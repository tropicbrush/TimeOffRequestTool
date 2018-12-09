#!flask/bin/python
import os
from flask import Flask
from flask import Flask, jsonify
from flask import abort
from flask import make_response
from flask import request
from flask import url_for
import requests
from flask import request
import json
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from flask_cors import CORS
from jose import jwt
from configparser import ConfigParser

app = Flask(__name__)

config = ConfigParser()
config_file = 'config.cnf'
config.read(config_file)


#app.config['SECRET_KEY'] = config.get('flask', 'secret_key')
db_path = config.get('AUTH0_CONF', 'AUTH0_SQLALCHEMY_DIR')
oauth_audience = config.get('AUTH0_CONF', 'AUTH0_API_ID')
oauth_issuer = config.get('AUTH0_CONF', 'AUTH0_ISSUER')
jwt_alg = config.get('AUTH0_CONF', 'AUTH0_JWT_ALG')
jwks_url = config.get('AUTH0_CONF', 'AUTH0_JWKS_JSON')
cust_field_uri = config.get('AUTH0_CONF', 'AUTH0_CUST_FIELD_URI')


cors = CORS(app, resources={r"/api/*": {"origins": "*"}})

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(db_path,'Auth0Api.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS']='False'

db = SQLAlchemy(app)
ma = Marshmallow(app)

from apiModel import Leaves,User


class UserSchema(ma.ModelSchema):
        class Meta:
                model = User


class LeavesSchema(ma.ModelSchema):
        class Meta:
                model = Leaves




#This method shows all requests for same user , scope users.me
@app.route('/api/v1.0/getMyLeaves', methods=['POST'])
def get_Myleaves():
    access_token = request.form['access_token']
    if access_token:	
     verify = json.loads(auth0_verify_access_token(access_token))
     print verify
     if 'verified' in verify:
	print verify['verified']
        if (verify['verified'] == 'yes' and ('TimeOffTool.me.read' in verify['scopes'] or 'TimeOffTool.me.write' in verify['scopes'] )):
         result =db.session.query(Leaves).outerjoin(User, Leaves.username==User.username).filter(User.username == verify['username']).all()
	 if result:
		count = db.session.query(Leaves).outerjoin(User, Leaves.username==User.username).filter(User.username == verify['username']).count()
		leave_Schema = LeavesSchema(many=True)
		output = leave_Schema.dump(result).data
		return jsonify({"results": count,"Output": output})
	 return jsonify({'error': 'No Information found'})
        else:
         print abort(404)
         return abort(404)
     else:
	print abort(405)
        return  abort(405)

#This method showns requests from user DRs
@app.route('/api/v1.0/getDRLeaves', methods=['POST'])
def get_MyDRleaves():
         access_token = request.form['access_token']
 	 if access_token:
    	     verify = json.loads(auth0_verify_access_token(access_token))
             if (verify['verified'] == 'yes' and ('TimeOffTool.DR.read' in verify['scopes'] or 'TimeOffTool.DR.approve' in verify['scopes'] )):
	        result = db.session.query(Leaves).outerjoin(User, Leaves.username==User.username).filter(User.supervisor == verify['username']).all()
                if result:
			count = db.session.query(Leaves).outerjoin(User, Leaves.username==User.username).filter(User.supervisor == verify['username']).count()
                	leave_Schema = LeavesSchema(many=True)
                	output = leave_Schema.dump(result).data
                	return jsonify({"results": count,"Output": output})
        	return jsonify({'error': 'No Information found'})
     	     else:
        	abort(404)
    	 else:
         	abort(405)

#This method will show requests for everyone to HR ADMIN
@app.route('/api/v1.0/getAllLeaves', methods=['POST'])
def get_Allleaves():
    access_token = request.form['access_token']
    if access_token:
     verify = json.loads(auth0_verify_access_token(access_token))
     if (verify['verified'] == 'yes' and ('TimeOffTool.HR.admin' in verify['scopes'] )):
        result = db.session.query(Leaves).outerjoin(User, Leaves.username==User.username).all()
        if result:
                count = db.session.query(Leaves).outerjoin(User, Leaves.username==User.username).count()
		leave_Schema = LeavesSchema(many=True)
                output = leave_Schema.dump(result).data
                return jsonify({"results": count,"Output": output})
        return jsonify({'error': 'No Information found'})
     else:
        abort(404)
    else:
         abort(405)


