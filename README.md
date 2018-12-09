## The Time-Off Request Tool
The Time-Off Request tool is a Single Page Application (SPA) which can be used for Time-Off request management.

The application allows user to perform certain actions determined by user's job title as below:

+ A user with title as ```HR Admin``` can ```view``` leave requests from all users within the organization and also ```approve```, ```modify``` or ```deny``` the requests if in pending status.
+ A user with title as ```Manager``` can ```view``` his own requests and requests of his direct reports(DR) and can ```approve```/```reject``` requests from direct reports.
+ A user with title as ```EndUser``` can only ```view``` his owns requests and can ```change```/```cancel``` the request if it is in pending status.


## Prerequisites

+ Apache 2.2/2.4
+ Python 2.7

## Installation
+ Copy the content of SPAApp folder in directory used by Apache for serving content.
+ Copy the content of api folder in the python project and use the package manager  [pip](https://pip.pypa.io/en/stable/) to install the API app dependencies.

```
pip install -r requirements.txt
```
## Configuration
### Setup on Auth0
+ Create a application - ```Time Off Tool(SPA)``` of type ```Single Page Web Application``` and add below details in respective sections:

    Allowed Callback URL: http://localhost:80/index.html, http://webserver_ip_address/index.html

    Allowed Lougout URL: http://localhost:80/index.html, http://webserver_ip_address/index.html

    Allowed Origines(CORS): http://api_webserver_ip_address:port

+ Create a custom API - ```Time Off Tool (API)``` with identifier as ```http://localhost:8081``` and define properties:

    Scopes : ```TimeOffTool.me.read``` ```TimeOffTool.DR.read``` ```TimeOffTool.HR.admin``` ```TimeOffTool.me.write```
 ```TimeOffTool.DR.approve```

+ Create below rules from the files in Auth0 config folder in the order mentioned.

     + Fetch User Title and Status : FetchUserTitleAndStatus.js
     + Add username and Title to ID token : UpdateIDTokenWithUserDetails.js
     + Grant Scope Access On Title : grantAuthScope.js

### Setup on Apache and Python

+ Update the configuration in below files to reflect SPA App and API app details from setup above.

``` 
js/auth0-variables.js
config.cnf
```  
## Start the application
```
Start Apache service : service apache2 start or apachectl start
Start API service by runing : FLASK_APP=api.py flask run --port=8081 --host='0.0.0.0'
``` 
## Testing

+ Create users with title HR Admin and Manager in API database. (refer api/DemoDataAdd.md) and in Auth0.
+ User can register through Auth0 as well and will have title as EndUser by default.
+ The SPA application should be accessible on http://localhost/index.html and should show a screen request to login to access the application.
