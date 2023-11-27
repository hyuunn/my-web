module.exports = {
    boardMainBody: function () {
        return ` <div class="topDiv">
        <div class="topTitle1">
    
            <p  class="top-title" ><b>✔️ 인기 여행일정 둘러보기</b> </p>
            <div class="writeDiv">
                <div class="writeMenu noDisplay">
                    <p><a href="/board/write_plan/none/none" >- 일정 공유</a></p>
                    <p><a href="/board/write">- 게시글 작성</a></p>
                </div>
                <div class="tri noDisplay"></div>
    
                <i class="fa-solid writeIcon fa-pen-to-square fa-2xl icon hidden2"> </i>
            </div>
        </div>
    
    </div>
    
    </div>
    
    <div class="top planBox container text-center">
        <div class="row gap-3" style="width:100%;"></div>
    </div>
    
    
    <hr>
    <br>
    <div class="bottom-titleDiv" >
        <br>
        <p class="bottom-title"><b>✔️ 인기 게시글 둘러보기</b></p>
    
    </div>
    
    <div class="bottomBox container text-center">
        <div class="row gap-3" ></div>
    </div>
    <br>
    
    
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="/js/board/boardMain.js"></script>`
    },
    // 글쓰는 부분
    boardWriteBody: function (update, choiceD = '', title = '', description = '', handicap = '0', category = '0', choicePlace = '') {

        return `
          <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/sweetalert2@11.4.10/dist/sweetalert2.min.css">
<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11.4.10/dist/sweetalert2.min.js"></script>

          <br>
          <p style="margin-left:10%; font-size:20px;"><b>📝게시글 작성📝</b></>
          <br><br>
          <hr style="margin-left:10%;width:80%;">
          
          <form class="writeform" action="/board/write/post/${update}" method="post" style="width:80%; margin-left:10%; ">
          <label class="title" style="width:3%; margin-bottom:1%;" >제목</label>
          <input type="text" style="width:44%; margin-bottom:1%; margin-right:1%; height:30px; " name="title" value='${title}' maxlength='40' placeholder='제목을 입력하세요(최대 40자)'></input>
                    
                    <label style="width:8%; margin-bottom:2%;">무장애유형</label>
                    <select style="width:16%; margin-bottom:2%; border-color: border-color:#F5F5F5; height:30px;" name="handicap">
                        <option value="0" >선택 하지 않음</option>
                        <option value="1">시각장애</option>
                         <option value="2">청각장애</option>
                        <option value="3">지체장애</option>
                        <option value="4">유아동반</option>
                    </select>
                    <label style="width:8%; margin-bottom:2%; margin-left:1%" >게시글 유형</label>
                    <select class="postTypeS" style="width:16%; margin-bottom:2%; height:30px;" name="postType" >
                        <option value="0" >유형을 선택해주세요</option>
                        <option value="1">자유게시글</option>
                         <option value="2">후기게시글</option>
                        <option value="3">질문게시글</option>
                    </select>
                    <input type="button" class="${choiceD}" id="openModal" value="장소 추가하기"> 
                   <div class="placeDiv ${choiceD}" style="width:100%;" >
                   
                   ${choicePlace}
                   </div>
                    
                    <div class="modal" id="modal">
                      <div class="modal_body">
                      <div class="modal_left">
                      <div class="modal-top" >
                      <h5 style="width:100%; text-align:center;">지역과 장소의 타입을 선택해주세요!</h5>
                      </div>
                      <br>
                      <div class="areaDiv">
          <select  class="areaSelect" name="sido" id="sido" onchange="categoryChange(this)">
              <option >시/도 선택</option>
              <option value="1">서울특별시</option>
              <option value="2">인천광역시</option>
              <option value="3">대전광역시</option>
              <option value="4">대구광역시</option>
              <option value="5">광주광역시</option>
              <option value="6">부산광역시</option>
              <option value="7">울산광역시</option>
              <option value="8">세종특별자치시</option>
              <option value="31">경기도</option>
              <option value="32">강원도</option>
              <option value="33">충청북도</option>
              <option value="34">충청남도</option>
              <option value="35">경상북도</option>
              <option value="36">경상남도</option>
              <option value="37">전라북도</option>
              <option value="38">전라남도</option>
              <option value="39">제주도</option>
          </select>
        
          <select class="areaSelect" name="sigun" id="sigun">
              <option>시/군 선택</option>
          </select>   
          </div>
          <br>
          <select  class="contentTypeSelect" name="contentType" id="contentType" >
              <option>장소의 타입 선택</option>
              <option value="12">관광지</option>
              <option value="14">문화시설</option>
              <option value="28">레포츠</option>
              <option value="38">쇼핑</option>
              <option value="39">식당</option>
          </select>
        
          <br>
         
          <input class="searchInput" type="text"  placeholder="장소 선택" disabled>
          </div>
          <div class="modal_right">
          <h5 style="width:100%; text-align:center; margin-top:75px;">추가할 장소를 선택하세요!</h5>
          <div class="searchDiv"></div>
          <input class="placeBt"type="button" value="취소">
          </div>
                      </div>
                      
                    </div>
                        <textarea style="width:80%;"id="summernote" name="editordata">${description}</textarea>
                        
                        <hr style="width:100%;">
                        <input type="button" value="취소" ></input>
                        <input type="submit" value="확인" id="submitButton" ></input>
                      </form>
          <script>
          var category = document.getElementsByName("postType")[0];
          if(${category}!=''){
            category.selectedIndex =${category};
          }
          var handicap = document.getElementsByName("handicap")[0];
          if(${handicap}!=0){
            handicap.selectedIndex =${handicap};
          }
           
          
          </script>
          <script src='/areacode/js/chungbuk.js'></script>
    <script src='/areacode/js/chungnam.js'></script>
    <script src='/areacode/js/gangwon.js'></script>
    <script src='/areacode/js/gyeonggi.js'></script>
    <script src='/areacode/js/gyeongbuk.js'></script>
    <script src='/areacode/js/gyeongnam.js'></script>
    <script src='/areacode/js/jeonbuk.js'></script>
    <script src='/areacode/js/jeonnam.js'></script>
    
    <script src="/js/selectLoca.js"></script>
          <script src="/js/board/write.js"></script>
          <script src="/js/board/post_summernote.js"></script>

`;

    },
    // $(document).ready(function() {
    //     if (${update}) {
    //         // 글 수정하는 부분 summernote 세팅
    //         $('#summernote').summernote({
    //             height: 400,
    //             minHeight: null,
    //             maxHeight: null,
    //             focus: true,
    //             lang: 'ko-KR', // 기본 메뉴언어 US->KR로 변경
    //             callbacks: {
    //                 onImageUpload: function(files) {
    //                     uploadSummernoteImageFile(files[0], this);
    //                 }
    //             }
    //         });
    
    //         $('#summernote').summernote('code', '${description}');
    //     } else {
    //         // 글 쓰는 부분 summernote 세팅
    //         $('#summernote').summernote({
    //             placeholder: '내용을 작성해주세요',
    //             height: 500,
    //             callbacks: {
    //                 onImageUpload: function(files) {
    //                     uploadSummernoteImageFile(files[0], this);
    //                 }
    //             }
    //         });
    //     }
    // });
    
    // function uploadSummernoteImageFile(file, editor) {
    //     var data = new FormData();
    //     data.append("file", file);
    
    //     $.ajax({
    //         data: data,
    //         type: "POST",
    //         url: "/board/uploadSummernoteImageFile",
    //         contentType: false,
    //         processData: false,
    //         success: function(data) {
    //             console.log("gg");
    //             // 항상 업로드된 파일의 URL이 있어야 합니다.
    //             $(editor).summernote('insertImage', data.url);
    //         }
    //     });
    // }
    //게시글 출력 부분
    //display는 자기 게시글이면 수정 글씨 보이게 
    boardPostBody: function (title, date, description, id, postID, declare = '', display = '', auth, choicePlace = '', report, js) {
        if(report == true){ // 글 작성자 =/= 로그인한 사용자
            report = `
            <button class="more_btn"><i class="fa-solid fa-ellipsis-vertical"></i></button>
            <div id="report">
                <button onclick="window.open('http://localhost:3000/board/report/${postID}', '_blank', 'width=500, height=500');">신고하기</button>
            </div>`;
        } else {
            report = '';
        }

        return `
        <div class="container-md h-auto">
        <div class="post_header">
            <h6><a href="/board/list">게시글 목록</a></h6>
            <h4><b>${title}</b></h4>
            <p id="userID">${id}</p>
            <p id="date">${date}</p>
            ${report}
            <div id="choicePlace"> ${choicePlace}</div>
        </div>

        <div id="content_wrap">
                <div id="content" style="min-height:300px;">${description}</div>
        </div>
            <div class="heart" value="${postID}">
                <i class="fa-regular fa-heart fa-xl" style="color: #ffdbdb;"></i>
            </div>
            <button class="ud" name="postID" style="display:${display};" onclick="deletePost(${postID});">삭제</button>

            <p class="ud" style="display:${display}; "><a href="/board/write/${postID}">수정</a></p>
            <hr style="width:100%">
            
            <form action="/board/commentinsert/normal/${postID}" method="post">
                <textarea class="commentTextarea" name="comment" placeholder="답글을 달아보세요!"></textarea>
                <input class="commentSubmit" type="submit" value="확인"></input> 
            </form>

            <br>
            <div id="commentBox" style="width:90%; margin-left:5%; display: flex; flex-direction: column; ">
                <div class="auth" style="display:none;" value="${auth}"><div>
            </div>
        <hr>
    </div>

        
        <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
        ${js}
        
        
        `;

    },

    /*
    postList: function (lists, postCategory, regionSelect) {  // 게시글 목록 페이지
      var category = '카테고리';
      if(regionSelect != ''){
          category = '지역';
      } 
      return `
      <div class="container-md h-auto">
          <div class="content">
              <div class="board_header">
                  <h5><a href="/board">게시글 목록</a></h5>
                  <hr>
                  ${postCategory}
                  <ul class="tabnav" id="barrier_cate">
                      <li><button id="b_all" class="active">전체</button></li>
                      <li><button id="eye">👁 시각장애</button></li>
                      <li><button id="ear">👂 청각장애</button></li>
                      <li><button id="body">👩‍🦼 지체장애</button></li>
                      <li><button id="baby">🤱 영유아 동반</button></li>
                  </ul>
                  ${regionSelect}
                  <div id="search">
                      <select name="search_target" onchange="searchTarget(this)">
                          <option value="whole">전체</option>
                          <option value="title">제목</option>
                          <option value="content">내용</option>
                      </select>
                      <input type="text" name="keyword">
                      <input type="button" value="검색" onclick="searchKeyword()">
                  </div>
              </div>
              <div class="post_list">
                  <table>
                      <thead>
                          <tr>
                              <th class="narrow">번호</th>
                              <th class="narrow">${category}</th>
                              <th class="narrow">무장애유형</th>
                              <th class="wide">제목</th>
                              <th class="narrow">날짜</th>
                              <th class="narrow">작성자</th>
                              <th class="narrow">조회</th>
                              <th class="narrow">좋아요</th>
                          </tr>
                      </thead>
                      <tbody>
                          ${lists}
                      </tbody>
                  </table>
                  <button id="write_btn" onclick="location.href='/board/write_plan/false/false'">✏️ 글쓰기</button>
  
                  <div class="page_buttons"></div>
              </div>
              
          </div>
         
      </div>
      <script src="/js/board/boardList.js"></script>
      <script src="/js/pagination.js"></script>
      `
  }, 
  lists: function (result) {  // 게시글 목록
      var post_cate = ["전체", "자유", "후기", "Q&A"];
      var barrier_cate = ["시각장애", "청각장애", "지체장애", "영유아 동반"];
      var post_cateNum = result.category;
      var barrier_cateNum = result.barrier_category;
      var barrier = '';
  
      if (barrier_cateNum == null)
          barrier = '없음';
      else
          barrier = barrier_cate[barrier_cateNum];
  
      function getDt(dt) { // yy.mm.dd
          const temp = new Date(dt);
          const year = temp.getFullYear();
          const month = temp.getMonth() + 1;
          const date = temp.getDate();
  
          return `${year - 2000}.${month >= 10 ? month : '0' + month}.${date >= 10 ? date : '0' + date}`;
      }
  
      var date = getDt(result.date);
      return `
      <tr>
          <td class="narrow">${result.postID}</td>
          <td class="narrow">${post_cate[post_cateNum]}</td>
          <td class="narrow">${barrier}</td>
          <td class="wide"><a href="/board/post/${result.postID}">${result.title}</a></td>
          <td class="narrow">${date}</td>
          <td class="narrow">${result.userID}</td>
          <td class="narrow">${result.views}</td>
          <td class="narrow">${result.recommend}</td>
      </tr>
      `}*/
}

