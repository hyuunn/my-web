
const authClass = document.querySelector(".auth");
const auth1 = authClass.getAttribute("value");
const postDelete = document.querySelector(".postDelete");
/*
console.log(postID);
postDelete.addEventListener("click", confirmDelete);
function confirmDelete(event) {
  if (confirm("게시글을 삭제할까요?")) {
    window.location.href = `/board/delete/${postID}` ;
  }
}
async function checkRecommend(){
$.ajax({
  url: `/contentComment/checkRecommend/${postID}`,
  type: "GET",
  data: {},
  dataType: "JSON",
  success: function(data) {
    console.log(data);
    while (heart.firstChild) {
      heart.firstChild.remove();
    }
    if (data[0].isRecommend == false) {
      heart.insertAdjacentHTML("beforeend", `
      <i class="fa-regular fa-heart fa-xl" style="color: #ffdbdb;" id="recommend-false" value="false"></i>
      <p style="font-size:15px; color:#ffdbdb; display:inline;"><b>+${data[0].recommend}</b></p>
     `)
    } else {
      heart.insertAdjacentHTML("beforeend", `
      <i class="fa-solid fa-heart fa-xl" style="color: #ffdbdb;" id="recommend-true" value="true"></i>
      <p style="font-size:15px; color:#ffdbdb; display:inline;"><b>+${data[0].recommend}</b></p>
     `)
    }

    const recommendButtons = document.querySelectorAll('[id^="recommend"]');
    recommendButtons.forEach((button) => {
      button.addEventListener("click", handleRecommend);
    });
  },
  error: function(error) {
    // 에러 처리
    console.log(error);
  }
});
}
checkRecommend();

function handleRecommend(event) {
  const clickedElement = event.target;
  const recommend = clickedElement.getAttribute("value");
  console.log(recommend);
  if(auth1=="true"){
  $.ajax({
    url: `/contentComment/recommend/post`,
    type: "POST",
    data: {'postID':postID,'recommend':recommend},
    dataType: "JSON",
    success: async function(data) {
      console.log(data)
      if(data.success==true){
      checkRecommend();}
      else{
        window.location.replace('/auth1/login');
      }
    },
    error: function(error) {
      // 에러 처리
      
    }
  });
}
else{
  alert("로그인 후 이용해주세요!");
}
}

*/
function handleCommentSubmit(event) {// 입력하지 않고 확인을 눌렀을 때 
    const textarea= document.querySelector(".commentTextarea");
    if (textarea.value === "" ) {
      event.preventDefault(); // 폼 제출 기본 동작을 막음
      alert("내용을 입력하세요!");
    return;
  }
   }
   document.querySelector(".commentSubmit").addEventListener("click", handleCommentSubmit);
  
  const box = document.getElementById("commentBox");//댓글박스
  
  $.ajax({ //댓글 정보를 읽어서 화면에 출력하는 거 
      url: "/contentComment/comment",
      type: "GET",
      data: {},
      dataType: "JSON",
      success: function(data) {
        // 응답 데이터 처리
        console.log("data");
        console.log(data);
        
        for(let i=0; i<data.length; i++){
          
          let temp ='';
          if(data[i].auth == true){
              temp='<button  class="delete" data-comment-id="${data[i].commentID}" style=" all:unset; color:gray; font-size:12px; text-align:right; margin-right:5px; margin-left:3%;">삭제</button>';
              temp+='<button class="update"style="all:unset;color:gray; font-size:12px; text-align:right; margin-right:5px; ">수정</button>';
            
          }
          if(data[i].parents==0){
          box.insertAdjacentHTML("beforeend",`<div class=${data[i].commentID} style="min-height:80px;  padding-top:10px; display: flex; border-top:0.2px solid rgb(179, 179, 179);">
          <div class="name${data[i].commentID}" style=" flex-basis:23%;"><p style="color:gray;margin-left:20%; font-size:13px;">${data[i].userID}</p></div>
          <div class="description${data[i].commentID}" style=" flex-basis:60%; font-size:13px;">${data[i].description}</div>
          ${temp}
          <button class="recomment"style="all:unset;color:gray; font-size:12px; text-align:right; margin-right:5px; ">답글</button>
          </div>
          <div class="recommentDiv${data[i].commentID}" style="width:80%; margin-left:10%;"><div>`);
          }else{
            const recommentDiv = document.querySelector(`.recommentDiv${data[i].parents}`);
            recommentDiv .insertAdjacentHTML("beforeend",`<div class=${data[i].commentID} style="min-height:80px;  padding-top:10px; display: flex; border-top:0.2px solid rgb(179, 179, 179);">
          <div class="name${data[i].commentID}" style=" flex-basis:23%;"><p style="color:gray;margin-left:20%; font-size:13px;">${data[i].userID}</p></div>
          <div class="description${data[i].commentID}" style=" flex-basis:60%; font-size:13px;">${data[i].description}</div>
          ${temp}
          
          </div>
          `);
          }
        }
        
        //삭제
        const commentDelete = document.querySelectorAll('.delete');
      commentDelete.forEach((button) => {
        button.addEventListener("click", handleDelete);
      });
  
      //수정
      const commentUpdate = document.querySelectorAll('.update');
      commentUpdate.forEach((button) => {
        button.addEventListener("click", handleUpdate);
      });
  
      //닺글
      const recomment = document.querySelectorAll('.recomment');
      recomment.forEach((button) => {
        button.addEventListener("click", handleRecomment);
      });
       
      },
      error: function(error) {
        // 에러 처리
        console.log(error);
      }
    });
  
      //답글 이벤트 핸들러 
    function handleRecomment(event) { 
      console.log(auth1);
      if(auth1=="true"){
      const clickedElement = event.target;
      const parentElement = clickedElement.parentNode;
    
      
      const commentID = parentElement.classList.value;
    
      console.log('클릭한 요소의 댓글 ID:', commentID);
      const recommentDiv = document.querySelector(`.recommentDiv${commentID}`);
    
      console.log(recommentDiv);
    
      recommentDiv.insertAdjacentHTML("afterbegin", `
        <form action="/contentComment/recomment/${commentID}" method="post" style="display: flex; width:100%;">
          
          <textarea class="comment" name="comment"  style="flex-basis:70%; margin-left:10%;height:60px; resize: none; font-size:13px;"></textarea>
          <input  class="updateCancel" type="button" value="취소" style="width:5%; height:5%; position:relative; top:-10px; all:unset; color:gray; font-size:12px; margin-left:3%;" ></input> 
          <input class="updateSubmit" type="submit" value="확인" style="width:5%; height:5%; position:relative; top:-50px; all:unset; font-size:12px; color:gray;margin-left:0.5%;" ></input> 
        </form>
      `);
      }else{
        alert("로그인 후 이용해주세요!");
      }
    
    }
  
    //댓글 삭제 이벤트 핸들러 
    function handleDelete(event) {
      const clickedElement = event.target;
      const parentElement = clickedElement.parentNode;
  
      // 부모 요소의 클래스 값을 가져옵니다.
      const commentID = parentElement.classList.value;
      
    
      console.log('클릭한 요소의 댓글 ID:', commentID);
    
      // AJAX 요청을 통해 서버로 댓글 삭제 요청을 보내고, 성공한 경우 commentContainer를 제거합니다.
      // 예시 코드:
      $.ajax({
         url: `/contentComment/comment/delete/${commentID}`,
         type: "POST",
         success: function(response) {
          location.reload();
  
         },
         error: function(error) {
           console.log(error);
         }
       });
    }
  
    //댓글 수정 이벤트 핸들러 
    function handleUpdate(event) {
      const clickedElement = event.target;
      const parentElement = clickedElement.parentNode;
      //let comment =clickedElement.previousSibling.previousSibling
    
      // 부모 요소의 클래스 값을 가져옵니다.
      const commentID = parentElement.classList.value;
      const commentUpdate = document.querySelectorAll('.update');
      commentUpdate.forEach((button) => {
        button.removeEventListener("click", handleUpdate);
      });
    
      console.log('클릭한 요소의 댓글 ID:', commentID);
      const nameElement = parentElement.querySelector(`.name${commentID}`);
      const descriptionElement = parentElement.querySelector(`.description${commentID}`);
  
    // 이름과 설명의 텍스트 값을 가져옵니다.
      const name = nameElement.textContent;
      
      
      const description = descriptionElement.textContent;
      console.log(description);
      while (parentElement.firstChild) {
        
        parentElement.firstChild.remove();
       }
  
       parentElement.insertAdjacentHTML("beforeend",`
        <form action="/contentComment/comment/update/${commentID}" method="post" style="display: flex; width:100%;">
        <div  style=" flex-basis:23%;"><p style="color:gray;margin-left:20%; font-size:13px;">${name}</p></div>
          <textarea class="comment" name="comment"  style="flex-basis:60%; height:60px; resize: none; font-size:13px;">${description}</textarea>
          <input  class="updateCancel" type="button" value="취소" style="width:5%; height:5%; position:relative; top:-10px; all:unset; color:gray; font-size:12px; margin-left:3%;" ></input> 
          <input class="updateSubmit" type="submit" value="확인" style="width:5%; height:5%; position:relative; top:-50px; all:unset; font-size:12px; color:gray;margin-left:0.5%;" ></input> 
          
        </form>`
          );
  
          const updateCancel = parentElement.querySelector('.updateCancel');
          updateCancel.addEventListener("click", handleUpdateCancel);
        
          const updateSubmit = parentElement.querySelector('.updateSubmit');
          updateSubmit.addEventListener("click", handleUpdateSubmit);
    
    }
  
    function handleUpdateCancel(event) {
      const commentUpdate = document.querySelectorAll('.update');
      commentUpdate.forEach((button) => {
        button.addEventListener("click", handleUpdate);
      });
      location.reload();
    }
    function handleUpdateSubmit(event) {
      const commentUpdate = document.querySelectorAll('.update');
      commentUpdate.forEach((button) => {
        button.addEventListener("click", handleUpdate);
      });
     
    }
  
  