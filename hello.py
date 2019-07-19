from cloudant import Cloudant
from flask import Flask, render_template, request, jsonify, flash, session, abort, redirect, url_for, make_response
from app import bmkg
import flask_headers
import atexit
import os
import json

app = Flask(__name__, static_url_path='')

db_name = 'mydb'
client = None
db = None

if "CLOUDANT_URL" in os.environ:
    print("Found Credentials in Env")
    client = Cloudant(os.environ['CLOUDANT_USERNAME'], os.environ['CLOUDANT_PASSWORD'], url=os.environ['CLOUDANT_URL'], connect=True)
    db = client.create_database(db_name, throw_on_exists=False)
else:
    print("No Credentials :(\nJust run locally.")

port = int(os.getenv('PORT', 8000))


# -------------------------------------------------------------------- #
#                           REST API                                   #
# -------------------------------------------------------------------- #
@app.route('/')
def home():
    if not session.get("logged_in"):
        r = redirect(url_for('loginpage', next='/'), code=302)
        r.headers['Cache-Control'] = 'no-cache'
        return r
    else:
        r = make_response(render_template('home.html', title="Home"))
        r.headers['Cache-Control'] = 'no-cache'
        r.headers['X-Frame-Options'] = 'DENY'
        return r

@app.route('/login')
def loginpage():
    if not session.get('logged_in'):
        r = app.send_static_file('login.html')
        r.headers['Cache-Control'] = 'no-cache'
        r.headers['X-Frame-Options'] = 'DENY'
        return r
    else:
        flash("You already log in")
        return redirect(url_for('home', login='True'))

@app.route('/login', methods=['POST'])
def doLogin():
    if request.form['password'] == 'admin' and request.form['username'] == 'admin':
        session['logged_in'] = True
        return redirect('/', code=302)
    else:
        return redirect(url_for('loginpage', fail=1), code=302)

@app.route('/logout')
def logout():
    if not session.get('logged_in'):
        return redirect('/login', code=302)
    else:
        session.clear()
        return redirect(url_for('loginpage', logout=True))

# @app.route('/api/visitors', methods=['GET'])
# def get_visitor():
#     if client:
#         return jsonify(list(map(lambda doc: doc['name'], db)))
#     else:
#         print('No database')
#         return jsonify([])

# @app.route('/api/visitors', methods=['POST'])
# def put_visitor():
#     user = request.json['name']
#     data = {'name':user}
#     if client:
#         my_document = db.create_document(data)
#         data['_id'] = my_document['_id']
#         return jsonify(data)
#     else:
#         print('No database')
#         return jsonify(data)

@app.route('/api/gempa', methods=['GET'])
def data_gempa():
    if not session.get('logged_in'):
        return "<h1> Forbidden! </h1> "
    else:
        re = bmkg.dataGempa("http://data.bmkg.go.id/en_gempaterkini.xml")
        r = make_response(jsonify(re))
        r.headers['Cache-Control'] = 'no-cache'
        r.headers['X-Frame-Options'] = 'DENY'
        return r # Might change this url later.

@app.route('/api/cuaca', methods=['GET'])
def data_cuaca():
    if not session.get('logged_in'):
        return "<h1> Forbidden! </h1> "
    else:
        datacuaca = bmkg.dataCuaca("http://dataweb.bmkg.go.id/MEWS/DigitalForecast/DigitalForecast-SulawesiUtara.xml")
        r = make_response(jsonify(datacuaca['data']['forecast']['area']))
        r.headers['Cache-Control'] = 'no-cache'
        r.headers['X-Frame-Options'] = 'DENY'
        return r
# ----- The endpoint is gone :(  ----- #
# @app.route('/api/cuaca_maritim', methods=['GET'])
# def data_cuaca_maritim():
#     if not session.get('logged_in'):
#         return "<h1> Forbidden! </h1>"
#     else:
#         return jsonify(bmkg.dataMaritim("http://maritim.bmkg.go.id/xml/wilayah_pelayanan/prakiraan?kode=N.10&format=xml"))

@app.route('/data', methods=['GET'])
def getData():
    if not session.get('logged_in'):
        r = redirect(url_for('loginpage', next='/'), code=302)
        r.headers['Cache-Control'] = 'no-cache'
        return r 
    else:
        r = make_response(render_template('data.html', title="Data BMKG"))
        r.headers['Cache-Control'] = 'no-cache'
        r.headers['X-Frame-Options'] = 'DENY'
        return r 
    


@atexit.register
def shutdown():
    if client:
        client.disconnect()

if __name__ == '__main__':
    app.secret_key = os.urandom(15)
    app.run(host='0.0.0.0', port=port, debug=True)
