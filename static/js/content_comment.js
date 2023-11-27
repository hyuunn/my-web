
const authClass = document.querySelector(".auth");
const auth1 = authClass.getAttribute("value");
const postDelete = document.querySelector(".postDelete");


function handleCommentSubmit(textarea) {// 입력하지 않고 확인을 눌렀을 때 
   // const textarea= document.querySelector(".commentTextarea");
    if (textarea.value === "" ) {
      event.preventDefault(); // 폼 제출 기본 동작을 막음
      alert("내용을 입력하세요!");
    return;
  }
   }

   const textarea= document.querySelector(".commentTextarea");
   document.querySelector(".commentSubmit").addEventListener('click', () =>  handleCommentSubmit(textarea));
   //document.querySelector(".commentSubmit").addEventListener("click", handleCommentSubmit(comment));
  
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
              temp=`<button  class="delete" data-comment-id="${data[i].commentID}" >삭제</button>`;
              temp+='<button class="update">수정</button>';
            
          }
          if(data[i].parents==0){
          box.insertAdjacentHTML("beforeend",`<div class=${data[i].commentID} id="commentID">
          <div class="name${data[i].commentID}"><p>${data[i].userID}</p></div>
          <div class="description${data[i].commentID}" >${data[i].description}</div>
          <div class="updateBtn">
          ${temp}
          <button class="recomment">답글</button>
          </div>
        </div>
        <p class="comment_time">${data[i].date}</p>
          <div class="recommentDiv${data[i].commentID}"><div>`);
          }else{
            const recommentDiv = document.querySelector(`.recommentDiv${data[i].parents}`);
            recommentDiv .insertAdjacentHTML("beforeend",`<div class=${data[i].commentID} id="commentID">
            <div class="name${data[i].commentID}" ><p>${data[i].userID}</p></div>
            <div class="description${data[i].commentID}">${data[i].description}</div>
            <div class="updateBtn">
            ${temp}
            </div>
            </div>
            <p class="comment_time">${data[i].date}</p>
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
        /*****************************이거 추가함 */
      const updateAction = document.querySelectorAll('.update');
      updateAction.forEach((button) => {
        button.removeEventListener("click", handleUpdate);
      });

      const recommentAction = document.querySelectorAll('.recomment');
      recommentAction.forEach((button) => {
        button.removeEventListener("click", handleRecomment);
      });
        /*********************************** */
      const clickedElement = event.target;
      const parentElement = clickedElement.parentNode.parentNode;
    
      
      const commentID = parentElement.classList.value;
    
      console.log('클릭한 요소의 댓글 ID:', commentID);
      const recommentDiv = document.querySelector(`.recommentDiv${commentID}`);
    
      console.log(recommentDiv);
    
      recommentDiv.insertAdjacentHTML("afterbegin", `
        <form action="/contentComment/recomment/${commentID}" class="recommentForm" method="post">
          
          <textarea class="comment" name="comment"  ></textarea>
          <input  class="recommentCancel" type="button" value="취소"  ></input> 
          <input class="recommentSubmit" type="submit" value="확인"  ></input> 
        </form>
      `);
      //********************** 이거 추가함 위에 !!!취소 확인 버튼 클래스명 변경 */
      const recommentCancel = document.querySelectorAll('.recommentCancel');
      recommentCancel.forEach((recommentCancel) => {
        recommentCancel.addEventListener("click", handleUpdateCancel);
      
      });
      var textarea = document.querySelector('.comment');
      document.querySelector(".recommentSubmit").addEventListener('click', () =>  handleCommentSubmit(textarea));
     
    
  
      //닺글
  
      }else{
        alert("로그인 후 이용해주세요!");
      }
    
    }
  
    //댓글 삭제 이벤트 핸들러 
    function handleDelete(event) {
      const clickedElement = event.target;
      const parentElement = clickedElement.parentNode.parentNode;
  
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
      const parentElement = clickedElement.parentNode.parentNode;
      //let comment =clickedElement.previousSibling.previousSibling
    
      // 부모 요소의 클래스 값을 가져옵니다.
      const commentID = parentElement.classList.value;
      const commentUpdate = document.querySelectorAll('.update');
      commentUpdate.forEach((button) => {
        button.removeEventListener("click", handleUpdate);
      });

      //*********************&***********이거 추가함  */
      const recommentUpdate = document.querySelectorAll('.recomment');
      recommentUpdate.forEach((button) => {
        button.removeEventListener("click", handleRecomment);
      });

      //******************************************************** */
    
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
        <form action="/contentComment/comment/update/${commentID}" method="post" class="updateForm">
        <div class="updateDiv" ><p class="updateName">${name}</p></div>
          <textarea  name="comment"  id="updateTA">${description}</textarea>
          <input  class="updateCancel" type="button" value="취소"  ></input> 
          <input class="updateSubmit" type="submit" value="확인"  ></input> 
          
        </form>`
          );
  
          const updateCancel = parentElement.querySelector('.updateCancel');
          updateCancel.addEventListener("click", handleUpdateCancel);
        
          var textarea = document.querySelector('#updateTA');
      document.querySelector(".updateSubmit").addEventListener('click', () =>  handleCommentSubmit(textarea));
     
    
    }
  
    function handleUpdateCancel(event) {
     

      location.reload();
    }
    
  