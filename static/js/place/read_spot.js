
const url = new URL(window.location.href);
const urlParmas = url.searchParams;
const querySearch = urlParmas.get('search')
var queryString='';
if(querySearch !=null){
  queryString =`?search=${querySearch}`
}
const menuUl = document.querySelector('.typeMenu')
menuUl.insertAdjacentHTML("beforeend", `
<li class="typeMenuil"><a class="menu14" href="/place/inform/14${queryString}" class="14" value='14' >문화시설</a></li>
<li class="typeMenuil"><a class="menu12" href="/place/inform/12${queryString}" >관광지</a></li>
<li class="typeMenuil"><a class="menu39" href="/place/inform/39${queryString}" >식당</a></li>
<li class="typeMenuil"><a class="menu28" href="/place/inform/28${queryString}" >레포츠</a></li>
<li class="typeMenuil"><a class="menu38"  href="/place/inform/38${queryString}" >쇼핑</a></li>

`)

const div = document.querySelector("#card");
const menu14 = document.querySelector(".menu14");
const menu12 = document.querySelector(".menu12");
const menu28 = document.querySelector(".menu28");
const menu38 = document.querySelector(".menu38");
const menu39 = document.querySelector(".menu39");
const handiType = document.querySelector(".handiType");
const changeTypeUl = document.querySelector(".typeMenuUl")
const changeTypeDiv= document.querySelector(".changeType");
const changeBt = document.querySelector(".changeBt")
const choiceArea= document.querySelector(".area");
const key = "https://apis.data.go.kr/B551011/KorWithService1/detailWithTour1?numOfRows=1000&pageNo=1&MobileOS=ETC&MobileApp=APP&contentId=2562239&_type=json&serviceKey=TUMOhRKkJOHxh3bBw093oFlLM7YLA4Bo%2BfiXMnMWNU7uIMCjmG%2FAWH81KDyafJNQROiq97v%2BPEp7IwjKfmxDOw%3D%3D"
//async 
var num = 0;
var infantsfamily = { "stroller": "유모차", "lactationroom": "수유실", "babysparechair": "유아용 보조 의자", "infantsfamilyetc": "영유아가족 기타 지원 항목" };
var handicap = { "parkig": "주차 여부", "route": "대중교통", "publictransport": "접근로", "ticketoffice": "매표소", "promotion": "홍보물", "wheelchair": "휠체어", "exit": "출입통로", "elevator": "엘리베이터", "restroom": "화장실", "auditorium": "관람석", "room": "객실", "handicapetc": "기타 지원 항목" };
var blindhandicap = { "braileblock": "점자블록", "helpdog": "보조견 동반", "guidehuman": "안내요원", "audioguide": "오디오 가이드", "bigprint": "큰활자 홍보물", "brailepromotion": "점자 홍보물 및 점자 표지판", "guidesystem": "유도안내설비", "blindhandicapetc": "기타 지원 항목" };
var hearinghandicap = { "signguide": "수화안내", "videoguide": "자막 비디오 가이드 및 영상 자막 안내", "hearinghandicapetc": "기타 지원 항목", "hearingroom": "객실" };
var handiTypeList = {"undefined":"","handicap":"지체장애🧑‍🦽","blindhandicap":"시각장애👀","infantsfamily":"영유아동반🧑🏻‍👩🏻‍👧🏻","hearinghandicap":"청각장애👂"}
//page++;
//var url
let auth =  $.ajax({url:"/place/authCheck", type:"get", data:{}, dataType: "text",
    success: function(data){ auth=data;}
  
          });
console.log(auth);


  
  const cookieString = document.cookie;
  const cookies = cookieString.split('; ');

  for (const cookie of cookies) {
    const [cookieName, cookieValue] = cookie.split('=');
    if (cookieName === 'area') {
       area=  decodeURIComponent(cookieValue);

    }
    else if (cookieName === 'type') {
      type=  decodeURIComponent(cookieValue);
      console.log(type)
      
    }
    else if (cookieName === 'sido') {
      sidoCode=  decodeURIComponent(cookieValue);
      
    }
    else if (cookieName === 'sigun') {
      sigunCode=  decodeURIComponent(cookieValue);
      
    }
  }
  
  
  const temp = area.split('-');
  console.log(temp[0]);
  const sido =temp[0];
  const sigun = temp[1];
  
  if(type == 'false'){
    window.location.href = '/place';
  }

changeTypeUl.addEventListener("click",function(){
  if(changeTypeDiv.offsetHeight==400){
    
    changeTypeDiv.style.animation="upSlide 1s ease-out forwards";
  }else{
    changeTypeDiv.style.animation="downSlide 1s ease-out forwards";
  }
})

