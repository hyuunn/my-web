const { write } = require("fs-extra");

module.exports = {
    postList: function (lists, postCategory, regionSelect) {  // 게시글 목록 페이지
        var category = '카테고리';
        var list_link = 'list';
        var write_link = '/write'
        if (regionSelect != '') {
            category = '지역';
            list_link = 'list_plan'
            write_link = '/write_plan/none/none';
        }
        return `
        <div class="container-md h-auto">
            <div class="content">
                <div class="board_header">
                    <h5><a href="/board/${list_link}">게시글 목록</a></h5>
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
                            <option value="place">장소</option>
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
                    <button id="write_btn" onclick="location.href='/board${write_link}'">✏️ 글쓰기</button>

                    <div class="page_buttons"></div>
                </div>
                
            </div>
           
        </div>
        <script src="/js/board/boardList.js"></script>
        <script src="/js/pagination.js"></script>
        `
    }, lists: function (result, result2) {  // 게시글 목록
        var post_cate = ["전체", "자유", "후기", "Q&A"];
        var barrier_cate = ["시각장애", "청각장애", "지체장애", "영유아 동반"];
        var post_cateNum = result.category;
        var barrier_cateNum = result.barrier_category;
        var barrier = '';

        if (barrier_cateNum == 0 || barrier_cateNum == null)
            barrier = '없음';
        else
            barrier = barrier_cate[barrier_cateNum - 1];

        function getDt(dt) { // yy.mm.dd
            const temp = new Date(dt);
            const year = temp.getFullYear();
            const month = temp.getMonth() + 1;
            const date = temp.getDate();

            return `${year - 2000}.${month >= 10 ? month : '0' + month}.${date >= 10 ? date : '0' + date}`;
        }

        var date = getDt(result.date);

        var comment_count = '';
        var count = 0;
        for (var i = 0; i < result2.length; i++) {
            if (result2[i].postID == result.postID) {
                count++;
            }
        }
        if(count != 0){
            comment_count = count;
        }
        return `
        <tr>
            <td class="narrow">${result.postID}</td>
            <td class="narrow">${post_cate[post_cateNum]}</td>
            <td class="narrow">${barrier}</td>
            <td class="wide"><a href="/board/post/${result.postID}">${result.title}</a><span class="comment">${comment_count}</span></td>
            <td class="narrow">${date}</td>
            <td class="narrow">${result.userID}</td>
            <td class="narrow">${result.views}</td>
            <td class="narrow">${result.recommend}</td>
        </tr>
        `
    }, plan_lists: function (result, result2) {  // 일정 공유글 목록
        var barrier_cate = ["없음", "시각장애", "청각장애", "지체장애", "영유아 동반"];
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

        var comment_count = '';
        var count = 0;
        for (var i = 0; i < result2.length; i++) {
            if (result2[i].postID == result.postID) {
                count++;
            }
        }
        if(count != 0){
            comment_count = count;
        }
        return `
        <tr data-code="${result.sidoCode}">
            <td class="narrow">${result.postID}</td>
            <td class="narrow">${result.location}</td>
            <td class="narrow">${barrier}</td>
            <td class="wide"><a href="/board/plan_post/${result.postID}">${result.title}</a><span class="comment">${comment_count}</span></td>
            <td class="narrow">${date}</td>
            <td class="narrow">${result.userID}</td>
            <td class="narrow">${result.views}</td>
            <td class="narrow">${result.recommend}</td>
        </tr>
        `
    }, postCategory: function () {
        return `
        <ul class="tabnav" id="post_cate">
            <li><button id="all" class="active">전체</button></li>
            <li><button id="any">자유</button></li>
            <li><button id="review">후기</button></li>
            <li><button id="qna">Q&A</button></li>
        </ul>`;
    }, regionSelect: function () {
        return `
            <select id="region" onchange="filteringRegion(this.options[this.selectedIndex].value);">
                <option value="0" selected>지역 선택</option>
                <option value="all">전체</option>
                <option value="seoul">서울</option>
                <option value="gyeonggi">인천ㆍ경기</option>
                <option value="gangwon">강원</option>
                <option value="chungcheong">대전ㆍ세종ㆍ충청</option>
                <option value="gyeongbuk">대구ㆍ경북</option>
                <option value="gyeongnam">부산ㆍ울산ㆍ경남</option>
                <option value="jeolla">광주ㆍ전북ㆍ전남</option>
                <option value="jeju">제주</option>
            </select>
        `;
    },
    boardWriteBody: function (update, plans, single_plan, plan_post) {
        var plan_select = '', description = '', title = '';

        if (plan_post) {
            description = plan_post[0].description;
            title = plan_post[0].title;
        }
        function getDt(dt) { // yy.mm.dd
            const temp = new Date(dt);
            const year = temp.getFullYear();
            const month = temp.getMonth() + 1;
            const date = temp.getDate();

            return `${year - 2000}.${month >= 10 ? month : '0' + month}.${date >= 10 ? date : '0' + date}`;
        }

        for (var i = 0; i < plans.length; i++) {
            var startDate = getDt(plans[i].startDate);
            var endDate = getDt(plans[i].endDate);
            plan_select += `
                <option value="${plans[i].planID}">
                ${plans[i].title}(${startDate}~${endDate})</option>
            `;
        }

        return `
        <div class="container">
            <h4><b>📝일정 공유 게시글 작성📝</b></h4>
            <hr>
            
            <form class="writeform" action="/board/write/plan_post/${update}" onsubmit="return checkEmpty();" method="post">
                <div id="write_header">                            
                    <select name="handicap">
                        <option value="0">무장애유형</option>
                        <option value="0">선택 하지 않음</option>
                        <option value="1">시각장애</option> 
                        <option value="2">청각장애</option>
                        <option value="3">지체장애</option>
                        <option value="4">영유아동반</option>
                    </select>
                    <select id="plan" name="planID" onchange="showSinglePlans()">
                        <option value="0">여행 일정 선택</option>
                        ${plan_select}
                    </select>
                    <input type="text" name="title" placeholder="제목" value="${title}">
                </div>
                <div id="write_wrap">
                    <div id="single_plans">
                        <ul>
                            ${single_plan}
                        </ul>
                    </div>
                    <textarea id="summernote" name="editordata">${description}</textarea>
                </div>
                
                <hr>
                <input type="button" value="취소" onclick="location.href='/board/list_plan'">
                <input type="submit" value="확인" id="submitButton">
            </form>
        </div>
          
        <script src="/js/board/boardWrite.js"></script>
        `;
    },
    boardPostBody: function (post, report, display = '', single_plan, plan, auth) {
        function getDt_time(dt) { // yy.mm.dd hh:mm
            const temp = new Date(dt);
            const year = temp.getFullYear();
            const month = temp.getMonth() + 1;
            const date = temp.getDate();
            const hour = temp.getHours();
            const min = temp.getMinutes();

            return `${year - 2000}.${month >= 10 ? month : '0' + month}.${date >= 10 ? date : '0' + date}  ${hour >= 10 ? hour : '0' + hour}:${min >= 10 ? min : '0' + min}`;
        }
        function getDt(dt) { // yy.mm.dd 
            const temp = new Date(dt);
            const year = temp.getFullYear();
            const month = temp.getMonth() + 1;
            const date = temp.getDate();

            return `${year - 2000}.${month >= 10 ? month : '0' + month}.${date >= 10 ? date : '0' + date}`;
        }

        if (report == true) { // 글 작성자 =/= 로그인한 사용자
            report = `
            <button class="more_btn"><i class="fa-solid fa-ellipsis-vertical"></i></button>\
            <div id="report">
                <button onclick="window.open('http://localhost:3000/board/report/${post.postID}', '_blank', 'width=500, height=500');">신고하기</button>
            </div>`;
        } else {
            report = '';
        }

        return `
        <div class="container-md h-auto">
            <div class="post_header">
                <h6><a href="/board/list_plan">게시글 목록</a></h6>
                <h4><b>${post.title}</b></h4>
                <p id="userID">${post.userID}</p>
                <p id="date">${getDt_time(post.date)}</p>
                ${report}
            </div>

            <div id="content_wrap">
                    <div id="single_plans">
                        <p id="ptitle"><b>${plan[0].plan_title}</b></p>
                        <p id="pdate">${getDt(plan[0].startDate)}~${getDt(plan[0].endDate)}</p>
                        <p id="loca" style="display:none;">${plan[0].location}</p>
                        <ul>
                            ${single_plan}
                        </ul>
                    </div>
                    <div id="content">${post.description}</div>
            </div>
            <div id="map"></div>

                <div class="heart" value="${post.postID}">
                    <i class="fa-regular fa-heart fa-xl" style="color: #ffdbdb;"></i>
                </div>
                <button class="ud" name="postID" style="display:${display};" onclick="deletePost(${post.postID});">삭제</button>

                <p class="ud" style="display:${display}; "><a href="/board/write_plan/${post.postID}/${plan[0].planID}">수정</a></p>
                <hr style="width:100%">
                
                <form action="/board/commentinsert/plan/${post.postID}" method="post">
                    <textarea class="commentTextarea" name="comment" placeholder="답글을 달아보세요!" style="width:80%; margin-left:7%; height:60px; resize: none;"></textarea>
                    <input class="commentSubmit" type="submit" value="확인"></input> 
                </form>

                <br>
                <div id="commentBox" style="width:90%; margin-left:5%; display: flex; flex-direction: column; ">
                    <div class="auth" style="display:none;" value="${auth}"><div>
                </div>
            <hr>
        </div>
        <script type="text/javascript" src="//dapi.kakao.com/v2/maps/sdk.js?appkey=973bd6a9d94de434166af01949bb7d0f&libraries=services"></script>
        <script src="/js/board/planPost.js"></script>
        <script src="/js/board/comment.js"></script>
        <script src="/js/place.js"></script>
        `;
    }, single_plans: function (single_plans, write) {
        var single_plan = '', day = 0;

        for (var i = 0; i < single_plans.length; i++) {
            var time = single_plans[i].startTime;
            if (time == null) time = '';

            var title = single_plans[i].title;
            if (write == false) {
                title = single_plans[i].single_title;
            }

            var list = `<li class="sList">
                            <button type="button" class="place_title" id="sList_${single_plans[i].singleID}" 
                            data-placeid="${single_plans[i].placeID}">${title}</button>
                            <p>${time}</p>
                            <p id="lt_${single_plans[i].singleID}" style="display:none;">${single_plans[i].latitude}</p>
                            <p id="lg_${single_plans[i].singleID}" style="display:none;">${single_plans[i].longitude}</p>
                        </li>`;

            if (day == single_plans[i].date) {
                single_plan += list;
            } else {
                day++;
                single_plan += `<li class="day"><span class="when">${single_plans[i].date}일차</span><li>`;
                single_plan += list;
            }
        }
        return single_plan;
    }, report: function (postID) {
        return `
        <div id="popup">
            <h4><b>신고하기</b></h4>
            <h5>신고 사유</h5>
            <ul>
                <li><input type="radio" name="reason" value="0">성적인 콘텐츠입니다.</li>
                <li><input type="radio" name="reason" value="1">스팸홍보/도배글입니다.</li>
                <li><input type="radio" name="reason" value="2">불법 정보를 포함하고 있습니다.</li>
                <li><input type="radio" name="reason" value="3">청소년에게 유해합니다.</li>
                <li><input type="radio" name="reason" value="4">욕설/생명경시/혐오/차별적 표현입니다.</li>
                <li><input type="radio" name="reason" value="5">개인정보 노출 게시물입니다.</li>
                <li><input type="radio" name="reason" value="6">불쾌한 표현이 있습니다.</li>
            </ul>
            <button onclick="report(${postID});">확인</button>
        </div>

        <script src="/js/board/planPost.js"></script>
        `;
    }, undefinedPlace: function (id) {
        return `
        <div class="container">
            <div id="undefined_place">
                <p id="sad"><i class="fa-regular fa-face-sad-tear"></i></p>
                <h3>죄송합니다. 무장애 정보를 불러올 수 없는 장소입니다.</h3>
                <p>장소 상세 정보는 <a href="https://place.map.kakao.com/${id}" target="_black"><b>여기</b></a>에서 볼 수 있습니다.</p>
            </div>
        </div>
        `;
    }
}