from configparser import ConfigParser
import unittest

from arachne import Arachne

class ArachneObjectTest(unittest.TestCase):
    def setUp(self): # setup unittest: initialize Arachne-object
        cfg = ConfigParser()
        cfg.read("config/localhost.ini") # uses local config file (as server.py does) 
        self.db = Arachne(cfg["database"])
    
    # test CRUD-methods -> https://de.wikipedia.org/wiki/CRUD
    def test_create(self): # C
        self.assertEqual(self.db.search("work", {"abbr": "test"}, ["id"]), []) # check if a "test"-work exists.
        new_id = self.db.save("work", {"abbr": "test"}) # create work
        self.assertEqual(self.db.search("work", {"abbr": "test"}, ["id"]), [{"id": new_id}]) # check if new work exists
        self.db.delete("work", {"id": new_id}) #remove new work
        self.assertEqual(self.db.search("work", {"abbr": "test"}, ["id"]), []) # check if "test"-work exists.

    def test_read(self): # R
        self.assertEqual(self.db.search("author", {"id": 1}, ["abbr"]), [{"abbr": "Abbo Flor."}])
        self.assertEqual(self.db.search("author", {"abbr": "Abbo Flor."}, ["id"]), [{"id": 1}])

    def test_update(self): # U
        pass

    def test_delete(self): # D
        pass

if __name__ == "__main__":
    unittest.main()
