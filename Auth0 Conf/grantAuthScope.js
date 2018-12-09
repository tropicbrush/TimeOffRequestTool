function (user, context, callback) {
  // TODO: implement your rule
if (context.clientID === 'client_id')
  {
  
  if (user.app_metadata.title === 'EndUser') {
    
   context.accessToken.scope = ['TimeOffTool.me.read', 'TimeOffTool.me.write'];
  }
  else if (user.app_metadata.title === 'Manager')
  {
   context.accessToken.scope = ['TimeOffTool.me.read', 'TimeOffTool.me.write','TimeOffTool.DR.read', 'TimeOffTool.DR.approve'];
  //  currentScope.concat(['TimeOfTool.DR.read', 'TimeOfTool.DR.Approve']);
  }
  else if (user.app_metadata.title === 'HR Admin')
  {
      context.accessToken.scope = ['TimeOffTool.me.read', 'TimeOffTool.me.write','TimeOffTool.HR.admin'];

  // currentScope.concat(['TimeOffTool.HR.admin']);
  }
  else
  {
  return callback(new Error("Access Denied : User Title not available or invalid title."));
  
  }

  callback(null, user, context);
  }
  else 
  {
  callback(null, user, context);
  }
}
