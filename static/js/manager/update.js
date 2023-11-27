const handi = document.querySelector('.handicap')
var infantsfamily = { "stroller": "유모차", "lactationroom": "수유실", "babysparechair": "유아용 보조 의자", "infantsfamilyetc": "영유아가족 기타 지원 항목" };
var handicap = { "parkig": "주차 여부", "route": "대중교통", "publictransport": "접근로", "ticketoffice": "매표소", "promotion": "홍보물", "wheelchair": "휠체어", "exit": "출입통로", "elevator": "엘리베이터", "restroom": "화장실", "auditorium": "관람석", "room": "객실", "handicapetc": "기타 지원 항목" };
var blindhandicap = { "braileblock": "점자블록", "helpdog": "보조견 동반", "guidehuman": "안내요원", "audioguide": "오디오 가이드", "bigprint": "큰활자 홍보물", "brailepromotion": "점자 홍보물 및 점자 표지판", "guidesystem": "유도안내설비", "blindhandicapetc": "기타 지원 항목" };
var hearinghandicap = { "signguide": "수화안내", "videoguide": "자막 비디오 가이드 및 영상 자막 안내", "hearinghandicapetc": "기타 지원 항목", "hearingroom": "객실" };


progress = document.querySelectorAll('.progressP')
var modalId;
progress.forEach(progress => {
  progress.addEventListener('click', changeProgress);
});
progressMenu = document.querySelectorAll('#menu')

function changeProgress(event) {
  const value = event.target.getAttribute('value');
  const parentElement = event.target.parentElement;
  const id = parentElement.getAttribute('value');
  console.log(id)

  $.ajax({
    url: "/manager/progress",
    type: "POST",
    traditional: true,
    data: { id: id, progress: value },
    success: function (result) {
      console.log(result)
      location.reload();
    },
    error: function (err) {
      console.log(err);
    }
  })
}

progressMenu.forEach(progressMenu => {
  progressMenu.addEventListener('click', toggleDiv);
});

function toggleDiv(event) {
  id = event.target.getAttribute('value')
  progressDiv = document.querySelector(`#hidden${id}`)
  progressDiv.classList.toggle('none');
}

//modal
const modalClose = document.querySelectorAll('.modal_closeBT')

modalClose.forEach(modalClose => {
  modalClose.addEventListener('click', modal_close);
});
const modalOpen = document.querySelectorAll('.modalOpen')

modalOpen.forEach(modalOpen => {
  modalOpen.addEventListener('click', modalDiv);
});

const modal = document.querySelector(".modal");

function modal_close() {

  while (imgDiv.firstChild) {
    imgDiv.removeChild(imgDiv.firstChild);
  }
  while (description.firstChild) {
    description.removeChild(description.firstChild);
  }
  // progressDiv = document.querySelector(`#hidden${id}`)
  modal.classList.toggle('none');
  location.reload();
}

const modal_title = document.querySelector('.modal_title')
const description = document.querySelector('.description')
const imgDiv = document.querySelector('.img')
const modal_date = document.querySelector('.modal_date');
var modalSelect = document.querySelectorAll('.modalProgress')

