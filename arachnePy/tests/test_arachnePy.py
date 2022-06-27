import pytest
import requests
import json

from arachne import Arachne
#from credentials import user_credentials

#user_credentials = json.loads(open("credentials.json", "r").read())
with open("./arachnePy/tests/login_data.json", "r") as login_file:
    user_credentials = json.load(login_file)

@pytest.fixture
def conn():
    return Arachne(
        user_credentials["user"],
        user_credentials["password"],
        url="http://localhost:8080/mlw",
        tbls=["zettel", "lemma", "author", "work"]
    )

def test_session():
    with pytest.raises(PermissionError) as e_info:
        conn = Arachne(
            "bla",
            "1234",
            url="http://localhost:8080/mlw",
            tbls=["zettel", "lemma", "author", "work"]
        )
    with pytest.raises(requests.exceptions.ConnectionError) as e_info:
        conn = Arachne(
            user_credentials["user"],
            user_credentials["password"],
            url="https://dienste.badw.de:1000",
            tbls=["zettel", "lemma", "author", "work"]
        )
    conn = Arachne(
        user_credentials["user"],
        user_credentials["password"],
        url="http://localhost:8080/mlw",
        tbls=["zettel", "lemma", "author", "work"]
    )
    conn.close()
def test_search(conn):
    re = conn.lemma.search([{"c": "id", "o": "=", "v": 1}])
    assert len(re) == 1
    assert re[0]["id"] == 1
    re = conn.author.search([{"c": "id", "o": ">", "v": 0}], count=True)
    assert len(re) == 1
    assert re[0]["count"] == 964
    re = conn.zettel.search([{"c": "lemma_id", "o": "!=", "v": "NULL"}], limit=10)
    assert len(re) == 10
    re2 = conn.zettel.search([{"c": "lemma_id", "o": "!=", "v": "NULL"}], limit=10, offset=5)
    assert len(re2) == 10
    assert re[5]["id"] == re2[0]["id"]
    re = conn.work.search([{"c": "author_id", "o": "=", "v": "1"}], select=["id", "date_sort"])
    assert len(re) > 0
    for r in re: assert [x for x in r.keys()] == ["id", "date_sort"]
    re = conn.lemma.search([{"c": "id", "o": ">", "v": "0"}], select=["id", "u_date"], limit=10)
    re2 = conn.lemma.search([{"c": "id", "o": ">", "v": "0"}], select=["id", "u_date"], limit=10, order=["u_date"])
    assert len(re) > 0
    assert len(re) == len(re2)
    assert re[0]["id"] != re2[0]["id"]
    conn.close()
def test_get(conn):
    re = conn.work.get({"id": 1})
    assert len(re) == 1
    assert re[0]["id"] == 1
    re = conn.zettel.get({"lemma_id": 3376})
    assert len(re) == 1781
    conn.close()
def test_getAll(conn):
    re = conn.work.search([{"c": "id", "o": ">", "v": 0}], select=["id"])
    re2 = conn.work.getAll(select=["id"])
    assert len(re) > 0
    assert len(re) == len(re2)
    conn.close()
def test_describe(conn):
    re = conn.author.describe()
    assert re == ["id", "abbr", "full", "date_display", "date_sort", "date_type", "txt_info", "in_use", "abbr_sort", "c_date", "deleted", "u_date"]
    conn.close()
def test_version(conn):
    re = conn.lemma.version()
    assert re["length"] >= 11491
    assert re["max_date"] >= "2022-06-03 18:52:55.238350"
    conn.close()
def test_save(conn):
    re = conn.lemma.get({"id": 1})
    re2 = conn.lemma.save({"id": 1, "lemma": "bla"})
    re3 = conn.lemma.get({"id": 1})
    assert re3[0]["lemma"] == "bla"
    conn.lemma.save({"id": 1, "lemma": re[0]["lemma"]})
    conn.close()
def test_delete(conn):
    new_lemma_name = "testdeletepy4"
    re = conn.lemma.get({"lemma": new_lemma_name})
    assert len(re) == 0
    lemma_length = conn.lemma.version()["length"]
    assert lemma_length > 0
    reId = conn.lemma.save({"lemma": new_lemma_name})
    assert lemma_length+1 == conn.lemma.version()["length"]
    assert reId > 0
    re = conn.lemma.delete(reId)
    assert lemma_length == conn.lemma.version()["length"]
    conn.close()