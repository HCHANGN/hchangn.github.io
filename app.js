let url = "";
let next = 0;
let isLoading=false;

function ajax(src,callback){
    // your code here
    var xhr = new XMLHttpRequest();
    isLoading=true;
    xhr.onreadystatechange = ()=>{
        if(xhr.readyState===4 && xhr.status ===200){
            let data = JSON.parse(xhr.responseText);
            next = data.next_paging;
            if(src.indexOf("?")!=-1){
                url=src.slice(0,src.indexOf("?"));
            }
            else{
                url = src;
            }
            // console.log(src+"  "+next);
            callback(data);
            isLoading=false;
        }
    }   
    xhr.open('get',src);
    xhr.send();
}

function renderProductAll(data){
    const productArray = data.data;
    let container= document.getElementById("mainContent");
    for(i=0;i<productArray.length;i++){
        let outerDiv= document.createElement("div");
        let imgDiv = document.createElement("div");
        let productImg = document.createElement("img");
        let colorBox = document.createElement("div");
        let productName= document.createElement("p");
        let price = document.createElement("p");

        container.appendChild(outerDiv);
        outerDiv.appendChild(imgDiv);
        outerDiv.appendChild(colorBox);
        outerDiv.appendChild(productName);
        outerDiv.appendChild(price);
        imgDiv.appendChild(productImg);
        for(j=0;j<productArray[i].colors.length;j++){
            let colorItem = document.createElement("div");
            colorBox.appendChild(colorItem);
            colorItem.style=`background-color: #${productArray[i].colors[j].code}`;
            colorItem.className="colorItem";
        }
        
        productImg.src= productArray[i].main_image;
        productImg.id=productArray[i].id;
        productImg.style.cursor="pointer";
        
        outerDiv.className="card";
        colorBox.className="colorBox";
        price.className="price";

        productName.textContent=productArray[i].title;
        price.textContent="NT " + productArray[i].price;
    }
    
}

const womenButton = document.getElementById("womenButton");
const menButton = document.getElementById("menButton");
const assButton = document.getElementById("assButton");
const womenButton2 = document.getElementById("womenButton2");
const menButton2 = document.getElementById("menButton2");
const assButton2 = document.getElementById("assButton2");

womenButton.addEventListener("click",()=>{
    let container= document.getElementById("mainContent");
    container.innerHTML="";
    ajax('https://api.appworks-school.tw/api/1.0/products/women',renderProductAll);
});

menButton.addEventListener("click",()=>{
    let container= document.getElementById("mainContent");
    container.innerHTML="";
    ajax('https://api.appworks-school.tw/api/1.0/products/men',renderProductAll);
});

assButton.addEventListener("click",()=>{
    let container= document.getElementById("mainContent");
    container.innerHTML="";
    ajax('https://api.appworks-school.tw/api/1.0/products/accessories',renderProductAll);
});


womenButton2.addEventListener("click",()=>{
    let container= document.getElementById("mainContent");
    container.innerHTML="";
    ajax('https://api.appworks-school.tw/api/1.0/products/women',renderProductAll);
});

menButton2.addEventListener("click",()=>{
    let container= document.getElementById("mainContent");
    container.innerHTML="";
    ajax('https://api.appworks-school.tw/api/1.0/products/men',renderProductAll);
});

assButton2.addEventListener("click",()=>{
    let container= document.getElementById("mainContent");
    container.innerHTML="";
    ajax('https://api.appworks-school.tw/api/1.0/products/accessories',renderProductAll);
});

//home page

const home = document.getElementsByClassName("btn_logo01");

home[0].addEventListener("click",()=>{
    let container= document.getElementById("mainContent");
    container.innerHTML="";
    ajax('https://api.appworks-school.tw/api/1.0/products/all',renderProductAll);
});

//search app

const searchIcon = document.getElementById("searchIcon");
const searchInput = document.getElementById("searchInput");

searchIcon.addEventListener("click",()=>{
    let container= document.getElementById("mainContent");
    container.innerHTML="";
    ajax(`https://api.appworks-school.tw/api/1.0/products/search?keyword=${searchInput.value}`,renderProductAll);    
});

searchInput.addEventListener("keydown",(e)=>{
    if(e.keyCode==13&&isLoading==false){
        let container= document.getElementById("mainContent");
        container.innerHTML="";
        ajax(`https://api.appworks-school.tw/api/1.0/products/search?keyword=${searchInput.value}`,renderProductAll);    
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
                let container= document.getElementById("mainContent");
                container.innerHTML="";
                ajax(`https://api.appworks-school.tw/api/1.0/products/search?keyword=${mobileSearch.value}`,renderProductAll);    
            }
        });
    }
});

//infinity scroll

window.addEventListener("scroll",()=>{
    if(window.innerHeight+window.scrollY >= document.body.scrollHeight -1){
        if(next&&isLoading==false){
            ajax(url+`?paging=${next}`,renderProductAll);
        }
    }
})

//canvas
const canvas = document.getElementById("canvas");
const positionBox = document.getElementById("positionBox");
const ctx= canvas.getContext('2d');
canvas.width=window.innerWidth;
canvas.height=window.innerWidth/2.5;
let image = [];
let campaignsText=[];
let textArray=[];
let imgX=0;
let counter=0;
let isPause=false;

