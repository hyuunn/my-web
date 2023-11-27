module.exports = {
    main: function(content, js) {
        return `
            <div class="container">
                
                    <div id="in_content">
                        <ul class="tabnav">
                            <li><a href="/mypage/myinfo" id="myinfo">👤 나의 회원 정보</a></li>
                            <li><a href="/mypage/myplans" id="myplans">📅 나의 여행 일정</a></li>
                            <li><a href="/mypage/mybookmarks" id="mybookmarks">📍 북마크 장소 보기</a></li>
                            <li><a href="/mypage/myposts" id="myposts">📝 작성 게시글 보기</a></li>
                            <li><a href="/mypage/mycomments" id="mycomments">📝 작성 댓글 보기</a></li>
                            <li><a href="/mypage/myscraps" id="myscraps">❤️ 좋아요한 게시글 보기</a></li>
                        </ul>
                        <div class="tab_content">
                            ${content}
                        </div>
                    </div>
               
            </div>
            <script type="text/javascript" src="//dapi.kakao.com/v2/maps/sdk.js?appkey=973bd6a9d94de434166af01949bb7d0f&libraries=services"></script>
            <script src="/js/mypage/mypage.js"></script>
            ${js}
            `
    }, info: function (result, report_cnt, update_cnt, manager) {
        var barrier = result[0].barrier_type;
        var btype = ['없음', '시각장애', '청각장애', '지체장애', '영유아 동반'];

        if (barrier == null) barrier = '없음';
        else barrier = btype[barrier];

        var manager_btn = '';
        if (manager == true){
            manager_btn = '<button id="manager" data-bs-toggle="offcanvas" data-bs-target="#offcanvasWithBothOptions" aria-controls="offcanvasWithBothOptions"><i class="fa-solid fa-user-lock"></i></button>';
        }

        var alert_icon = '', alert_words = '', alert_icon_update = '', alert_words_update = '';

        // count: {progress: 0/1, count: n}
        var obj = {};
        for(var i = 0; i < report_cnt.length; i++){
            obj[report_cnt[i]['progress']] = report_cnt[i]['count'];
        }
        console.log(obj);

        var obj_update = {};
        for(var i = 0; i < update_cnt.length; i++){
            obj_update[update_cnt[i]['checked']] = update_cnt[i]['count'];
        }
        console.log(obj_update);
        if(Object.keys(obj).length > 0 && obj['0'] != 0){
            alert_icon = '<sup class="alert">●</sup>';
            alert_words = `<p class="alert words">확인하지 않은 내역이 ${obj['0']}건 있습니다.</p>`;
        }
        if(Object.keys(obj_update).length > 0 && obj_update['0'] != 0){
            alert_icon_update = '<sup class="alert">●</sup>';
            alert_words_update = `<p class="alert words">확인하지 않은 내역이 ${obj_update['0']}건 있습니다.</p>`;
        }

       if(obj_update){
        console.log('exist');
       }
       if(obj){
        console.log(Object.keys(obj).length);
       }
        return `
        <div id="info">
            <ul>
                <li>아이디 : ${result[0].userID}</li>
                <li>닉네임 : ${result[0].name}</li>
                <li>이메일 : ${result[0].email}</li>
                <li>무장애 유형 : ${barrier}</li>
            </ul>
            <button onclick="location.href='/mypage/checkPassword';">회원 정보 수정</button>
            <button onclick="location.href='/mypage/changePassword';">비밀번호 변경</button>
            <button onclick="deleteUser('${result[0].userID}');">회원 탈퇴</button>
            ${manager_btn}            
            <div class="offcanvas offcanvas-start" data-bs-scroll="true" tabindex="-1" id="offcanvasWithBothOptions" aria-labelledby="offcanvasWithBothOptionsLabel">
                <div class="offcanvas-header">
                    <h5 class="offcanvas-title" id="offcanvasWithBothOptionsLabel">관리자 메뉴</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                </div>
                <div class="offcanvas-body">
                    <div id="requests">
                        <a href="/manager/update"><p>정보 수정 요청 내역 ${alert_icon_update}&nbsp;></p></a>
                        ${alert_words_update}
                    </div>
                    <div id="reports">
                        <a href="/manager/report"><p>게시물 신고 내역 ${alert_icon}&nbsp;></p></a>
                        ${alert_words}
                    </div>
                </div>
            </div>
        </div>
        `;
    }, checkPwd: function(){
        return `
        <div id="checkPwd">
            <h2>비밀번호 재확인</h2>
            <p>안전한 보안을 위해 비밀번호를 입력해주세요.</p>
            <form action="/mypage/checking" method="post">
                <input type="password" name="password" placeholder="비밀번호" required>
                <input type="submit" value="확인">
            </form>
        </div>
        `;
    }, modifyInfo: function(result){
        return `
        <div id="mod_info">
            <h2>회원 정보 수정</h2>
            
                <p>아이디 <input type="text" name="id" placeholder="${result[0].userID}" readonly></p>
                <p>닉네임 <input type="text" name="nickname" value="${result[0].name}"></p>
                <p>이메일 <input type="text" name="email" value="${result[0].email}"> <input type="button" onclick="checkEmail('${result[0].userID}');" value="중복 확인"></p>
                <p>무장애 유형 
                    <select name="bType" data-id="${result[0].barrier_type}">
                        <option value="0">없음</option>
                        <option value="1">시각장애</option>
                        <option value="2">청각장애</option>
                        <option value="3">지체장애</option>
                        <option value="4">영유아 동반</option>
                    </select></p>
                <button onclick="modifying();">확인</button>
            
        </div>
        `;
    }, changePassword: function(){
        return `
        <div id="changePwd">
            <h2>비밀번호 변경</h2>
            <form action="/mypage/changing" method="post">
                <p><input type="password" name="current" placeholder="현재 비밀번호" required></p>
                <p><input type="password" name="new" placeholder="새 비밀번호" required></p>
                <p>영문과 숫자를 포함하여 8자 이상으로 설정해주세요.</p>
                <p><input type="password" name="check" placeholder="새 비밀번호 재확인" required></p>
                <button>확인</button>
            </form>
        </div>
        `;
    }, 
    plans: function (plists, len) {
        if(len == 0){
            return `
            <div style="padding:15px;">
                <h5>생성된 일정이 없습니다.</h5>
                <button onclick="location.href='/plan'">➡️ 일정 생성하러 가기</button>
            </div>
            `
        } else {
           return `
        <div id="plans">${plists}</div>
        `; 
        }
        
    },
    bookmarks: function (blists, places, len) {
        if(len == 0){
            return `
            <div style="padding:15px;">
                <h5>저장된 장소가 없습니다.</h5>
            </div>
            `
        } else{
            return `
        <div id="bookmarks">
            <div id="folders">
                <ul>
                    <li>
                        <button data-id="null" class="b_title" style="height:80px;">기타 폴더</button>
                    </li>
                    ${blists}
                </ul>
            </div>
            <div id="places">
                <div id="bookmark_header">
                    <button onclick="goBack();" style="padding:10px;"><</button>
                    <p></p>
                </div>
                <ul>${places}</ul>
            </div>
            <div id="map"></div>
        </div>
        `
        }
        
    }, blists: function (title, startDate, endDate, planID, location) {
        return `
        <li>
            <button data-id="${planID}" data-location="${location}" class="b_title" onclick="setHeader('${title}');">${title}</button>
            <p>${startDate} ~ ${endDate}</p>
        </li>
        `
    }, places: function (result, num) {
        return `
        <li data-id="${result.planID}" class="place">
            <button class="place_title" data-id="${result.bookID}" data-placeid="${result.placeID}" data-lat="${result.latitude}" data-lng="${result.longitude}">${result.title}</button>
            <button class="modify_btn" ><i class="fa-solid fa-ellipsis-vertical" data-num="${num}"></i></button>
            <div class="modify" data-num="${num}">
                <button onclick="modify(${result.bookID});">수정</button>&nbsp;&nbsp;&nbsp;<button onclick="delBookmark(${result.bookID})";>삭제</button>
            </div>
            <p>${result.addr}</p>
        </li>
        `
    },
    posts: function(lists) {
        return`
        <div id="posts">
            <div class="post_list">
                <input type="checkbox" name="selectAll" value="all" onclick="selectAll(this)"><span style="margin:0 10px;">모두 선택</span>
                <button class="btn" onclick="delPosts();">선택한 게시글 삭제</button>
                <table>
                    <thead>
                        <tr>
                            <th class="narrow">선택</th>
                            <th class="narrow">번호</th>
                            <th class="narrow">카테고리</th>
                            <th class="wide">제목</th>
                            <th class="narrow">날짜</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${lists}
                    </tbody>
                </table>
                <div class="page_buttons"></div>
            </div>
        </div>
        `;
    }, post_lists:function(result){
        const cate = {1:'자유', 2:'후기', 3:'Q&A', 4:'일정공유'};

        function getDt(dt) { // yy-mm-dd
            const temp = new Date(dt);
            const year = temp.getFullYear();
            const month = temp.getMonth() + 1;
            const date = temp.getDate();

            return `${year - 2000}-${month >= 10 ? month : '0' + month}-${date >= 10 ? date : '0' + date}`;
        }
        var date = getDt(result.date)
        var category = cate[result.category];
        var str = `<td><a href="/board/post/${result.postID}">${result.title}</a></td>`;

        if(category == '일정공유'){
            str = `<td><a href="/board/plan_post/${result.postID}">${result.title}</a></td>`;
        }
        return `
        <tr>
            <td class="narrow"><input type="checkbox" name="select" value="${result.postID}" onclick="checkSelectAll()"></td>
            <td class="narrow">${result.postID}</td>
            <td class="narrow">${category}</td>
            ${str}
            <td class="narrow">${date}</td>
        </tr>
        `;

    } ,
    
    scraps: function () {

    },
    likes: function (lists) {
        return`
        <div id="posts">
            <div class="post_list">
                <input type="checkbox" name="selectAll" value="all" onclick="selectAll(this)"><span style="margin:0 10px;">모두 선택</span>
                <button class="btn" onclick="delPosts();">선택한 좋아요 취소</button>
                <table>
                    <thead>
                        <tr>
                            <th class="narrow">선택</th>
                            <th class="narrow">번호</th>
                            <th class="narrow">카테고리</th>
                            <th class="wide">제목</th>
                            <th class="narrow">작성자</th>
                            <th class="narrow">날짜</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${lists}
                    </tbody>
                </table>
                <div class="page_buttons"></div>
            </div>
        </div>
        `;
    }, like_lists:function(result){
        const cate = {1:'자유', 2:'후기', 3:'Q&A', 4:'일정공유'};

        function getDt(dt) { // yy-mm-dd
            const temp = new Date(dt);
            const year = temp.getFullYear();
            const month = temp.getMonth() + 1;
            const date = temp.getDate();

            return `${year - 2000}-${month >= 10 ? month : '0' + month}-${date >= 10 ? date : '0' + date}`;
        }
        var date = getDt(result.date)
        var category = cate[result.category];
        var str = `<td><a href="/board/post/${result.postID}">${result.title}</a></td>`;

        if(category == '일정공유'){
            str = `<td><a href="/board/plan_post/${result.postID}">${result.title}</a></td>`;
        }
        return `
        <tr>
            <td class="narrow"><input type="checkbox" name="select" value="${'r/'+result.recommendID}" onclick="checkSelectAll()"></td>
            <td class="narrow">${result.postID}</td>
            <td class="narrow">${category}</td>
            ${str}
            <td class="narrow">${result.userID}</td>
            <td class="narrow">${date}</td>
        </tr>
        `;


    } ,
    comment: function(lists) {
        return`
        <div id="posts">
            <div class="post_list">
                <input type="checkbox" name="selectAll" value="all" onclick="selectAll(this)"><span style="margin:0 10px;">모두 선택</span>
                <button class="btn" onclick="delPosts();">선택한 댓글    삭제</button>
                <table>
                    <thead>
                        <tr>
                            <th class="narrow">선택</th>
                            <th class="narrow">번호</th>
                            <th class="wide">내용</th>
                            <th class="narrow">날짜</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${lists}
                    </tbody>
                </table>
                <div class="page_buttons"></div>
            </div>
        </div>
        `;
    }, comment_lists:function(result){
        const cate = {1:'자유', 2:'후기', 3:'Q&A', 4:'일정공유'};

        function getDt(dt) { // yy-mm-dd
            const temp = new Date(dt);
            const year = temp.getFullYear();
            const month = temp.getMonth() + 1;
            const date = temp.getDate();

            return `${year - 2000}-${month >= 10 ? month : '0' + month}-${date >= 10 ? date : '0' + date}`;
        }
        var date = getDt(result.date)
        var category = cate[result.category];
        var str = `<td>${result.description}</a></td>`;
        var value;
        var deleteValue;
        if(result.commentID == undefined){
            value = result.content_commentID
            deleteValue = 'cc/'+result.content_commentID
            str = `<td><a href='/place/content/${result.url}'>${result.description} <p>${result.title}</p> </a></td>`
        }else{
            value = result.commentID
            deleteValue = 'c/'+result.commentID
            str = `<td><a href='/board/post/${result.postID}'>${result.description} &nbsp;&nbsp;<p>${result.title}</p></a></td>`
        }
        
       if(category == '일정공유'){
            str = `<td><a href="/board/plan_post/${result.postID}">${result.description}&nbsp;&nbsp;<p>${result.title}</p></a></td>`
        }
        return `
        <tr>
            <td class="narrow"><input type="checkbox" name="select" value="${deleteValue}" onclick="checkSelectAll()"></td>
            <td class="narrow">${value}</td>
            
            ${str}
            <td class="narrow">${date}</td>
        </tr>   
        `;

    } ,
}