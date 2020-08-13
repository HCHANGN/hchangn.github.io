TPDirect.setupSDK(12348, 'app_pa1pQcKoY22IlnSXq5m5WP5jFKzoRG58VEXpT7wU62ud7mMbDOGzCYIlzzLF', 'sandbox');
//TPDirect.card.setup(config);
let primeKey;
let deliveryTime="";
let list=[];


TPDirect.card.setup({
    // Display ccv field
    fields: {
        number: {
            // css selector
            element: '#card-number',
            placeholder: '**** **** **** ****'
        },
        expirationDate: {
            // DOM object
            element: document.getElementById('card-expiration-date'),
            placeholder: 'MM / YY'
        },
        ccv: {
            element: '#card-ccv',
            placeholder: 'ccv'
        }
    },
    styles: {
        // Style all elements
        'input': {
            'color': 'gray'
        },
        // Styling ccv field
        'input.ccv': {
            // 'font-size': '16px'
        },
        // Styling expiration-date field
        'input.expiration-date': {
            // 'font-size': '16px'
        },
        // Styling card-number field
        'input.card-number': {
            // 'font-size': '16px'
        },
        // style focus state
        ':focus': {
            // 'color': 'black'
        },
        // style valid state
        '.valid': {
            'color': 'green'
        },
        // style invalid state
        '.invalid': {
            'color': 'red'
        },
        // Media queries
        // Note that these apply to the iframe, not the root window.
        '@media screen and (max-width: 400px)': {
            'input': {
                'color': 'orange'
            }
        }
    }
})

TPDirect.card.onUpdate(function (update) {
    // update.canGetPrime === true
    // --> you can call TPDirect.card.getPrime()
    if (update.canGetPrime) {
        // Enable submit Button to get prime.
        // submitButton.removeAttribute('disabled')
    } else {
        // Disable submit Button to get prime.
        // submitButton.setAttribute('disabled', true)
    }

    // cardTypes = ['mastercard', 'visa', 'jcb', 'amex', 'unionpay','unknown']
    if (update.cardType === 'visa') {
        // Handle card type visa.
    }

    // number 欄位是錯誤的
    if (update.status.number === 2) {
        // setNumberFormGroupToError()
    } else if (update.status.number === 0) {
        // setNumberFormGroupToSuccess()
    } else {
        // setNumberFormGroupToNormal()
    }

    if (update.status.expiry === 2) {
        // setNumberFormGroupToError()
    } else if (update.status.expiry === 0) {
        // setNumberFormGroupToSuccess()
    } else {
        // setNumberFormGroupToNormal()
    }

    if (update.status.ccv === 2) {
        // setNumberFormGroupToError()
    } else if (update.status.ccv === 0) {
        // setNumberFormGroupToSuccess()
    } else {
        // setNumberFormGroupToNormal()
    }
})

TPDirect.card.getTappayFieldsStatus();

function onSubmit(event) {
    event.preventDefault()

    // 取得 TapPay Fields 的 status
    const tappayStatus = TPDirect.card.getTappayFieldsStatus()

    // 確認是否可以 getPrime
    if (tappayStatus.canGetPrime === false) {
        alert('can not get prime')
        return
    }

    // Get prime
    TPDirect.card.getPrime((result) => {
        if (result.status !== 0) {
            console.log('get prime error ' + result.msg)
            return
        }
        console.log('get prime 成功，prime: ' + result.card.prime);
        primeKey=result.card.prime;
        makeLocalStorageList();
        setDataForCheckOut();
        sendPostRequestToServer();  
        // send prime to your server, to pay with Pay by Prime API .
        // Pay By Prime Docs: https://docs.tappaysdk.com/tutorial/zh/back.html#pay-by-prime-api
    })
}

function checkDeliveryTime(){
    if(document.getElementById("deliveryTimeMorning").checked==true){
        deliveryTime="morning";
    }
    else if(document.getElementById("deliveryTimeAfernoon").checked==true){
        deliveryTime="afternoon";
    }
    else if(document.getElementById("deliveryTimeNone").checked==true){
        deliveryTime="anytime";
    }
}

function setGetPrimeButton(){
    document.getElementById("finialCheckButton").addEventListener("click",e=>{
        if(Number(window.localStorage.totalItemNum)==0){
            alert("Please at least add one item to cart!")
        }
        else if(document.getElementById("orderPersonInfoNameValue").value==""){
            alert("Please fill in your name!");
        }
        else if(document.getElementById("orderPersonInfoPhoneValue").value==""){
            alert("Please fill in your phone!");
        }
        else if(document.getElementById("orderPersonInfoAddressValue").value==""){
            alert("Please fill in your address!");
        }
        else{
            onSubmit(e);
            console.log("get Prime Sent!");  
        }        
    });
}

function makeLocalStorageList(){
    return JSON.parse(window.localStorage.CartItems).forEach(item=>{
        list.push({
            id:item.id,
            name:item.title,
            price:item.price,
            color:{
                name:item.colorName,
                code:item.color
            },
            size:item.size,
            qty:item.num
        })
    })
}

function setDataForCheckOut(){
    checkDeliveryTime();
    let data={
            "prime": primeKey,
            "order": {
              "shipping": "delivery",
              "payment": "credit_card",
              "subtotal": window.localStorage.totalP,
              "freight": 30,
              "total": window.localStorage.totalP-(-30),
              "recipient": {
                "name": document.getElementById("orderPersonInfoNameValue").value,
                "phone": document.getElementById("orderPersonInfoPhoneValue").value,
                "email": "lobochang4@gmail.com",
                "address": document.getElementById("orderPersonInfoAddressValue").value,
                "time": deliveryTime
                }
            ,"list": list
            }
    }
    return data;
}

function sendPostRequestToServer(){
    var xhr = new XMLHttpRequest();
    isLoading=true;
    xhr.onreadystatechange = ()=>{
        if(xhr.readyState===4 && xhr.status ===200){
            console.log(xhr.responseText);
            window.localStorage.setItem("PurchaseId",xhr.responseText);
            isLoading=false;
            window.location="./thankyou.html";
        }
    }   
    xhr.open('POST',"https://api.appworks-school.tw/api/1.0/order/checkout",true);
    xhr.setRequestHeader("Content-Type","application/json");
    if(window.localStorage.fbKey){
        xhr.setRequestHeader("Authorization","Bearer "+window.localStorage.fbKey);
    }
    xhr.send(JSON.stringify(setDataForCheckOut()));
}


setGetPrimeButton();

