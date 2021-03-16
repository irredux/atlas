from os import path
from sys import argv

from dMLW import Buticula

if __name__ == '__main__':
    main_path = path.dirname(path.abspath(__file__))
    if len(argv) > 1:
        cfg_path = argv[1]
    else:
        cfg_path = 'config/localhost.ini'

    mlw_buticula = Buticula(main_path, cfg_path)
    mlw_buticula.run()
