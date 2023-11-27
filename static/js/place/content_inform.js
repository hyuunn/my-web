//const axios = require('axios');

//쿼리스트링 읽어오는 부분
const url = new URL(window.location.href);
const urlParmas = url.searchParams;
const btype = urlParmas.get('barrier_category')//장애유형
const place_name = urlParmas.get('title')//장소이름
console.log(btype)

var typeName;


//후기게시글 보기에서 메뉴 추가
const reviewTop = document.querySelector('.reviewTop')
console.log(reviewTop);
reviewTop.insertAdjacentHTML("beforeend", `
<a href='?barrier_category=all&title=${place_name}'><button class="all choiceBt">전체</button></a>
<a href='?barrier_category=body&title=${place_name}'><button class="body choiceBt">지체장애</button></a>
<a href='?barrier_category=eye&title=${place_name}'><button class="eye choiceBt">시각장애</button></a>
<a href='?barrier_category=ear&title=${place_name}'><button class="ear choiceBt">청각장애</button></a>
<a href='?barrier_category=baby&title=${place_name}'><button class="baby choiceBt">영유아동반</button> </a>
`)
//메뉴 눌렀을 때 색 변하는 거 (쿼리스트링 읽어서 함)
if(btype =='all'|| btype==null){
  document.querySelector('.all').classList.add('choiceBtG')
  typeName='사용자'
}else if(btype=='eye'){
  document.querySelector('.eye').classList.add('choiceBtG')
  typeName='시각장애 사용자'
  
}else if(btype=='ear'){
  document.querySelector('.ear').classList.add('choiceBtG')
  typeName='청각장애 사용자'
}else if(btype=='body'){
  document.querySelector('.body').classList.add('choiceBtG')
  typeName='지체장애 사용자'
}else if(btype=='baby'){
  document.querySelector('.baby').classList.add('choiceBtG')
  typeName='영유아동반 사용자'
}
const handicapDiv = document.querySelector(".handicap");
const handi = document.querySelector(".handi");
const title = document.querySelector(".title b");
const table = document.querySelector(".table");
const inform = document.querySelector(".inform");
const summary = document.querySelector(".summary");
const detail = document.querySelector(".detail");
const mapAddr = document.querySelector(".mapAddr");
const mapImg = mapAddr.querySelector("img");
var container = document.getElementById('map');
const sideInform = document.querySelector(".sideInform");
const sideMap = document.querySelector(".sideMap");
const sideHandi = document.querySelector(".sideHandi");
const sidePost = document.querySelector(".sidePost");
const handiIcon = document.querySelector("#handiIcon");
const mapIcon = document.querySelector("#mapIcon");
const informIcon = document.querySelector("#informIcon");
const reviewIcon = document.querySelector(".reviewIcon");
const mapDiv = document.querySelector(".mapDiv");
const handiHr = document.querySelector(".handiHr");
const mapHr = document.querySelector(".mapHr");
const reviewHr = document.querySelector(".reviewHr");
const informHr = document.querySelector(".informHr");
const reviewDiv = document.querySelector("#reviewDiv");
const reviewD = document.querySelector(".reviewD");
const bookmarkP = document.querySelector(".bookmarkP");
const inputTitle = document.querySelector(".inputTitle");
const addr = document.querySelector(".addr");

var infantsfamily = { "stroller": "유모차", "lactationroom": "수유실", "babysparechair": "유아용 보조 의자", "infantsfamilyetc": "영유아가족 기타 지원 항목" };
var handicap = { "parkig": "주차 여부", "route": "대중교통", "publictransport": "접근로", "ticketoffice": "매표소", "promotion": "홍보물", "wheelchair": "휠체어", "exit": "출입통로", "elevator": "엘리베이터", "restroom": "화장실", "auditorium": "관람석", "room": "객실", "handicapetc": "기타 지원 항목" };
var blindhandicap = { "braileblock": "점자블록", "helpdog": "보조견 동반", "guidehuman": "안내요원", "audioguide": "오디오 가이드", "bigprint": "큰활자 홍보물", "brailepromotion": "점자 홍보물 및 점자 표지판", "guidesystem": "유도안내설비", "blindhandicapetc": "기타 지원 항목" };
var hearinghandicap = { "signguide": "수화안내", "videoguide": "자막 비디오 가이드 및 영상 자막 안내", "hearinghandicapetc": "기타 지원 항목", "hearingroom": "객실" };