var sigunTemp;
if(sigun === '0'){
  sigunTemp='';
}
else{
  sigunTemp=sigun;
}


// 타입별 분류
handiType.innerText=handiTypeList[type];
choiceArea.innerText=sido+" "+sigunTemp;
const pathname = window.location.pathname;
const pathArray= pathname.split("/");
const contentType=pathArray[3];
console.log(contentType);
if(contentType == "14") menu14.style.color="blue";
else if(contentType == "12") menu12.style.color="blue";
else if(contentType == "28") menu28.style.color="blue";
else if(contentType == "38") menu38.style.color="blue";
else if(contentType == "39") menu39.style.color="blue";

const filePath ="/tourApi/"+sidoCode+"/"+sigunCode+"/"+contentType+".json"

async function read_image(title) {//이미지를 읽어오는부분
  const encodedText = encodeURIComponent(title);
  console.log(encodedText);
  image_data = await fetch(`https://apis.data.go.kr/B551011/PhotoGalleryService1/galleryDetailList1?numOfRows=10&pageNo=1&MobileOS=etc&MobileApp=app&title=${encodedText}&_type=json&serviceKey=TUMOhRKkJOHxh3bBw093oFlLM7YLA4Bo%2BfiXMnMWNU7uIMCjmG%2FAWH81KDyafJNQROiq97v%2BPEp7IwjKfmxDOw%3D%3D`)
    .then((response) => response.json())
    .then(data => {
      console.log(data);
      let items = data.response.body.items.item;
      if (items) {
        console.log(items[0].galWebImageUrl);
        return items[0].galWebImageUrl
        
      }
      else {//이미지가 없는 경우
        return "/img/noImage.png"
      }
    });
}
var btype='all'
if(type=='handicap'){
  btype='body'
}
else if(type=='infantsfamily'){
  btype='baby'
}else if(type=='blindhandicap'){
  btype='eye'
}else if(type=='hearinghandicap'){
  btype='ear'
}

/* 카드 출력하는 함수  */
async function creatCard(jdata,key,i){

  if(jdata[key].firstimage!="")
  {  img = jdata[key].firstimage}
  else{
    img = await read_image(jdata[key].title)
  }
   
 console.log(btype)
   div.insertAdjacentHTML(
     "beforeend",
     `<div class="col mt-10 my-4">
             <div class="card" >
             
               <img src="${img}" class="card-img-top img_size" alt="..." >
               <div id="cardBody${i}" class="card-body" value="${jdata[key].addr1}${jdata[key].addr2}">
                 <h5 class="card-title">${jdata[key].title}</h5>
                 <p  class="card-text" >${jdata[key].addr1}</p>
                 <div id="imgBody${i}" class="cardHandi"></div>
               
             


                 </div>
                 <a href="/place/content/${sidoCode}/${sigunCode}/${contentType}/${key}?barrier_category=${btype}&title=${jdata[key].title}">
                 <button class="bt" type="button" id="${jdata[key].mapx}" name="${jdata[key].mapy}" value="${i}" class="myinput${i}" data-bs-toggle="modal" data-bs-target="#exampleModal${i}">
더보기🔍
</button>
</a>
             </div>
         </div>`

   );
   const imgElements = document.querySelectorAll(".card-img-top");
   imgElements.forEach((imgElement, index) => {
     imgElement.onerror = function() {
       // 이미지 로딩 오류 처리 및 대체 이미지 로드
       imgElement.src = "/img/noImage.png";
       console.log("==> " + jdata[key].title);
     };
   });
   
   const imgBody = document.querySelector(`#imgBody${i}`);

     if(jdata[key].handicap=='1'){
       imgBody.insertAdjacentHTML(
         "beforeend",`
         <span class="hidden" style="font-size:18px;margin:3px;">지체장애 </span>
       <span class="hidden2" style="font-size:30px;margin:3px;">🧑‍🦽<span>`);
     }
     if(jdata[key].blindhandicap=='1'){
       imgBody.insertAdjacentHTML(
         "beforeend",`
         <span class="hidden" style="font-size:18px;margin:3px;">시각장애 </span>
       <span class="hidden2" style="font-size:30px;margin:3px;">👁️<span>`);
     }
     if(jdata[key].hearinghandicap=='1'){
       imgBody.insertAdjacentHTML(
         "beforeend",`
         <span class="hidden" style="font-size:18px;margin:3px;">청각장애 </span>
       <span class="hidden2" style="font-size:30px;margin:3px;">👂<span>`);
     }
     if(jdata[key].infantsfamily=='1'){
       imgBody.insertAdjacentHTML(
         "beforeend",`
         <span class="hidden" style="font-size:18px;margin:3px;">영유아동반 </span>
       <span class="hidden2" style="font-size:30px;margin:3px;">👶🏻<span>`);
     }

}