/*
<div style="margin-left:10%; width:80%">
        <br><br>
        <p style="   width:100%; font-size:20px; text-align:center; "><b>${title}</b><p/>
          
        <p style="color:gray; font-size:12px; text-align:right; ">${id}</p>
        <p style="color:gray; text-align:right; font-size:12px; ">${date}</p>
        
       
       
        <hr style="">

        <div stype="display:inline;"> ${choicePlace}<div>
        <div style="min-height:300px;">
        
        ${description}
        </div>
        <div class="post_bottom">
        <div class="heart" value="${postID}">

        <i class="fa-regular fa-heart fa-xl" style="color: #ffdbdb;"></i>
        </div>
        <div>
        <p  class="declare" style="color:gray; font-size:12px; display:inline; display:${declare} ">신고</p>
        <p style="color:gray; font-size:12px; display:inline;  display:${display}; "><a href="/board/write/${postID}">수정</a></p>
        <p style="color:gray; font-size:12px; display:inline; text-align:right; display:${display}; "><a href="#" class="postDelete">삭제</a></p>
        </div>
        </div>
        <div class="modal" id="modal">
    <div class="modal_body">
        <div class="modal_top">
        <i class="fa-solid fa-xmark fa-xl" style="color: #a3a3a3;"></i>
        </div>
    
    </div>
    
  </div>
        <hr style="">
        
        <form action="/board/commentinsert/${postID}" method="post">
        
        
            <textarea class="commentTextarea" name="comment" placeholder="답글을 달아보세요!" style="width:80%; margin-left:7%; height:60px; resize: none; font-size:13px;"></textarea>
            <input class="commentSubmit" type="submit" value="확인" style="width:5%; position:relative; top:-10px;  all:unset; font-size: 14px; color:gray;" ></input> 
            
        </form>

        <br>
        <div id="commentBox" style="width:90%; margin-left:5%; display: flex; flex-direction: column; ">
        <div class="auth" style="display:none;" value="${auth}"><div>

        
        
        </div>
        <hr style="">
*/