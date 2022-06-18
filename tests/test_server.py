import json
import pytest

from server import app

with open("./tests/login_data.json", "r") as login_file:
	users = json.load(login_file)

@pytest.fixture
def client():
	app.config["TESTING"] = True
	with app.test_client() as client:
		yield client

def test_reroutes(client):
	re = client.get("/")
	assert re.status_code == 302
	assert re.headers[2][1] == "http://localhost/static/index.html?project=mlw"
	re = client.get("/dom")
	assert re.status_code == 302
	assert re.headers[2][1] == "http://localhost/static/index.html?project=dom"
	re = client.get("/tll")
	assert re.status_code == 302
	assert re.headers[2][1] == "http://localhost/static/index.html?project=tll"
	re = client.get("/mlw/argos/1")
	assert re.status_code == 302
	assert re.headers[2][1] == "http://localhost/static/index.html?project=mlw&app=argos&site=edition&id=1"
	re = client.get("/dom/argos/201")
	assert re.status_code == 302
	assert re.headers[2][1] == "http://localhost/static/index.html?project=dom&app=argos&site=edition&id=201"
	re = client.get("/tll/argos/1002")
	assert re.status_code == 302
	assert re.headers[2][1] == "http://localhost/static/index.html?project=tll&app=argos&site=edition&id=1002"

def test_session(client):
	assert client.get("/mlw/session").status_code == 401
	re = client.post("/mlw/session", json={"user": users["admin"]["email"], "password": users["admin"]["password"]})
	assert re.status_code == 201
	assert json.loads(client.get("/mlw/session").data.decode("utf-8"))["email"] == users["admin"]["email"]
	assert client.delete("/mlw/session").status_code == 200
	assert client.get("/mlw/session").status_code == 401

def test_user_c(client):
	assert client.post("/mlw/data/user", json={
		"first_name": "",
		"last_name": users["test"]["last_name"],
		"email": users["test"]["email"],
		"password": users["test"]["password"],
		}).status_code == 406
	assert client.post("/mlw/data/user", json={
		"first_name": users["test"]["first_name"],
		"last_name": "",
		"email": users["test"]["email"],
		"password": users["test"]["password"],
		}).status_code == 406
	assert client.post("/mlw/data/user", json={
		"first_name": users["test"]["first_name"],
		"last_name": users["test"]["last_name"],
		"email": "",
		"password": users["test"]["password"],
		}).status_code == 406
	assert client.post("/mlw/data/user", json={
		"first_name": users["test"]["first_name"],
		"last_name": users["test"]["last_name"],
		"email": users["test"]["email"],
		"password": "",
		}).status_code == 406
	assert client.post("/mlw/data/user", json={
		"first_name": users["test"]["first_name"],
		"last_name": users["test"]["last_name"],
		"email": users["test"]["email"],
		}).status_code == 406
	assert client.post("/mlw/data/user", json={
		"first_name": users["test"]["first_name"],
		"last_name": users["test"]["last_name"],
		"email": users["admin"]["email"],
		"password": users["test"]["password"],
		}).status_code == 409
	assert client.post("/mlw/data/user", json={
		"first_name": users["test"]["first_name"],
		"last_name": users["test"]["last_name"],
		"email": users["test"]["email"],
		"password": users["test"]["password"],
	 	}).status_code == 201

	assert client.post("/mlw/session", json={"user": users["admin"]["email"], "password": users["admin"]["password"]}).status_code == 201
	test_user = json.loads(client.get(f"/mlw/data/user?query={json.dumps([{'c': 'email', 'o': '=', 'v': users['test']['email']}])}")
		.data.decode("utf-8"))[0]


	assert client.patch(f"/mlw/data/user/{test_user['id']}", json={"access": ["auth"]}).status_code == 200
	assert client.delete("/mlw/session").status_code == 200
