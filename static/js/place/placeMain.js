let changeBt = document.querySelector('.submit');
    changeBt.addEventListener("click",changeBtHandle)
var sidoSelect = document.getElementById("sido");
  var sigunSelect = document.getElementById("sigun");
function changeBtHandle(event){
  //console.log(sidoSelect.value)
  //event.preventDefault();
  if(sidoSelect.value === "시/도 선택" || sigunSelect.value === "시/군 선택"){
    if(sidoSelect.value!=='1'&&sidoSelect.value!=='2'&&
    sidoSelect.value!=='3'&&sidoSelect.value!=='4'&&sidoSelect.value!=='5'&&
    sidoSelect.value!=='6'&&sidoSelect.value!=='7'&&sidoSelect.value!=='8' &&sidoSelect.value!=='39'){
      event.preventDefault();
      alert("지역을 선택해주세요!")
    }
    
  }
}

var preThis='';
document.addEventListener("DOMContentLoaded", function() {
  // 라디오 버튼 요소들을 가져옴
  var radioButtons = document.querySelectorAll('input[name="type"]');

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