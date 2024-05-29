from flask import Flask
from flask import render_template


def create_app():
	application = Flask(__name__, static_folder='static')

	@application.route("/")
	def home_route():
		return render_template("home.html")

	@application.route("/about")
	def about_route():
		return render_template("about.html")

	return application