def test_user_u(client):
	assert client.patch("/mlw/data/user/1", json={}).status_code == 401
	assert client.post("/mlw/session", json={"user": users["test"]["email"], "password": users["test"]["password"]}).status_code == 201
	re = client.get("/mlw/session")
	assert re.status_code == 200
	test_user = json.loads(re.data.decode("utf-8"))
	assert client.patch(f"/mlw/data/user/{test_user['id']}", json={}).status_code == 400
	assert client.patch(f"/mlw/data/user/{test_user['id']}", json={"email": users["admin"]["email"], "first_name":"Maria", "last_name":"Test"}).status_code == 409
	assert client.patch(f"/mlw/data/user/{test_user['id']}", json={"email": "", "first_name":"Maria", "last_name":"Test"}).status_code == 400
	assert client.patch(f"/mlw/data/user/{test_user['id']}", json={"email": users["test"]["email"], "first_name":"", "last_name":"Test"}).status_code == 400
	assert client.patch(f"/mlw/data/user/{test_user['id']}", json={"email": users["test"]["email"], "first_name":"Maria", "last_name":""}).status_code == 400
	assert client.patch(f"/mlw/data/user/{test_user['id']}", json={"first_name":"Maria", "last_name":"Test"}).status_code == 200
	assert client.patch(f"/mlw/data/user/{test_user['id']}", json={"first_name":"Maria", "last_name":"Test"}).status_code == 304
	assert client.patch(f"/mlw/data/user/{test_user['id']}", json={"email":"maria.test@badw.de", "last_name":"Test"}).status_code == 200
	assert client.patch(f"/mlw/data/user/{test_user['id']}", json={"first_name": users["test"]["first_name"], "last_name": users["test"]["last_name"], "email": users["test"]["email"]}).status_code == 200
	assert client.patch(f"/mlw/data/user/{test_user['id']}", json={"last_name": "Test", "email": users["test"]["email"]}).status_code == 200
	assert client.patch(f"/mlw/data/user/{test_user['id']}", json={"last_name": users["test"]["last_name"]}).status_code == 200

	assert client.patch(f"/mlw/data/user/{test_user['id']}", json={"access": ["auth", "z_edit"]}).status_code == 404
	assert client.delete("/mlw/session").status_code == 200
	assert client.post("/mlw/session", json={"user": users["admin"]["email"], "password": users["admin"]["password"]}).status_code == 201
	assert client.patch(f"/mlw/data/user/{test_user['id']}", json={"access": ["auth", "z_edit"]}).status_code == 200
	# !!!!!! check here, if rights have changed!
	assert client.delete("/mlw/session").status_code == 200
def test_user_r(client):
	assert client.post("/mlw/session", json={"user": users["admin"]["email"], "password": users["admin"]["password"]}).status_code == 201
	assert client.get(f"/mlw/data/user?query={json.dumps([{'c': 'id', 'o': '=', 'v': 1}])}").status_code == 200
	assert client.get(f"/mlw/data/user?query={json.dumps([{'c': 'email', 'o': '=', 'v': users['test']['email']}])}").status_code == 200
	assert client.delete("/mlw/session").status_code == 200

def test_data_c(client):
	assert client.post("/mlw/session", json={"user": users["admin"]["email"], "password": users["admin"]["password"]}).status_code == 201
	re = client.post("/mlw/data/lemma", json={"lemma": "testlemma"})
	assert re.status_code == 201
	assert int(re.data.decode("utf-8")) > 0
	assert client.post("/mlw/data/not_existing", json={"lemma": "testlemma"}).status_code == 404
	assert client.delete("/mlw/session").status_code == 200

	assert client.post("/mlw/session", json={"user": users["test"]["email"], "password": users["test"]["password"]}).status_code == 201
	assert client.post("/mlw/data/lemma", json={"lemma": "testlemma"}).status_code == 403
	assert client.delete("/mlw/session").status_code == 200
def test_data_r(client):
	assert client.post("/mlw/session", json={"user": users["admin"]["email"], "password": users["admin"]["password"]}).status_code == 201
	assert client.get(f"/mlw/data/zettel?query={json.dumps([{'c': 'id', 'o': '=', 'v': 11765}])}").status_code == 200
	assert client.delete("/mlw/session").status_code == 200
