import unittest
from arachne import Arachne
from passport import Passport

class ArachnePyCRUD(unittest.TestCase):
    def setUp(self):
        pp = Passport()
        self.a = Arachne(pp.email, pp.password, pp.host, ["lemma"], True)
    # C
    def test_create(self):
        self.assertEqual(len(self.a.lemma.search({"lemma": "xyz"})), 0)
        self.a.lemma.save({"lemma": "xyz", "lemma_display": "abc"})
        self.assertEqual(len(self.a.lemma.search({"lemma": "xyz"})), 1)
        self.assertEqual(len(self.a.lemma.search({"lemma": "xyz", "lemma_display": "abc"})), 1)
        self.assertEqual(self.a.lemma.delete(self.a.lemma.search({"lemma": "xyz", "lemma_display": "abc"})[0]["id"]), 200)
        self.assertEqual(len(self.a.lemma.search({"lemma": "xyz"})), 0)
    # R
    def test_search(self):
        self.assertEqual(len(self.a.lemma.search({"lemma": "kabrates"})), 1)
        self.assertEqual(len(self.a.lemma.search({"lemma": "kab*"})), 8)
        self.assertEqual(len(self.a.lemma.search({"id": "<3"})), 2)
        self.assertEqual(len(self.a.lemma.search({"id": ">10000"})), 296)
        self.assertEqual(len(self.a.lemma.search({"lemma": "-k"})), 10160)
    # U
    def test_save(self):
        c_id = self.a.lemma.search({"lemma": "kabrates"})[0]["id"]
        self.assertEqual(self.a.lemma.save({"id": c_id, "lemma": "ABC-123"}), 200)
        self.assertEqual(self.a.lemma.save({"id": c_id, "lemma": "kabrates"}), 200)
        self.assertEqual(self.a.lemma.search({"lemma": "kabrates"})[0]["id"], c_id)
    # D
    def test_delete(self):
        c_lemma = {"lemma": "AABBCC", "lemma_display": "AAAABBBBCCCC"}
        self.assertEqual(self.a.lemma.save(c_lemma), 201)
        c_db_lemma = self.a.lemma.search({"lemma": "AABBCC"})
        self.assertEqual(len(c_db_lemma), 1)
        self.assertEqual(self.a.lemma.delete(c_db_lemma[0]["id"]), 200)
        c_db_lemma = self.a.lemma.search({"lemma": "AABBCC"})
        self.assertEqual(len(c_db_lemma), 0)

if __name__ == "__main__":
    unittest.main()
