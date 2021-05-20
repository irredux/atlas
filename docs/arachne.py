#!/user/bin/env python3
#from csv import DictWriter
#import json
import requests

class Arachne(object):
    def __init__(self, user, pw, url='https://dienste.badw.de:9999'):
        self.__url = url
        re = requests.post(f"{self.__url}/session", json={"user": user, "password": pw})
        if(re.status_code == 200):
            self.__token = re.text
        else:
            raise "login failed."

    def __call(self, location, mode= "GET", data=None):
        '''calls server and handles authorization and transfer of data.'''
        headers = {"Authorization": f"Bearer {self.__token}"}
        if mode == "GET":
            return requests.get(self.__url+location, headers=headers)
        if mode == "DELETE":
            return requests.delete(self.__url+location, headers=headers)

    def close(self):
        ''' call close() at the end of the session to delete active token from server.'''
        re = self.__call("/session", mode = "DELETE")
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
        pass
    def version(self, tblName):
        pass

    def search(self, tblName, query):
        pass
    def save(self, tblName, values):
        pass
    def delete(self, tblName, rowId):
        pass

#    def load(self, table='opera_view', query='', cols= [], o_cols = [], html=False):
#        '''
#        Requests data-dump from dMLW-tables.
#
#        query:
#            works exactly as the search-function on the website. more infos on
#            https://dienste.badw.de:9999/help#search.
#        table:
#            same table-name as in search-function (doesn't always match real table
#            name).
#        cols:
#            names of column for output in list-format. if empty, all columns will
#            be returned (col-names always match real col-names from db).
#        o_cols:
#            names of columns by which results will be sorted.
#        html:
#            if false, server will remove all html-tags.
#        '''
#        if type(query) in [list, dict]:
#            query = json.dumps(query)
#        cols = json.dumps(cols)
#        o_cols = json.dumps(o_cols)
#        data = {'mode': 'search', 'query': query, 'table': table, 'cols': cols,
#                'o_cols': o_cols, 'html': html}
#        raw_dump = self.__call(data).text
#        try:
#            j_dump = json.loads(raw_dump)
#        except:
#            raise ValueError(f'An error occurred while receiving data. Response from server:\n{raw_dump}')
#
#        return raw_dump, j_dump
#
#
if __name__ == '__main__':
    user = input(' User: ')
    pw = input(' Passwort: ')
    table = 'opera_view'
    print(f' |{user}|{pw}')
    reader = dMLW(user, pw)
    print(f'\t\'{table}\' last updated:', reader.version(table))
#    if input('download data? (y/n) ').lower() in ['yes', 'y']:
#        j_str, j_dump = reader.load(table, {'in_use': 1}, ['id', 'example', 'example_plain'],
#                ['author_abbr', 'work_abbr_sort'])
#        with open('opera.json', 'w', encoding='utf-8') as f:
#            f.write(j_str)
#        print(j_str)
