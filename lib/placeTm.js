module.exports = {
  placeMainBody:function(){
      return `<section>
      <p class="mentP" id="text_hidden"><b>Let's go <br>&nbsp;&nbsp;&nbsp;&nbsp;on a trip<br>&nbsp;together!</b></p>
      <h2 class="ment" id="text_hidden" ><b>여행이 필요할 때, 언제 어디든</b></h2>
      <div class="choiceDiv">
          <form method="post" action="/place/creatTypeCookies">
          <p class="formTitle">무장애 유형과 여행지를 선택해보세요!</p>
          
          <div class="handitypeDiv">
             
          
          <input name="type" type="radio" id="handicap"  name="type" value="handicap" ><label for="handicap" class="handicapRadio" ><img  id="text_hidden" src="/img/handicap.png"><span class="hidden hidden2 radioLabel">지체장애</span></label></input>
          <input name="type" type="radio" id="blind"  name="type" value="blindhandicap" ><label for="blind"class="blindRdio" ><img id="text_hidden" src="/img/eye.png" ><span class="hidden hidden2 radioLabel">시각장애</span></label ></input>
          <input name="type" type="radio" id="hearing"  name="type" value="hearinghandicap" ><label for="hearing" class="hearingRadio" ><img id="text_hidden" src="/img/hearinghadicap.png"><span class="hidden  hidden2 radioLabel">청각장애</span></label></input>
          <input name="type" type="radio" id="family"  name="type" value="infantsfamily" ><label for="family" ><img id="text_hidden" src="/img/infantsfamily.png"><span class="hidden hidden2 radioLabel">영유아동반</span></label></input>
          
      
      </div>
          <div class="areaDiv">
              <select class="areaSelect" name="sido" id="sido" onchange="categoryChange(this)" required>
                  <option>시/도 선택</option>
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
            
              <select class="areaSelect" name="sigun" id="sigun" >
                  <option>시/군 선택</option>
              </select>   
              </div>
              <input type="submit" class="submit" value="검색🔍">
  </form>
      </div>
      <p class="top10Title"><b><i>인기여행지</i></b></p>
      <p class="top10Title1"><b><i>TOP 10</i></b></p>
      <svg class="wave hidden" id="text_hidden" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="#000000" fill-opacity="1" d="M0,224L48,192C96,160,192,96,288,112C384,128,480,224,576,261.3C672,299,768,277,864,240C960,203,1056,149,1152,144C1248,139,1344,181,1392,202.7L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path></svg>
      <svg class="wave hidden2" id="text_hidden"  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="#f0f8ff" fill-opacity="1" d="M0,224L48,192C96,160,192,96,288,112C384,128,480,224,576,261.3C672,299,768,277,864,240C960,203,1056,149,1152,144C1248,139,1344,181,1392,202.7L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path></svg>
  </section>
  
  <br>
  
  <br>
 
  
  <div class="slide_wapper">
        <ul class="slides">
            
            
        </ul>
        
    </div>
    <p class="controls">
        <span class="prev"><</span>
        <span class="next">></span>
    </p>
  
    
    </div>
  
    
    <style>
      /*@font-face {
    font-family: 'neon';
    src: url('/font/나눔손글씨\ 다시\ 시작해.ttf') format('truetype');
  }*/
  
  /*여기서부터*/
  
  
    </style>
    <script>
    document.addEventListener('DOMContentLoaded', function () {
      // 두 번째 input 엘리먼트 가져오기
      var enter1 = document.querySelector('#handicap');
      var enter2 = document.querySelector('#hearing');
      var enter3 = document.querySelector('#blind');
      var enter4 = document.querySelector('#family');
     

      // 두 번째 input에서 키 다운 이벤트 감지
      enter1.addEventListener('keydown', enterSubmit);
      enter2.addEventListener('keydown', enterSubmit);
      enter3.addEventListener('keydown', enterSubmit);
      enter4.addEventListener('keydown', enterSubmit);
      function enterSubmit (e) {
        // 엔터 키일 경우
        if (e.key === 'Enter') {
          // 폼 제출 방지
          e.preventDefault();
          if (document.activeElement.type === 'radio') {
            // 라디오 버튼 선택
            document.activeElement.checked = true;
          }
        }
      }
    });
  </script>
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
  
    <script src='/areacode/js/chungbuk.js'></script>
    <script src='/areacode/js/chungnam.js'></script>
    <script src='/areacode/js/gangwon.js'></script>
    <script src='/areacode/js/gyeonggi.js'></script>
    <script src='/areacode/js/gyeongbuk.js'></script>
    <script src='/areacode/js/gyeongnam.js'></script>
    <script src='/areacode/js/jeonbuk.js'></script>
    <script src='/areacode/js/jeonnam.js'></script>
    <script src="/js/place/top10.js"></script>
    <script src="/js/selectLoca.js"></script>
    `;
  },
  place_inform:function(js){
      return `<div  class="top_menu" style="margin-left:30%;  width:100%; height: 40px;  display: inline; ">
    
      <ul class="menu typeMenu"  > <!--메뉴바-->
        
      </ul>
      <div class="searchBox">
      </div>
      <ul class="typeMenuUl menu"  > <!--메뉴바-->
      <li class="handiType"> </li>
      
        <li class="area"> </li>
        <li>▼</li>
       
      </ul>
      </div>
      
      <div class="changeType">
      
        <form method="post" action="/place/creatTypeCookies">
          
          <p class="changeTypeTitle">✏️ 입력 정보를 수정해볼까요?<p>
          <div class="handitypeDiv" >
          <input name="type" type="radio" id="handicap" name="type" value="handicap" ><label for="handicap"><span class="hidden text_label">지체장애</span><img src="/img/handicap.png" class="hidden2"></label></input>
          <input name="type" type="radio" id="blind" name="type" value="blindhandicap" ><label for="blind"class="blindRdio"><span class="hidden text_label">시각장애</span><img src="/img/eye.png" class="hidden2"></label ></input>
          <input name="type" type="radio" id="hearing" name="type" value="hearinghandicap" ><label for="hearing" class="hearingRadio"><span class="hidden text_label">청각장애</span><img src="/img/hearinghadicap.png" class="hidden2"></label></input>
          <input name="type" type="radio" id="family" name="type" value="infantsfamily" ><label for="family"><span class="hidden text_label">영유아동반</span><img src="/img/infantsfamily.png" class="hidden2"></label></input>
           
         
          </div>
          <div class="areaDiv">
          <select class="areaSelect" name="sido" id="sido" onchange="categoryChange(this)" >
              <option>시/도 선택</option>
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
        
          <select class="areaSelect" name="sigun" id="sigun" >
              <option>시/군 선택</option>
          </select>   
          </div>
          <button class="changeBt" type="submit" >변경🔍</button>
        </form>
        
      </div>
      
  
      <hr style="width:90%; margin-left:5%; height:0.5px; background-color:gray;">
      <div class="searchDiv">
        <input type="textarea" class="searchTA"></input>
        <input type="button"  value='검색' class="searchBT"></input>
      </div> 
      <div class="container text-center ">
         
            <div class="row gx-6" id="card">
            
            </div>
          
          </div>
          
     
  <button class="plus "><span class="hidden">더보기</span><i class="fa-solid fa-chevron-down plusIcon"></i></button>
  <button class="plus2 "><span class="hidden">더보기</span><i class="fa-solid fa-chevron-down plusIcon"></i></button>
       
  <script>
    document.addEventListener('DOMContentLoaded', function () {
      // 두 번째 input 엘리먼트 가져오기
      var enter1 = document.querySelector('#handicap');
      var enter2 = document.querySelector('#hearing');
      var enter3 = document.querySelector('#blind');
      var enter4 = document.querySelector('#family');
     

      // 두 번째 input에서 키 다운 이벤트 감지
      enter1.addEventListener('keydown', enterSubmit);
      enter2.addEventListener('keydown', enterSubmit);
      enter3.addEventListener('keydown', enterSubmit);
      enter4.addEventListener('keydown', enterSubmit);
      function enterSubmit (e) {
        // 엔터 키일 경우
        if (e.key === 'Enter') {
          // 폼 제출 방지
          e.preventDefault();
          if (document.activeElement.type === 'radio') {
            // 라디오 버튼 선택
            document.activeElement.checked = true;
          }
        }
      }
    });
  </script>
  
  <script type="text/javascript" src="//dapi.kakao.com/v2/maps/sdk.js?appkey=23e8098caa8eb8171e1c91663bb084a7"></script>
  <script src="https://kit.fontawesome.com/5b6033a2e2.js" crossorigin="anonymous"></script>
  <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
  ${js}
  <script src='/areacode/js/chungbuk.js'></script>
  <script src='/areacode/js/chungnam.js'></script>
  <script src='/areacode/js/gangwon.js'></script>
  <script src='/areacode/js/gyeonggi.js'></script>
  <script src='/areacode/js/gyeongbuk.js'></script>
  <script src='/areacode/js/gyeongnam.js'></script>
  <script src='/areacode/js/jeonbuk.js'></script>
  <script src='/areacode/js/jeonnam.js'></script>
  
  <script src="/js/selectLocation.js"></script>
  <script>
  $("#myInput").click(function() {
  $("#mymodal").modal("show");
  });
  </script>
  

`
  },
 

  content_inform:function(js,content,auth){
    return `
    
    <div class="top">
    <p class="title"><b></b></p>
    <div class="bookmark">
    <p class="bookmarkP"><button class="hidden">북마크</button><i class="fa-regular fa-bookmark fa-2xl hidden2" value="delete" style="color: #ccdfff;"></i></p>
    </div>
    <hr style="width:90%; margin-left:5%; height:0.5px; background-color:gray;">
</div>

<div class="section">
    <div class="sideMenu hidden2">
        <div class="sideInform">
        <p style="font-size:18px;"><b>• 기본 정보</b></p>
        </div>
        <div class="sideHandi">
        <p style="font-size:18px;"><b>• 무장애<br> &nbsp;&nbsp;편의정보</b></p>
        </div>
        <div class="sideMap">
        <p style="font-size:18px;"><b>• 교통 <br> &nbsp;&nbsp;편의 정보</b></p>
        </div>
        <div class="sidePost">
            <p style="font-size:18px;"><b>• 후기글</b></p>
        </div>

    </div>
    <br>
    <div class="main">
  
    
        <div class="title2">
            <h5><b>기본정보</b></h5>
            <p id="informIcon">
              <i class="informUp fa-solid fa-chevron-up upImage" ></i>
              
            </p>
            
        </div>
        <hr class="informHr">
        <div class="inform">
            <div class="summary"></div>
            <div class="detail">
                <table border="1" class="table">
                </table>
            </div>
            <br>
        </div>
    </div>
    <br>
    <div class="main">
        <div class="title2">
            <h5><b>무장애 편의정보</b></h5>
            
            <div >
            <button class="updateBT"><i class="fa-solid fa-pen" style="color: #6b6b6b;"></i>   무장애 편의정보 수정/신규 요청</button> 
            <p id="handiIcon">
              <i class="fa-solid fa-chevron-up upImage" ></i>
             
            </p>

            </div>
        </div>

        <hr class="handiHr">
        <div class="handicap">
        
            <div class="handi"></div>
        </div>
    </div>
    <br>
    <div class="main">
        <div class="title2">
            <h5 ><b>지도</b></h5>
            
            <p id="mapIcon"><i class="fa-solid fa-chevron-up upImage" ></i></p>
            
        </div>
        <hr class="mapHr">
        <div class="mapDiv">
            <table></table>

            <div class="mapAddr">
              <h6 class="addr"></h6>
            </div>
            <div id="map" style="width:60%;height:400px; margin-left:20%;"></div>
        </div>
        <br>
        
    </div>
    <br>
  <div class="main">
    <div class="title2">
      <h5><b>후기 게시글</b></h5>
      <p class="reviewIcon">
        <i class="fa-solid fa-chevron-up upImage" ></i>
      </p>
    </div>
    <hr class="reviewHr">
    <div class="reviewDiv" id="reviewDiv" >
      <div class="reviewTop">
         
      </div>
      <div class="reviewD"></div>
    </div>
  <br>
</div>


  </div>
</div>
</div>
<br>
<hr>
<div style="width:80%; margin-left:10%;">
  <form  class="content_comment_form" action="/contentComment/commentinsert/${content}" method="post">
          
          
    <textarea class="commentTextarea" name="comment" maxlength='500' placeholder="답글을 달아보세요!(500자 제한)" ></textarea>
    <input class="commentSubmit" type="submit" value="확인" ></input> 

  </form>

  <br>
  <div id="commentBox" style="width:90%; margin-left:5%; display: flex; flex-direction: column; ">
    <div class="auth" style="display:none;" value="${auth}"></div>

  </div>
  <hr style="">
</div>
<script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>


<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
<script type="text/javascript" src="//dapi.kakao.com/v2/maps/sdk.js?appkey=23e8098caa8eb8171e1c91663bb084a7"></script>
${js}

    `
  },

update_infom(js){
  return`
  
  <div class="main">
  <form action="/place/update/inform" method="post" enctype="multipart/form-data">
  <h6 class="title"><b>#제주어쩌고마을</b></h6>
  <h3><b>무장애 편의정보 신규/수정 요청</b></h3>
  <input type="hidden" class="hidden" name="title"></input>
  <hr>
  
  <textarea class="description" name="description" style="width: 100%;" placeholder="현재 제공되고 있는 정보와 다르거나, 새로 추가할 정보가 있다면 입력해주세요."></textarea>
  <br>
  <br>
  <div class="imgUploadDiv">
      <input type="file" id="imageUpload" name="image" accept="image/*" multiple></input>
      
  </div>
  <p class="ment">*한 장의 사진만 업로드 할 수 있습니다.</p>
  
  <div class="file-list"></div>
  
  <div class="submit">
  <input type="button" id="cancel" value="취소"></input>
  <input type="submit" id="submit" class="submit"  value="제출"></input>
  
  <div>
</form>
  </div>
  ${js}
  
  `
  },

 test:function(js){
    return `
    
<h2>kakao</h2>
<textarea class="ta"></textarea>
${js}`
}
}