var detail12 = { "accomcount": "수용인원", "chkpet": "애완동물 동반 가능 여부", "expagerange": "체험가능 연령", "expguide": "체험안내", "heritage1": "세계 문화유산 유무", "heritage2": "세계 자연유산 유무", "heritage3": "세계 기록유산 유무", "infocenter": "문의 및 안내", "opendate": "개장일", "parking": "주차시설", "restdate": "쉬는 날", "useseason": "이용시기", "usetime": "이용시간" }
var detail14 = { "accomcountculture": "수용인원", "chkpetculture": "애완동물 동반 가능 여부", "discountinfo": "할인정보", "infocenterculture": "문의 및 안내", "parkingculture": "주차시설", "parkingfee": "주차요금", "restdateculture": "쉬는 날", "usefee": "이용요금", "usetimeculture": "이용시간",  "spendtime": "관람 소요시간" }
var detail28 = { "accomcountleports": "수용인원",   "chkpetleports": "애완동물 동반 가능 여부", "expagerangeleports": "체험 가능 연령", "infocenterleports": "문의 및 안내", "openperiod": "개장기간", "parkingfeeleports": "주차요금", "parkingleports": "주차시설", "reservation": "예약안내", "restdateleports": "쉬는 날", "usefeeleports": "입장료", "usetimeleports": "이용시간" }
var detail38 = {   "chkpetshopping": "애완동물 동반 가능 여부", "culturecenter": "문화센터 바로가기", "fairday": "장서는 날", "infocentershopping": "문의 및 안내", "opendateshopping": "개장일", "opentime": "영엽시간", "parkingshopping": "주차시설", "restdateshopping": "쉬는 날", "restroom": "화장실 설명", "saleitem": "판매 품목", "saleitemcost": "판매 품목별 가격", "scaleshopping": "규모", "shopguide": "매장안내" }
var detail39 = {  "discountinfofood": "할인정보", "firstmenu": "대표메뉴", "infocenterfood": "문의 및 안내", "kidsfacility": "어린이 놀이방 여부",  "opentimefood": "영업시간", "packing": "포장 가능", "parkingfood": "주차시설", "reservationfood": "예약안내", "restdatefood": "쉬는 날", "seat": "좌석수", "smoking": "금연/흡연 여부", "treatmenu": "취급 메뉴" }
const currentPath = window.location.pathname;
const path = currentPath.split('/');
sido = path[3];
sigun = path[4];
content = path[6];
contentType = path[5];
console.log(path[3]);

//댓글 submit할 때 필요한 정보 추가 
const commentForm= document.querySelector('.content_comment_form');
commentForm.insertAdjacentHTML(
"beforeend",
`<input type="hidden" name="url" value="${sido}/${sigun}/${contentType}/${content}"></input>`);
commentForm.insertAdjacentHTML(
  "beforeend",
  `<input type="hidden" name="title" value="${place_name}"></input>`);

var place_data
const filePath = `/tourApi/${sido}/${sigun}/${contentType}.json`
var handicap_audio='';

