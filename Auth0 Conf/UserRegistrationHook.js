module.exports = function (user, context, cb) {
   
  var request = require("request");
  let access_token = '';

  var mail = user.email;
  var username = mail.substring(0, mail.lastIndexOf("@"));

  console.log( username);
  var options1 = { method: 'POST',
  url: 'https://how2makessowork.auth0.com/oauth/token',
  headers:
   { 'cache-control': 'no-cache',
     'Content-Type': 'application/json' },
  body:
   { client_id: 'YOUR_CLIENT_ID',
     client_secret: '##################################',
     audience: 'https://oauth.how2makesso.work/',
     grant_type: 'client_credentials' },
  json: true };
  
  request(options1, function (error, response, body) {
  if (error) return cb(new Error(body));
  
     access_token = body.access_token;
   console.log(access_token);
 //  user.user_metadata.title = 'role23';
   
  var options2 = { method: 'POST',
  url: 'http://localhost:8081/api/v1.0/registerUser',
  headers: { 'cache-control': 'no-cache' },rejectUnauthorized:false,
  form:
   { access_token: access_token,
     username: username,
     title: 'EndUser',
     status:'Active',
     supervisor: 'philc',
     firstname: user.user_metadata.firstname,
     lastname: user.user_metadata.lastname
   } };

  request(options2, function (error, response, body) {
  if (error) return cb(new Error(body));

//  console.log(body);

var resp = JSON.parse(body);
return cb(null, user, context);

});  

});
 cb();

};
