import re
from api import db
from api import ma
from sqlalchemy.orm import validates

class User(db.Model):
	id = db.Column(db.Integer,primary_key=True)
	username = db.Column(db.String(80), unique=True)
        firstname = db.Column(db.String(300))
	lastname = db.Column(db.String(300))
        supervisor = db.Column(db.String(300))
	status = db.Column(db.String(10))
        title = db.Column(db.String(300))
        leaves = db.relationship('Leaves',backref='user', lazy='dynamic') 
	
	def serialize(self):
            return "{ 'id' : self.id,'username': self.username,'fistname': self.firstname,'lastname': self.lastname,'supervisor': self.supervisor,'status': self.status, 'title' : self.title }"
		


	@validates('username')
	def validate_username(self, key, username):
  		if not username:
      			raise AssertionError('No username provided')

  		if User.query.filter(User.username == username).first():
    			raise AssertionError('Username is already in use')

  		if len(username) < 1 or len(username) > 20:
    			raise AssertionError('Username must be between 5 and 20 characters')

  		return username

class Leaves(db.Model):
        id = db.Column(db.Integer,primary_key=True)
	username = db.Column(db.String(80))
	startdt = db.Column(db.String(30))
	enddt = db.Column(db.String(30))
	status = db.Column(db.String(30))
	approvebydate = db.Column(db.String(30))
	comments = db.Column(db.Text)
        user_id = db.Column(db.Integer,db.ForeignKey('user.id'), nullable = False) 

	def __repr__(self):
            return "{} {} {} {} {} {} {} {}".format(self.id,self.username,self.startdt,self.enddt,self.status,self.approvebydate,self.comments,self.user_id)

	

	@validates('startdt')
        def validate_startdt(self, key, startdt):
                if not startdt:
                        raise AssertionError('No Start Date provided')


                if len(startdt) < 8 or len(startdt) > 8:
                        raise AssertionError('StartDate must be in MM/DD/YY format')

                return startdt

	@validates('enddt')
        def validate_enddt(self, key, enddt):
                if not enddt:
                        raise AssertionError('No End Date provided')


                if len(enddt) < 8 or len(enddt) > 8:
                        raise AssertionError('End Date  must be in MM/DD/YY format')

                return enddt



	@validates('comments')
        def validate_comments(self, key, comments):
                if len(comments)  > 200:
                        raise AssertionError('Comments should not be longer than 200')

                return comments



class UserSchema(ma.ModelSchema):
	class Meta:
		model = User


class LeavesSchema(ma.ModelSchema):
        class Meta:
                model = Leaves