window.onresize = ()=>{
    canvas.width=window.innerWidth;
    canvas.height=window.innerWidth/2.5;
    ctx.font = "1rem Arial";
    ctx.drawImage(image[counter],imgX,0,canvas.width,canvas.height);
    for(let j=0;j<textArray[counter].length;j++){
        ctx.fillText(textArray[counter][j],canvas.width/8+imgX,canvas.height/3+j*30);
    }
}

function campaignsImage(data){
    let loadCounter=0;
    for(let i=0;i<data.data.length;i++){
        image.push(new Image());
        image[i].src=data.data[i].picture;
        campaignsText[i]=data.data[i].story;
        //check if image had loaded
        image[i].addEventListener("load",()=>{
            loadCounter+=1;
            if(loadCounter==3){
                update();
            };
        });
    }
    for(let i =0;i<campaignsText.length;i++){
        textArray.push(campaignsText[i].split("\r\n"));
    }

    for(let i =0;i<image.length;i++){
        let positionBoxItem = document.createElement("div");
        positionBox.appendChild(positionBoxItem);
        positionBoxItem.className="positionBoxItem";
        positionBoxItem.id=`positionBox${i}`;
    }
    //window.setTimeout(()=>{update();},1000);
    //update();
    // image.addEventListener("load",()=>{update();});
}

function drawSlidingImage(){
    ctx.drawImage(image[counter],imgX-canvas.width,0,canvas.width,canvas.height);
}
function clear(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
}

function update(){
    if(!isPause){
        clear();
        imgX+=canvas.width/30;
        ctx.font = "1rem Arial";
        ctx.drawImage(image[counter],imgX,0,canvas.width,canvas.height);
        for(let j=0;j<textArray[counter].length;j++){
            ctx.fillText(textArray[counter][j],canvas.width/8+imgX,canvas.height/3+j*30);
        }
        if(counter!=image.length-1){    
            ctx.drawImage(image[counter+1],imgX-canvas.width,0,canvas.width,canvas.height);
            for(let j=0;j<textArray[counter+1].length;j++){
                ctx.fillText(textArray[counter+1][j],canvas.width/8+imgX-canvas.width,canvas.height/3+j*30);
            }
        }
        else{
            ctx.drawImage(image[0],imgX-canvas.width,0,canvas.width,canvas.height);
            for(let j=0;j<textArray[0].length;j++){
                ctx.fillText(textArray[0][j],canvas.width/8+imgX-canvas.width,canvas.height/3+j*30);
            }
        }
        if(imgX>=canvas.width){ 
            if(counter!=image.length-1){
                counter+=1;
            }
            else{
                counter=0;
            }
            imgX=0;
            isPause=true;
        }
        requestAnimationFrame(update);
    }
    
    else if(imgX==0){   
        for(let i=0;i<image.length;i++){
            if(i==counter){
                let currentBox=document.getElementById(`positionBox${i}`);
                currentBox.style.backgroundColor="wheat";
            }
            else{
                let currentBox=document.getElementById(`positionBox${i}`);
                currentBox.style.backgroundColor="#313538";
            }    
        }
        timeOut();
    }
}

positionBox.addEventListener("click",(e)=>{
    for(let i=0;i<image.length;i++){
        if(e.target.id=="positionBox"+i){
            counter=i;
            imgX=0;
            ctx.drawImage(image[counter],0,0,canvas.width,canvas.height);
            for(let j=0;j<textArray[counter].length;j++){
                ctx.fillText(textArray[counter][j],canvas.width/8+imgX,canvas.height/3+j*30);
            }
            e.target.style.backgroundColor="wheat";
        }
        //e.target.style.backgroundColor="wheat";
        let otherBox=document.getElementById(`positionBox${i}`);
        if(otherBox.id!=e.target.id&&e.target.id!="positionBox"){
            otherBox.style.backgroundColor="#313538";
        }
    }
})

const timeOut=() => {setTimeout(()=>{
            isPause=false;
            requestAnimationFrame(update);    
        },3000);}


//product detail
const productList = document.getElementById("mainContent");
productList.addEventListener("click",(e)=>{
    if(e.target.id!=mainContent){
        ajax(`https://api.appworks-school.tw/api/1.0/products/details?id=${e.target.id}`,renderProductDetail);
    }  
});

function renderProductDetail(data){
    window.location.href=`./product.html?id=${data.data.id}`;
}


//Load data form ajax for campaigns

ajax("https://api.appworks-school.tw/api/1.0/marketing/campaigns",campaignsImage);

//Load data form ajax for render pages
if(window.location.search.substring().slice(4)=="men"){
    ajax('https://api.appworks-school.tw/api/1.0/products/men',renderProductAll);
}
else if(window.location.search.substring().slice(4)=="woman"){
    ajax('https://api.appworks-school.tw/api/1.0/products/women',renderProductAll);
}
else if(window.location.search.substring().slice(4)=="ass"){
    // window.history.replaceState(null, null, window.location.pathname);
    ajax('https://api.appworks-school.tw/api/1.0/products/accessories',renderProductAll);
}
else if(window.location.search.substring().slice(0,7)=="?search"){
    ajax(`https://api.appworks-school.tw/api/1.0/products/search?keyword=${window.location.search.substring().slice(8)}`,renderProductAll);
}
else{
    ajax('https://api.appworks-school.tw/api/1.0/products/all',renderProductAll);
}









