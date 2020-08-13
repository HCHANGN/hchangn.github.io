function addMemberContent(){
    let outerDiv = document.getElementById("memberMainText");
    let memberPicture = document.createElement("img");
    let memberName = document.createElement("h1");
    let memberEmail = document.createElement("p");
    let memberId = document.createElement("p");
    let memberData = JSON.parse(window.localStorage.memberData);
    outerDiv.appendChild(memberPicture);
    outerDiv.appendChild(memberName);
    outerDiv.appendChild(memberEmail);
    outerDiv.appendChild(memberId);
    memberPicture.src=`https://graph.facebook.com/${memberData.id}/picture?width=500&height=500`;
    memberPicture.id= "memberPic";
    memberName.textContent=memberData.name;
    memberEmail.textContent ="Email: "+ memberData.email;
    memberId.textContent ="Id: "+ memberData.id;
}

function changeMemberPictureSize(){
    let memberData = JSON.parse(window.localStorage.memberData);
    memberData.picture.data.url
}

function addLogoutBtn(){
    let outerDiv = document.getElementById("memberMainText");
    let logoutBtn = document.createElement("button");

    outerDiv.appendChild(logoutBtn);
    logoutBtn.id="logoutBtn";
    logoutBtn.textContent="Logout";
    document.getElementById("logoutBtn").addEventListener("click",()=>{
        FB.getLoginStatus((response)=>{
            if(response.status=="connected"){
                FB.logout(()=>{
                    alert("Logout!");
                    window.localStorage.removeItem('fbKey');
                    window.location="./index.html";
                });
            }
            else{
                FB.login();
            }
        });
        
    })
}

addMemberContent();
addLogoutBtn();