# Install

python3 -m venv .
./bin/pip3 install -r requirements.txt
./bin/activate

# To run the app

./bin/uvicorn main:app --reload --app-dir src
