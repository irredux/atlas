"""metamorphosis.py - translates string queries into dictionary-queries 

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

import html

def s_html(i_txt, remove = False):
    """allows simple html in display."""
    if i_txt == None:
        return ""
    #i_txt = f"{i_txt}"
    tags = ["b", "sup", "aut", "i", "br /"]
    for tag in tags:
        c_open = html.escape(f"<{tag}>")
        c_close = html.escape(f"</{tag}>")

        if remove:
            re_open = ""
            re_close = ""
        else:
            re_open = f"<{tag}>"
            re_close = f"</{tag}>"
        i_txt = i_txt.replace(c_open, re_open)
        i_txt = i_txt.replace(c_close, re_close)

    while "  " in i_txt:
        i_txt = i_txt.replace("  ", " ")
    return i_txt



class Metamorphosis(object):
    """Object converting search input from user to sql query."""
    def __init__(self):
        # map search-fields (german) to search-columns of tables
        self.s_map = {}

        # rules for adding content to self.s_map:
        # Allways include table-name.

    def __s_map_add(self, group, des, ph, cols, access = ["auth"]):
        """Adds an item to 'f_map'.

        group: string containing name of group
        des: string describing group (will be printed on page als help text)
        ph: string of placeholder in user input
        cols: list containing columns which will be searched
        tbls: list containing tables which will be searched. Generated in function.
        access: list containing permission to use the placeholder"""
        if self.s_map.get(group, "") == "":
            self.s_map[group] = []

        tbls = []
        for col in cols:
            tbl = col.split(".")[0]
            if tbl not in tbls: tbls.append(tbl)

        self.s_map[group].append({"des": des,
            "ph": ph,
            "cols": cols,
            "tbls": tbls,
            "access": access})

    def c(self, i_txt):
        """is used to replace special character with the html equivalent.
        allow_html allows a small number of html formatting to be displayed as such.
        """
        o_txt = html.escape(i_txt.strip())
        # simple html (like b, i etc.) redone with s_html
        return o_txt

    def transform(self, input, group, access):
        # IMPORTANT: THE * SYMBOL MUST BE MASKED IN ENTRIES! AS WELL AS THE % SYMBOL

        # split input string and convert to list with placesholders and
        # search-string. '*' will be converted to '%'
        # group = group, where to search
        # access lst of user making the request
        input += " "
        ph_lst = []
        q_on = False
        c_str = ""
        f_name = ""
        mode = "and"

        for c in input:
            do_append = False

            if c == " " and q_on == False:
                if c_str != "":
                    do_append = True
            elif c == "\"":
                if q_on:
                    q_on = False
                    do_append = True
                else:
                    q_on = True
            elif c == ":" and q_on == False:
                f_name = c_str
                c_str = ""
            elif c == "*":
                c_str += "%"
            else:
                c_str += c

            if do_append:
                if c_str != "oder" or c == "\"":
                    c_str = self.c(c_str)
                    # check, if search is excluded
                    if f_name == "" and c_str[:1] == "-":
                        c_str = c_str[1:]
                        ex = True
                    elif f_name[:1] == "-":
                        f_name = f_name[1:]
                        ex = True
                    else:
                        ex = False

                    if f_name == "" and c != "\"":
                        ph_lst.append(["*", f"%{c_str}%", mode, "", ex])
                    elif f_name == "" and c == "\"":
                        ph_lst.append(["*", f"{c_str}", mode, "", ex])
                    else:
                        # check, if there is < or >
                        if c_str[:4] == "&lt;":
                            c_str = c_str[4:]
                            val_mode = "<"
                        elif c_str[:4] == "&gt;":
                            c_str = c_str[4:]
                            val_mode = ">"
                        else:
                            val_mode = ""
                        ph_lst.append([f_name, c_str, mode, val_mode, ex])
                    mode = "and"
                    c_str = ""
                    f_name = ""
                else:
                    mode = "or"
                    c_str = ""

        # creating sql-query from placeholder-list; and list with tables
        sql = []
        q_tbls = []
        for ph in ph_lst:
            q_lst = []
            for s in self.s_map[group]:

                if ph[0] == "*":# search all fields
                    qq_lst = []
                    for c in s["cols"]:
                        qq_lst.append({"s": ph[1], "f": c, "op": "OR", "ex": ph[4]})
                        q_tbls += s["tbls"]
                    q_lst.append({"q": qq_lst, "op": "OR"})
                elif ph[0] == s["ph"]:# only search specific fields
                    for c in s["cols"]:
                        # if 'NULL' is searched
                        if ph[1] == "NULL":
                            q_lst.append({"s": ph[1], "f": c, "op": "OR", "s_f": True, "ex": ph[4]})
                        else:
                            # set value-mode
                            if ph[3] != "":
                                q_lst.append({"s": ph[1], "f": c, "op": "OR", "val_op": ph[3], "ex": ph[4]})
                            else:
                                q_lst.append({"s": ph[1], "f": c, "op": "OR", "ex": ph[4]})
                        q_tbls += s["tbls"]

            sql.append({"q": q_lst, "op": ph[2]})

        #prepare tables list for output
        tbls_o = []
        for q in q_tbls:
            if q not in tbls_o: tbls_o.append(q)

        return sql, tbls_o