async function modalDiv(event) {
  var Element = event.target;
  var progressTemp = Element.nextElementSibling.nextElementSibling.textContent;

  var selectNum = 1;
  console.log(progressTemp)
  if (progressTemp.includes('미완료')) {
    selectNum = 0
  }
  else if (progressTemp.includes('진행중')) {
    selectNum = 1
  }
  else if (progressTemp.includes('완료')) {
    selectNum = 2
  }
  console.log(selectNum);
  modalSelect.forEach((select) => {
    select.selectedIndex = selectNum;
  });
  console.log(progressTemp);
  console.log('div')
  id = event.target.getAttribute('value')
  $.ajax({
    url: "/manager/getinfo",
    type: "POST",
    traditional: true,
    data: { id: id },
    success: async function (result) {
      console.log(result)
      modal_title.textContent = '#' + result[0].title
      //const dateObject = new Date(result[0].date);
      // yy.mm.dd hh:mm
        const temp = new Date(result[0].date);
        const year = temp.getFullYear();
        const month = temp.getMonth() + 1;
        const date = temp.getDate();
        const hour = temp.getHours();
        const min = temp.getMinutes();

        const modalDate =  `${year - 2000}.${month >= 10 ? month : '0' + month}.${date >= 10 ? date : '0' + date}  ${hour >= 10 ? hour : '0' + hour}:${min >= 10 ? min : '0' + min}`;
      
      modal_date.textContent = modalDate;
      description.insertAdjacentHTML(
        "beforeend",
        `<p>${result[0].description}</p>`);

        result = result[0]
        
        console.log(result.sido)
        while (handi.firstChild) {
          handi.removeChild(handi.firstChild);
        }
        const filePath = `/tourApi/${result.sido}/${result.sigun}/${result.contentType}.json`
      
        // 장애 편의시설 정보 나타내는 부분
        const content = result.contentID
        place_data = fetch(filePath)
          .then((response) => response.json())
          .then(data => {
            console.log(result.contentID);
            if (data[content].handicap == "1") {
              handi.insertAdjacentHTML(
                "beforeend",
                `<p class="handicapTitle"><b>지체장애 편의시설</b></p>`);
              handi.insertAdjacentHTML(
                "beforeend",
                `<table class="handiTB" style="width:100%;"></table>`);
              var handiTB = document.querySelector(".handiTB");
              for (const item of data[content].handi) {
                const key = Object.keys(item)[0];
                const value = item[key];
                handiTB.insertAdjacentHTML(
                  "beforeend",
                  `<tr ><td style="width:30%;"><span><b>${key}&nbsp;</b></span></td><td><span> ${value}</span></td></tr>`);
                console.log(`키: ${key}`);
                console.log(`값: ${value}`);
              }
              handi.insertAdjacentHTML(
                "beforeend",
                `<br><br>`);
      
            }
            if (data[content].blindhandicap == "1") {
              handi.insertAdjacentHTML(
                "beforeend",
                `<p class="handicapTitle"><b>시각장애 편의시설</b></p>`);
              handi.insertAdjacentHTML(
                "beforeend",
                `<table class="blindTB" style="width:100%;"></table>`);
              var blindTB = document.querySelector(".blindTB");
              for (const item of data[content].blind) {
                const key = Object.keys(item)[0];
                const value = item[key];
                blindTB.insertAdjacentHTML(
                  "beforeend",
                  `<tr><td style="width:30%;"><span><b>${key}&nbsp;</b></span></td><td><span> ${value}</span></td></tr>`);
                console.log(`키: ${key}`);
                console.log(`값: ${value}`);
              }
              handi.insertAdjacentHTML(
                "beforeend",
                `<br><br>`);
      
            }
            if (data[content].hearinghandicap == "1") {
              handi.insertAdjacentHTML(
                "beforeend",
                `<p class="handicapTitle"><b>청각장애 편의시설</b></p>`);
              handi.insertAdjacentHTML(
                "beforeend",
                `<table class="hearTB" style="width:100%;"></table>`);
              var hearTB = document.querySelector(".hearTB");
              for (const item of data[content].hearing) {
                const key = Object.keys(item)[0];
                const value = item[key];
                hearTB.insertAdjacentHTML(
                  "beforeend",
                  `<tr><td style="width:30%;"><span><b>${key}&nbsp;</b></span></td><td><span> ${value}</span></td></tr>`);
                console.log(`키: ${key}`);
                console.log(`값: ${value}`);
              }
              handi.insertAdjacentHTML(
                "beforeend",
                `<br><br>`);
            }
            if (data[content].infantsfamily == "1") {
              handi.insertAdjacentHTML(
                "beforeend",
                `<p class="handicapTitle"><b>영유아동반 편의시설</b></p>`);
              handi.insertAdjacentHTML(
                "beforeend",
                `<table class="familyTB" style="width:100%;"></table>`);
              var familyTB = document.querySelector(".familyTB");
              for (const item of data[content].family) {
                const key = Object.keys(item)[0];
                const value = item[key];
                familyTB.insertAdjacentHTML(
                  "beforeend",
                  `<tr><td style="width:30%;"><span><b>${key}&nbsp;</b></span></td><td><span> ${value}</span></td></tr>`);
                console.log(`키: ${key}`);
                console.log(`값: ${value}`);
              }
              handi.insertAdjacentHTML(
                "beforeend",
                `<br><br>`);
      
            }
            // 여기에서 data 변수를 사용하거나 적절하게 처리할 수 있습니다.
          });
      imgDiv.insertAdjacentHTML(
        "beforeend",
        `<img class="image" src="/update_inform_img/${result.image}"></img>`);

    },
    error: function (err) {
      console.log(err);

    }
  })
  // progressDiv = document.querySelector(`#hidden${id}`)
  modal.classList.toggle('none');
}

async function read_handicap(result) {
 


}

modalSelect.forEach(modalSelect => {
  modalSelect.addEventListener('change', selectChange);
});

function selectChange(event) {
  var selectedValue = event.target.value;
  console.log(selectedValue);
  $.ajax({
    url: "/manager/progress",
    type: "POST",
    traditional: true,
    data: { id: id, progress: selectedValue },
    success: function (result) {
      console.log(result)

    },
    error: function (err) {
      console.log(err);
    }
  })
}



// 삭제 
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
    url: "/manager/update/delete",
    type: "POST",
    traditional: true,
    data: { data: delArr },
    success: function (result) {
      console.log('success');
      swal.fire({
        type: 'success',
        html: '모두 삭제되었습니다.'
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