async function read_api() {// 장애 편의시설 정보 나타내는 부분

  place_data = await fetch(filePath)
    .then((response) => response.json())
    .then(async data => {
      console.log(data)
      title.innerText = `${data[content].title}`;
      
      //  inputTitle.value = `${data[content].title}`;
      handi.insertAdjacentHTML(
        "beforeend",
        `
        <input type='button' class="handicap_Voice" value="음성듣기"></input>
        <audio class="handicap_audioPlayer" controls style="display: none;"></audio>`);

        const handicap_Voice = document.querySelector('.handicap_Voice');
        const handicap_audioPlayer = document.querySelector('.handicap_audioPlayer');
        handicap_Voice.addEventListener('click', () => handicap_play(handicap_audio, handicap_audioPlayer));
        
      console.log(title.children);
      console.log(data[content]);
      if (data[content].handicap == "1") {
        handi.insertAdjacentHTML(
          "beforeend",
          `<p class="handicapTitle" style="font-size:20px;"><b>🧑‍🦽지체장애 편의시설</b></p>`);
          handicap_audio+='지체장애 편의시설 입니다.\n'
        handi.insertAdjacentHTML(
          "beforeend",
          `<table class="handiTB" style="width:100%;"></table>`);
        var handiTB = document.querySelector(".handiTB");
        for (const item of data[content].handi) {
          const key = Object.keys(item)[0];
          const value = item[key];
          handiTB.insertAdjacentHTML(
            "beforeend",
            `<tr class="ptext" style="font-size:18px;" ><td style="width:30%;"><span><b>${key}&nbsp;</b></span></td><td><span> ${value}</span></td></tr>`);
            handicap_audio+=key+' '+value+'.';
          console.log(`키: ${key}`);
          console.log(`값: ${value}`);
        }
        handi.insertAdjacentHTML(
          "beforeend",
          `<br><br>`);

      }
      if (data[content].blindhandicap == "1") {
        handi.insertAdjacentHTML(
          "beforeend",
          `<p class="handicapTitle" style="font-size:20px;"><b>👁️ 시각장애 편의시설</b></p>`);
          handicap_audio+='시각장애 편의시설 입니다.\n'
        handi.insertAdjacentHTML(
          "beforeend",
          `<table class="blindTB" style="width:100%;"></table>`);
        var blindTB = document.querySelector(".blindTB");
        for (const item of data[content].blind) {
          const key = Object.keys(item)[0];
          const value = item[key];
          blindTB.insertAdjacentHTML(
            "beforeend",
            `<tr class="ptext" style="font-size:18px;"><td style="width:30%;"  ><span><b>${key}&nbsp;</b></span></td><td><span> ${value}</span></td></tr>`);
          console.log(`키: ${key}`);
          console.log(`값: ${value}`);
          handicap_audio+=key+' '+value+'.';
        }
        handi.insertAdjacentHTML(
          "beforeend",
          `<br><br>`);

      }
      if (data[content].hearinghandicap == "1") {
        handi.insertAdjacentHTML(
          "beforeend",
          `<p class="handicapTitle" style="font-size:20px;"><b>👂 청각장애 편의시설</b></p>`);
          handicap_audio+='청각장애 편의시설 입니다.\n'
        handi.insertAdjacentHTML(
          "beforeend",
          `<table class="hearTB" style="width:100%;"></table>`);
        var hearTB = document.querySelector(".hearTB");
        for (const item of data[content].hearing) {
          const key = Object.keys(item)[0];
          const value = item[key];
          hearTB.insertAdjacentHTML(
            "beforeend",
            `<tr class="ptext" style="font-size:18px;"><td style="width:30%;" ><span><b>${key}&nbsp;</b></span></td><td><span> ${value}</span></td></tr>`);
          console.log(`키: ${key}`);
          console.log(`값: ${value}`);
          handicap_audio+=key+' '+value+'.';
        }
        handi.insertAdjacentHTML(
          "beforeend",
          `<br><br>`);
      }
      if (data[content].infantsfamily == "1") {
        handi.insertAdjacentHTML(
          "beforeend",
          `<p class="handicapTitle" style="font-size:20px;"><b>🧑🏻‍👩🏻‍👧🏻 영유아동반 편의시설</b></p>`);
          handicap_audio+='영유아동반 편의시설 입니다.\n'
        handi.insertAdjacentHTML(
          "beforeend",
          `<table class="familyTB" style="width:100%;"></table>`);
        var familyTB = document.querySelector(".familyTB");
        for (const item of data[content].family) {
          const key = Object.keys(item)[0];
          const value = item[key];
          familyTB.insertAdjacentHTML(
            "beforeend",
            `<tr class="ptext" style="font-size:18px;"><td style="width:30%;" ><span><b>${key}&nbsp;</b></span></td><td><span> ${value}</span></td></tr>`);
          console.log(`키: ${key}`);
          console.log(`값: ${value}`);
          handicap_audio+=key+' '+value+'.';
        }
        handi.insertAdjacentHTML(
          "beforeend",
          `<br><br>`);

      }

      //kakao API 하는 부분
      placecheckBookmark(data[content].mapx, data[content].mapy);
      console.log(data[content].mapy + "//" + data[content].mapx);
      var options = {
        center: new kakao.maps.LatLng(data[content].mapy, data[content].mapx),
        level: 3
      };

      var map = new kakao.maps.Map(container, options);

      var markerPosition = new kakao.maps.LatLng(data[content].mapy, data[content].mapx);

      // 마커를 생성합니다
      var marker = new kakao.maps.Marker({
        position: markerPosition
      });

      marker.setMap(map);
      console.log(data[content].title);

      //지도 위에 주소
      addr.value = data[content].addr1

      mapAddr.insertAdjacentHTML(
        "afterbegin",
        `     <a href="https://map.kakao.com/link/to/${data[content].title},${data[content].mapy},${data[content].mapx}">
        <img class="searchMap"src="/img/map.png" alt="My Image">
      </a>
              <p>📍${data[content].addr1}</p>
              
              `);
      await read_image(data[content].title, data[content].firstimage);
    })
}


