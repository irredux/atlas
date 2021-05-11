"""arachne.py - interacts with dMLW-Database 

Author: Alexander Häberlin <alexander.haeberlin@mlw.badw.de>

Copyright 2021 Bavarian Academy of Sciences and Humanities

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
"""

from base64 import b64decode
from csv import reader
from datetime import datetime
import html
import json
from pymysql import connect, cursors, Error as pymysql_err
import time
import xml.etree.ElementTree as ET

from dMLW.arachne.metamorphosis import Metamorphosis

class Arachne(object):
    def __init__(self, db_cfg, logger, search_json_file, access_file):
        self.Tiro = logger
        self.Tiro.log("Starting Arachne...")
        self.meta = Metamorphosis()
        self.c = self.meta.c

        # setup login
        self.__user = db_cfg["user"]
        self.__password = b64decode(db_cfg["password"]).decode("utf-8")
        self.__database_name = db_cfg["database"]
        self.__host = db_cfg["host"]
        self.__port = int(db_cfg["port"])
        self.__unix_socket = db_cfg.get("unix_socket", "")
        self.__charset = db_cfg.get("charset", "")
        self.Tiro.log(f"\t... '{db_cfg['database']}' on '{db_cfg['host']}'")
        self.Tiro.log(f"\t... user: '{db_cfg['user']}'")


        # load access to change tables
        with open(access_file) as access_file:
            raw_access = json.load(access_file)
        self.table_access = {}
        for key, vals in raw_access.items():
            for val in vals:
                if val not in self.table_access.keys():
                    self.table_access[val] = [key]
                else:
                    if key not in self.table_access[val]:
                        self.table_access[val].append(key)

        # load search cols
        self.search_helper = {}
        self.search_cols = {}
        if search_json_file == "":
            self.Tiro.log("\t... no custom search cols loaded.")
        else:
            self.Tiro.log(f"\t... loading custom search: '{search_json_file}'")
            with open(search_json_file) as search_json:
                self.search_helper = json.load(search_json)
            for key, cols in self.search_helper.items():
                # get cols from database to check type of col
                temp_cols = self.command(f"DESCRIBE {key}")
                self.search_cols[key] = {}
                for col in cols.values():
                    for item in col["cols"]:
                        if item not in self.search_cols[key]:
                            set_type = ""
                            for col_type in temp_cols:
                                if col_type["Field"] == item:
                                    if col_type["Type"] in ["int(11)", "tinyint(1)"]:
                                        set_type = int
                                    elif col_type["Type"] in ["mediumtext", "longtext",
                                            "char(1)", "text"]:
                                        set_type = str
                                    else:
                                        set_type = col_type["Type"]
                                    break
                            self.search_cols[key][item] = set_type

            self.Tiro.log(f"\t... search cols loaded: '{', '.join(self.search_cols.keys())}'")

        self.Tiro.log("\tArachne started.")

    # ################################################################
    # -I- database connection
    # ################################################################
    def command(self, statement, values = [], commit = False):
        conn = connect(host=self.__host, user=self.__user,
                password=self.__password, database=self.__database_name,
                port=self.__port, unix_socket=self.__unix_socket,
                charset=self.__charset)
        cur = conn.cursor(cursors.DictCursor)
        self.Tiro.log(f"SQL-QUERY:", "DEBUG")
        self.Tiro.log(f"\t... '{statement}'", "DEBUG")
        self.Tiro.log(f"\t... '{values}'", "DEBUG")
        try:
            cur.execute(statement, values)
        except pymysql_err as err:
            self.Tiro.log(f"An error occured with '{statement}' - '{values}'.\n{err}", "ERROR")
            raise TypeError

        if commit:
            conn.commit()

        #warning = conn.show_warnings()
        #if warning != ():
        #    print("*"*10,"\n","An error occured:")
        #    print(warning)

        if (statement[:7] == "UPDATE " or statement[:12] == "INSERT INTO " or
                statement[:12] == "DELETE FROM "):
            #if cur.rowcount == 0:
            # when no rows were affected: ether no change in values or row not found.
            #    raise ValueError(f"No row was affected. {statement} - {values}")
            r_value = cur.lastrowid
        else:
            r_value = cur.fetchall()
        cur.close()
        conn.close()
        return r_value


    # ################################################################
    # -II- searching, saving and deleting rows
    # ################################################################
    def delete(self, tbl, query):
        """Removes a row from a given table.

            tbl: table-name
            query: query to search for the rows. Can be dict or array
        """
        #prepare WHERE
        where_txt = ""
        values = []
        if len(query) > 0:
            where_txt, values = self.WHERE_to_str(query)
            where_txt = " WHERE " + where_txt
        self.command(f"DELETE FROM {tbl}{where_txt};", values, True)

    def save(self, table, op, id = None, save_stat = True, return_row=False):
        """Saves new values into row. Returns id of row.

                table: name of table
                op: dict with col/value pairs
                id: if omitted new row is created
                return_row: if true not only id but whole row will be returned
        """
        #prepare field, values and value types
        cols = []
        vals = []
        for key, value in op.items():
            cols.append(key)
            if type(value) in [list, dict]:
                vals.append(json.dumps(value))
            elif type(value) == bool:
                vals.append(int(value))
            else:
                vals.append(value)

        # prepare and execute sql-query
        if id:
            # id is given
            cols_lst = []
            for nr, col in enumerate(cols):
                cols_lst.append(col + " = %s")
            query = f"UPDATE {table} SET {', '.join(cols_lst)}" + " WHERE id = %s;"
            vals.append(id)
        else:
            # new entry
            placeholder = (", %s"*len(vals))[2:]
            query = f"INSERT INTO {table} ({', '.join(cols)}) VALUES({placeholder})"
        print(query, vals)
        print("*"*10)
        html_vals = []
        for val in vals:
            if type(val) == str and val != "":
                html_vals.append(html.escape(val, quote=False))
            else:
                html_vals.append(val)
        r_id = self.command(query, values=html_vals, commit=True)

        # save datetime of change
        if (table == "work" or table == "author") and save_stat == True:
            self.save("stat", {table: datetime.now()}, 1)

        # lastrowid returns  0 on "UPDATE"
        if id == None:
            return_id=r_id
        else:
            return_id = id
        if return_row:
            return self.search(table, {"id": return_id})
        else:
            return return_id

    def clean(self, i_lst):
        o_lst = []
        for lst in i_lst:
            o_dict = {}
            for key, val in lst.items():
                if type(val) == str:
                    # NOT POSSIBLE TO ESCAPE HERE, BECAUSE OF LST CONTENT IN DB!
                    #o_dict[key] = html.escape(val)
                    o_dict[key] = self.simple_html(val)
                #elif val == None:
                #    pass
                else:
                    o_dict[key] = val

            o_lst.append(o_dict)
        return o_lst

    def simple_html(self, i_txt):
        allowed_dict = {"&lt;br /&gt;": "<br />",
                "&lt;sup&gt;": "<sup>", "&lt;/sup&gt;": "</sup>",
                "&lt;sub&gt;": "<sub>", "&lt;/sub&gt;": "</sub>",
                "&lt;i&gt;": "<i>", "&lt;/i&gt;": "</i>",
                "&lt;b&gt;": "<b>", "&lt;/b&gt;": "</b>",
                "&lt;aut&gt;": "<aut>", "&lt;/aut&gt;": "</aut>",
                "&lt;rot&gt;": "<rot>", "&lt;/rot&gt;": "</rot>",
                "&lt;blau&gt;": "<blau>", "&lt;/blau&gt;": "</blau>",
                "&lt;gruen&gt;": "<gruen>", "&lt;/gruen&gt;": "</gruen>",
                "&lt;gelb&gt;": "<gelb>", "&lt;/gelb&gt;": "</gelb>",
                }
        for key, val in allowed_dict.items():
            i_txt = i_txt.replace(key, val)
        return i_txt

    def search(self, tbl, query = {}, r_cols = "*", o_cols = [], limit=10001, offset=0):
        """ searches the database.
            tbl:    table or view to be searched.
            query:  Could be a dict (col-name/value) or string.
            r_cols: list containing col-names to be returned.
            o_cols: list containing cols by which to order results. if col-name
                    has "-" in front, order is descending.
        """
        # prepare SELECT
        if type(r_cols) == list: r_cols = ", ".join(r_cols)
        if type(o_cols) == str: o_cols = [o_cols]

        #prepare WHERE
        where_txt = ""
        values = []
        if type(query) is str and query != "":
            where_txt, values = self.query_to_WHERE_to_str(query.replace("*", "%"), tbl)
            where_txt = " WHERE " + where_txt
        else:
            if len(query) > 0:
                where_txt, values = self.WHERE_to_str(query)
                where_txt = " WHERE " + where_txt

        # prepare ORDER
        if len(o_cols) > 0:
            order_lst = []
            for o_col in o_cols:
                if o_col[:1] == "-":
                    # Desc
                    order_lst.append(f"{o_col[1:]} DESC")
                else:
                    order_lst.append(f"{o_col}")
            order_txt = " ORDER BY " + ", ".join(order_lst)
        else:
            order_txt = ""
        sql_search = f"SELECT {r_cols} FROM {tbl}{where_txt}{order_txt} LIMIT {limit} OFFSET {offset};"
        print(sql_search, values)
        return_lst = self.command(sql_search, values)

        # clean HTML tags and return results
        return self.clean(return_lst)

    def query_to_WHERE_to_str(self, query_str, tbl):
        # this method converts a string into a WHERE-formula
        quotes = query_str.split('"')
        quoted = False
        queries = []
        for quote in quotes:
            if quoted == False:
                quoted = True
                queries += quote.split(" ")
            else:
                queries.append(quote)
                quoted = False

        query_lst = []
        for query_raw in queries:
            new_query = []
            if query_raw[:1] == "-":
                query = query_raw[1:]
                query_op = "-"
                query_op2 = "AND"
            else:
                query = query_raw
                query_op = ""
                query_op2 = "OR"

            if query == "":
                pass
            elif query.find(":") > -1 and query[:query.find(":")] in self.search_helper[tbl]:
                user_col = query[:query.find(":")]
                for col in self.search_helper[tbl][user_col]["cols"]:
                    new_query.append({f"{query_op}{col}": f"{query[query.find(':')+1:]}"})
                    new_query.append(query_op2)
            else:
                for col, col_type in self.search_cols[tbl].items():
                    if type(query) == col_type:
                        new_query.append({f"{query_op}{col}": f"%{query}%"})
                        new_query.append(query_op2)



            query_lst.append(new_query)
        return self.WHERE_to_str(query_lst)



    def WHERE_to_str(self, query, first = True):
        where_txt = ""
        vals = []
        if type(query) is list:
            c_op = "AND"
            for quer in query:
                if quer == "OR":
                    c_op = "OR"
                elif quer == "AND":
                    c_op = "AND"
                else:
                    c_txt, c_vals = self.WHERE_to_str(quer, False)
                    where_txt += f" {c_op} {c_txt}"
                    vals += c_vals
                    c_op = "AND"
        else:
            for key, value in query.items():
                if key[0] == "-":
                    op_1 = "IS NOT"
                    op_2 = "!="
                    op_3 = "NOT LIKE"
                    key = key[1:]
                else:
                    op_1 = "IS"
                    if value == "":
                        op_2 = "="
                    elif type(value) == int:
                        op_2 = "="
                    elif value[0] == "<":
                        op_2 = "<"
                        value = value[1:]
                    elif value[0] == ">":
                        op_2 = ">"
                        value = value[1:]
                    else:
                        op_2 = "="
                    op_3 = "LIKE"
                if value == "NULL":
                    where_txt += f" AND {key} {op_1} NULL"
                elif f"{value}".find("%") > -1:
                    where_txt += f" AND {key} {op_3} %s"
                    vals.append(f"{value}")
                else:
                    where_txt += f" AND {key} {op_2} %s"
                    vals.append(f"{value}")

        if first == False and len(query) > 1:
            return f"({where_txt[5:]})", vals
        else:
            return where_txt[5:], vals

    # ################################################################
    # -IV- import data
    # ################################################################
    def import_xml(self, table_name, file_path):
        tree = ET.parse(file_path)
        root = tree.getroot()
        for Eintrag in root:
            newEntry = {}
            for col in Eintrag:
                newEntry[col.tag] = col.text
            self.save(table_name, newEntry, save_stat=False)
            time.sleep(0.01)




    def import_csv(self, table_name, file_path, encoding='utf-8-sig', delimiter = ';'):
        csv_file = open(file_path, 'r', encoding=encoding)
        csv_data = reader(csv_file, delimiter=delimiter)

        count = 0
        row_names = []
        for Eintrag in csv_data:
            if count == 0:
                row_names = Eintrag
            else:
                new_entries = {row_names[i]: Eintrag[i] for i in range(len(Eintrag))}
                self.save(table_name, new_entries, save_stat=False)
            count += 1
        return count


    def setup_table(self, table_name, if_not = False):
        """Creates the tables in the db.

        if_not = True: if they dont exists, they should be created."""

        if self.__db.get(table_name, "") == "":
            raise ValueError("No table {} found.".format(table_name))

        n_lst = []
        for key, value in self.__db[table_name].items():
            n_lst.append(key + " " + value)
        if if_not:
            self.command(f"CREATE TABLE IF NOT EXISTS {table_name} ({', '.join(n_lst)});")
        else:
            self.command(f"DROP TABLE IF EXISTS {table_name};")
            self.command(f"CREATE TABLE {table_name} ({', '.join(n_lst)});")

    def setup(self, i_table, i_file, i_lemma, i_reset):
        if i_table == "maiora":
            if i_reset != "":
                self.setup_table("work")
                self.setup_table("author")
            self.import_maiora(i_file)
        elif i_table == "minora":
            if i_reset != "":
                self.setup_table("work")
                self.setup_table("author")
            self.import_minora(i_file)
        elif i_table == "lemma":
            if i_reset != "":
                self.setup_table("lemma")
            self.import_lemmata(i_file, i_lemma)
        elif i_table == "zettel":
            self.setup_table("zettel")
        elif i_table == "edition":
            if i_reset != "":
                self.setup_table("edition")
            self.import_edition(i_file)
        elif i_table == "scans":
            if i_reset != "":
                self.setup_table("scan")
            self.import_scan(i_file)
        elif i_table == "dMGH":
            if i_reset != "":
                self.setup_table("edition")
            self.import_dMGH(i_file)
        else:
            raise ValueError(f"no table {i_table} found.")

    def import_dMGH(self, i_file):
        with open(i_file, "r") as f_in:
            for line in f_in:
                line = line[:-1]
                c_id_work = line[:line.rfind("|")]
                c_link = line[line.rfind("|")+1:]
                c_bsb = c_link[c_link.find("bsb")+3:c_link.find("bsb")+11]
                c_page = c_link[c_link.find("seite=")+6:]
                self.save("edition", {"path": c_link, "default_page": c_page,
                    "bsb": c_bsb, "work_id": c_id_work, "editor": "dMGH"})

    def import_scan(self, i_file):
        imgs = []
        c_import = 0
        print(f"start import scans... {datetime.now()}")
        with open(i_file, "r", encoding="ascii", errors="ignore") as f_in:
            for line in f_in:
                c_file = line[1:]
                c_file = c_file[:-1]
                c_pos = c_file.rfind("/")+1
                c_path = c_file[:c_pos]
                c_filename = c_file[c_pos:]
                c_filename = c_filename[:c_filename.rfind(".")]
                self.save("scan", {"filename": c_filename, "path": c_path})
                c_import += 1
            f_in.close()
        print(f"{c_import} scans imported. {datetime.now()}")

        # matching scans with folder, where there is only 1 solution
        print(f"start matching scans... {datetime.now()}")
        in_scans = self.look("scan", {"s": "%/%", "f": "path"}, ["id", "path"])
        c_path = ""
        c_edition = []
        c_success = 0
        c_error = 0
        for in_img in in_scans:
            if in_img["path"] != c_path:
                c_path = in_img["path"]
                c_editions = self.look("edition", {"s": in_img["path"],
                    "f": "path"}, ["id"])
                if len(c_editions) == 1:
                    self.save("edition", {"no_imgs": False}, c_editions[0]["id"])
            if len(c_editions) == 1:
                self.save("scan", {"path": "",
                    "edition_id": c_editions[0]["id"]}, in_img["id"])
                c_success += 1
            else:
                c_error += 1
        print(f"matching complete. success {datetime.now()}:", c_success, "error:", c_error)


    def import_edition(self, file):
        opera = self.look(["work", "author"], [], ["author.abbr",
            "work.abbr", "work.id"])
        count_work = 0
        count_edition = 0
        with open(file, "r", encoding="utf-16le") as ed_f:
            ed_csv = reader(ed_f, delimiter=";")
            for ed_row in ed_csv:
                count_edition += 1
                ed_row[1] = ed_row[1].replace("\\", "/")
                c_path = ed_row[1][:ed_row[1].rfind("/")+1]
                c_file = ed_row[1][ed_row[1].rfind("/")+1:]
                c_name = c_file[:c_file.rfind(".")]
                c_type = c_file[c_file.rfind("."):]
                n_edition = {"editor": ed_row[0],
                        "path": c_path,
                        "default_page": c_name,
                        "page_type": c_type}
                for opus in opera:
                    opus_abbr = opus["author.abbr"]
                    if opus.get("work.abbr", False):
                        opus_abbr += " " + opus["work.abbr"]
                    if (ed_row[0].lower() == opus_abbr.lower() and
                            n_edition.get("work_id", "") == ""):
                        n_edition["work_id"] = opus.get("work.id")
                        count_work += 1
                self.save("edition", n_edition)
            print("Total number of editions:", count_edition)
            print("Total number of works-editon-links:", count_work)

    def import_minora(self, file):
        opera_file = open(file, "r", encoding="utf-8-sig")
        opera_csv = reader(opera_file, delimiter=";")

        error_count = 0
        author_count = 0
        work_count = 0
        current_works = 0
        loop_count = 0

        for in_lst in opera_csv:
            loop_count += 1
            if len(in_lst) != 13:
                print(len(in_lst))
                raise ValueError(f"there is a problem with the fields on line {loop_count}.")

            x_lst = []
            for in_col in in_lst:
                x_lst.append(in_col.strip())


            # Mapping the dict with the fields from the csv
            x = {}
            if x_lst[0] != "":
                x["date_display"] = self.c(x_lst[0])
            if x_lst[1] != "":
                x["date_sort"] = self.c(x_lst[1])
            if x_lst[2] != "":
                x["date_type"] = self.c(x_lst[2])
            if x_lst[3] != "":
                x["in_use"] = False
            else:
                x["in_use"] = True
            if x_lst[4] != "":
                x["author_abbr"] = self.c(x_lst[4])
            if x_lst[5] != "":
                x["work_abbr"] =  self.c(x_lst[5])
            if x_lst[6] != "":
                x["citation"] = self.c(x_lst[6])
            if x_lst[7] != "":
                x["bibliography"] =  self.c(x_lst[7])
            if x_lst[8] != "":
                x["bibliography_cit"] = self.c(x_lst[8])
            if x_lst[9] != "":
                x["reference"] = self.c(x_lst[9])
            if x_lst[10] != "":
                x["txt_info"] = self.c(x_lst[10])

            # Determening the Line-Typ and preparing import (x_work/x_author)
            x_work = {}
            x_author = {}
            l_author = ""
            # ADD OTHER VALUES TO LIST, O-MIN CONTAINS DIFFERENT NAMES
            if x.get("author_abbr") in ["VITA", "MIRAC.", "CONVERS.",
                    "PASS.", "TRANSL.", "INVENT.", "VITAE", "TRIUMPH."]:
                x["author_display"] = x["author_abbr"]
                c_author = "VITA"
            else:
                c_author = x["author_abbr"]
            if l_author != c_author:
                # add new author
                x_author = {"author_abbr": c_author,
                        "in_use": x["in_use"]}

            # append work from current line
            x_work = x.copy()
            del x_work["author_abbr"]
            if c_author == "VITA":
                x_work["author_display"]: x["author_abbr"]

            # Creating a new entries
            if len(x_author) > 0 and loop_count > 1:
                if x_author.get("author_abbr", False):
                    x_author["abbr"] = x_author["author_abbr"]
                    del x_author["author_abbr"]
                if x_author.get("author_full", False):
                    x_author["full"] = x_author["author_full"]
                    del x_author["author_full"]
                # had the last author at least one work attached to him?
                if current_works == 0 and author_count > 0:
                    self.save("work", {"author_id": author_id})
                # check, if there is allready an author by the same name in op-mai.
                aut_mai_id = self.look("author",
                        {"s": x_author["abbr"], "f": "abbr"},
                        ["id"])
                if len(aut_mai_id) == 1:
                    print("author found!")
                    author_id = aut_mai_id[0].get("id")
                elif len(aut_mai_id) == 0:
                    print("new author!")
                    author_id = self.save("author", x_author)
                elif x_author.get("abbr") == "Rein. Leod.":
                    author_id = 529
                elif x_author.get("abbr") == "Thietm.":
                    author_id = 606
                else:
                    raise ValueError(f"Error with author {x_author['abbr']}.\n{aut_mai_id}")
                current_works = 0
                author_count += 1
            if len(x_work) > 0 and loop_count > 1:
                if x_work.get("work_abbr", False):
                    x_work["abbr"] = x_work["work_abbr"]
                    del x_work["work_abbr"]
                if x_work.get("work_full", False):
                    x_work["full"] = x_work["work_full"]
                    del x_work["work_full"]
                x_work["author_id"] = author_id
                x_work["is_maior"] = False
                self.save("work", x_work)
                work_count += 1
                current_works += 1
            if len(x_author) == 0 and len(x_work) == 0:
                print(x)
                error_count += 1

        opera_file.close()
        print("authors: ", author_count)
        print("works: ", work_count)
        print("errors: ", error_count)

    def import_maiora(self, file):
        opera_file = open(file, "r", encoding="utf-8-sig")
        opera_csv = reader(opera_file, delimiter=";")

        error_count = 0
        author_count = 0
        current_works = 0
        work_count = 0
        loop_count = 0
        for input_x_list in opera_csv:
            loop_count += 1
            #check, if there are 11 fields
            if len(input_x_list) != 12:
                raise ValueError("there is a problem with the fields on line {}".format(loop_count))

            x_list = []
            for c_input in input_x_list:
                x_list.append(c_input.strip())

            # Mapping the dict with the fields from the csv
            x = {}
            if x_list[0] != "":
                x["date_display"] = self.c(x_list[0])
            if x_list[1] != "":
                x["author_abbr"] = self.c(x_list[1])
            if x_list[2] != "":
                x["work_abbr"] =  self.c(x_list[2])
            if x_list[3] != "":
                x["author_full"] = self.c(x_list[3])
            if x_list[4] != "":
                x["reference"] = self.c(x_list[4])
            if x_list[5] != "":
                x["work_full"] =  self.c(x_list[5])
            if x_list[6] != "":
                x["bibliography"] = self.c(x_list[6])
            if x_list[7] != "":
                x["citation"] = self.c(x_list[7])
            if x_list[8] != "":
                x["txt_info"] = self.c(x_list[8])
            if x_list[9] != "":
                x["dMGH"] = self.c(x_list[9])
            if x_list[10] != "":
                x["date_sort"] = self.c(x_list[10])
            if x_list[11] != "":
                x["date_type"] = self.c(x_list[11])

            # Determening the Line-Typ and preparing import (x_work/x_author)
            x_work = {}
            x_author = {}

            if (x.get("author_abbr") != None and
                    #x.get("author_full") != None and
                    x.get("work_abbr") == None and
                    x.get("work_full") == None):
                # the current line is an author

                # is the author still used?
                x["in_use"] = True
                if x["author_abbr"][0] == "[" and x["author_abbr"][-1] == "]":
                    x["in_use"] = False
                    x["author_abbr"] = x["author_abbr"][1:]
                    x["author_abbr"] = x["author_abbr"][:-1]

                # are there author + work on the same line?
                if x.get("bibliography") != None or x.get("citation") != None:
                    x_work = x.copy()
                    if x.get("bibliography") != None: del x["bibliography"]
                    if x.get("citation") != None: del x["citation"]
                    del x_work["author_abbr"]
                    # if there is no full name for an author
                    if x.get("author_full") != None:
                        del x_work["author_full"]
                    if x.get("dMGH") != None:
                        del x["dMGH"]
                    if x.get("reference") != None:
                        del x["reference"]

                # is there a reference on the author-line?
                if x.get("reference") != None and x_work == {}:
                    x_work = {"reference": x["reference"]}
                    del x["reference"]
                x_author = x.copy()

            elif x.get("work_abbr") != None and loop_count > 1:
                # current line is a work

                # is the work still used?
                x["in_use"] = True
                if x["work_abbr"][0] == "[" and x["work_abbr"][-1] == "]":
                    x["in_use"] = False
                    x["work_abbr"] = x["work_abbr"][1:]
                    x["work_abbr"] = x["work_abbr"][:-1]

                # is the work in the VITA-group? = has a different author to display?
                if x.get("author_abbr") in ["Vita", "Mirac.", "Convers.",
                        "Pass.", "Transl.", "Invent.", "Vitae", "Triumph."]:
                    x["author_display"] = x["author_abbr"]
                    del x["author_abbr"]

                # disabled works with reference in column 'author_full'
                if x.get("author_full") != None and x.get("work_full") == None:
                    x["work_full"] = x["author_full"]
                    del x["author_full"]
                x_work = x.copy()

            # Creating a new entries
            if len(x_author) > 0:
                x_author["abbr"] = x_author["author_abbr"]
                if x_author.get("author_full", False):
                    x_author["full"] = x_author["author_full"]
                    del x_author["author_full"]
                del x_author["author_abbr"]
                # had the last author at least one work attached to him?
                if current_works == 0 and author_count > 0:
                    self.save("work", {"author_id": author_id})
                author_id = self.save("author", x_author)
                current_works = 0
                author_count += 1
            if len(x_work) > 0:
                if x_work.get("work_abbr", False):
                    x_work["abbr"] = x_work["work_abbr"]
                    del x_work["work_abbr"]
                if x_work.get("work_full", False):
                    x_work["full"] = x_work["work_full"]
                    del x_work["work_full"]
                x_work["author_id"] = author_id
                x_work["is_maior"] = True
                self.save("work", x_work)
                work_count += 1
                current_works += 1
            if len(x_author) == 0 and len(x_work) == 0:
                print(x)
                error_count += 1

        opera_file.close()
        print("authors: ", author_count)
        print("works: ", work_count)
        print("errors: ", error_count)

    def import_lemmata(self, file_name, letter):
        l_file = open(file_name, "r", encoding="utf-8-sig")
        lemma_csv = reader(l_file, delimiter=";")

        error_count = 0
        loop_count = 0
        l_add = 0
        m_lst = []
        for row in lemma_csv:
            loop_count += 1
            if loop_count == 1:
                # first row -> map the column-names
                for col in row:
                    m_lst.append(col.strip())
            else:
                # on the other rows, prepare import-lst
                n_dict = {}
                n_dict = {"letter": letter,
                        "attr": ["MLW"],
                        }
                for nr, col in enumerate(row):
                    if m_lst[nr] in ["lemma", "lemma_display", "dicts",
                            "comment"]:
                        n_dict[m_lst[nr]] = self.c(col.strip())
                    elif m_lst[nr] == "lemma_nr":
                        if col != "": n_dict["lemma_nr"] = int(col)
                    elif m_lst[nr] in ["Stern", "fraglich",
                            "Klammerverweis", "excludendum"]:
                        if col.strip() == "True":
                            n_dict["attr"].append(m_lst[nr])
                    else:
                        raise TypeError(f"No column '{m_lst[nr]}' found.")
                if n_dict["lemma"] != "":
                    self.save("lemma", n_dict)
                    l_add += 1

        l_file.close()
        print(f"{loop_count} rows in file, {l_add} lemmata added.")
