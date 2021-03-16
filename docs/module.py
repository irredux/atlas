#!/user/bin/env python3

from csv import DictWriter
import json
import requests

class dMLW(object):
    def __init__(self, user, password, url='https://dienste.badw.de:9999/module'):
        self.__user = user
        self.__pw = password
        self.__url = url

    def __call(self, data):
        '''Calls the server and handles the login and transfers data.'''
        r_data = data
        r_data['user'] = self.__user
        r_data['pw'] = self.__pw
        return requests.post(self.__url, r_data)


    def version(self, table = 'opera_view'):
        '''checks version of table and returns datetime of last change.
        '''
        r_txt = self.__call({'mode': 'version', 'table': table}).text
        return r_txt


    def load(self, table='opera_view', query='', cols= [], o_cols = [], html=False):
        '''
        Requests data-dump from dMLW-tables.

        query:
            works exactly as the search-function on the website. more infos on
            https://dienste.badw.de:9999/help#search.
        table:
            same table-name as in search-function (doesn't always match real table
            name).
        cols:
            names of column for output in list-format. if empty, all columns will
            be returned (col-names always match real col-names from db).
        o_cols:
            names of columns by which results will be sorted.
        html:
            if false, server will remove all html-tags.
        '''
        if type(query) in [list, dict]:
            query = json.dumps(query)
        cols = json.dumps(cols)
        o_cols = json.dumps(o_cols)
        data = {'mode': 'search', 'query': query, 'table': table, 'cols': cols,
                'o_cols': o_cols, 'html': html}
        raw_dump = self.__call(data).text
        try:
            j_dump = json.loads(raw_dump)
        except:
            raise ValueError(f'An error occurred while receiving data. Response from server:\n{raw_dump}')

        return raw_dump, j_dump


if __name__ == '__main__':
    user = input(' User: ')
    pw = input(' Passwort: ')
    table = 'opera_view'
    print(f' |{user}|{pw}')
    reader = dMLW(user, pw)
    print(f'\t\'{table}\' last updated:', reader.version(table))
    if input('download data? (y/n) ').lower() in ['yes', 'y']:
        j_str, j_dump = reader.load(table, {'in_use': 1}, ['id', 'example', 'example_plain'],
                ['author_abbr', 'work_abbr_sort'])
        with open('opera.json', 'w', encoding='utf-8') as f:
            f.write(j_str)
        print(j_str)