async function read_image(title, firstimage) {//이미지를 읽어오는부분
  const encodedText = encodeURIComponent(title);
  console.log(encodedText);
  image_data = await fetch(`https://apis.data.go.kr/B551011/PhotoGalleryService1/galleryDetailList1?numOfRows=10&pageNo=1&MobileOS=etc&MobileApp=app&title=${encodedText}&_type=json&serviceKey=TUMOhRKkJOHxh3bBw093oFlLM7YLA4Bo%2BfiXMnMWNU7uIMCjmG%2FAWH81KDyafJNQROiq97v%2BPEp7IwjKfmxDOw%3D%3D`,{
    headers : { 
      'Accept': 'application/json'
     }
  })
    .then((response) => response.json())
    .then(data => {
      console.log(data);
      let items = data.response.body.items.item;
      if (items) {
        console.log(items[0].galWebImageUrl);
        inform.insertAdjacentHTML(
          "afterbegin",
          `<br><br><img src="${items[0].galWebImageUrl}" class="img" alt='...'>`);
      }
      else {//이미지가 없는 경우
        console.log("here!")
        if (firstimage != "") {
          inform.insertAdjacentHTML(
            "afterbegin",
            `<br><br><img src="${firstimage}" class="img" alt='...'>`);
        }
      }
    });
}


var summary_audio='';

async function read_summary() {//개요 읽어오는 부분


  summary_data = await fetch(`https://apis.data.go.kr/B551011/KorWithService1/detailCommon1?numOfRows=100&pageNo=1&MobileOS=etc&MobileApp=test&contentId=${content}&overviewYN=Y&_type=json&serviceKey=TUMOhRKkJOHxh3bBw093oFlLM7YLA4Bo%2BfiXMnMWNU7uIMCjmG%2FAWH81KDyafJNQROiq97v%2BPEp7IwjKfmxDOw%3D%3D`,{
    headers : { 
      'Accept': 'application/json'
     }
  })
    .then((response) => response.json())
    .then(data => {
      console.log(data);
      if (data.response.body.items.item[0].overview != "") {
        summary.insertAdjacentHTML(
          "beforeend",
          `
          <br><br><p class="handicapTitle" style="font-size:20px;"><b>✔️ 개요</b></p>\
          <input class="summary_Voice" type="button" value=' 음성듣기 '></input>
          <audio class="summary_audioPlayer" controls style="display: none;"></audio>
          <br>
        
        <p class="ptext" style="font-size:18px;">${data.response.body.items.item[0].overview}</p>`);
          summary_audio = '개요입니다.'+data.response.body.items.item[0].overview;
        const summary_Voice = document.querySelector('.summary_Voice');
        const summary_audioPlayer = document.querySelector('.summary_audioPlayer');
        summary_Voice.addEventListener('click', () => summary_play(summary_audio, summary_audioPlayer));
      }


    })
}




