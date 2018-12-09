# How to create users in API DB

The API application uses Flask-SQLAlchemy as its database. Below commands can be used to perform various tasks on the database directly.


## Connection to database

Login to your python enviroment set for the API application and execute below commands in python.

> from api import db
> from apiModel import User, Leaves


## Search for a user in the database.

>  db.session.query(User.id,User.username,User.firstname,User.lastname).filter_by(username='hulk').all()

## Add a user in the database.

> db.session.add(User(username="iron.man",firstname="Robert",lastname="Downey",supervisor="philc",status="Active",title="EndUser"))
> db.session.commit()

## Delete a user from the database.

>  db.session.delete(User.query.filter_by(id=4).first())
> db.session.commit()
