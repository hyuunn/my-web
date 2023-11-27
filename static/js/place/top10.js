
function image(sido,sigun){
    var array=[];
    if(sido==1){//서울
        array.push({'name':"서울-0","img": "/img/서울.jpg",})
        return array;
    }
    else if(sido ==2){//인천{
        array.push({'name':"인천-0","img": "/img/인천.jpg"})
        return array;
    }
    else if(sido ==3){//대전
        array.push({'name':"대전-0","img": "/img/대전.jpg"})
        return array;
    }else if(sido ==4){//대구
        array.push({'name':"대구-0","img": "/img/대구.jpg"})
        return array;
    }
    else if(sido ==5){//광주
        array.push({'name':"광주-0","img": "/img/광주.jpg"})
        return array;
    }
    else if(sido ==6){//부산
        array.push({'name':"부산-0","img": "/img/부산.jpg"})
        return array;
    }else if(sido ==7){//울산
        array.push({'name':"울산-0","img": "/img/울산.jpg"})
        return array;
    }else if(sido ==8){//세종
        array.push({'name':"세종-0","img": "/img/세종.jpg"})
        return array;
    }else if(sido ==33){//충북
        array.push({'name':"충청북도-"+cb_data[sigun-1].name,"img": cb_data[sigun-1].img})
        return array;
    }else if(sido ==31){//경기
        array.push({'name':"경기도-"+gyeonggi_data[sigun-1].name,"img": gyeonggi_data[sigun-1].img})
        return array;
    }else if(sido ==32){//강원
        array.push({'name':"강원도-"+gw_data[sigun-1].name,"img": gw_data[sigun-1].img})
        return array;
    }else if(sido ==34){//충남
        array.push({'name':"충청남도-"+cn_data[sigun-1].name,"img": cn_data[sigun-1].img})
        return array;
    }else if(sido ==35){//경북
        array.push({'name':"경상북도-"+gb_data[sigun-1].name,"img": gb_data[sigun-1].img})
        return array;
    }else if(sido ==36){//경남
        array.push({'name':"경상남도-"+gn_data[sigun-1].name,"img": gn_data[sigun-1].img})
        return array;
    }else if(sido ==37){//전북
        array.push({'name':"전라북도-"+jb_data[sigun-1].name,"img": jb_data[sigun-1].img})
        return array;
    }else if(sido ==38){//전남
        array.push({'name':"전라남도-"+jn_data[sigun-1].name,"img": jn_data[sigun-1].img})
        return array;
    }else if(sido ==39){//제주
        array.push({'name':"제주-0","img": "/img/제주.jpg"})
        return array;
    }
}

var slides = document.querySelector(".slides")
let liArray =[10];
function getCookie(name) {
    var cookieName = name + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var cookieArray = decodedCookie.split(';');
    for (var i = 0; i < cookieArray.length; i++) {
        var cookie = cookieArray[i];
        while (cookie.charAt(0) == ' ') {
            cookie = cookie.substring(1);
        }
        if (cookie.indexOf(cookieName) == 0) {
            return cookie.substring(cookieName.length, cookie.length);
        }
    }
    return null;
}

function setCookie(name, value, days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + value + expires + "; path=/";
}

function top10ClickHandle(event) {
    var areaCode = event.currentTarget.getAttribute('value');
    console.log(areaCode);

    var area = areaCode.split('/');
    console.log(area[1]);
    var sigun = 0;
    var sido = area[0];

    var sigunInt = parseFloat(area[1]);
    console.log(area[1]);
    // 숫자가 NaN이 아니고 0이 아니면 true 반환
    if (!isNaN(sigunInt) && sigunInt !== 0) {
        sigun=area[1]
    }
    else{
        sigun=0;
    }
    console.log(sigun);
    var array2 = image(sido,sigun);
    // 쿠키 읽기
    var existingSido = getCookie("sido");
    var existingSigun = getCookie("sigun");
    var existingarea = getCookie("area");
    var existingType = getCookie("type");
    var currentDate = new Date();


    // 쿠키가 존재하지 않으면 생성, 존재하면 수정
    if (existingSido === null) {
        setCookie("sido", sido, 30); // 30일 동안 유효한 sido 쿠키
    } else {
        setCookie("sido", sido, 30); // 30일 동안 유효한 sido 쿠키 (수정)
    }

    if (existingSigun === null) {
        setCookie("sigun", sigun, 30); // 30일 동안 유효한 sigun 쿠키
    } else {
        setCookie("sigun", sigun, 30); // 30일 동안 유효한 sigun 쿠키 (수정)
    }

    if (existingarea === null) {
        setCookie("area",array2[0].name, 30); // 30일 동안 유효한 sigun 쿠키
    } else {
        setCookie("area",array2[0].name, 30); // 30일 동안 유효한 sigun 쿠키 (수정)
    }

    if (existingType === null) {
        setCookie("type",undefined, 30); // 30일 동안 유효한 sigun 쿠키
    } else {
        setCookie("type",undefined, 30); // 30일 동안 유효한 sigun 쿠키 (수정)
    }


    // 페이지 이동
    window.location.href = "/place/inform/14";
}

$.ajax({
    url: "/place/popular10",
    type: "get",
    data: {},
    dataType: "JSON",
    success: function(data) {
        console.log(data)
        for(var i=0; i<data.length;i++){
        
        var temp = image(data[i].sido_code,data[i].sigun_code)
        var areaCode = data[i].sido_code+"/"+data[i].sigun_code;
       
        var nameTemp = temp[0].name.split("-");
        if(nameTemp[1]=='0'){
            var name = nameTemp[0]
        }else{
            var name = nameTemp[1]
        }
        
        console.log(temp)
        slides.insertAdjacentHTML(
            "beforeend",
            `<li class="top${i} top10Li text_hidden" value=${areaCode}>
                <img class="topImg" src="${temp[0].img}" alt=""><p class="top_place">${name}</p>
                
            </li>

            <li class="top top10Li hidden hidden2 " >
                <img class="topImg"src="${temp[0].img}" alt=""><p style="width:50px;">${name}</p>
                <p><b>${i+1}</b><p>
                <button class="hidden hidden2 top10Bt" value=${areaCode}>${name} 여행지 탐색</button>
            </li>
            
            `)
        liArray[i] = document.querySelector('.top' + i);
        liArray[i].addEventListener('click', top10ClickHandle);
    }
    },
    error: function(error) {
      // 에러 처리
      
    }
  });

  console.log(cb_data[0].name)


    //var slide = document.querySelectorAll(".slides li")
    currentIdx = 0
   // slideCount = slide.length
   slideCount = 10
    slideWidth=150
    slideMargin=44
    preBtn = document.querySelector(".prev")
    nextBtn = document.querySelector(".next")
    //slides.style.width = '870px';
    slides.style.width = '20000px';
    function moveSlide(num){
        slides.style.left = -num*(slideMargin+slideWidth)+'px';
        currentIdx = num;
    }
    nextBtn.addEventListener("click",function(){
        if(currentIdx !==9){
        moveSlide(currentIdx+1);
    }else{
        moveSlide(0);
        }
    })
    preBtn.addEventListener("click",function(){
        if(currentIdx !==0){
        moveSlide(currentIdx-1);
    }else{
        moveSlide(0);
        }
    })
   


    /* 장애유형, 여행지 선택 */
