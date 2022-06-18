from locust import HttpUser, task

# to start: run `locust` in /benchmark and connect to http://127.0.0.1:8089

class HelloWorldUser(HttpUser):
	@task
	def hello_world(self):
		self.client.get("/")
		self.client.get("/session")
