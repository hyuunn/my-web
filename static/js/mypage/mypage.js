var url = [];
url = window.location.pathname.split('/');

var el = document.querySelectorAll(".tabnav > li > a");
for (e of el) {
  if (url[2] == e.getAttribute("id")) {
    e.classList.add("active");
  }
}

// 무장애 유형 selected
var bselect = document.querySelector('select[name="bType"]');
var boption = document.querySelectorAll('select[name="bType"] option');
for (op of boption) {
  if (op.value == bselect.dataset.id) {
    op.setAttribute('selected', true);
  }
}

// 회원 탈퇴
function deleteUser(id) {
  Swal.fire({
    title: '정말 탈퇴하시겠습니까?',
    text: "회원 탈퇴 시 회원님의 모든 일정과 게시글이 삭제됩니다. 😥",
    padding: '20px',
    width: '600px',
    showCancelButton: true,
    confirmButtonText: '탈퇴할래요',
    cancelButtonText: '안할래요'
  }).then(async (result) => {
    if (result.isConfirmed) {
      const { value: password } = await Swal.fire({
        title: '회원님의 비밀번호를 입력해주세요.',
        input: 'password',
        showCancelButton: true,
        inputValidator: (value) => {
          if (!value) {
            return '비밀번호를 입력해주세요!'
          }
        }
      })

      if (password) {
        $.ajax({
          url: `/mypage/delete_user`,
          type: "POST",
          data: {
            id: id,
            password: password
          },
          dataType: "text",
          success: function (result) {
            console.log('success');
            var obj = JSON.parse(result);
            console.log(obj['result']);
            if (obj['result'] == false) {
              alert('비밀번호가 일치하지 않습니다.');
            } else {
              alert('회원 탈퇴가 완료되었습니다.');
              location.href = '/plan';
            }

          },
          error: function () {
            console.log("실패");
            return false;
          }
        })
      }




    }
  })
}

var isOk = false;

function checkEmail(id) {
  var email = document.querySelector("input[name='email']").value;

  console.log(email);
  $.ajax({
    url: `/mypage/check_email`,
    type: "POST",
    data: {
      email: email,
      id: id
    },
    dataType: "text",
    success: function (result) {
      var obj = JSON.parse(result);
      if (obj['result'] == true) {
        alert('사용 가능한 이메일입니다.');
        isOk = true;
      } else if (obj['result'] == false) {
        alert('이미 사용 중인 이메일입니다. 다시 입력해주세요.');
      }

    },
    error: function () {
      console.log("실패");
      return false;
    }
  })
}

function modifying() {
  var id = document.querySelector("input[name='id']").value;
  var name = document.querySelector("input[name='nickname']").value;
  var email = document.querySelector("input[name='email']").value;

  if (isOk == true) {
    $.ajax({
      url: `/mypage/modifying`,
      type: "POST",
      data: {
        email: email,
        id: id,
        name: name
      },
      dataType: "text",
      success: function (result) {
        console.log('success');
        alert('수정이 완료되었습니다!');
        location.href = '/mypage/myinfo';
      },
      error: function () {
        console.log("실패");
        return false;
      }
    })
  }
  else {
    alert('이메일 중복 확인을 해주세요.');
  }
}

var plans = document.querySelectorAll('.b_title');
var places = document.querySelectorAll('.place');
var place_box = document.querySelector('#places');

var modify_box = document.querySelectorAll(".modify");
var modify_btn = document.querySelectorAll(".modify_btn");

const url_ = new URL(window.location.href);
const urlParams = url_.searchParams;

for (let plan of plans) {
  plan.addEventListener("click", function (e) {
    var id = e.target.dataset.id;   // planID
    urlParams.set('id', id);
    urlParams.set('location', e.target.dataset.location);
    urlParams.set('title', encodeURI(e.target.innerHTML));
    window.open(location.pathname + '?' + urlParams, '_self');
  })
}

