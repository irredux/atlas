import unittest
from arachne import Arachne
from passport import Passport

class ArachnePyCRUD(unittest.TestCase):
    def setUp(self):
        pp = Passport()
        self.a = Arachne(pp.email, pp.password, pp.host, ["lemma"])
    # C
    def test_create(self):
        self.assertEqual(len(self.a.search("lemma", {"lemma": "xyz"})), 0)
        self.a.save("lemma", {"lemma": "xyz", "lemma_display": "abc"})
        self.assertEqual(len(self.a.search("lemma", {"lemma": "xyz"})), 1)
        self.assertEqual(len(self.a.search("lemma", {"lemma": "xyz", "lemma_display": "abc"})), 1)
        self.a.delete("lemma",self.a.search("lemma", {"lemma": "xyz", "lemma_display": "abc"})[0]["id"])
        self.assertEqual(len(self.a.search("lemma", {"lemma": "xyz"})), 0)
    # R
    def test_search(self):
        self.assertEqual(len(self.a.search("lemma", {"lemma": "kabrates"})), 1)
        self.assertEqual(len(self.a.search("lemma", {"lemma": "kab*"})), 8)
        self.assertEqual(len(self.a.search("lemma", {"id": "<3"})), 1)
        self.assertEqual(len(self.a.search("lemma", {"id": ">10000"})), 297)
        self.assertEqual(len(self.a.search("lemma", {"lemma": "-k"})), 10161)
    # U
    def test_save(self):
        c_id = self.a.search("lemma", {"lemma": "kabrates"})[0]["id"]
        self.assertEqual(self.a.save("lemma", {"id": c_id, "lemma": "ABC-123"}), 200)
        self.assertEqual(self.a.save("lemma", {"id": c_id, "lemma": "kabrates"}), 200)
        self.assertEqual(self.a.search("lemma", {"lemma": "kabrates"})[0]["id"], c_id)
    # D
    def test_delete(self):
        c_lemma = {"lemma": "AABBCC", "lemma_display": "AAAABBBBCCCC"}
        self.assertEqual(self.a.save("lemma", c_lemma), 201)
        c_db_lemma = self.a.search("lemma", {"lemma": "AABBCC"})
        self.assertEqual(len(c_db_lemma), 1)
        self.assertEqual(self.a.delete("lemma", c_db_lemma[0]["id"]), 200)
        c_db_lemma = self.a.search("lemma", {"lemma": "AABBCC"})
        self.assertEqual(len(c_db_lemma), 0)

if __name__ == "__main__":
    unittest.main()