def test_data_u(client):
	assert client.post("/mlw/session", json={"user": users["admin"]["email"], "password": users["admin"]["password"]}).status_code == 201
	test_lemma = json.loads(client.get(f"/mlw/data/lemma?query={json.dumps([{'c': 'lemma', 'o': '=', 'v': 'testlemma'}])}").data.decode("utf-8"))[0]
	assert client.patch(f"/mlw/data/lemma/{test_lemma['id']}", json={"lemma": "testlemmatest"}).status_code == 200
	assert client.patch("/mlw/data/lemma/10000000000000", json={"lemma": "testlemmatest"}).status_code == 200
	assert client.patch(f"/mlw/data/not_existing/{test_lemma['id']}", json={"lemma": "testlemmatest"}).status_code == 404
	assert client.delete("/mlw/session").status_code == 200
	assert client.post("/mlw/session", json={"user": users["test"]["email"], "password": users["test"]["password"]}).status_code == 201
	assert client.patch(f"/mlw/data/lemma/{test_lemma['id']}", json={"lemma": "testlemmatest"}).status_code == 403
	assert client.delete("/mlw/session").status_code == 200
	assert client.patch(f"/mlw/data/lemma/{test_lemma['id']}", json={"lemma": "testlemmatest"}).status_code == 401
def test_data_d(client):
	assert client.post("/mlw/session", json={"user": users["admin"]["email"], "password": users["admin"]["password"]}).status_code == 201
	test_lemma = json.loads(client.get(f"/mlw/data/lemma?query={json.dumps([{'c': 'lemma', 'o': '=', 'v': 'testlemmatest'}])}").data.decode("utf-8"))[0]
	assert client.delete("/mlw/session").status_code == 200
	assert client.delete(f"/mlw/data/lemma/{test_lemma['id']}").status_code == 401
	assert client.post("/mlw/session", json={"user": users["test"]["email"], "password": users["test"]["password"]}).status_code == 201
	assert client.delete(f"/mlw/data/lemma/{test_lemma['id']}").status_code == 403
	assert client.delete("/mlw/session").status_code == 200
	assert client.post("/mlw/session", json={"user": users["admin"]["email"], "password": users["admin"]["password"]}).status_code == 201
	assert client.delete(f"/mlw/data/lemma/{test_lemma['id']}").status_code == 200
	assert client.delete("/mlw/session").status_code == 200

def test_batch(client):
	assert client.post("/mlw/data_batch/zettel", json=[{"id": 3, "lemma": "bla"}]).status_code == 401
	assert client.post("/mlw/session", json={"user": users["admin"]["email"], "password": users["admin"]["password"]}).status_code == 201
	re = client.post("/mlw/data_batch/zettel", json=[{"id": 3, "lemma": "bla"}])
	assert re.status_code == 200
	assert json.loads(re.data.decode("utf-8")) == [3]
	re = client.post("/mlw/data_batch/zettel", json=[{"id": 3, "lemma": "bla"}, {"id": 1, "lemma": "bla"}])
	assert re.status_code == 200
	assert json.loads(re.data.decode("utf-8")) == [3, 1]
	re = client.post("/mlw/data_batch/zettel", json=[{"id": 3, "lemma": "bla"}, {"lemma": "bla"}])
	assert re.status_code == 200
	assert len(json.loads(re.data.decode("utf-8"))) == 2
	assert client.delete("/mlw/session").status_code == 200
	# test delete part 

def test_user_d(client):
	assert client.post("/mlw/session", json={"user": users["admin"]["email"], "password": users["admin"]["password"]}).status_code == 201
	test_user = json.loads(client.get(f"/mlw/data/user?query={json.dumps([{'c': 'email', 'o': '=', 'v': users['test']['email']}])}")
		.data.decode("utf-8"))[0]
	assert client.delete("/mlw/session").status_code == 200

	assert client.post("/mlw/session", json={"user": users["test"]["email"], "password": users["test"]["password"]}).status_code == 201
	re = client.delete(f"/mlw/data/user/{test_user['id']}")
	assert re.status_code == 401
	assert client.post("/mlw/session", json={"user": users["admin"]["email"], "password": users["admin"]["password"]}).status_code == 201
	re = client.delete(f"/mlw/data/user/{test_user['id']}")
	assert re.status_code == 200
	assert client.delete("/mlw/session").status_code == 200