function setTotal(){
    let total = 0;
    if(localStorage.CartItems){
        let cartItems=JSON.parse(localStorage.CartItems);
        total=cartItems.reduce((acc,cur)=>{
        return acc-=-cur.num;
        },0);
    }
    document.getElementById("mobileCartTotalNum").textContent=total;
    document.getElementById("cartTotalNum").textContent=total;
    window.localStorage.setItem("totalItemNum",total);
}

window.addEventListener("load",()=>{
    setTotal();
})

