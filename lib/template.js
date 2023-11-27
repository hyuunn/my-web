module.exports = {
    header:function(authStatusUI, authStatusUI_mp){
        return `
        <div id="header">
            <div id="top_menu">
                <ul class="special_mode">
                    <li><button onclick="change_mode('text');">텍스트 보기</a></li>
                    <li><button onclick="change_mode('color');">고대비 보기</a></li>
                </ul>
            </div>
            <nav class="navbar">
                <div class="nav_logo">
                    <a href="/place">Traveler</a>
                </div>
                <ul class="nav_menu">
                    <li><a href="/place">여행지 탐색</a></li>
                    <li><a href="/plan">일정 짜기</a></li>
                    <li><a href="/board">게시판</a></li>
                </ul>
                <ul class="nav_login">
                    <li>${authStatusUI}</li>
                    <li>${authStatusUI_mp}</a></li>
                </ul>
                <a id="toggleBtn" class="nav_toggle" href="#">
                    <i class="fas fa-bars"></i>
                </a>
            </nav>
        </div>
        `;
    },
    HTML:function(css, header, body){

        return `
        <!DOCTYPE html>
        <html>
            <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1">
                <title>Travel</title>
                
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-GLhlTQ8iRABdZLl6O3oVMWSktQOp6b7In1Zl3/Jr59b6EGGoI1aFkw7cmDA6j6gD" crossorigin="anonymous">
                <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/js/bootstrap.bundle.min.js" integrity="sha384-HwwvtgBNo3bZJJLYd8oVXjrBZt8cqVSpeBNS5n7C8IVInixGAoxmnlMuBnhbgrkm" crossorigin="anonymous"></script>
                <link href="/css/navbar.css" rel="stylesheet">

                <link rel="preconnect" href="https://fonts.googleapis.com">
                <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
                <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;700&family=Raleway:ital,wght@1,200&display=swap" rel="stylesheet">
                
                <script src="https://cdn.jsdelivr.net/npm/fullcalendar@6.1.5/index.global.min.js"></script>
                <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css">    
                
                <script src="https://code.jquery.com/jquery-3.7.0.js" integrity="sha256-JlqSTELeR4TLqP0OG9dxM7yDPqX1ox/HfgiSLBj8+kM=" crossorigin="anonymous"></script>                
                ${css}
            </head>
            <body>
                ${header}
                ${body}
                <script src="/js/navbar.js"></script>
            </body>
        </html>
        `;
    },
    login:function(path){
        if(path == undefined)
            path = '';
        else 
            path = `?path=${path}`;

        return `
        <div class="main">
            <form action="/auth/login_process${path}" method="post">
                <div class="div">
                    <h5><b>로그인</b></h5>
                    <div>
                        <table>
                            <tr>
                                <td><img src="/img/icon/userIcon.svg" class="creatIcon"></td>
                                <td><input type="text" class="idInput" name="userID" placeholder="아이디"></td>
                            </tr>
                            <tr>
                                <td><img src="/img/icon/keyIcon.svg" class="creatIcon"></td>
                                <td><input type="password" class="input"name="pwd" placeholder="비밀번호"></td>
                            </tr>
                        </table>
                    </div>
                    <input type="submit" class="submit" value="확인">
                    <div class="find">
                        <p>계정이 없으신가요? <a href="/auth/signup" style="color:blue;">회원가입</a></p>
                        <a href="/auth/find_id">아이디 찾기</a>
                        <a href="/auth/find_password">비밀번호 찾기</a>
                    </div>
                </div>
            </form>
        </div>
        
        <script src="/js/navbar.js"></script>
        `;
    }, findID: function(){
        return `
        <div id="content">
            <h2>아이디 찾기</h2>
            <p>회원가입시 등록한 정보를 입력해주세요.</p>
            <form action="/auth/findID_process" method="post" style="margin:20px;">
                <p><input type="text" name="name" placeholder="이름"></p>
                <p><input type="text" name="email" placeholder="이메일 주소"></p>
                <button>확인</button>
            </form>
        </div>
        `;
    }, findPassword: function(){
        return `
        <div id="content">
            <h2>비밀번호 찾기</h2>
            <p>회원가입 시 등록한 정보를 입력해주세요</p>
            <form action="/auth/findPwd_process" method="post" style="margin:20px;">
                <p><input type="text" name="id" placeholder="아이디"></p>
                <p><input type="text" name="name" placeholder="이름"></p>
                <p><input type="text" name="email" placeholder="이메일"></p>
                <button>확인</button>
            </form>
        </div>
        `;
    }, resetPassword: function(id){
        console.log(id);
        return `
        <div id="content">
            <h2>비밀번호 재설정</h2>
            <form action="/auth/resetPwd_process" method="post" style="margin:20px;">
                <p>비밀번호는 영문과 숫자를 포함하여 8자 이상으로 설정해주세요.</p>
                <input type="hidden" name="id" value="${id}">
                <p><input type="password" name="new" placeholder="새 비밀번호" required></p>
                <p><input type="password" name="check" placeholder="새 비밀번호 확인" required></p>
                <button>확인</button>
            </form>
        </div>
        `;
    },
    signup:function(){
        return `
        <h2 style="margin:20px;">회원가입</h2>
        <form action="/auth/signup_process" method="post" style="margin:20px;">
            <p><input class="login" type="text" name="userID" placeholder="아이디"></p>
            <p><input class="login" type="text" name="name" placeholder="이름"></p>
            <p><input class="login" type="text" name="email" placeholder="이메일"></p>
            <p><input class="login" type="password" name="pwd" placeholder="비밀번호"></p>    
            <p><input class="login" type="password" name="pwd2" placeholder="비밀번호 재확인"></p>
            <p><input class="btn" type="submit" value="제출"></p>
        </form>
        <script src="/js/navbar.js"></script>
        `;
    },
    creatAccount:function(js){
        return `
        <form method="post" action="/auth/creatAccount/check">
        <div class="main">
            <div class="div">
                <h5 ><b>회원가입</b></h5>
                <div>
                <table>
                    <tr>
                        <td>
                            <img src="/img/icon/penIcon.svg" class="creatIcon">
                        </td>
                        <td colspan="2">
                        
                            <input type="text" name="name" id="nameInput" class="input" placeholder="이름 입력" required>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <img src="/img/icon/userIcon.svg" class="creatIcon">
                        </td>
                        <td>
                            
                            
                            <input type="text" name="id" id ="idInput" class="idInput" placeholder="ID" required>
                            <button id="idCheckBt"> 확인</button>
                            <p class="rule">*영문 대소문자와 숫자 4~12자리</p>
                        </td>

                    </tr>
                    <tr>
                        <td>
                            <img src="/img/icon/emailIcon.svg" class="creatIcon">
                        </td>
                        <td>
                            
                            <input type="email" name="email" id="emailInput" class="input" placeholder="email" required>
                            <button id="emailCheckBt"> 확인</button>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <img src="/img/icon/keyIcon.svg" class="creatIcon">

                        </td>
                        <td>
                            
                            <input type="password" name="password" id="pwInput" class="input" placeholder="비밀번호" required>
                            <p class="rule">*영문 숫자 포함 8자리 이상</p>
                        </td>
                    </tr>
                    <tr>
                        <td>
                        
                            <img src="/img/icon/keyIcon.svg" class="creatIcon">
                        </td>
                        <td>
                        
                            <input type="password" name="password2" id="pwInput2" class="input" placeholder="비밀번호 확인" required disabled>
                        </td>
                    </tr>
                </table>
                </div>
            <p style="font-size:12px; width:100%; text-align: center;"><b>무장애 유형 </b> (선택)</p>
            <div class="handitypeDiv">
                <input name="handiType" type="radio" id="handicap" value="3"><label for="handicap" class="handicapRadio"><img src="/img/handicap.png"></label></input>
                <input name="handiType" type="radio" id="blind" value="1"><label for="blind"class="blindRdio"><img src="/img/eye.png"></label ></input>
                <input name="handiType" type="radio" id="hearing" value="2"><label for="hearing" class="hearingRadio"><img src="/img/hearinghadicap.png"></label></input>
                <input name="handiType" type="radio" id="family" value="4"><label for="family"><img src="/img/infantsfamily.png"></label></input>
            </div>
            <input type="submit" id="submit" class="submit" value="가입">
            <p>이미 계정이 있으신가요? <a href="/auth/login" style="color:blue;" >로그인</a></p>
                
            </div>
        </div>
    </form>
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    ${js}
        `;
    },
}