#This method will allow creating a request
@app.route('/api/v1.0/leaveRequest', methods=['POST'])
def get_leaveRequest():
    access_token = request.form['access_token']
    if access_token:
     verify = json.loads(auth0_verify_access_token(access_token))
     if (verify['verified'] == 'yes' and ('TimeOffTool.me.write' in verify['scopes'] )):
	 startdte = request.form['startdt']
	 enddte = request.form['enddt']
	 comment = request.form['comments']
     	 try:
	  userObj = User.query.filter_by(username=verify['username']).first()
	  result =  db.session.add(Leaves(user=userObj,username=userObj.username,startdt=startdte,enddt=enddte,status="Pending",approvebydate=startdte,comments=comment))
          db.session.commit()
	  return jsonify({'Success': 'Successfully updated the entry'})
         except AssertionError as exception_message:
		 return jsonify(msg='error: {}. '.format(exception_message)), 400
     else:
        abort(404)
    else:
         abort(405)




# method will allow deleting request
@app.route('/api/v1.0/delLeaveRequest', methods=['POST'])
def delLeaveRequest():
    access_token = request.form['access_token']
    if access_token:
     verify = json.loads(auth0_verify_access_token(access_token))
     if (verify['verified'] == 'yes' and ('TimeOffTool.HR.admin' in verify['scopes'] )):
         req_id = request.form['req_id']
	 result =  db.session.delete(Leaves.query.filter_by(id=req_id).first())
         db.session.commit()
         return jsonify({'Success': 'Successfully deleted the entry'})
     else:
         abort(404)
    else:
         abort(405)



#this method will allow  updating request 
@app.route('/api/v1.0/updateLeaveRequest', methods=['POST'])
def updateLeaveRequest():
    access_token = request.form['access_token']
    if access_token:
     verify = json.loads(auth0_verify_access_token(access_token))
     if (verify['verified'] == 'yes' and ('TimeOffTool.HR.admin' in verify['scopes'] or 'TimeOffTool.me.write' in verify['scopes'] )):
         req_id = request.form['req_id']
	 print req_id
	 startdte = request.form['startdt']
	 enddte = request.form['enddt']
	 comment = request.form['comments']
         result =  Leaves.query.filter_by(id=req_id).first()
         result.startdt = startdte
	 result.enddt = enddte
	 result.comments = comment
	 result.approvebydate = startdte
	 result.status = "Pending"
	 db.session.commit()
         return jsonify({'Success': 'Successfully updated the entry'})
     else:
        abort(404)
    else:
         abort(405)



@app.route('/api/v1.0/approveRequest', methods=['POST'])
def approveRequest():
    access_token = request.form['access_token']
    if access_token:
     verify = json.loads(auth0_verify_access_token(access_token))
     if (verify['verified'] == 'yes' and ('TimeOffTool.HR.admin' in verify['scopes'] or 'TimeOffTool.DR.approve' in verify['scopes'] )):
         req_id = request.form['req_id']
         print req_id
         result =  Leaves.query.filter_by(id=req_id).first()
         result.status = "Approved"
         db.session.commit()
         return jsonify({'Success': 'Successfully approved the entry'})
     else:
        abort(404)
    else:
         abort(405)



@app.route('/api/v1.0/cancelRequest', methods=['POST'])
def cancelRequest():
    access_token = request.form['access_token']
    if access_token:
     verify = json.loads(auth0_verify_access_token(access_token))
     if (verify['verified'] == 'yes' and ('TimeOffTool.HR.admin' in verify['scopes'] or 'TimeOffTool.me.write' in verify['scopes'] )):
         req_id = request.form['req_id']
         print req_id
         result =  Leaves.query.filter_by(id=req_id).first()
         result.status = "Cancelled"
         db.session.commit()
         return jsonify({'Success': 'Successfully cancelled the entry'})
     else:
        abort(404)
    else:
         abort(405)



