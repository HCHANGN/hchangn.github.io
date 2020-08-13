let productId = window.location.search.substring().slice(4);
let isLoading=false;

function ajax(src,callback){
    // your code here
    var xhr = new XMLHttpRequest();
    isLoading=true;
    xhr.onreadystatechange = ()=>{
        if(xhr.readyState===4 && xhr.status ===200){
            let data = JSON.parse(xhr.responseText);
            callback(data);
            isLoading=false;
        }
    }
    xhr.open('get',src);
    xhr.send();
}


function renderProductDetail(data){
    const dataArray=data.data;
    const mainPicture = document.getElementById("mainPicture");
    const productDetailName = document.getElementById("productDetailName");
    const productDetailId= document.getElementById("productDetailId");
    const productDetailPrice= document.getElementById("productDetailPrice");
    const productDetailColor=document.getElementById("productDetailColor");
    const productDetailSize = document.getElementById("productDetailSize");
    const productDetailInt = document.getElementById("productDetailInt");
    const productDetailCountry1 = document.getElementById("productDetailCountry1");
    const productDetailCountry2 = document.getElementById("productDetailCountry2");
    // const firstDetailP = document.getElementById("firstDetailP");
    // const secondDetailP = document.getElementById("secondDetailP");
    const productDetailSection = document.getElementById("productDetailSection");

    mainPicture.src=dataArray.main_image;
    productDetailName.textContent=dataArray.title;
    productDetailId.textContent=dataArray.id;
    productDetailPrice.textContent="TWD."+dataArray.price;
    for(let j=0;j<dataArray.colors.length;j++){
        let colorItem = document.createElement("div");
        productDetailColor.appendChild(colorItem);
        colorItem.style=`background-color: #${dataArray.colors[j].code}`;
        colorItem.className="detailColorItem";
        colorItem.id=dataArray.colors[j].code;
        colorItem.style.cursor="pointer";
    }
    for(let j=0;j<dataArray.sizes.length;j++){
        let sizeItem = document.createElement("div");
        productDetailSize.appendChild(sizeItem);
        sizeItem.textContent=dataArray.sizes[j];
        sizeItem.className="detailSizeItem";
        sizeItem.id=dataArray.sizes[j];
        sizeItem.style.cursor="pointer";
    }

    let texture = document.createElement("div");
    texture.textContent = dataArray.texture;
    let description = document.createElement("div");
    description.innerHTML = dataArray.description.replace(/\r\n/g,"<br>");
    productDetailInt.appendChild(texture);
    productDetailInt.appendChild(description);
    productDetailCountry1.textContent="素材產地/ "+dataArray.place;
    productDetailCountry2.textContent="加工產地/ "+dataArray.place;

    for(let j=0;j<dataArray.images.length;j++){
        let productStory = document.createElement("p");
        let sectionPicture = document.createElement("img");
        productDetailSection.appendChild(productStory);
        productDetailSection.appendChild(sectionPicture);
        productStory.textContent=dataArray.story;
        sectionPicture.src=dataArray.images[j];
    }


    //control panel of product
    const mainControlPanel = document.getElementById("mainControl");

    const productDetailNumInputinput = document.getElementById("numInput");
    const productDetailNumInput = document.getElementById("productDetailNumInput");
    let stockMax=0;
    let totalStock=0;
    let curColor="";
    let curColorName="";
    let curSize="";
    let cartItemStorage = window.localStorage;
    let cartItems=[];
    // cartItemStorage.setItem("total",0);

    productDetailNumInput.style.opacity=0.2;

    mainControlPanel.addEventListener("click",(e)=>{
        if(e.target.className=="detailColorItem"){
            stockMax=0;
            document.getElementById("stockMaxNumber").textContent="-";
            //clear out size box selection
            for(let i=0;i<dataArray.sizes.length;i++){
                document.getElementById(dataArray.sizes[i]).style.backgroundColor="darkgray";
                document.getElementById(dataArray.sizes[i]).style.color="black";
            }
            //toggle outline while select
            for(let i=0;i<dataArray.colors.length;i++){
                if(e.target.id==dataArray.colors[i].code){
                    e.target.style.outline="3px black solid";
                }
                else{
                    document.getElementById(dataArray.colors[i].code).style.outline="darkgray 0.2px solid";
                }
            }
            //change opacity of size when select color
            for(let i=0;i<dataArray.variants.length;i++){
                if(dataArray.variants[i].color_code==e.target.id){
                    if(dataArray.variants[i].stock==0){
                        document.getElementById(dataArray.variants[i].size).style.opacity="0.5";
                    }
                    else{
                        document.getElementById(dataArray.variants[i].size).style.opacity="1";
                    }    
                }
            }
        }
        if(e.target.className=="detailSizeItem"){
            //toggle outline while select
            for(let i=0;i<dataArray.sizes.length;i++){
                if(e.target.id==dataArray.sizes[i]){
                    if(document.getElementById(dataArray.variants[i].size).style.opacity=="0.5"){
                        alert("Out Of Stock");
                    }
                    else{
                        e.target.style.backgroundColor="black";
                        e.target.style.color="white";
                        //search varients for matching data
                        for(let j=0;j<dataArray.colors.length;j++){
                            if(document.getElementById(dataArray.colors[j].code).style.outline=="black solid 3px"){
                                for(let k=0;k<dataArray.variants.length;k++){
                                    if(dataArray.variants[k].size==e.target.id && dataArray.variants[k].color_code==dataArray.colors[j].code){
                                        curSize=dataArray.variants[k].size;
                                        curColor=dataArray.variants[k].color_code;
                                        curColorName=dataArray.colors[0].name;
                                        stockMax=dataArray.variants[k].stock;
                                        totalStock=dataArray.variants[k].stock;
                                        //change the stockMax value while local storage have same item
                                        if(cartItemStorage.CartItems){
                                            let inCartItem = JSON.parse(cartItemStorage.CartItems);
                                            inCartItem.filter(item=>{
                                                if(item.id==dataArray.id&&item.size==curSize&&item.color==curColor){
                                                    stockMax=dataArray.variants[k].stock-item.num;
                                                }
                                            })
                                        }
                                        

                                        // for(var key of Object.keys(localStorage)){
                                        //     let localStorageData = JSON.parse(localStorage[key]);
                                        //     if(curSize==localStorageData["size"]&&curColor==localStorageData["color"]&&dataArray.id==localStorageData.id){
                                        //         stockMax=dataArray.variants[k].stock-localStorageData.num;
                                                
                                        //         document.getElementById("stockMaxNumber").textContent=stockMax;
                                        //     }
                                        // }
                                        console.log(`Product id:${dataArray.id} color:${curColor} size:${curSize}`);
                                    }
                                }
                            }
                        }
                    }    
                }
                else{
                        document.getElementById(dataArray.sizes[i]).style.backgroundColor="darkgray";
                        document.getElementById(dataArray.sizes[i]).style.color="black";
                }
            }
        }
        // inStock number control
        if(stockMax!=0){
            document.getElementById("stockMaxNumber").textContent=stockMax;
            productDetailNumInput.style.opacity=1;
            if(productDetailNumInputinput.value>stockMax){
                productDetailNumInputinput.value=0;
            }
            
            if(e.target.id=="increaseBtn"){
                if(productDetailNumInputinput.value>=stockMax){
                    alert("Max number in stock!");
                }
                else{
                    productDetailNumInputinput.value-=-1;
                }
            }
            if(e.target.id=="decreaseBtn"){
                if(productDetailNumInputinput.value<=0){
                    productDetailNumInputinput.value=0;
                }
                else{
                    productDetailNumInputinput.value-=1;
                }
            }
        }
        else{
            productDetailNumInput.style.opacity=0.2;
            productDetailNumInputinput.value=0;
        }

        //add item to cart

        if(e.target.id=="addToCartBtn"){
            //handle input=0
            if(productDetailNumInputinput.value==0){
                alert("Please select at less one item");
            }
            //handle input>0
            else{
                //handle input to local storage while same id is in local storage
                let statementChecker=false;
                if(cartItemStorage.CartItems){
                    if(JSON.parse(cartItemStorage.CartItems).filter(item=>item.id==dataArray.id&&item.size==curSize&&item.color==curColor)[0])
                    {
                        statementChecker=true;
                    }
                    else{
                        statementChecker=false;
                    }
                }
                else{
                    statementChecker=false;
                }
                
                if(statementChecker){
                    let insideCart=JSON.parse(cartItemStorage.CartItems);
                    
                    if(parseInt(productDetailNumInputinput.value)>parseInt(document.getElementById("stockMaxNumber").textContent)){
                        alert("Out of stock!");
                    }
                    else{
                        insideCart.filter(item=>{
                            if(item.id==dataArray.id&&item.color==curColor&&item.size==curSize){
                                item.num-=-productDetailNumInputinput.value;
                            }
                        })
                        //cartItem.num-=-productDetailNumInputinput.value;
                        stockMax-=productDetailNumInputinput.value;
                        cartItemStorage.setItem("CartItems",JSON.stringify(insideCart));
                        document.getElementById("numInput").value=0;
                        document.getElementById("stockMaxNumber").textContent=stockMax;
                    }
                }
                //handle input to local storage while id is not in local storage
                else{
                    //find current color name
                    for(let z=0;z<dataArray.colors.length;z++){
                        if(dataArray.colors[z].code==curColor){
                            curColorName=dataArray.colors[z].name;
                        }
                    }
                    let cartItem={
                        title:dataArray.title,
                        id:dataArray.id,
                        price:dataArray.price,
                        color:curColor,
                        colorName:curColorName,
                        size:curSize,
                        num:parseInt(productDetailNumInputinput.value),
                        imgSrc:dataArray.main_image,
                        stock:totalStock
                    };
                    if(cartItemStorage.CartItems){
                        cartItems = JSON.parse(cartItemStorage.CartItems);
                    }
                    cartItems.push(cartItem);
                    cartItemStorage.setItem("CartItems", JSON.stringify(cartItems));
                    document.getElementById("numInput").value=0;
                    stockMax-=parseInt(cartItem.num);
                    document.getElementById("stockMaxNumber").textContent=stockMax;
                }
            }
            setTotal();
        }
    });

    
}



if(productId){
    ajax(`https://api.appworks-school.tw/api/1.0/products/details?id=${productId}`,renderProductDetail);
}
else{
    console.log("product not found!");
}