async function read_detail() {//상세정보 읽어오는 부분

  var detail_audio='';
  detail_data = await fetch(`https://apis.data.go.kr/B551011/KorWithService1/detailIntro1?numOfRows=1000&pageNo=1&MobileOS=etc&MobileApp=test&contentId=${content}&contentTypeId=${contentType}&_type=json&serviceKey=TUMOhRKkJOHxh3bBw093oFlLM7YLA4Bo%2BfiXMnMWNU7uIMCjmG%2FAWH81KDyafJNQROiq97v%2BPEp7IwjKfmxDOw%3D%3D`,{
    headers : { 
      'Accept': 'application/json'
     }
  })
    .then((response) => response.json())
    .then(data => {
      console.log(data);
      var temp = data.response.body.items.item[0];
      var detailHash;
      if (contentType == '14') {
        detailHash = detail14
      } else if (contentType == '12') {
        detailHash = detail12
      } else if (contentType == '28') {
        detailHash = detail28
      } else if (contentType == '38') {
        detailHash = detail38
      } else if (contentType == '39') {
        detailHash = detail39
      }
      detail.insertAdjacentHTML(
        "afterbegin",
        `<br><br>
            <br><br><p class="handicapTitle" style="font-size:20px;"><b>✔️ 상세 정보</b></p>
            <input class="detail_Voice" type="button" value=' 음성듣기 '></input>
          <audio class="detail_audioPlayer" controls style="display: none;"></audio>
            <br><br>
            `);
      console.log(table);
      var count = 0;

      for (var key in detailHash) {
        if (temp[`${key}`] !== "" && detailHash[key]!==null) {
          console.log(detailHash[key] + "-" + temp[`${key}`]);
          var value = temp[`${key}`];
          console.log(temp[`${key}`].length);

          table.insertAdjacentHTML(
            "beforeend",
            `<tr style="font-size:18px;">
                      <td style="width:30%;" class="ptext" ><b>${detailHash[key]}</b></td>
                      <td class="ptext">${value}</td>
                      </tr>
                    `);
            detail_audio+=detailHash[key]+' '+value+'.'
        }
      }
    
        const detail_Voice = document.querySelector('.detail_Voice');
        const detail_audioPlayer = document.querySelector('.detail_audioPlayer');
        detail_Voice.addEventListener('click', () => detail_play(detail_audio, detail_audioPlayer));

    })
}

//장소에 대한 후기글 읽어오는 부분


console.log(btype)
$.ajax({
  url: `/place/readContentReview/${content}?barrier_category=${btype}`,
  type: "get",
  data: {},
  dataType: "json",
  success: async function (data) {
   console.log(data.length)
   console.log('data.length')
   if(data.length ==0){
    reviewD.insertAdjacentHTML("beforeend", `
    <div class="noReviewDiv"><p>${typeName}의 후기가 없습니다.</p></div>
    `)
   }else{
    for (var i = 0; i < data.length; i++) {
      console.log('i왔다!!');
      var handicap;
      var handicap_text;
      for (var i = 0; i < data.length ; i++) {

          if (data[i].barrier_category  == 4) {
              handicap = '👶🏻';
              handicap_text='영유아동반 사용자'
          } else if (data[i].barrier_category == 1) {
              handicap = '👀';
              handicap_text='시각장애 사용자'
          } else if (data[i].barrier_category == 2) {
              handicap = '👂';
              handicap_text='청각장애 사용자'
          } if (data[i].barrier_category  == 3) {
              handicap = '🧑‍🦽';
              handicap_text='지체장애 사용자'
          } if (data[i].barrier_category  == 0) {
              handicap = '&nbsp;';
              handicap_text=''
          }
          

        reviewD.insertAdjacentHTML("beforeend", `
        <div class="Bcard col-3 card-1 "  >
        <div class="header">
        <span> <i class="fa-solid fa-heart fa-lg" style="color: #ffdbdb;" id="recommend-true" value="true"></i>&nbsp;+${data[i].recommend} </span>
        <span style="font-size:14px; ">${data[i].userID}</span>
        </div>
        <hr>
        
        <div class="Bcard-body ">
        <p class="post-title" ><b>${data[i].title}</b></p>
        <div class="card-handiDiv">
        
        <span style="font-size:14px; ">${handicap_text}</span>
        
        <span style="font-size:33px;">${handicap}</span>
        
        </div>
       <a href="/board/post/${data[i].postID}"> <button class="cardBt"><span class="hidden">더보기</span>🔍</button></a>
        </div>
        
    </div>
         
      `)
      
     
          if(i==5){
            reviewD.insertAdjacentHTML("beforeend", `
    <div class="plusDiv">
<a href="/board/list?search_target=place&search_keyword=${place_name}" class="hidden2"><i class="fa-solid fa-angles-down fa-xl" class="plusIcon"></i></a>
<a href="/board/list?search_target=place&search_keyword=${place_name}" class="hidden"><button >후기 게시글 더보기</button><a>
</div>

    `)
    break;
          }
      }
      if(i==5)break;
    }
    
    
    //console.log('title',title.innerText);
    
  }

  },
  error: function (error) {
    // 에러 처리

  }
});



