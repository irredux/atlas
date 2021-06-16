#!/user/bin/env python3
#from csv import DictWriter
#import json
from os import path
import requests
import sqlite3

class Arachne(object):
    def __init__(self, user, pw, url='https://dienste.badw.de:9999', tbls = None):
        self.p = path.dirname(path.abspath(__file__))
        self.__url = url
        re = requests.post(f"{self.__url}/session", json={"user": user, "password": pw})
        if(re.status_code == 200):
            self.__token = re.text
        else:
            raise "login failed."
        if tbls == None: tbls = self.show_tables()
        for tbl in tbls:
            self.update(tbl)


    def update(self, tbl):
        #print("start updating...", tbl)
        initial_setup = False
        if len(self.__command(f"SELECT name FROM sqlite_master WHERE name = '{tbl}'")) == 0:
            # create table if it doesnt exists
            cols = self.version(tbl)["describe"]
            col_lst = []
            for col in cols:
                col_type = "TEXT"
                if col["Type"] == "int(11)": col_type = "INTEGER"
                elif col["Type"] == "tinyint(1)": col_type = "INTEGER"
                col_lst.append(f"{col['Field']} {col_type}")
            sql = f"CREATE TABLE '{tbl}' ({', '.join(col_lst)})"
            self.__command(sql)
            initial_setup = True

        chunk = 10000
        while chunk > 9999:
            u_date = self.__command(f"SELECT MAX(u_date) AS max FROM {tbl}")[0]["max"]
            values = self.__getAll(tbl, u_date)
            chunk = len(values)
            #print("\t new rows:", chunk)
            add_lst = []
            for value in values:
                if initial_setup: c_row = []
                else: c_row = self.__command(f"SELECT u_date FROM {tbl} WHERE id = ?", [value["id"]])
                if len(c_row) == 0 and value["deleted"] != 1:
                    vals = []
                    cols = []
                    for col, val in value.items():
                        cols.append(col)
                        vals.append(val)
                    cols_txt = ", ".join(cols)
                    val_placeholder = ("?, "*len(vals))[:-2]
                    add_lst.append({"sql":f"INSERT INTO '{tbl}' ({cols_txt}) VALUES ({val_placeholder})", "vals": vals})
                elif len(c_row) == 1 and value["deleted"] == 1:
                    add_lst.append({"sql":f"DELETE FROM '{tbl}' WHERE id = ?", "vals": [value["id"]]})
                elif len(c_row) == 1 and c_row[0]["u_date"] < value["u_date"]:
                    vals = []
                    sets = []
                    for col, val in value.items():
                        if col != "id":
                            sets.append(f"{col} = ?")
                            #if val == None: vals.append("NULL")
                            #else: vals.append(val)
                            vals.append(val)
                    sets_txt = ", ".join(sets)
                    vals.append(value["id"])
                    add_lst.append({"sql":f"UPDATE '{tbl}' SET {sets_txt} WHERE id = ?", "vals": vals})
                elif len(c_row) == 0 and value["deleted"] == 1:
                    pass
                else:
                    raise Exception(f"CANNOT SAVE ROW TO DB: {value} - {c_row}")
            self.__command(add_lst)

    def __command(self, sql, values = None):
        re = True
        db = sqlite3.connect(self.p+"/arachne.db")
        def dict_factory(cursor, row):
            d = {}
            for idx, col in enumerate(cursor.description):
                d[col[0]] = row[idx]
            return d
        db.row_factory = dict_factory
        cursor = db.cursor()
        if type(sql) == str:
            if values == None: cursor.execute(sql)
            else: cursor.execute(sql, values)
            re = cursor.fetchall()
        else:
            for s in sql:
                cursor.execute(s["sql"], s["vals"])
        db.commit()
        db.close()
        return re

    def __call(self, location, method= "GET", data=None):
        '''calls server and handles authorization and transfer of data.'''
        headers = {"Authorization": f"Bearer {self.__token}"}
        if method == "GET":
            return requests.get(self.__url+location, headers=headers)
        if method == "POST":
            return requests.post(self.__url+location, headers=headers, json=data)
        if method == "PATCH":
            return requests.patch(self.__url+location, headers=headers, json=data)
        if method == "DELETE":
            return requests.delete(self.__url+location, headers=headers)
        else:
            raise Exception(f"UNKNOWN METHOD '{method}' WITH CALL().")

    def close(self):
        ''' call close() at the end of the session to delete active token from server.'''
        re = self.__call("/session", method = "DELETE")
        if(re.status_code == 200):
            del self.__token
        else:
            raise "logout failed."

    def show_tables(self):
        ''' shows available tables of current account '''
        re = self.__call("/config/oStores")
        if(re.status_code == 200):
            oStores = re.json()
            tbls = []
            for oStore in oStores:
                tbls.append(oStore["name"])
            return tbls
        else:
            raise "connection failed."

    def describe(self, TblName):
        return self.__command(f"PRAGMA table_info ('{TblName}')")

    def version(self, tblName):
        '''
            returns dict:
                "max_date" => datetime stamp of update
                "length" => number of rows in table
        '''
        re = self.__call("/info/"+tblName)
        return re.json()

    def __getAll(self, tblName, u_date=None):
        '''
            returns all rows of table.
            if u_date is given, only newer rows are downloaded.
        '''
        url = "/data/"+tblName
        if u_date != None: url += f"?u_date={u_date}"
        re = self.__call(url)
        return re.json()

    def search(self, tblName, query = "*", rCols = "*"):
        '''
            query should be a list of dict and defines WHERE-clause:
                [{"foo": "bar"}]  =>  foo = "bar"
            value can be prefixed:
                [{"foo": ">bar"}]  =>  foo > "bar"
                [{"foo": "<bar"}]  =>  foo < "bar"
                [{"foo": "-bar"}]  =>  foo != "bar"
            * can be used as placeholder:
                [{"foo": "bar*"}]  =>  foo LIKE "bar%"
        '''
        select = "*"
        where = ""
        if type(query) == dict:
            where = " WHERE "
            where_lst = []
            for k, v in query.items():
                # set operator
                nV = v
                op = "="
                if v[0] in [">", "<"]:
                    op = v[0]
                    nV = v[1:]
                elif v[0] == "-":
                    op = "!="
                    nV = v[1:]
                elif type(nV) == str and nV.find("*")>-1:
                    op = "LIKE"
                    nV = nV.replace("*", "%")

                #set quotes
                q = "'"
                if f"{nV}".isnumeric(): q = ""

                where_lst.append(f"{k} {op} {q}{nV}{q}")
            where += " AND ".join(where_lst)
        #print(f"SELECT {select} FROM {tblName}{where}")
        re = self.__command(f"SELECT {select} FROM {tblName}{where}")
        return re
    def save(self, tblName, values):
        '''
            saves "values" into db. if "id" is given Arachne trys to update, if no a new entry is created.
        '''
        method = "POST"
        url = "/data/"+tblName
        if "id" in values.keys():
            method = "PATCH"
            url += f"/{values['id']}"
            del values["id"]
        re = self.__call(url, method=method, data=values)
        self.update(tblName)
        return re.status_code

    def delete(self, tblName, rowId):
        '''
            removes a record from the db.
        '''
        method = "DELETE"
        url = f"/data/{tblName}/{rowId}"
        re = self.__call(url, method=method)
        self.update(tblName)
        return re.status_code

#if __name__ == '__main__':
#    user = input(' User: ')
#    pw = input(' Passwort: ')
#    table = 'opera_view'
#    print(f' |{user}|{pw}')
#    reader = dMLW(user, pw)
#    print(f'\t\'{table}\' last updated:', reader.version(table))
#    if input('download data? (y/n) ').lower() in ['yes', 'y']:
#        j_str, j_dump = reader.load(table, {'in_use': 1}, ['id', 'example', 'example_plain'],
#                ['author_abbr', 'work_abbr_sort'])
#        with open('opera.json', 'w', encoding='utf-8') as f:
#            f.write(j_str)
#        print(j_str)
