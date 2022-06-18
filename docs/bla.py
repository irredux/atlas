# test_arachne.py
from configparser import ConfigParser
import pytest

from arachne import Arachne

@pytest.fixture
def db():
    cfg = ConfigParser()
    cfg.read("config/localhost.ini") # uses local config file (as server.py does) 
    return Arachne(cfg["database"])


def test_create(db):
    # setup
    assert db.search("work", {"abbr": "test"}, ["id"]) == []
    new_id = db.save("work", {"abbr": "test"})

    # check
    assert db.search("work", {"abbr": "test"}, ["id"]) == [{"id": new_id}]
    assert db.command("SELECT id FROM work WHERE id = %s", [new_id]) == [{"id": new_id}]
    
    # cleanup
    db.delete("work", {"id": new_id})
    assert db.search("work", {"abbr": "test"}, ["id"]) == []


#class TestArachneObject:
#     def setUp(self): # setup unittest: initialize Arachne-object
#         
    
#     # test CRUD-methods -> https://de.wikipedia.org/wiki/CRUD
#     def test_create(self): # C
#         

#     def test_read(self): # R
#         self.assertEqual(self.db.search("author", {"id": 1}, ["abbr"]), [{"abbr": "Abbo Flor."}])
#         self.assertEqual(self.db.search("author", {"abbr": "Abbo Flor."}, ["id"]), [{"id": 1}])

#     def test_update(self): # U
#         pass

#     def test_delete(self): # D
#         pass

# if __name__ == "__main__":
#     unittest.main()
