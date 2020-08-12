window.fbAsyncInit = function() {
    FB.init({
      appId      : '557910525152277',
      cookie     : true,
      xfbml      : true,
      version    : 'v7.0'
    });
      
    FB.AppEvents.logPageView();   
      
  };

  (function(d, s, id){
     var js, fjs = d.getElementsByTagName(s)[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement(s); js.id = id;
     js.src = "https://connect.facebook.net/en_US/sdk.js";
     fjs.parentNode.insertBefore(js, fjs);
   }(document, 'script', 'facebook-jssdk'));


function clickOnMemberImg(memberClickTarget){
    memberClickTarget.addEventListener("click",()=>{
        FB.getLoginStatus(function(response) {
          if(response.status=="connected"){
            console.log(response);
            FB.api(
                '/me',
                'GET',
                {"fields":"id,name,email,picture"},
                function(response) {
                    //console.log(response);
                    window.localStorage.setItem("memberData",JSON.stringify(response));
                    window.location="./memberPage.html";
                }
            );

          }
          else{

            FB.login(function(response) {
                if (response.status === 'connected') {
                  // Logged into your webpage and Facebook.
                  let sendData = {
                    provider:"facebook",
                    access_token: response.authResponse.accessToken
                  }
                  window.localStorage.setItem("fbKey",response.authResponse.accessToken);
                  alert("Login successful");
                  let xhr = new XMLHttpRequest();
                  xhr.onreadystatechange =()=>{
                    if(xhr.status==200&&xhr.readyState==4){
                      console.log("xhr complete, responseText:");
                      console.log(xhr.responseText);
                    }
                  }
                  xhr.open("POST","https://api.appworks-school.tw/api/1.0/user/signin",true);
                  xhr.setRequestHeader("Content-Type","application/json");
                  xhr.send(JSON.stringify(sendData));
                  console.log("ok");
                } 

                else {
                  // The person is not logged into your webpage or we are unable to tell. 
                  console.log("no");
                }
            },
            {
                scope:'public_profile,email',
                return_scope:true
            });
          }
        });    
    })   
}

clickOnMemberImg(document.getElementById("memberImg"));
clickOnMemberImg(document.getElementById("mobileMember"));
   