if (urlParams.get('id')) {
  place_box.style.display = 'block';
  for (let place of places) {
    if (place.dataset.id == urlParams.get('id')) {
      place.style.display = 'block';
    } else {
      place.style.display = 'none';
    }
  }
  var title = document.querySelector('#bookmark_header p');
  title.innerHTML = decodeURI(urlParams.get('title'));
}

function setHeader(plan_title) {
  console.log(plan_title);
  var title = document.querySelector('#bookmark_header p');
  title.innerHTML = plan_title;
}

function goBack() { // 뒤로 가기
  urlParams.delete('id');
  urlParams.delete('location');
  urlParams.delete('title');
  window.open(location.pathname + '?' + urlParams, '_self');
}


for (let btn of modify_btn) {
  btn.addEventListener("click", function (e) {
    var num = e.target.dataset.num;
    for (let box of modify_box) {
      if (num == box.dataset.num) {
        if (box.style.display == 'block')
          box.style.display = 'none';
        else
          box.style.display = 'block';
      }
    }
  })
}

function delBookmark(id) {
  if (confirm("장소를 삭제하시겠습니까?")) {
    $.ajax({
      url: `/plan/delete_bookmark`,
      type: "POST",
      data: {
        id: id
      },
      dataType: "text",
      success: function (result) {
        alert('북마크 장소가 삭제되었습니다.');
        location.reload();
      },
      error: function () {
        console.log("실패");
        return false;
      }
    })
  }
}

const inputOptions = {};
for (let plan of plans) {
  inputOptions[plan.dataset.id] = plan.innerHTML;
}

// 일정 수정
async function modify(bookID) {
  const { value: planID } = await Swal.fire({
    title: '일정을 선택해주세요 😎',
    input: 'radio',
    width: '600px',
    inputOptions: inputOptions,
    inputValidator: (value) => {
      if (!value) {
        return '일정을 선택해주세요!'
      }
    }
  })

  $.ajax({
    url: `/mypage/modify_bookmark/${bookID}`,
    type: "POST",
    data: {
      planID: planID
    },
    dataType: "text",
    success: function (result) {
      console.log("성공");
      swal.fire({
        type: 'success',
        html: '수정이 완료되었습니다!'
      }).then((isConfirm) => {
        if (isConfirm) location.reload();
        return false;
      });
    },
    error: function () {
      console.log("실패");
      return false;
    }
  })
}

function checkSelectAll() {
  const checkboxes = document.querySelectorAll("input[name='select']");
  const checked = document.querySelectorAll("input[name='select']:checked");
  const selectAll = document.querySelector("input[name='selectAll']");
  // 전체 체크박스의 개수와 체크된 체크박스의 개수 비교
  if (checkboxes.length == checked.length) {
    selectAll.checked = true;
  } else {
    selectAll.checked = false;
  }
}

function selectAll(selectAll) {
  const checkboxes = document.getElementsByName('select');
  checkboxes.forEach((checkbox) => {
    checkbox.checked = selectAll.checked;
  })
}

function delPosts() {
  const checked = document.querySelectorAll("input[name='select']:checked");
  let result = '';
  var delArr = [];

  checked.forEach((el) => {
    result += el.value + ' ';
    delArr.push(el.value);
  })
  console.log(result);
  var delList = { 'data': JSON.stringify(delArr) };
  console.log(delList);

  $.ajax({
    url: "/mypage/delete_posts",
    type: "POST",
    traditional: true,
    data: { data: delArr },
    success: function (result) {
      console.log('success');
      swal.fire({
        type: 'success',
        html: '선택한 게시글이 모두 삭제되었습니다.'
      }).then((isConfirm) => {
        if (isConfirm) location.reload();
        return false;
      })
    },
    error: function (err) {
      console.log('fail');
    }
  })
}

function get_cookie(name) {
  let matches = document.cookie.match(new RegExp(
    "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
  ));
  return matches ? decodeURIComponent(matches[1]) : undefined;
}

if(get_cookie('text')){
  var back_btn = document.querySelector("#bookmark_header button");
  console.log(back_btn);
  back_btn.innerHTML = '뒤로가기';
}