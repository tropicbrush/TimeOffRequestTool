function (user, context, callback) {
  // TODO: implement your rule
  // 
if (context.clientID === '##########')
  {
var request = require("request");
let role = '';
let access_token = '';
let nickname = user.nickname;  
  
var options1 = { method: 'POST',
  url: 'https://YOUR_AUth0_Tenant/oauth/token',
  headers:
   { 'cache-control': 'no-cache',
     'Content-Type': 'application/json' },
  body:
   { client_id: '############',
     client_secret: '########################',
     audience: 'http://localhost:8081/',
     grant_type: 'client_credentials' },
  json: true };

request(options1, function (error, response, body) {
  if (error) return callback(new Error(body));

//  console.log(body);
//var obj = JSON.parse(body);

//   console.log(body.access_token);
   access_token = body.access_token;
   console.log(access_token);
 //  user.user_metadata.title = 'role23';
   
  var options2 = { method: 'POST',
  url: 'https://oauth.how2makesso.work/api/v1.0/getUserRoleStatus',
  headers: { 'cache-control': 'no-cache' },rejectUnauthorized:false,
  form:
   { access_token: access_token,
     username: nickname} };

  request(options2, function (error, response, body) {
  if (error) return callback(new Error(body));

//  console.log(body);

var resp = JSON.parse(body);

var role = resp[0];
var status =resp[1];
//console.log(role);
//
user.app_metadata = user.app_metadata || {};
user.app_metadata.title = role; 
user.app_metadata.status = status;
if (status !=='Active'){
return callback(new Error("Access Denied : User inactive in TimeOffTool"));
}    
    
return callback(null, user, context);
});
});
  }
  else {
  return callback(null, user, context);
  }
}
