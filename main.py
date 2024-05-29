import logging
from waitress import serve
from routes import create_app

app = create_app()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

if __name__ == "__main__":
	serve(app, host="localhost", port=8080)
