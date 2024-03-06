#!/usr/bin/python3
from flask_cognito import CognitoAuth 
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from dotenv import dotenv_values 
import logging
import boto3

s3 = boto3.resource('s3')

config = dotenv_values(".env")
app = Flask(__name__)
app.config.from_mapping(
    COGNITO_REGION='us-east-1',
    COGNITO_USERPOOL_ID='us-east-1_anHc3uvBS',

    # optional
    # client ID you wish to verify user is authenticated against
    COGNITO_APP_CLIENT_ID='3udstlvm0ad7fgnr58948939hl',
    # disable token expiration checking for testing purposes
    COGNITO_CHECK_TOKEN_EXPIRATION=False,
    COGNITO_JWT_HEADER_NAME='Authorization',
    COGNITO_JWT_HEADER_PREFIX='Bearer',
)
cogauth = CognitoAuth(app)
app.config['SQLALCHEMY_DATABASE_URI'] = f"postgresql://{config['FLASK_DB_USER']}:{config['FLASK_DB_PASSWORD']}@{config['FLASK_RUN_HOST']}:{config['FLASK_RUN_PORT']}/{config['FLASK_DB_NAME']}"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['REDIS_URL'] = config['REDIS_URL']
CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
# configuration
db = SQLAlchemy(app)
migrate = Migrate(app, db)
#db.create_all()
from endpoints import * 
import models as appmod
if __name__ == '__main__':
    logging.basicConfig(level=logging.DEBUG)
    app.run(debug=True)
else:
    gunicorn_logger = logging.getLogger('gunicorn.error')
    app.logger.handlers = gunicorn_logger.handlers
    app.logger.setLevel(gunicorn_logger.level)
