
function handleSubmit(event) { //게시글 submit 컨트롤
   
  
    var titleInput = document.getElementsByName("title")[0];
    var selectBox2 = document.getElementsByName("postType")[0];
    var description = document.getElementsByName("editordata")[0];
    

    if (titleInput.value === "" || selectBox2.value === "0" || description.value === "" ) {
        event.preventDefault(); // 폼 제출 기본 동작을 막음
        alert("제목, 내용, 게시글 유형을 모두 입력해주세요!");
      return;
    }

  }

  document.querySelector("#submitButton").addEventListener("click", handleSubmit);
  
  // selectbox 변경 이벤트를 처리하는 함수
  function handleSelectChange() {
    var titleInput = document.getElementsByName("title")[0];
    //var selectBox1 = document.getElementsByName("handicap")[0];
    var selectBox2 = document.getElementsByName("postType")[0];
    var submitButton = document.getElementById("submitButton");
  
    if (titleInput.value !== "" &&  selectBox2.value !== "") {
      submitButton.disabled = false;
    } else {
      submitButton.disabled = true;
    }
  }

 var open = document.querySelector("#openModal");
 var modal = document.querySelector("#modal");
 var searchDiv = document.querySelector(".searchDiv");
 var searchInputField = document.querySelector(".searchInput"); // 변수명 수정
 var sido = document.querySelector("#sido");
 var sigun = document.querySelector("#sigun"); 
 var typeSelect = document.querySelector(".contentTypeSelect"); 
 var modal_body = document.querySelector(".modal_body");
 var placeBt = document.querySelector(".placeBt"); 
 var placeDiv = document.querySelector(".placeDiv"); 
var userClick=false;
var placeN=0;
/*
modal_body.addEventListener("click", function(event) {//이건 뭐더라
    if (!searchDiv.contains(event.target)) {
        clearSearchResults();
    }
});*/

 function openModal() { //모달 open 함수
     modal.classList.add("show");
 }
 
 let searchTimeout;
/*
 searchInputField.addEventListener("blur", function(event) {
    event.stopPropagation()
  });
 searchInputField.addEventListener("click", function(event) {
   
    event.stopPropagation()
   
  });
*/


async function handleSearchInput() {//사용자가 검색할 때 
    clearTimeout(searchTimeout);
    console.log(userClick);
   // if(userClick==false){
    const searchText = searchInputField.value.trim();
        console.log("searchText"+searchText);
    if (searchText === "") {
        
        searchTimeout = setTimeout(async () => {
            clearSearchResults();
            try {
                var temp;
                if(isNaN(parseInt(sigun.value))){
                    temp=0;
                }else{
                    temp = sigun.value;
                }
                const response = await fetch(`/tourApi/${sido.value}/${temp}/${typeSelect.value}.json`);
                const data = await response.json();
    
                clearSearchResults();
                console.log("여기")
                for (const key in data) {
                        const resultElement = document.createElement("p");
                        resultElement.style.width = "100%";
                        resultElement.textContent = data[key].title+("(선택)");
                        resultElement.classList.add("titleP")
                        searchDiv.appendChild(resultElement);
                        resultElement.addEventListener("click", choicePlaceHandle);
                        
                    
                }
            } catch (error) {
                console.error("Error fetching or processing data:", error);
            }
        }, 300); 
        return;
       
    }

    searchTimeout = setTimeout(async () => {
        
        try {
            var temp;
            if(isNaN(parseInt(sigun.value))){
                temp=0;
            }else{
                temp = sigun.value;
            }
            const response = await fetch(`/tourApi/${sido.value}/${temp}/${typeSelect.value}.json`);
            const data = await response.json();

            clearSearchResults();
            
            for (const key in data) {
                if (data[key].title.startsWith(searchText)) {
                    const resultElement = document.createElement("p");
                    resultElement.style.width = "100%";
                    resultElement.textContent = data[key].title+("(선택)");
                    resultElement.classList.add("titleP")
                    searchDiv.appendChild(resultElement);
                    resultElement.addEventListener("click", choicePlaceHandle);
                    
                }
            }
        } catch (error) {
            console.error("Error fetching or processing data:", error);
        }
    }, 300); // 예시로 300ms 딜레이를 준 것입니다.
//}else{
   // clearSearchResults();
//}
    }
    


