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
import html
import json
from pymysql import connect, cursors

class Arachne(object):
    def __init__(self, db_cfg):
        # setup login
        self.__user = db_cfg["user"]
        self.__password = b64decode(db_cfg["password"]).decode("utf-8")
        self.__database_name = db_cfg["database"]
        self.__host = db_cfg["host"]
        self.__port = int(db_cfg["port"])
        self.__unix_socket = db_cfg.get("unix_socket", "")
        self.__charset = db_cfg.get("charset", "")
    
    def call(self, command, values=None):
        conn = connect(host=self.__host, user=self.__user,
                password=self.__password, database=self.__database_name,
                port=self.__port, unix_socket=self.__unix_socket,
                charset=self.__charset, autocommit=True)
        cur = conn.cursor()
        if values: re = cur.callproc(command, values)
        else: re = cur.callproc(command)
        return re

    def command(self, statement, values = [], commit = False):
        conn = connect(host=self.__host, user=self.__user,
                password=self.__password, database=self.__database_name,
                port=self.__port, unix_socket=self.__unix_socket,
                charset=self.__charset)
        cur = conn.cursor(cursors.DictCursor)
        cur.execute(statement, values)
        if commit: conn.commit()

        if (statement[:7] == "UPDATE " or statement[:12] == "INSERT INTO " or
                statement[:12] == "DELETE FROM "):
            r_value = cur.lastrowid
        else:
            r_value = cur.fetchall()
        cur.close()
        conn.close()
        return r_value

    def delete(self, tbl, query):
        """Removes a row from a given table.

            tbl: table-name
            query:  Can be a dict (col-name/value) or string.
        """
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
            for col in cols:
                cols_lst.append(col + " = %s")
            query = f"UPDATE {table} SET {', '.join(cols_lst)}" + " WHERE id = %s;"
            vals.append(id)
        else:
            # new entry
            placeholder = (", %s"*len(vals))[2:]
            query = f"INSERT INTO {table} ({', '.join(cols)}) VALUES({placeholder})"
        #html_vals = [] # difficult to get to work on entries like "<aut>Abbo</aut>" when saved again! --- sanitize output is required!
        # maybe use later: https://lxml.de/lxmlhtml.html#cleaning-up-html
        #for val in vals:
        #    if type(val) == str and val != "":
        #        html_vals.append(html.escape(val, quote=False))
        #    else:
        #        html_vals.append(val)
        r_id = self.command(query, values=vals, commit=True)

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
            query:  Can be a dict (col-name/value) or string.
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
        #print(sql_search)
        return_lst = self.command(sql_search, values)

        # clean HTML tags and return results
        return self.clean(return_lst)

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