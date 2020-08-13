//search app

const searchIcon = document.getElementById("searchIcon");
const searchInput = document.getElementById("searchInput");

searchIcon.addEventListener("click",()=>{
    window.location.href=`./index.html?search=${searchInput.value}`;
});

searchInput.addEventListener("keydown",(e)=>{
    if(e.keyCode==13&&isLoading==false){
        window.location.href=`./index.html?search=${searchInput.value}`;  
    }
});

//mobile search

const mobileSearchIcon = document.getElementById("mobileSearchIcon");
const mobileSearch = document.getElementById("mobileSearch");

mobileSearchIcon.addEventListener("click",()=>{
    if(mobileSearch.style.display=="block"){
        mobileSearch.style.display="none";
    }
    else{
        mobileSearch.style.display="block";
        mobileSearch.addEventListener("keydown",(e)=>{
            if(e.keyCode==13&&isLoading==false){
                window.location.href=`./index.html?search=${mobileSearch.value}`;  
            }
        });
    }
});