function sideClick(element) {//side 메뉴 클릭하였을 때 화면 이동
  element.scrollIntoView(true);// 클릭한 p 태그의 텍스트를 출력합니다.
}


function toggleElement(element) { //main에서의 div toggle

  element.classList.toggle("close");


}

function toggleIcon(icon, div, hr) {
  icon.removeChild(icon.firstElementChild);
  console.log(div);
  if (div.classList.contains("close")) {
    icon.insertAdjacentHTML(
      "beforeend",

      `<i class="fa-solid fa-chevron-up upImage" ></i> 
      
              `);
    div.classList.toggle("close");
    hr.classList.toggle("close");
  }
  else {
    icon.insertAdjacentHTML(
      "beforeend",
      ` <i class="fa-solid fa-chevron-down upImage" ></i>
              `);
    div.classList.toggle("close");
    hr.classList.toggle("close");
  }
}
//side menu
sideInform.addEventListener('click', function () { sideClick(informIcon); });
sideMap.addEventListener('click', function () { sideClick(mapIcon); });
sideHandi.addEventListener('click', function () { sideClick(handiIcon); });
sidePost.addEventListener('click', function () { sideClick(reviewIcon); });

//toggle div



handiIcon.addEventListener('click', function () { toggleIcon(handiIcon, handicapDiv, handiHr); });
informIcon.addEventListener('click', function () { toggleIcon(informIcon, inform, informHr); });
mapIcon.addEventListener('click', function () { toggleIcon(mapIcon, mapDiv, mapHr); });
reviewIcon.addEventListener('click', function () { toggleIcon(reviewIcon, reviewDiv, reviewHr); });



//bookmark !!!!!

async function placecheckBookmark(x, y) { // 북마크 저장되어있는지 확인하여 북마크 이미지를 바꾸는 함수 
  await $.ajax({
    url: "/place/checkBookmark", type: "post", data: { x: x, y: y }, dataType: "text",
    success: function (response) {
      console.log("success!");
    }
  });
  var bookmark = await $.ajax({
    url: "/place/checkBookmark", type: "get", data: {}, dataType: "text",
    success: function (data) { bookmark = data; return bookmark; }
  });
  console.log(bookmark);
  if (bookmark == "true") {
    isSave = "save";
    console.log(auth);
    console.log(bookmarkP);
    while(bookmarkP.firstChild) {
      bookmarkP.removeChild(bookmarkP.firstChild);
    }
    bookmarkP.insertAdjacentHTML("beforeend"
      , `<button class="hidden">북마크</button><i class="fa-regular fa-bookmark fa-2xl hidden2" value="delete" style="color: #ccdfff;"></i>`);
  } else {
    isSave = "delete";
    console.log(auth);
    while(bookmarkP.firstChild) {
      bookmarkP.removeChild(bookmarkP.firstChild);
    }
    bookmarkP.insertAdjacentHTML("beforeend"
      , `<button class="hidden">북마크</button> <i class="fa-solid fa-bookmark fa-2xl hidden2" value="save" style="color: #a1bff2;">
     `);
  }
}

