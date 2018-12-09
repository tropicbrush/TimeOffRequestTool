function (user, context, callback) {
  if (context.clientID === 'YOUR_CLIENT_ID')
  {
  context.idToken['https://customr_uri/username']=user.nickname;
  context.idToken['https://customr_uri/title']=user.app_metadata.title;
  context.accessToken['https://customr_uri/username']=user.nickname;
  callback(null, user, context);
  }
  else{
  callback(null, user, context);
  }
}