@app.route('/api/v1.0/rejectRequest', methods=['POST'])
def rejectRequest():
    access_token = request.form['access_token']
    if access_token:
     verify = json.loads(auth0_verify_access_token(access_token))
     if (verify['verified'] == 'yes' and ('TimeOffTool.HR.admin' in verify['scopes'] or 'TimeOffTool.DR.Approve' in verify['scopes'] )):
         req_id = request.form['req_id']
         print req_id
         result =  Leaves.query.filter_by(id=req_id).first()
         result.status = "Rejected"
         db.session.commit()
         return jsonify({'Success': 'Successfully rejected the entry'})
     else:
        abort(404)
    else:
         abort(405)




#This method will allow role check
@app.route('/api/v1.0/getUserRoleStatus', methods=['POST'])
def get_userRole():
    access_token = request.form['access_token']
    username = request.form['username']
    print access_token
    print username
    if access_token:
     verify = json.loads(auth0_verify_access_token_ClientCred(access_token))
     if (verify['verified'] == 'yes' and ('TimeOffTool.readUser' in verify['scopes'] )):
	result = User.query.with_entities(User.title,User.status).filter_by(username=username).first()
        if result:
		print result
                return jsonify(result)
        return jsonify({'error': 'No Information found'})
     else:
        abort(404)
    else:
         abort(405)


@app.route('/api/v1.0/registerUser', methods=['POST'])
def registerUser():
    access_token = request.form['access_token']
    print access_token
    if access_token:
     verify = json.loads(auth0_verify_access_token_ClientCred(access_token))
     print verify
     if (verify['verified'] == 'yes' and ('TimeOffTool.registerUser' in verify['scopes'] )):
	 print "inside"
         username = request.form['username']
         print username
	 title = request.form['title']
         print title
	 status = request.form['status']
         print status
	 manager = request.form['supervisor']
	 print manager
	 fn = request.form['firstname']
	 print fn
	 ln  = request.form['lastname']
	 print ln
         try:
          createUser = db.session.add(User(username=username,firstname=fn,lastname=ln,supervisor=manager,status=status,title=title))
          db.session.commit()
          return jsonify({'Success': 'Successfully added new user'})
         except AssertionError as exception_message:
                 return jsonify(msg='error: {}. '.format(exception_message)), 400
     else:
        abort(404)
    else:
         abort(405)



def auth0_verify_access_token_ClientCred(access_token):
        token = access_token
        response = requests.get(jwks_url)
        keys = json.dumps(response.json())
        try :
         token_json = jwt.decode(token, keys, algorithms=jwt_alg,audience=oauth_audience,issuer=oauth_issuer)
         if (token_json):
                print "test2"
                return json.dumps({"verified": "yes",'scopes':token_json["scope"]})
         return json.dumps({"verified": 'false'})
        except jwt.ExpiredSignatureError:
            return json.dumps({'Error':'Signature expired. Please log in again.'})
        except jwt.InvalidTokenError:
            return json.dumps({'Error':'Invalid token. Please log in again.'})



def auth0_verify_access_token(access_token):
	token = access_token
	response = requests.get(jwks_url)
	print token
	keys = json.dumps(response.json())
	try :
	 token_json = jwt.decode(token, keys, algorithms=jwt_alg,audience=oauth_audience,issuer=oauth_issuer)
	 if (token_json):
                print token_json
		return json.dumps({"verified": 'yes',"username":token_json[cust_field_uri+'username'],'scopes':token_json["scope"]})
    	 print "returning false"
         return json.dumps({"verified": 'false'})
	except jwt.ExpiredSignatureError:
            return json.dumps({'Error':'Signature expired. Please log in again.'})
        except jwt.InvalidTokenError:
            return json.dumps({'Error':'Invalid token. Please log in again.'})




@app.route('/')
def index():
    return "Hello, World!"


@app.errorhandler(404)
def not_found(error):
    return make_response(jsonify({'error': 'Not found'}), 404)

@app.errorhandler(405)
def not_found(error):
    return make_response(jsonify({'error': 'Not found access_token'}), 405)


if __name__ == '__main__':
    app.run(debug=True)
