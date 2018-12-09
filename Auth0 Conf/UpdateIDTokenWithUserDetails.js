function (user, context, callback) {
  if (context.clientID === 'lnRKX3VDp6qZwRbTCsmR1p5oMkzSw5ke')
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
