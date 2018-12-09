function (user, context, callback) {
  if (context.clientID === 'YOUR_CLIENT_ID')
  {
  context.idToken['https://how2makesso.work/username']=user.nickname;
  context.idToken['https://how2makesso.work/title']=user.app_metadata.title;
  context.accessToken['https://how2makesso.work/username']=user.nickname;
  callback(null, user, context);
  }
  else{
  callback(null, user, context);
  }
}
