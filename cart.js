function renderCartResultItems(){
    const cartShoppingList = document.getElementById("cartShoppingList");
    const localStorage = JSON.parse(window.localStorage.CartItems);
    let totalP = 0;
    let totalInCartNum = 0;
    cartShoppingList.innerHTML="";
    localStorage.forEach(e => {
        let cartShoppingListAppendItem = document.createElement("div");
        let cartShoppingListLeft = document.createElement("div");
        let cartShoppingListImg = document.createElement("img");
        let mainCartItem = document.createElement("div");
        let mainCartItemProductName = document.createElement("div");
        let mainCartItemProductId = document.createElement("div");
        let cartShoppingListProductInfo = document.createElement("div");
        let cartShoppingListColor = document.createElement("div");
        let cartShoppingListColorValue = document.createElement("div");
        let cartShoppingListSize = document.createElement("div");
        let cartShoppingListSizeValue = document.createElement("div");
        let cartItemNumber = document.createElement("div");
        let cartItemNumberValue = document.createElement("select");
        let cartItemSinglePrice = document.createElement("div");
        let cartItemTotalPrice = document.createElement("div");
        let cartItemDelete = document.createElement("div");
        let cartItemDeleteIcon = document.createElement("img");
        let CartItemCarNumMobile = document.createElement("div");
        let CartItemCarSiglePriceMobile = document.createElement("div");
        let CartItemCarTotalPriceMobile = document.createElement("div");
        let CartItemCarSiglePriceMobileDiv = document.createElement("div");
        let CartItemCarTotalPriceMobileDiv = document.createElement("div");


        cartShoppingList.appendChild(cartShoppingListAppendItem);
        cartShoppingListAppendItem.className="cartShoppingListAppendItem";
        cartShoppingListAppendItem.appendChild(cartShoppingListLeft);
        cartShoppingListLeft.className="cartShoppingListLeft";
        cartShoppingListLeft.appendChild(cartShoppingListImg);
        cartShoppingListImg.className="cartShoppingListImg";
        cartShoppingListImg.src=e.imgSrc;
        cartShoppingListLeft.appendChild(mainCartItem);
        mainCartItem.className="mainCartItem";
        mainCartItem.appendChild(mainCartItemProductName);
        mainCartItemProductName.textContent=e.title;
        mainCartItemProductName.className="mainCartItemProductName";
        mainCartItem.appendChild(mainCartItemProductId);
        mainCartItemProductId.textContent=e.id;
        mainCartItemProductId.className="mainCartItemProductId";
        mainCartItem.appendChild(cartShoppingListProductInfo);
        cartShoppingListProductInfo.className="cartShoppingListProductInfo";
        cartShoppingListProductInfo.appendChild(cartShoppingListColor);
        cartShoppingListColor.className="cartShoppingListColor";
        cartShoppingListColor.textContent="顏色 | \xa0\xa0";
        cartShoppingListColor.appendChild(cartShoppingListColorValue)
        cartShoppingListColorValue.className="cartShoppingListColorValue";
        cartShoppingListColorValue.textContent=e.colorName;
        cartShoppingListProductInfo.appendChild(cartShoppingListSize);
        cartShoppingListSize.className="cartShoppingListSize";
        cartShoppingListSize.textContent="尺寸 | \xa0\xa0";
        cartShoppingListSize.appendChild(cartShoppingListSizeValue);
        cartShoppingListSizeValue.className="cartShoppingListSizeValue";
        cartShoppingListSizeValue.textContent=e.size;
        cartShoppingListAppendItem.appendChild(cartItemNumber);
        cartItemNumber.className="cartItemNumber";
        cartItemNumber.appendChild(CartItemCarNumMobile);
        CartItemCarNumMobile.textContent="數量";
        CartItemCarNumMobile.className="CartItemCarNumMobile";
        cartItemNumber.appendChild(cartItemNumberValue);
        cartItemNumberValue.className="cartItemNumberValue";
        cartItemNumberValue.id=`${e.id}_${e.size}_${e.color}`;
        for(let i=1;i<=e.stock;i++){
            let numOption = document.createElement("option");
            cartItemNumberValue.appendChild(numOption);
            numOption.value=i;
            numOption.textContent=i;
        }
        cartItemNumberValue.value=e.num;
        cartShoppingListAppendItem.appendChild(cartItemSinglePrice);
        cartItemSinglePrice.appendChild(CartItemCarSiglePriceMobile);
        cartItemSinglePrice.appendChild(CartItemCarSiglePriceMobileDiv);
        CartItemCarSiglePriceMobile.textContent="單價";
        CartItemCarSiglePriceMobile.className="CartItemCarSiglePriceMobile";
        cartItemSinglePrice.className="cartItemSinglePrice";
        CartItemCarSiglePriceMobileDiv.textContent="NT. "+e.price;
        // cartItemSinglePrice.textContent="NT. "+e.price;
        cartShoppingListAppendItem.appendChild(cartItemTotalPrice);
        cartItemTotalPrice.appendChild(CartItemCarTotalPriceMobile);
        cartItemTotalPrice.appendChild(CartItemCarTotalPriceMobileDiv);
        CartItemCarTotalPriceMobile.textContent="小計";
        CartItemCarTotalPriceMobile.className="CartItemCarTotalPriceMobile";
        cartItemTotalPrice.className="cartItemTotalPrice";
        CartItemCarTotalPriceMobileDiv.textContent=`NT. ${e.price*e.num}`;
        // cartItemTotalPrice.textContent=`NT. ${e.price*e.num}`;
        cartShoppingListAppendItem.appendChild(cartItemDelete);
        cartItemDelete.className="cartItemDelete";
        cartItemDelete.appendChild(cartItemDeleteIcon);
        cartItemDeleteIcon.className="cartItemDeleteIcon";
        cartItemDeleteIcon.src="img/cart-remove.png";
        cartItemDeleteIcon.id=`${e.id}-${e.size}-${e.color}`;
        totalP+=e.num*e.price;
        totalInCartNum+=e.num;
    });
    document.getElementById("finialResultItemsPriceValue").textContent=`NT. ${totalP}`;
    window.localStorage.setItem("totalP",totalP);
    document.getElementById("finialResultPriceValue").textContent=`NT. ${totalP+30}`;
    document.getElementById("numInItemCar").textContent=`( ${totalInCartNum} )`;
    addEventListenerToNumSelect();
    deleteItemInCart();
}

