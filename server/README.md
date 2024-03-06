# Startup
First you must have Postgres installed with a new database called caregiver created.
There must be a user that has read, write and delete privileges to use with flask. 
To start the server first change all variables in the .env file to the correct postgres login information.
Then change line 24 in migrations/env.py to the correct top level path for your current install. 
Source the venv/bin/activate file to enter the virtual python environment.
Then run pip install -r requirements.txt to install all dependencies.
Source the .env file and then run python3 app.py which will launch the app in developer mode. 


