"""tiro.py - logs entries from dMLW 

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

import logging

class Tiro(object):
    def __init__(self, stream = "True", logfile = None, lvl = 'DEBUG'):
        # DEBUG, INFO, WARNING, ERROR, CRITICAL
        startup_lst = []
        self.logger = logging.getLogger(__name__)
        self.logger.setLevel(lvl)
        formatter = logging.Formatter('%(asctime)s - %(levelname)s - %(message)s')
        if stream == "True":
            stderr_log_handler = logging.StreamHandler()
            stderr_log_handler.setFormatter(formatter)
            self.logger.addHandler(stderr_log_handler)
            startup_lst.append('standard output active.')
        if logfile != None:
            file_log_handler = logging.FileHandler(logfile)#self.p+"/dmlw.log"
            #file_log_handler = setLevel(logging.DEBUG)
            file_log_handler.setFormatter(formatter)
            self.logger.addHandler(file_log_handler)
            startup_lst.append(f'logfile "{logfile}" active.')
        self.logger.info(f'Tiro started. ({lvl})')
        for startup in startup_lst:
            self.logger.info(f'\t{startup}')

    def log(self, msg, msg_type = "INFO"):
        if msg_type == "INFO":
            self.logger.info(msg)
        elif msg_type == "WARNING":
            self.logger.warning(msg)
        elif msg_type == "ERROR":
            self.logger.error(msg)
        elif msg_type == "CRITICAL":
            self.logger.critical(msg)
        else:
            #"DEBUG"
            self.logger.debug(msg)