function addEventListenerToNumSelect(){
    let selectItem = document.getElementsByClassName("cartItemNumberValue");
    if(window.localStorage.CartItems){
        const localStorage = JSON.parse(window.localStorage.CartItems);

        for(let i=0;i<selectItem.length;i++){
            let selectItemArray = selectItem[i].id.split("_");
            selectItem[i].addEventListener("change",e=>{
                localStorage.forEach(item=>{
                    if(item.id==selectItemArray[0]&&item.size==selectItemArray[1]&&item.color==selectItemArray[2]){
                        item.num=parseInt(e.target.value);
                        window.localStorage.setItem("CartItems",JSON.stringify(localStorage));
                        renderCartResultItems();
                        setTotal();
                    }
                })
            })
        }
    }
}

function deleteItemInCart(){
    const cartItemDeleteIcon = document.getElementsByClassName("cartItemDeleteIcon");
    let localStorage = JSON.parse(window.localStorage.CartItems);
    for(let i=0;i<cartItemDeleteIcon.length;i++){
        let cartItemDeleteIconArray=cartItemDeleteIcon[i].id.split("-");

        cartItemDeleteIcon[i].addEventListener("click",()=>{
            for(let i=0;i<localStorage.length;i++){
                if(localStorage[i].id==parseInt(cartItemDeleteIconArray[0])
                &&localStorage[i].size==cartItemDeleteIconArray[1]
                &&localStorage[i].color==cartItemDeleteIconArray[2]){
                    localStorage.splice(i,1);
                    window.localStorage.setItem("CartItems",JSON.stringify(localStorage));
                }
            }
            renderCartResultItems();
            setTotal();
        });
    }
}

if(window.localStorage.CartItems){
    renderCartResultItems();
    addEventListenerToNumSelect();
    deleteItemInCart();
}
else{
    cartShoppingList.innerHTML="";
}