/* 12개씩 일거오는 부분 */
const plus = document.querySelector(".plus");
const searchPlus = document.querySelector(".plus2");


var page=1;
var i=0;

var count=0;
async function read_api() {// 여행지 읽어오기 
  
  var j=0;
  
  place_data = await fetch(filePath)
    .then((response) => response.json())
    .then(data => {
      const jdata =data;
      var img;
     // const jdata = data.response["body"].items.item;
    
     console.log(Object.keys(jdata).length);
     var end ;
     if(page*12 < Object.keys(jdata).length ){
      end =  page*12;
     }
     else{
      end = Object.keys(jdata).length;
      plus.classList.toggle("none");
     }
     console.log(Object.keys(jdata));

     while(true) {
      const key =Object.keys(jdata)[count];
      console.log(count);
      if(type=='undefined'){
        
        creatCard(jdata,key,i);
        i++;
        j++;
        if(j==12) break;
       
      }else{
        console.log(jdata[key].title);
        if(jdata[key][type]=='1'){
          
          creatCard(jdata,key,i)
          i++;
          j++;
          if(j==12){ break; }
         
          }  
      }
      count++;
      if(count >= Object.keys(jdata).length){
        plus.classList.toggle("none")
        break;
      }
      }
     
    });

}



plus.addEventListener("click", read_api); 




changeBt.addEventListener("click",changeBtHandle)
var sidoSelect = document.getElementById("sido");
  var sigunSelect = document.getElementById("sigun");
function changeBtHandle(event){
  //console.log(sidoSelect.value)
  //event.preventDefault();
  if(sidoSelect.value === "시/도 선택" || sigunSelect.value === "시/군 선택"){
    if(sidoSelect.value!=='1'&&sidoSelect.value!=='2'&&
    sidoSelect.value!=='3'&&sidoSelect.value!=='4'&&sidoSelect.value!=='5'&&
    sidoSelect.value!=='6'&&sidoSelect.value!=='7'&&sidoSelect.value!=='8' &&sidoSelect.value!=='39'){
      event.preventDefault();
      alert("지역을 선택해주세요!")
    }
    
  }
}

var preThis='';
document.addEventListener("DOMContentLoaded", function() {
  // 라디오 버튼 요소들을 가져옴
  var radioButtons = document.querySelectorAll('input[name="type"]');

  // 각 라디오 버튼에 대해 클릭 이벤트 리스너 등록
  radioButtons.forEach(function(radioButton) {
    radioButton.addEventListener("click", function() {
      console.log(this.checked)
      if (preThis == this) {
        this.checked = false;
        preThis='';
      }else{
        preThis=this;
        this.checked=true;
      }
    });
  });
});


const searchPath ="/tourApi/"+sidoCode+"/"+sigunCode+"/"+contentType+".json"
const searchInput = document.querySelector('.searchTA')
const searchButton = document.querySelector('.searchBT')
searchButton.addEventListener('click',handleSearch)

async function search_read_api(userInput){
  searchPlus.addEventListener("click", function() {
    search_read_api(urlParmas.get('search'));
  });
  var j=0;
  place_data = fetch(searchPath)
  .then((response) => response.json())
  .then(data => {
      jdata=data
      while(true) {
          const key =Object.keys(jdata)[count];
          if(type=='undefined' && jdata[key].title.includes(userInput)){
            
           creatCard(jdata,key,i);
              i++;
              j++;
              if(j==12) break;
          }else{
              console.log(jdata[key].title);
              if(jdata[key][type]=='1'&& jdata[key].title.includes(userInput)){
                console.log(jdata[key].title)
                  creatCard(jdata,key,i)
                  i++;
                  j++;
                  if(j==12){ break; }
              }
          }
          count++;
          if(count >= Object.keys(jdata).length){
          searchPlus.classList.add("none")
          break;
    }
      }

  })
}
async function handleSearch(){
  while (div.firstChild) {
    div.removeChild(div.firstChild);
  }
  plus.classList.add("none")
  searchPlus.classList.remove('none')
  userInput = searchInput.value
  urlParmas.set('search', userInput);
   count=0;
   page=1;
   i=0;
   window.open(location.pathname + '?' + urlParmas, '_self');
  console.log(userInput)
  await search_read_api(userInput)
  
}

async function load_page(){
  if(urlParmas.has('search')){
  
    plus.classList.add("none")
    searchPlus.classList.remove('none')
    searchInput.value = urlParmas.get('search')
    await search_read_api(urlParmas.get('search'))
  }else{
    await read_api()
    console.log('여기')
    searchPlus.classList.add("none")
    plus.classList.remove('none')
  }
}
load_page()