from flask import request, jsonify
from api.config import app, mysql
from flask_mysqldb import MySQLdb
from werkzeug.security import generate_password_hash, check_password_hash
from utils.functions import *
import requests

GOOGLE_CLIENT_ID = os.environ['GOOGLE_CLIENT_ID']
GOOGLE_SECRET_KEY = os.environ['GOOGLE_SECRET_KEY']


@app.route("/api/auth/", methods=["GET"])
@token_required
def auth():
    return jsonify({'user': request.user}), 200

@app.route('/api/auth/google_login', methods=['POST'])
def login():
    auth_code = request.get_json()['code']

    data = {
        'code': auth_code,
        'client_id': GOOGLE_CLIENT_ID,  # client ID from the credential at google developer console
        'client_secret': GOOGLE_SECRET_KEY,  # client secret from the credential at google developer console
        'redirect_uri': 'postmessage',
        'grant_type': 'authorization_code'
    }

    response = requests.post('https://oauth2.googleapis.com/token', data=data).json()
    
    headers = {
        'Authorization': f'Bearer {response["access_token"]}'
    }
    user_info = requests.get('https://www.googleapis.com/oauth2/v3/userinfo', headers=headers).json()

    """
        check here if user exists in database, if not, add him
    """
    

    # ================ regiserinig ===================

    firstName = user_info["given_name"]
    lastName = user_info["family_name"] if user_info.get("family_name") != None else ""
    email = user_info["email"]
    password = generate_password_hash(os.environ["GOOGLE_PASSWORD"])
    create_table_query = '''
        CREATE TABLE IF NOT EXISTS Users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            firstName VARCHAR(255) NOT NULL,
            lastName VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL,
            password VARCHAR(255) NOT NULL
        )
    '''

    try:
        cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
        cursor.execute(create_table_query)
        
        email_check_query = "SELECT * FROM Users WHERE email = %s"
        cursor.execute(email_check_query, (email,))
        
        exist_users = cursor.fetchall()
        if len(exist_users) > 0:
            # return jsonify({"message": "User already registered."}), 409
            pass
        else:
            user_register_query = "INSERT INTO Users (firstName, lastName, email, password) VALUES (%s, %s, %s, %s)"
            cursor.execute(user_register_query, (firstName, lastName, email, password))
            mysql.connection.commit()
            cursor.close()
            # return jsonify({"message": "User Registered successfully"}), 200
    except Exception as e:
        print("Database connection failed due to {}".format(e))
        return jsonify({"message": "Database Error"}), 400

    # ================ regiserinig ===================


    payload = {
        "firstName": user_info["given_name"],
        "lastName":  user_info["family_name"] if user_info.get("family_name") != None else "",
        "email": user_info["email"],
    }
    token = encode_auth_token(payload)
    return jsonify({"token": token, "message": "User Logged in successfully"}), 200



    jwt_token = create_access_token(identity=user_info['email'])  # create jwt token
    response = jsonify(user=user_info)
    response.set_cookie('access_token_cookie', value=jwt_token, secure=True)

    return response, 200



@app.route("/api/auth/signin/", methods=["POST"])
def signin():
    if (
        request.method == "POST"
        and "email" in request.form
        and "password" in request.form
    ):
        email = request.form["email"]
        password = request.form["password"]
        user_find_query = "SELECT * FROM Users WHERE email = %s"
        try:
            cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
            cursor.execute(user_find_query, (email,))
            user = cursor.fetchone()
            if user is None:
                return {"message": "User not exist"}, 404
            else:
                user_firstName = user['firstName']
                user_lastName = user['lastName']
                user_email = user['email']
                user_password = user['password']
                if user_password and check_password_hash(user_password, password) == True:
                    payload = {
                        "firstName": user_firstName,
                        "lastName": user_lastName,
                        "email": user_email,
                    }
                    token = encode_auth_token(payload)
                    return jsonify({"token": token, "message": "User Logged in successfully"}), 200
                    
        except Exception as e:
            print("Database connection failed due to {}".format(e))
            return jsonify({"message": "Database Error"}), 400
    else:
        print("Missing fields")
        return jsonify({"status": 400, "message": "Missing fields"}), 400

@app.route("/api/auth/signup/", methods=["POST"])
def register():
    if (
        request.method == "POST"
        and "firstName" in request.form
        and "lastName" in request.form
        and "email" in request.form
        and "password" in request.form
    ):
        firstName = request.form["firstName"]
        lastName = request.form["lastName"]
        email = request.form["email"]
        password = generate_password_hash(request.form["password"])
        create_table_query = '''
            CREATE TABLE IF NOT EXISTS Users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                firstName VARCHAR(255) NOT NULL,
                lastName VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL,
                password VARCHAR(255) NOT NULL
            )
        '''

        try:
            cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
            cursor.execute(create_table_query)
            
            email_check_query = "SELECT * FROM Users WHERE email = %s"
            cursor.execute(email_check_query, (email,))
            
            exist_users = cursor.fetchall()
            if len(exist_users) > 0:
                return jsonify({"message": "User already registered."}), 409
            else:
                user_register_query = "INSERT INTO Users (firstName, lastName, email, password) VALUES (%s, %s, %s, %s)"
                cursor.execute(user_register_query, (firstName, lastName, email, password))
                mysql.connection.commit()
                cursor.close()
                return jsonify({"message": "User Registered successfully"}), 200
        except Exception as e:
            print("Database connection failed due to {}".format(e))
            return jsonify({"message": "Database Error"}), 400
    else:
        print("Missing fields")
        return jsonify({"status": 400, "message": "Missing fields"}), 400