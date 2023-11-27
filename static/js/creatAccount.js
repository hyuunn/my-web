var idCheckBt = document.getElementById('idCheckBt');
var emailCheckBt = document.getElementById('emailCheckBt');
var submitBt = document.getElementById('submit');
var idInput = document.getElementById('idInput');
var pw= document.getElementById('pwInput');
var pw2 = document.getElementById('pwInput2');
var name = document.getElementById('nameInput');
var email = document.getElementById('emailInput');
console.log(idCheckBt);
var idCheck = false;
var  emailCheck = false;

function checkExistData(input, dataName) {//공백인 경우 
    if (input.value == "") {
        alert(dataName + " 입력해주세요!");
        input.style.borderColor="red";
        input.style.borderWidth="0.5px";
        return false;
    }
    return true;
}

function emailCheckClick( event) {
    
    event.preventDefault();
    
    var result = checkExistData(email,"이메일을");
    if(result == true){
        var idRegExp = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/; //아이디 유효성 검사
        if (!idRegExp.test(email.value)) {
            alert("이메일 형식이 맞지 않습니다!");
            
            return false;
        }
       
        $.ajax({
            url: '/auth/creatAccount/checkEmail',
            type: 'POST',
            data: { 'data': emailInput.value }, // 데이터를 객체 형태로 전달
            dataType: 'json', // 받을 데이터 형식 (JSON)
            success: function(response) {
              // 서버로부터 받은 데이터 처리
              if(response==true){
                alert("사용 가능한 이메일입니다!");
                emailInput.style.borderColor="blue";
                emailInput.style.borderWidth="0.7px";
                emailCheck = true;
              }
              else{
                alert("이미 있는 이메일입니다!");
                emilInput.style.borderColor="red";
                emailInput.style.borderWidth="0.7px";
              }
              
            },
            error: function(error) {
                alert("다시 입력해주세요!");
                emailInput.style.borderColor="red";
                emailInput.style.borderWidth="0.7px";
            }
          });
          console.log()
          
        
    }else{
        return false;
    }
        //idInput.style.borderColor="green";
    

}

function idCheckClick( event) {
    console.log(idInput.value);
    event.preventDefault();
    var userId = idInput.value;
    var result = checkExistData(idInput,"아이디를");
    if(result == true){
        var idRegExp = /^[a-zA-z0-9]{4,12}$/; //아이디 유효성 검사
        if (!idRegExp.test(idInput.value)) {
            alert("아이디는 영문 대소문자와 숫자 4~12자리로 입력해야합니다!");
            
            return false;
        }
       
        $.ajax({
            url: '/auth/creatAccount/checkID',
            type: 'POST',
            data: { 'data': idInput.value }, // 데이터를 객체 형태로 전달
            dataType: 'json', // 받을 데이터 형식 (JSON)
            success: function(response) {
              // 서버로부터 받은 데이터 처리
              if(response==true){
                alert("사용 가능한 아이디입니다!");
                idInput.style.borderColor="blue";
                idInput.style.borderWidth="0.7px";
                idCheck = true;
              }
              else{
                alert("이미 있는 아이디입니다!");
                idInput.style.borderColor="red";
                idInput.style.borderWidth="0.7px";
              }
              
            },
            error: function(error) {
                alert("다시 입력해주세요!");
                idInput.style.borderColor="red";
                idInput.style.borderWidth="0.7px";
            }
          });
          console.log()
          
        
    }else{
        return false;
    }
        //idInput.style.borderColor="green";
    

}

idInput.addEventListener('input', function() {
    idInput.style.borderColor="black";
    idInput.style.borderWidth="0.5px";
    idCheck = false;
  });
  email.addEventListener('input', function() {
    email.style.borderColor="black";
    email.style.borderWidth="0.5px";
    emailCheck = false;
  });
  pw.addEventListener('input', function() {
    pw.style.borderColor="black";
    pw.style.borderWidth="0.5px";
    pw2.style.borderColor="black";
    pw2.style.borderWidth="0.5px";
    pw2.disabled = true;
    pw2.value="";
  });

pw.addEventListener('change',function() {
     var regex = /^(?=.*[a-zA-Z])(?=.*[0-9]).{8,}$/;
     if(!regex.test(pw.value)){
         alert("비밀번호 영문자, 숫자 포함 8자리 이상으로 다시 입력하세요");   
         pw.style.borderColor="red";
         pw.style.borderWidth="0.7px";
         pw.value="";
    }else{
        pw.style.borderColor="black";
        pw.style.borderWidth="0.5px";
        pw2.style.borderColor="black";
        pw2.style.borderWidth="0.5px";
        pw2.disabled = false;

    }

})
pw2.addEventListener('change',function() {
    var regex = /^(?=.*[a-zA-Z])(?=.*[0-9]).{8,}$/;
    if(pw.value != pw2.value){
        alert("일치하지 않습니다!");   
        pw2.style.borderColor="red";
        pw2.style.borderWidth="0.7px";
        pw2.value="";
   }

})

function submitClick(event){
    
    if(idCheck==false){
        event.preventDefault();
        alert("아이디 중복 검사를 해주세요!");
    }
    else if(emailCheck==false){
        event.preventDefault();
        alert("이메일 중복 검사를 해주세요!");
    }
    
}


idCheckBt.addEventListener('click', idCheckClick);
emailCheckBt.addEventListener('click', emailCheckClick);
submitBt.addEventListener('click', submitClick);

var preThis='';
document.addEventListener("DOMContentLoaded", function() {
  // 라디오 버튼 요소들을 가져옴
  var radioButtons = document.querySelectorAll('input[name="handiType"]');

  // 각 라디오 버튼에 대해 클릭 이벤트 리스너 등록
  radioButtons.forEach(function(radioButton) {
    radioButton.addEventListener("click", function() {
      console.log(this.checked)
      if (preThis == this) {
        this.checked = false;
        preThis='';
      }else{
        preThis=this;
        this.checked=true;
      }
    });
  });
});

