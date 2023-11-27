module.exports = {
    // 로그인 여부 반환
    isOwner: function(request, response){
        if(request.session.is_logined){
            return true;
        } else{
            return false;
        }
    },
    // 로그인 상태면 logout, 기본값으로 login 출력
    statusUI: function(request, response){
        var authStatusUI = '<a href="/auth/login">로그인</a>';
        if(this.isOwner(request, response)){
            authStatusUI = `${request.session.nickname} | <a href="/auth/logout">로그아웃</a>`;
        }
        return authStatusUI;
    },
    // 로그인 상태면 마이페이지, 기본값으로 회원가입 출력
    statusUI_mp: function(request, response){
        var authStatusUI = '<a href="/auth/signup">회원가입</a>';
        if(this.isOwner(request, response)){
            authStatusUI = `<a href="/mypage/myinfo">마이페이지</a>`;
        }
        return authStatusUI;
    }
}