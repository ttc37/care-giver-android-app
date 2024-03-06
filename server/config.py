from os import environ
from dotenv import load_dotenv

# Load environment variables
load_dotenv()


class DevelopmentConfig(object):
    """
    Development configuration just for local development
    """
    SQLALCHEMY_DATABASE_URI = f"postgresql://{environ.get('FLASK_DB_USER')}:\
        {environ.get('FLASK_DB_PASSWORD')}@localhost/db_name"
    SQLALCHEMY_TRACK_MODIFICATIONS = False


class TestingConfig(object):
    """ Testing configuration just for local development"""
    ...


class ProductionConfig(object):
    """ Deployment configuration for production development"""
    ...


APP_CONFIG = {
    "development": DevelopmentConfig,
    "testing": TestingConfig,
    "production": ProductionConfig
}
