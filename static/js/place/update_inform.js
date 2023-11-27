console.log("g")
let cancelBt = document.querySelector("#cancel");
let title = document.querySelector(".title")
let submit = document.querySelector(".submit")
let description = document.querySelector(".description")
let hidden = document.querySelector(".hidden")

//주소에서 지역코드와 타입 콘텐츠 아이디 읽어오는 부분

const currentPath = window.location.pathname;
const path = currentPath.split('/');
sido = path[3];
sigun = path[4];
contentId = path[6];
contentType = path[5];
console.log(path[3]);


//상단의 장소 이름 나타내는 부분
fetch(`/tourApi/${sido}/${sigun}/${contentType}.json`)
.then((response) => response.json())
.then(data => {
    console.log(data[contentId].title)
    title.innerHTML=`<b>#${data[contentId].title}</b>`
    hidden.value = data[contentId].title;
    
})

//취소버튼 눌렀을 때 
cancelBt.addEventListener("click",cancelBtHandle);
function cancelBtHandle(){
    console.log("g")
    window.location.href=`/place/content/${sido}/${sigun}/${contentType}/${contentId}`
}

// submit 버튼을 눌렀을 때 제어 
submit.addEventListener("click",submitBtHandle)
function submitBtHandle(event){
    console.log(description.value);
    if(description.value.length<30){
        event.preventDefault();
        alert("내용을 30자 이상 입력해주세요!")
    }
    else{
        alert("소중한 의견 감사합니다!")
    }
}

