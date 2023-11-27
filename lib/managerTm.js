module.exports={
    main: function(){
        return `
        <div class="container-md">
            <h2>관리자 페이지</h2>

            <div id="requests">
                <p>정보 수정 요청 내역</p>
            </div>
            <div id="reports">
                <p>게시글 신고 내역</p>
            </div>
        </div>
        `;
    },
    reports: function(lists){
        return `
        <div class="container-md">
            <div class="content">
                    <div class="board_header">
                        <h5>게시물 신고 내역</h5>
                    </div>
                    <div class="post_list">
                        <table id="report_table">
                            <thead>
                                <tr>
                                    <th class="narrow">번호</th>
                                    <th class="middle">신고 유형</th>
                                    <th class="wide">제목</th>
                                    <th class="narrow">작성자</th>
                                    <th class="narrow">신고일</th>
                                    <th class="middle">누적 신고 수 <button id="count" onclick="sortTable(5);">🔽</button</th>
                                    <th class="narrow">확인 여부</th>
                                </tr>
                            </thead>
                            <tbody>
                            ${lists}
                            </tbody>
                        </table>

                        <div class="page_buttons"></div>
                    </div>
                    
                </div>
            
            </div>
        </div>
        <script src="/js/pagination.js"></script>
        <script src="/js/manager/report.js"></script>
        `;
    }, lists: function(result, count){
        const report_type = {
            0: '성적 콘텐츠', 1: '스팸홍보/도배글', 2: '불법정보', 3: '청소년 유해',
            4: '욕설/혐오/차별적 표현', 5: '개인정보 노출', 6: '불쾌한 표현'
        };
        const progress = {0: '읽지 않음', 1: '읽음'};
        var checked = '';
        if(result.progress == 1) checked = 'checked';

        function getDt(dt) { // yy.mm.dd
            const temp = new Date(dt);
            const year = temp.getFullYear();
            const month = temp.getMonth() + 1;
            const date = temp.getDate();

            return `${year - 2000}.${month >= 10 ? month : '0' + month}.${date >= 10 ? date : '0' + date}`;
        }
        var date = getDt(result.date);

        // count: {postID: id, count: n}, obj: {id: n}
        var obj = {};
        for(var i = 0; i < count.length; i++){
            obj[count[i]['postID']] = count[i]['count'];
        }

        return `
        <tr data-id="${result.id}" class="${checked}">
            <td class="narrow">${result.id}</td>
            <td class="middle">${report_type[result.type]}</td>
            <td class="wide">
                <a href="/board/plan_post/${result.postID}" onclick="checked(this);" onmouseover="show_box(${obj[result.postID]}, ${result.id});">${result.title}</a>
                <button class="delete_reported" data-id="${result.id}" onclick="del_reported(${result.postID}, '${result.userID}');">게시글 삭제</button>
            </td>
            <td class="narrow">${result.userID}</td>
            <td class="narrow">${date}</td>
            <td class="middle count">${obj[result.postID]}</td>
            <td class="narrow">${progress[result.progress]}</td>
        </tr>
        `
    },
    manage_update: function(lists) {
        return`
        <div id="posts">
            <div class="post_list">
                <input type="checkbox" name="selectAll" value="all" onclick="selectAll(this)"><span style="margin:0 10px;">모두 선택</span>
                <button class="btn" onclick="delPosts();">삭제</button>
                <table>
                    <thead>
                        <tr>
                            <th class="narrow">선택</th>
                            <th class="narrow">번호</th>
                            <th class="narrow">작성자</th>
                            <th class="wide">제목</th>
    
                            <th class="narrow">날짜</th>
                            <th class="narrow">처리여부</th>
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
    }, update_lists:function(result){
        const cate = {0:'미완료', 1:'진행 중', 2:'완료&nbsp;&nbsp;&nbsp;&nbsp;'};
        const font = {0:'red', 1:'orange', 2:'blue'};
        var weight ;
        if(result.checked ==0){
            weight= 'class="font"'
        }else{
            weight=''
        }
        progress = cate[result.progress]
        color = font[result.progress]
        function getDt(dt) { // yy-mm-dd
            const temp = new Date(dt);
            const year = temp.getFullYear();
            const month = temp.getMonth() + 1;
            const date = temp.getDate();
    
            return `${year - 2000}-${month >= 10 ? month : '0' + month}-${date >= 10 ? date : '0' + date}`;
        }
        var date = getDt(result.date)
    
        var str = `<td class= "modalOpen" value=${result.id}>${result.title}</a></td>`;
    
      
        return `
        <tr ${weight}>
            <td class="narrow"><input type="checkbox" name="select" value="${result.id}" onclick="checkSelectAll()"></td>
            <td class="narrow">${result.id}</td>
            <td class="narrow">${result.userID}</td>
            ${str}
            <td class="narrow">${date}</td>
            <td class="narrow" style="color:${color};">${progress}<i id="menu" value="${result.id}" class="fa-solid fa-ellipsis-vertical fa-sm" style="color: #b0b0b0;"></i></td>
            <td id="hidden${result.id}"class="progressDiv none">
            <div "progressDiv" value=${result.id} ><p class="progressP" value=0>미완료</p><p class="progressP" value=1>진행중</p><p class="progressP" value=2>&nbsp;완료</p></div></td>
        </tr>
        `;
    
    } ,
    update_main:function(table, js){
        return `
        <br><br><br>
        <div style="width:100%;text-align :center;"><h4>무장애 시설 정보 수정/신규 요청</h4></div>
        <div style="width:80%; margin-left:10%;">
            ${table}
        <div>
        <div class="modal none" id="modal"> 
        <div class="modal_body ">
            <div class="modal_close" >
            <select class="modalProgress" >
            
            <option value="0">미완료</option>
            <option value="1">진행중</option>
            <option value="2">완료</option>
            
        </select>
                <p class="modal_closeBT">❌</p>
                
            </div>
            <div class="modal_top">
            <div>
            <h3 class="modal_title">#타이틀</h3>
            </div>
            <div class="top_right"><p class="modal_date">작성일</p></div>
            </div>
            <h5>수정/신규 요청</h5>
            <br>
            <div class="user_input">
                <div class="img" ></div>
                <div class="description"></div>
            </div>
            <hr>
            <h5>현재 무장애 정보</h5>
            <br>
            <br>
            <div class="handicap">
            <br>
            <br>
            </div>
            
            <div class="modal_main">
            <br>
            <br>
            </div>
            
        </div>
        
      </div>
            ${js}`
    
    } 

    
}