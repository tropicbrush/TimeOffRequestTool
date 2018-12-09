function (user, context, callback) {
  // TODO: implement your rule
  // 
if (context.clientID === 'lnRKX3VDp6qZwRbTCsmR1p5oMkzSw5ke')
  {
var request = require("request");
let role = '';
let access_token = '';
let nickname = user.nickname;  
  
var options1 = { method: 'POST',
  url: 'https://how2makessowork.auth0.com/oauth/token',
  headers:
   { 'cache-control': 'no-cache',
     'Content-Type': 'application/json' },
  body:
   { client_id: 'ZW40hrt8o1jnKFZes5c4FeR0uhaUhly3',
     client_secret: 'kvK92GvmtMvpXiCiK2FZIN8Sg5xLDR3EHX_t1QxkVv75Vyw8dWHGwxoubeTibfS4',
     audience: 'https://oauth.how2makesso.work/',
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