function clearSearchResults() {//searchDiv내 모든 자식요소 지우는 함수
    while (searchDiv.firstChild) {
        searchDiv.removeChild(searchDiv.firstChild);
    }
    userClick=false;
}

 function textDisable(){//사용자가 시도와 장소타입을 모두 선택했을 때 검색할 수 있게 하는 거 
    console.log(sigun.value);
    if(sido.value!='시/도 선택'&&typeSelect.value!='장소의 타입 선택'){
        searchInputField.disabled = false;

        searchTimeout = setTimeout(async () => {
        
            try {
                var temp;
                if(isNaN(parseInt(sigun.value))){
                    temp=0;
                }else{
                    temp = sigun.value;
                }
                const response = await fetch(`/tourApi/${sido.value}/${temp}/${typeSelect.value}.json`);
                const data = await response.json();
    
                clearSearchResults();
                console.log("여기")
                for (const key in data) {
                        const resultElement = document.createElement("p");
                        resultElement.style.width = "100%";
                        resultElement.textContent = data[key].title+("(선택)");
                        resultElement.classList.add("titleP")
                        searchDiv.appendChild(resultElement);
                        resultElement.addEventListener("click", choicePlaceHandle);
                        
                    
                }
            } catch (error) {
                console.error("Error fetching or processing data:", error);
            }
        }, 300); 

    }else{
        searchInputField.value="";
        searchInputField.disabled=true;
    }
 }

 //취소버튼
  async function placeBtClick() {
    searchInputField.value="";
    modal.classList.remove("show");
    
}
let isDoubleClick = false; //더블클릭 감지 
var array=[];
 async function choicePlaceHandle(event) {//사용자가 장소 선택할 때 
    try {
         if (isDoubleClick) {//더블클릭한 경우 실행하지 않음
            return; 
        }
        isDoubleClick=true;
        console.log(sigun);
        let temp;
        if(isNaN(parseInt(sigun.value))){
            temp=0;
        }else{
            temp = sigun.value;
        }
        const response = await fetch(`/tourApi/${sido.value}/${temp}/${typeSelect.value}.json`);
        const data = await response.json();
       
        for (const key in data) {
            var choicetitle = event.target.textContent.replace("(선택)", "");
           if (data[key].title === choicetitle) {
            var index = array.indexOf(key)
            console.log(index);
              if(index == -1){
                console.log("여기??ㄴ");
                array.push(key);
                placeDiv.insertAdjacentHTML(
                    "beforeend",
                    `<p class="choicePlace">#${choicetitle}<input type="hidden" name="contentID" value=${key} />
                    <input type="hidden" name="contentTitle" value=${encodeURIComponent(data[key].title)} />
                    <input type="hidden" name="contentSido" value=${sido.value} />
                    <input type="hidden" name="contentSigun" value=${sigun.value} />
                    <input type="hidden" name="placecontentType" value=${typeSelect.value} />
                    </p>`)
                    var choicePlaces = document.querySelectorAll(".choicePlace");

                    // 각 .choicePlace 요소에 대해 이벤트 핸들러를 등록합니다.
                    choicePlaces.forEach(function(choicePlace) {
                        choicePlace.addEventListener("click", function(event) {
                            if (event.target.tagName === "P") { // 클릭한 요소가 <p> 태그인 경우
                                placeDiv.removeChild(event.target); // 클릭한 요소를 제거
                            }
                        });
                    });
                    
                
                break;
            }else{
                temp =false
            }
           }
        }
        if (temp===false) {
            alert("이미 선택한 장소입니다!");
            searchInputField.value = "";
            modal.classList.remove("show");
        }else{
            searchInputField.value="";
                    
                    placeN+=1;
                    
                modal.classList.remove("show");
        }
         setTimeout(function() { //클릭한지 2초후 다음 클릭 가능
            isDoubleClick = false;
        }, 2000); 
    } catch (error) {
        console.error("Error fetching or processing data:", error);
    }
    
}
function postTypeChange(){
    console.log(postType.value);
    if(postType.value==='2'){
        if(placeDiv.classList.contains("none")){
            placeDiv.classList.remove("none");
            open.classList.remove("none");
        }
    }else{
        if(!placeDiv.classList.contains("none")){
            placeDiv.classList.add("none");
            open.classList.add("none");
            while (placeDiv.firstChild) {
                placeDiv.removeChild(placeDiv.firstChild);
            }

        }
    }
}
const postType = document.querySelector(".postTypeS");
postType.addEventListener("change", postTypeChange);
 open.addEventListener("click", openModal);
 searchInputField.addEventListener("input", handleSearchInput); // 수정된 함수명 사용
 sido.addEventListener("change",textDisable);
 sigun.addEventListener("change",function test(){
    console.log(sigun.value);
 });
 typeSelect.addEventListener("change",textDisable);
 placeBt.addEventListener("click",placeBtClick);

var choicePlace = document.querySelectorAll(".choicePlace"); 
choicePlace.forEach(function(choicePlace) {
    choicePlace.addEventListener("click", function(event) {
        console.log("dddd!!");
        if (event.target.tagName === "P") {
            placeDiv.removeChild(event.target);
        }
    });
});
 /*
 var choicePlace = document.querySelector(".choicePlace"); 
choicePlace.addEventListener("click", choicePlaceHandle);*/
/*
 var choicePlace = document.querySelector(".choicePlace"); 
                    choicePlace.addEventListener("click", function(event) {
                        if (event.target.tagName === "P") { // 클릭한 요소가 <p> 태그인 경우
                            placeDiv.removeChild(event.target); // 클릭한 요소를 제거
                        }
                    });
*/

 