var auth = "True";


async function save_click(event) {
  const cookieString = document.cookie;
  const cookies = cookieString.split('; ');

  var auth = await $.ajax({
    url: "/place/authCheck", type: "get", data: {}, dataType: "text",
    success: function (data) { auth = data; return auth; }
  });

  for (const cookie of cookies) {
    const [cookieName, cookieValue] = cookie.split('=');
    if (cookieName === 'x') {
      var x = decodeURIComponent(cookieValue);

    }
    else if (cookieName === 'y') {
      var y = decodeURIComponent(cookieValue);

    }

  }
  var placetitle = title.innerText;
  console.log(placetitle);
  var This = this;

  if (auth == "True") {
    console.log(this.firstChild);
    save_plan = await $.ajax({
      url: "/place/planCheck/save", type: "get", data: {}, dataType: "json",
      success: function (data) { console.log(data); return data; }
    });
    console.log(save_plan);

    if (save_plan != false) {
      var planList = "<form id=`alterCheck`>";
      var Title = "장소를 북마크에 저장/ 삭제 해보세요!📑";
      for (var i = 0; i < save_plan.length; i++) {
        if (i % 4 == 0) planList += "<br>";
        var check = "";
        if (save_plan[i].isCheck == true) {
          console.log(save_plan[i].isCheck);
          check = `checked="on"`;
        }
        planList += `<input  type="checkbox" ${check} style="font-size:12px;" id="input${i}"value="${save_plan[i].planID}"><span style="font-size:15px;">${save_plan[i].title}</span>     </input>&nbsp;&nbsp;`;
      }
      var bin = await $.ajax({
        url: "/place/checkfolder/check", type: "get", data: {}, dataType: "text",
        success: function (data) { return data; }
      });
      if (bin == "true") { planList += `<input type="checkbox" checked="on" id="input${save_plan.length}"><span style="font-size:15px;">기타폴더</span> </input>&nbsp;&nbsp;`; }
      else { planList += `<input  type="checkbox" style="font-size:12px;"  id="input${save_plan.length}"><span style="font-size:15px;">기타 폴더</span></input>&nbsp;&nbsp;`; }
    }
    else {
      var planList = "";
      if (isSave == "save") {
        var Title = "북마크에 저장할까요?📑";
      }
      else if (isSave == "delete") {
        var Title = "북마크를 삭제할까요?📑";
      }
    }
    console.log("planList=>" + planList);
    Swal.fire({

      title: `<p style="font-size:15px">` + Title + "</p>",
      html: planList,

      confirmButtonText: "확인",
      showDenyButton: true,
      denyButtonText: '취소',
      allowOutsideClick: false,
      confirmButtonColor: "#AD8B73",
      denyButtonColor: "#BEBCBA",




      preConfirm: () => {
        if (planList == "") {
          if (isSave == "save") {
            $.ajax({
              url: "/place/save", type: "post", data: { y: y, x: x, isSave: isSave, planID: false, title: placetitle, addr: addr.value }, dataType: "json",
              success: function (response) { console.log("success!"); }
            });
            placecheckBookmark(x, y, This);
            return 0;
          }
          else if (isSave == "delete") {
            $.ajax({
              url: "/place/save", type: "post", data: { y: y, x: x, isSave: isSave, planID: false, title: placetitle, addr: addr.value }, dataType: "json",
              success: function (response) { console.log("success!"); }
            });
            placecheckBookmark(x, y, This);
            return 0;
          }
        }
        for (var i = 0; i <= save_plan.length; i++) {
          if (Swal.getPopup().querySelector(`#input${i}`).checked) {
            isSave = "save";
            console.log(isSave);
            if (i == save_plan.length) {
              $.ajax({
                url: "/place/save", type: "post", data: { y: y, x: x, isSave: isSave, planID: false, title: placetitle, addr: addr.value }, dataType: "json",
                success: function (response) { console.log("success!"); }
              });
              placecheckBookmark(x, y, This);
              return 0;
            }
            $.ajax({
              url: "/place/save", type: "post", data: { y: y, x: x, isSave: isSave, planID: save_plan[i].planID, title: placetitle, addr: addr.value }, dataType: "json",
              success: function (response) { console.log("success!"); }
            });
            placecheckBookmark(x, y, This);
          }
          else {
            isSave = "delete";
            if (i == save_plan.length) {
              $.ajax({
                url: "/place/save", type: "post", data: { y: y, x: x, isSave: isSave, planID: false, title: placetitle, addr: addr.value }, dataType: "json",
                success: function (response) { console.log("success!"); }
              });
              placecheckBookmark(x, y, This);
              return 0;
            }
            $.ajax({
              url: "/place/save", type: "post", data: { y: y, x: x, isSave: isSave, planID: save_plan[i].planID, title: placetitle, addr: addr.value }, dataType: "json",
              success: function (response) { console.log("success!"); }
            });
            placecheckBookmark(x, y, This);
            console.log(isSave);
          }
        }

      }
    }).then((result) => {

      if (result.isConfirmed) {
        Swal.fire({
          position: "center",
          icon: "success",
          width: "400px",
          height: "200px",
          title: `<p style="font-size:15px">` + "수정하였습니다!😊" + "</p>",
          showConfirmButton: false,
          timer: 1500
        })
      }



    });
  }
  else { location.href = "/auth/login"; }
}

