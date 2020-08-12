function redirectCountDown(){
    window.addEventListener("load",()=>{
        let i = 20;
        window.setInterval(()=>{
            document.getElementById("ThankyouCountDown").textContent=i;
            i--;
            if(i==-1){
                window.location="./index.html";
                console.log(i);
                clearInterval();
            }
        },1000);
    })
}

function setTotalItemOfThankyouPage(){
    document.getElementById("ThankyouItemNum").textContent="("+window.localStorage.totalItemNum+")";
}

function clearOutCartItems(){
    window.localStorage.clear();
}

function setPurchaseId(){
    document.getElementById("ThankyouPurchaseId").textContent=JSON.parse(window.localStorage.PurchaseId).data.number;
}

function drawFunnyImg(){
}

setTotalItemOfThankyouPage();
setPurchaseId();
clearOutCartItems();
redirectCountDown();