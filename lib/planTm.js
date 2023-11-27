module.exports = {
    planMain: function(scheBox, popular){
        return `
            <div class="container-fluid">
                <div class="px-5 pt-5 rounded-3 content">
                    <div class="container">
                        <h1 class="title">아직 여행 계획이 없으시군요</h1>
                        <h5 class="title">Traveler와 함께 여행을 계획해보세요!</h5>
                        <button id="create">일정 만들기</button>
                        ${scheBox}
                    </div>
                </div>
                
                <div class="content">
                ${popular}
                </div>
            </div>
            <script src="/js/default.js"></script>
            <script src="/areacode/js/gyeonggi.js"></script>
            <script src="/areacode/js/gangwon.js"></script>
            <script src="/areacode/js/chungbuk.js"></script>
            <script src="/areacode/js/chungnam.js"></script>
            <script src="/areacode/js/gyeongbuk.js"></script>
            <script src="/areacode/js/gyeongnam.js"></script>
            <script src="/areacode/js/jeonbuk.js"></script>
            <script src="/areacode/js/jeonnam.js"></script>
            <script src="/js/selectLoca.js"></script>
            <script src="/js/place/top10.js"></script>

        `;
    }, scheBox:function(){
        return `
        <form action="/plan/create_process" method="post" id="scheBox">
            <div id="when">
                <p>언제 떠나시나요?</p>
                <input type="date" name="startDate" data-placeholder="가는 날" required aria-required="true">
                <input type="date" name="endDate" data-placeholder="오는 날" required aria-required="true">
            </div>
            <div id="where">
                <p>어디로 떠나시나요?</p>
                <select name="sido" id="sido" onchange="categoryChange(this)">
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
                <select name="sigun" id="sigun">
                    <option>시/군 선택</option>
                </select>
                <button type="submit" class="save_btn" style="margin-left:10px;">저장</button>
            </div>
        </form>
        `;
    }, popular:function(){
        return `
        <div id="popular">
            <h5>최근 한 달 간 사람들이 많이 찾은 여행지 👀</h5>
            <div id="top10">
                <div class="slide_wapper">
                    <ul class="slides"></ul>
                </div>
                <p class="controls text_hidden">
                    <span class="prev"><</span>
                    <span class="next">></span>
                </p> 
            </div>
        </div>
        `;
    },
    planList:function(scheBox, list, nickname){
        return `
        <div class="container">
            <div id="intro">
                <h3>${nickname}님, 여행을 준비하세요!</h3>
            </div>
            <div class="pList">
                ${list}
            </div>
            <button id="create">+ 새로운 여행 일정 만들기</button>
            ${scheBox}
            <div id="scheduler">
                <p>🎈 여행 일정을 달력에서 확인해보세요 🎈</p>
                <div id="calendar">
                    
                </div>
            </div>
        </div>
         
        <script src="/js/navbar.js"></script>    
        <script src="/js/plan/planList.js"></script>
        <script src="/areacode/js/gyeonggi.js"></script>
        <script src="/areacode/js/gangwon.js"></script>
        <script src="/areacode/js/chungbuk.js"></script>
        <script src="/areacode/js/chungnam.js"></script>
        <script src="/areacode/js/gyeongbuk.js"></script>
        <script src="/areacode/js/gyeongnam.js"></script>
        <script src="/areacode/js/jeonbuk.js"></script>
        <script src="/areacode/js/jeonnam.js"></script>
        <script src="/js/selectLoca.js"></script>
        `;
    },list:function(result, d_day){
        var html = `
        <div class="list">
         <div class="card" style="width: 18rem; height: 15rem;">
            <div class="card-body">
                <h5 class="card-title">${result.title}</h5>
                <h6 class="card-subtitle mb-2 text-muted">
                    <span class="start">${result.startDate}</span> <span>~</span> 
                    <span class="end">${result.endDate}</span></h6>
                <p>${d_day}</p>
                <a href="/plan/detail/${result.planID}" class="card-link" class="align-self-end">일정 짜러 가기 🏃‍♀️</a>
                
                <form action="/plan/delete_process/${result.planID}" onsubmit="return confirm('일정을 삭제하겠습니까?')" method="post">
                    <br>
                    <button>삭제</button>
                </form>
            </div>
         </div>
        </div>
        `
        return html;
    },
    planDetail:function(result, startDate, endDate, d_day, scheTable, bm_list, mode){
        if (mode == 'text'){    // 텍스트보기
            var change_order = 'updatePlan();';
        } else {
            var change_order = 'setOrder();';
        }
        return `
        <div class="container">
            <div id="title">
                
                <h2>${result.title}<button class="btn" id="btn-update">편집</button></h2>
                <p id="loca" style="display:none;">${result.location}</p>
                <div class="u-box" id="update">
                    <div class="content">
                        <button id="u-location">여행 지역 수정</button>
                        <div class="u-box" id="where">
                            <form action="/plan/update/location/${result.planID}" method="post">
                                <select name="sido" id="sido" onchange="categoryChange(this)">
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
                                <select name="sigun" id="sigun">
                                    <option>시/군 선택</option>
                                </select>
                                <input type="submit" value="저장">
                            </form>
                        </div>
                        <button id="u-date">여행 날짜 수정</button>
                        <div class="u-box" id="when">
                            <form action="/plan/update/date/${result.planID}" method="post">
                                <input type="date" name="startDate" data-placeholder="가는 날" required aria-required="true">
                                <input type="date" name="endDate" data-placeholder="오는 날" required aria-required="true">
                                <input type="submit" value="저장">
                            </form>
                        </div>
                        <button id="u-title">여행 제목 설정</button>
                        <div class="u-box" id="w-title">
                            <form action="/plan/update/title/${result.planID}" method="post">
                                <input type="text" name="title" placeholder="${result.title}">
                                <input type="submit" value="저장">
                            </form>
                        </div>
                        <form action="/plan/delete_process/${result.planID}" onsubmit="return confirm('일정을 삭제하겠습니까?')" method="post">
                            <input type="submit" value="여행 삭제">
                        </form>
                    </div>
                </div>
                <div id="travel-date">
                    <h5 id="startDate">${startDate}</h5> ~
                    <h5 id="endDate">${endDate}</h5>
                </div>
                <p>${d_day}</p>
            </div>

            <div id="scheduler">
                <p>📅 여행 일정 📅</p>
                <div id="calendar">
                    <p id="orderP" style="display:none;">드래그해서 순서를 변경해보세요!</p>
                    
                    ${scheTable}
                    <button class="slideBtn" id="prev" onclick="prevSlide()"><i class="fa-solid fa-chevron-left"></i></button>
                    <button class="slideBtn" id="next" onclick="nextSlide()")><i class="fa-solid fa-chevron-right"></i></button>
                </div>
                <button id="saveBtn" onclick="saveChange()">변경사항 저장</button>
                    <button id="addBtn">편집</button>
                    <div id="addBox">
                        <form action="/place/creatTypeCookies" method="post">
                            <input type="submit" value="여행 장소 탐색">
                            <input type="hidden" name="sido" value="${result.sidoCode}">
                            <input type="hidden" name="sigun" value="${result.sigunCode}">
                        </form>
                        <a href="#bookmark">
                            <button>북마크한 장소 추가</button>
                        </a>
                        <button id="setOrder" onclick="${change_order}">일정 순서 변경</button>
                    </div>
            </div>
            <div id="bookmark">
                <p>📍 북마크 장소 📍</p>
                <div id="b-box">
                    <div id="b-list">
                        <div id="list-header">
                            <button id="bookBtn">북마크</button>
                            <button id="searchBtn">장소 검색</button>
                        </div>
                        <div id="menu_wrap" class="bg_white">
                            <div class="option">
                                
                                    <form onsubmit="searchPlaces(); return false;">
                                        키워드 : <input type="text" value="" id="keyword" size="15"> 
                                        <button type="submit">검색하기</button> 
                                    </form>
                                
                            </div>
                            <hr>
                            <span id="planID" style="display:none;">${result.planID}</span>
                            <ul id="placesList"></ul>
                            <div id="pagination"></div>
                        </div>
                        <div id="bookList">
                            <ul>
                                ${bm_list}
                            </ul>
                        </div>
                    </div>
                    <div id="map" style="width:100%;height:650px;"></div>
                </div>
                
            </div>
            
        </div>
        <script type="text/javascript" src="//dapi.kakao.com/v2/maps/sdk.js?appkey=973bd6a9d94de434166af01949bb7d0f&libraries=services"></script>
        
        <script src="/js/navbar.js"></script>
        <script src="/areacode/js/gyeonggi.js"></script>
        <script src="/areacode/js/gangwon.js"></script>
        <script src="/areacode/js/chungbuk.js"></script>
        <script src="/areacode/js/chungnam.js"></script>
        <script src="/areacode/js/gyeongbuk.js"></script>
        <script src="/areacode/js/gyeongnam.js"></script>
        <script src="/areacode/js/jeonbuk.js"></script>
        <script src="/areacode/js/jeonnam.js"></script>
        <script src="/js/selectLoca.js"></script>
        <script src="/js/plan/planDetail.js"></script>
        <script src="/js/plan/map.js"></script>
        <script src="/js/place.js"></script>
        `;
    }, create_box: function(index, s_list){
        return ` 
        <div id="sBox_${index}">
            <ul id="sList_${index}">
                <li id="s_header${index}">
                    <span class="when">${index}일차</span>
                <li>
                ${s_list}
            </ul>
        </div>
        `;
    },s_list: function(result, i){
        ///<input type="hidden" name="singleID${sID}" value="${sID}">
        var date = result[i].date;
        var sID = result[i].singleID;
        var time = result[i].startTime;
        var memo = result[i].memo;
        var placeID = result[i].placeID;

        if(time == null) time = '';
        if(memo == null) memo = '';

        return `
        <li class="sList">
            <button id="sList_${date}_${sID}">${result[i].title}
                <button class="link"><i class="fa-solid fa-link" data-placeid="${placeID}" data-title="${result[i].title}"></i></button>
            </button>
            <p class="time">${time}</p>
            <p class="time">${memo}</p>
            <div class="detail_box" id="sList_${date}_${sID}">
                <div class="detail">
                    시간
                    <button class="add_btn timeBtn" data-id="${sID}"><i class="fa-solid fa-plus"></i></button>
                    <button class="del_btn" data-id="${sID}" onclick="delete_time('${sID}', '${time}');"><i class="fa-solid fa-trash"></i></button>
                </div>
                <div class="timeBox" data-id="${sID}">
                    <input type="time" name="time${date}${sID}" value="12:00">
                    <button onclick="add_time(${date}, ${sID})">저장</button>
                </div>
                
                <div class="detail">
                    메모
                    <button class="add_btn" data-id="${sID}" onclick="add_memo('${sID}', '${memo}');"><i class="fa-solid fa-plus"></i></i></button>
                    <button class="del_btn" data-id="${sID}" onclick="delete_memo('${sID}', '${memo}');"><i class="fa-solid fa-trash"></i></button>
                </div>

                <div class="detail">
                    <button class="setOrder" onclick="updatePlan(${sID});">일정 변경</button>
                    <button onclick="delSche(${sID});">삭제</button>
                </div>
                <div class="updown">
                    <button onclick="updown_number(${sID}, 'up');">▲</button>
                    <button onclick="updown_number(${sID}, 'down');">▼</button>
                </div>
                
            </div>
        </li>
        `;
        // <input type="button" data-id="${sID}" onclick="add_memo('${sID}');" value="<i class="fa-solid fa-trash"></i>">
    },bm_list: function(result){
        return `
        <li class="bm_list">
            <button class="more_btn" data-id="${result.bookID}" ><i class="fa-solid fa-ellipsis-vertical" ></i></button>
            <button class="place_title" data-id="${result.bookID}" data-placeid="${result.placeID}" data-lat="${result.latitude}" data-lng="${result.longitude}">${result.title}</button>
            <div class="more_box" data-id="${result.bookID}">
                    <button onclick="delBookmark(${result.bookID})">삭제</button>
                    <button onclick="addToPlan(${result.bookID}, ${result.planID})">일정에 추가</button>
            </div>
            <p class="baddr">${result.addr}</p>
        </li>
        `
    }
}