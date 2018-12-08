window.addEventListener('load', function() {
  var content = document.querySelector('.content');
  var loadingSpinner = document.getElementById('loading');
  content.style.display = 'block';
  loadingSpinner.style.display = 'none';

  var webAuth = new auth0.WebAuth({
    domain: AUTH0_DOMAIN,
    clientID: AUTH0_CLIENT_ID,
    redirectUri: AUTH0_CALLBACK_URL,
    responseType: 'token id_token',
    scope: AUTH00_DEFAULT_SCOPE,
    audience: AUTH0_AUDIENCE,
    leeway: 60,
  });

  var loginStatus = document.querySelector('.home-view');
  var loginView = document.getElementById('login-view');
  var homeView = document.getElementById('home-view');
  var loginBtns =  document.querySelector('.loginBtns');
  var loginBtn = document.getElementById('qsLoginBtn');
  var logoutBtn = document.getElementById('qsLogoutBtn');


 var tokenRenewalTimeout;

 var checkSessionBtn = document.getElementById('btn-renew-token');
 var accessTokenMessage = document.getElementById('access-token-message');
 var tokenExpiryDate = document.getElementById('token-expiry-date');

 console.log(AUTH0_CUST_ATTR_URI);
console.log(AUTH0_CALLBACK_URL);
checkSessionBtn.addEventListener('click', function() {
        console.log("inside cliked renew button");
	renewToken();
  });



  loginBtn.addEventListener('click', function(e) {
    e.preventDefault();
    webAuth.authorize();
  });

  logoutBtn.addEventListener('click', logout);

  function setSession(authResult) {
    // Set the time that the access token will expire at
    var expiresAt = JSON.stringify(
      authResult.expiresIn * 1000 + new Date().getTime()
    );
    sessionStorage.setItem('access_token', authResult.accessToken);
    sessionStorage.setItem('id_token', authResult.idToken);
    sessionStorage.setItem('expires_at', expiresAt);
  }



  function logout() {
    // Remove tokens and expiry time from sessionStorage
    sessionStorage.removeItem('access_token');
    sessionStorage.removeItem('id_token');
    sessionStorage.removeItem('expires_at');
    
   clearTimeout(tokenRenewalTimeout);
    console.log(AUTH0_CALLBACK_URL);
    var cb = encodeURIComponent(AUTH0_CALLBACK_URL);
    console.log(cb);
    window.location.href = 'https://'+AUTH0_DOMAIN+'/v2/logout?returnTo='+AUTH0_LOGOUT_CB+'&client_id='+AUTH0_CLIENT_ID;
    displayButtons();
  }

  function isAuthenticated() {
    var expiresAt = JSON.parse(sessionStorage.getItem('expires_at'));
    return new Date().getTime() < expiresAt;
  }

  function handleAuthentication() {
    webAuth.parseHash(function(err, authResult) {
      if (authResult && authResult.accessToken && authResult.idToken) {
        window.location.hash = '';
        setSession(authResult);
        loginBtn.style.display = 'none';
        homeView.style.display = 'inline-block';
      } else if (err) {
        homeView.style.display = 'inline-block';
        console.log(err);
        alert(
          'Error: ' + err.error + '. Check the console for further details.'
        );
      }
      displayButtons();
    });
  }

  function displayButtons() {
    if (isAuthenticated()) {
      loginBtn.style.display = 'none';
      logoutBtn.style.display = 'inline-block';
      var expiresAt = JSON.parse(sessionStorage.getItem('expires_at'));
       loginBtns.style.display = 'none';
      popupCall();
       checkSessionBtn.style.display = 'inline-block';
      accessTokenMessage.style.display = 'inline-block';
      tokenExpiryDate.innerHTML = JSON.stringify(new Date(expiresAt));
    } else {
      loginBtn.style.display = 'inline-block';
      logoutBtn.style.display = 'none';
      homeView.style.display = 'none';
      loginStatus.style.display = 'none';
      loginBtns.style.display = 'inline-block'; 
       checkSessionBtn.style.display = 'none';
      accessTokenMessage.style.display = 'none';
    }
  }




var modal = document.getElementById('myModal');
var span = document.getElementsByClassName("close")[0];

function  popupCall() {
    modal.style.display = "block";
    var userFocus = document.getElementById('userFocus');
    var idt = sessionStorage.getItem('id_token');
    var userDetails = parseJwt(idt);
    console.log(AUTH0_CUST_ATTR_URI);
    var username = userDetails[AUTH0_CUST_ATTR_URI+"username"];
    var userTitle = userDetails[AUTH0_CUST_ATTR_URI+"title"];
    if (userTitle === "HR Admin"){

userFocus.innerHTML = " <h2>Hi "+username+"!!</h2>  <p><strong>Welcome to the grete Time Off Tool!!</strong></p><p>as "+userTitle+", you can peform below activities in this tool</p>  <ul>    <li>Submit leave requests for yourself</li>    <li>View leave requests for all users in oraganization</li>    <li>Edit/Cancel/Delete requests which are in pending status</li>  </ul>";
        }
    else if (userTitle === "Manager"){

userFocus.innerHTML = " <h2>Hi "+username+"!!</h2>  <p><strong>Welcome to the grete Time Off Tool!!</strong></p><p>as "+userTitle+", you can peform below activities in this tool</p>  <ul>    <li>Submit leave requests for yourself</li>    <li>View leave requests for your direct reports in Organization</li>    <li>Approve or Reject requests which are in pending status</li>  </ul>";
        }
 else if (userTitle === "EndUser"){

userFocus.innerHTML = " <h2>Hi "+username+"!!</h2>  <p><strong>Welcome to the grete Time Off Tool!!</strong></p><p>as "+userTitle+", you can peform below activities in this tool</p>  <ul>    <li>Submit leave requests for yourself</li>    <li>View your leave requests.</li>    <li>Edit or Cancel requests which are in pending status</li>  </ul>";
        }

else {

userFocus.innerHTML = " <h2>Hi "+username+"!!</h2>  <p><strong>Welcome to the grete Time Off Tool!!</strong></p><p>Unfortunately, your title can not be concluded and hence you are not authorized to do anything on this application.</p>";
        }


}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}



function parseJwt (token) {
            var base64Url = token.split('.')[1];
            var base64 = base64Url.replace('-', '+').replace('_', '/');
            var json = JSON.parse(window.atob(base64));
            return json;
        };






function setSession(authResult) {
    // Set the time that the access token will expire at
    var expiresAt = JSON.stringify(
      authResult.expiresIn * 1000 + new Date().getTime()
    );
    sessionStorage.setItem('access_token', authResult.accessToken);
    sessionStorage.setItem('id_token', authResult.idToken);
    sessionStorage.setItem('expires_at', expiresAt);
    scheduleRenewal();
  }





  function renewToken() {
    console.log("inside renewToken method ");
    webAuth.checkSession({},
      function(err, result) {
        if (err) {
          alert(
            'Could not get a new token. ' +
              err.description
          );
        } else {
          setSession(result);
          alert('Successfully renewed auth!');
        }
      }
    );
  }

  function scheduleRenewal() {
    var expiresAt = JSON.parse(sessionStorage.getItem('expires_at'));
    var delay = expiresAt - Date.now();
    if (delay > 0) {
      tokenRenewalTimeout = setTimeout(function() {
        renewToken();
      }, delay);
    }
  }






scheduleRenewal();
handleAuthentication();
});
