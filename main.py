import logging

from gunicorn.app.base import BaseApplication

from routes import create_app

app = create_app()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class StandaloneApplication(BaseApplication):
	def __init__(self, application, opt=None):
		self.application = application
		self.options = opt or {}
		super().__init__()

	def load_config(self):
		# Apply configuration to Gunicorn
		for key, value in self.options.items():
			if key in self.cfg.settings and value is not None:
				self.cfg.set(key.lower(), value)

	def load(self):
		return self.application


if __name__ == "__main__":
	options = {
		"bind": "0.0.0.0:8080",
		"workers": 4,
		"loglevel": "info",
		"accesslog": "-"
	}
	StandaloneApplication(app, options).run()