bookmarkP.addEventListener('click', function () { save_click(); });


async function sequentialExecution() {
  try {
    

    // 두 번째 함수 실행
    await read_summary();

    // 세 번째 함수 실행
    await read_detail();

    await read_api(filePath)
    // 여기에 다음 단계 동작을 추가하거나 완료를 처리할 수 있습니다.
  } catch (error) {
    console.error(error);
    // 에러 처리
  }
}

// 함수 실행
sequentialExecution();


/*
<div class="Bcard class=" card-1" style="width:270px;">
          <div class="header" style="width:100%;" >
          <span >❤️+${data[i].recommend} </span>
          </div>
          <hr>
          <div class="Bcard-body ">
          <p style="position: relative; top:15px;font-size:14px;"><b>${handicap}${data[i].title}</b></p>
          <span style="font-size:12px;">${data[i].userID}</span>
         <a href="/board/post/${data[i].postID}"> <button class="cardBt">🔍</button></a>
          </div>
          
      </div>
       */
      

//!!!!!! 정보 수정요청 페이지로 이동
function updateBtHandle() {

  window.location.href = `/place/update/${sido}/${sigun}/${contentType}/${content}`
}
let updateBt = document.querySelector('.updateBT');
updateBt.addEventListener("click", updateBtHandle);




//오디오 하는 부분 !!!!!!!!!
 async function summary_play(summary_audio,summary_audioPlayer){
  var audio_text =summary_audio.replace(/<br>/g, '\n'); 
  await generateAudio(audio_text,summary_audioPlayer);
 }
 async function detail_play(detail_audio,detail_audioPlayer){
  var audio_text =detail_audio.replace(/<[^>]*>/g,'.');  
  //console.log(audio_text)
  await generateAudio(audio_text,detail_audioPlayer);
 }

async function handicap_play(handicap_audio,handicap_audioPlayer){
  var audio_text =handicap_audio.replace(/<br>/g, '.');  
  //console.log(audio_text)
  await generateAudio(audio_text,handicap_audioPlayer);
 }

 async function generateAudio(text,audioPlayer) {
  try {
    const response = await  axios.post('http://localhost:3000/place/voice', text,{responseType: 'blob'});

    const audioBlob = response.data;
    const audioUrl = URL.createObjectURL(audioBlob);
    audioPlayer.src = audioUrl;
   audioPlayer.style.display = 'block';
    audioPlayer.play();
  } catch (error) {
    console.error('요청 중 오류 발생:', error);
  }

}
