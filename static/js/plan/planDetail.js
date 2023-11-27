
function show(btn, box) {
	$(document).ready(function () {
		btn.click(function () {
			if (box.is(":visible")) {
				box.slideUp(500);
			} else {
				box.slideDown(500);
			}

		});
	})
}

$(function () {
	show($(".btn"), $("#update"));
});

$(function () {
	show($("#u-location"), $("#where"));
});

$(function () {
	show($("#u-date"), $("#when"));
});

$(function () {
	show($("#u-title"), $("#w-title"));
});

$(function () {
	show($("#addBtn"), $("#addBox"));
});

const planBox = $("[id^='sBox']");
for (let box of planBox) {
	box.style.width = (100 / planBox.length) + '%';
}

function get_cookie(name) {
    let matches = document.cookie.match(new RegExp(
      "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}

let link = document.querySelectorAll('.link');
let add_btn = document.querySelectorAll('.add_btn');
let del_btn = document.querySelectorAll('.del_btn');

if(get_cookie('text') == 1){
	for(let l of link){
		l.innerHTML = '장소 상세 보기';
	}
	for(let a of add_btn){
		a.innerHTML = '추가';
	}
	for(let d of del_btn){
		d.innerHTML = '삭제';
	}
}

// 여행 일수가 5일 이상인 경우 한 화면에 5일씩 출력
if (planBox.length > 5) {
	const prev = document.querySelector("#prev")
	const next = document.querySelector("#next");
	for (let box of planBox) {
		box.style.width = '20%';
	}
	if(get_cookie('text') == 0){
		prev.style.display = 'block';
		next.style.display = 'block';
	
		var current = 0;
		showSlides(0);
	
		function showSlides(n) {
			for (let box of planBox) {
				box.style.display = "none";
			}
			for (var i = n; i <= n + 4; i++) {  // n~n+4까지만 출력
				planBox[i].style.display = "block";
			}
		}
	
		function prevSlide() {
			if (current > 0) current -= 1;
			else current = 0;
			showSlides(current);
		}
	
		function nextSlide() {
			if (current < planBox.length - 5) current += 1;
			else current = planBox.length - 5;
			showSlides(current);
		}
	}
	
}

const detail_button = $("button[id^='sList']");
$.each(detail_button, function (index, value) {
	var id = value.getAttribute('id');
	var box = $(`div#${id}`);
	$(function () {
		show($(`button#${id}`), box);
	});
})

const add_button = $("button[id^='add']");
$.each(add_button, function (index, value) {
	var id = value.getAttribute('id');
	var box = $(`div#${id}`);
	$(function () {
		show($(`button#${id}`), box);
	});
})

const timeBtn = document.querySelectorAll(".timeBtn");
const timeBox = document.querySelectorAll(".timeBox");

$.each(timeBtn, function (index, btn) {
	//console.log(value.dataset.id);
	var btnId = btn.dataset.id;
	$.each(timeBox, function (index, box) {
		//console.log(value.dataset.id);
		var boxId = box.dataset.id;
		if (btnId == boxId) {
			btn.addEventListener("click", () => {
				if (box.style.display == "block")
					box.style.display = "none";
				else
					box.style.display = "block";
			})
		}
	})
})

var bookBtn = document.querySelector("#bookBtn");
var searchBtn = document.querySelector("#searchBtn");
var bookList = document.querySelector("#bookList");
var placeList = document.querySelector("#menu_wrap");

bookBtn.addEventListener('click', () => {
	bookList.style.display = "block";
	placeList.style.display = "none";
	searchBtn.style.color = "gray";
	bookBtn.style.color = "white";
})
searchBtn.addEventListener('click', () => {
	placeList.style.display = "block";
	bookList.style.display = "none";
	bookBtn.style.color = "gray";
	searchBtn.style.color = "white";
})

if (bookList.style.display == "block")
	bookBtn.style.color = "#0000FF";


const more_btn = $('.more_btn');
const more_box = $('.more_box');

for (let btn of more_btn) {
	btn.addEventListener("click", function (e) {
		console.log(e.target.dataset);
		var id = e.target.dataset.id;
		for (let box of more_box) {
			if (id == box.dataset.id) {
				if (box.style.display == 'block')
					box.style.display = 'none';
				else
					box.style.display = 'block';
			}
		}
	})
}

// 북마크 추가
function addBookmark(index) {
	var title = $(`#place_name_${index}`).text();
	var longitude = $(`#longitude_${index}`).text();
	var latitude = $(`#latitude_${index}`).text();
	var addr = $(`#addr_${index}`).text();
	var placeID = $(`#id_${index}`).text();
	var text = $(`#add_btn${index}`).text();
	var planID = $('#planID').text();
	$.ajax({
		url: `/plan/add_bookmark/${planID}`,
		type: "POST",
		data: {
			title: title,
			longitude: longitude,
			latitude: latitude,
			addr: addr,
			text: text,
			placeID: placeID
		},
		dataType: "text",
		success: function (result) {
			console.log(result);
			alert('북마크에 장소가 추가되었습니다.');
			//location.reload();
		},
		error: function (jqXHR, textStatus, errorThrown) {
			console.log(jqXHR);
			console.log(textStatus);
			console.log(errorThrown);
			return false;
		}
	})
}
// 북마크 삭제
function delBookmark(id) {
	if (confirm("북마크 목록에서 삭제하시겠습니까?")) {
		$.ajax({
			url: `/plan/delete_bookmark`,
			type: "POST",
			data: { id: id },
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

var startDate = $("#startDate").text();
var endDate = $("#endDate").text();
var travel_days = (new Date(endDate).getTime() - new Date(startDate).getTime()) / (24 * 60 * 60 * 1000);

// yyyy-mm-dd
function getDt(dt) {
	const temp = new Date(dt);
	const year = temp.getFullYear();
	const month = temp.getMonth() + 1;
	const date = temp.getDate();

	return `${year}-${month >= 10 ? month : '0' + month}-${date >= 10 ? date : '0' + date}`;
}

var list = [];
const inputOptions = [];
for (var i = 0; i <= travel_days; i++) {
	var d = new Date(startDate);
	d = new Date(d.setDate(d.getDate() + i));
	inputOptions.push(getDt(d));
}

// 일정 추가
async function addToPlan(bId, pId) {
	var bookID = bId;
	var planID = pId;

	const { value: date } = await Swal.fire({
		icon: 'question',
		title: '언제 가실 예정이신가요?',
		text: '여행일을 선택해주세요 😎',
		input: 'radio',
		width: '800px',
		inputOptions: inputOptions,
		inputValidator: (value) => {
			if (!value) {
				return '날짜를 선택해주세요!'
			}
		}

	})
	console.log(date);

	$.ajax({
		url: `/plan/add_to_plan/${planID}`,
		type: "POST",
		data: {
			bookID: bookID,
			date: Number(date) + 1
		},
		dataType: "text",
		success: function (result) {
			console.log("성공");
			swal.fire({
				type: 'success',
				html: '일정에 추가되었습니다!'
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
// 장소 검색 후 일정에 바로 추가
async function add_directly(pId, index) {
	var planID = pId;
	var title = $(`#place_name_${index}`).text();
	var longitude = $(`#longitude_${index}`).text();
	var latitude = $(`#latitude_${index}`).text();
	var addr = $(`#addr_${index}`).text();
	var placeID = $(`#id_${index}`).text();
	var text = $(`#add_btn${index}`).text();

	const { value: date } = await Swal.fire({
		icon: 'question',
		title: '언제 가실 예정이신가요?',
		text: '여행일을 선택해주세요 😎',
		input: 'radio',
		width: '800px',
		inputOptions: inputOptions,
		inputValidator: (value) => {
			if (!value) {
				return '날짜를 선택해주세요!'
			}
		}

	})
	console.log(date);

	$.ajax({
		url: `/plan/add_directly/${planID}`,
		type: "POST",
		data: {
			date: Number(date) + 1,
			title: title,
			longitude: longitude, 
			latitude: latitude,
			placeID: placeID
		},
		dataType: "text",
		success: function (result) {
			console.log("성공");
			swal.fire({
				type: 'success',
				html: '일정에 추가되었습니다!'
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

// 일정 수정
async function updatePlan(sID) {
	const { value: date } = await Swal.fire({
		icon: 'question',
		title: '일정을 변경하시겠어요?',
		text: '변경할 날짜를 선택해주세요.',
		input: 'radio',
		width: '800px',
		inputOptions: inputOptions,
		inputValidator: (value) => {
			if (!value) {
				return '날짜를 선택해주세요!'
			}
		}

	})
	console.log(date);

	$.ajax({
		url: `/plan/update_singlePlan`,
		type: "POST",
		data: {
			singleID: sID,
			date: Number(date) + 1
		},
		dataType: "text",
		success: function (result) {
			console.log("성공");
			swal.fire({
				type: 'success',
				html: '일정에 추가되었습니다!'
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

// 일정 삭제
function delSche(sID) {
	if (confirm("일정을 삭제하시겠습니까?")) {

		$.ajax({
			url: `/plan/delete_schedule`,
			type: "POST",
			data: {
				singleID: sID
			},
			dataType: "text",
			success: function (result) {
				alert('일정이 삭제되었습니다.');
				location.reload();
			},
			error: function () {
				console.log("실패");
				return false;
			}
		})
	}
}

// 시간 추가
function add_time(date, sID) {
	var time = $(`input[name="time${date}${sID}"]`).val();

	$.ajax({
		url: `/plan/add_time`,
		type: "POST",
		data: {
			singleID: sID,
			time: time
		},
		dataType: "text",
		success: function (result) {
			alert('일정에 시간이 추가되었습니다.');
			console.log(result);
			location.reload();
		},
		error: function (request, status, error) {
			console.log("code: " + request.status)
			console.log("message: " + request.responseText)
			console.log("error: " + error);
		}
	})
}

function delete_time(id, time){
	if (time == '') {
		window.alert('지정된 시간이 없습니다.');
	}
	else {
		if (window.confirm('시간을 삭제하시겠습니까?')) {
			$.ajax({
				url: `/plan/delete_time`,
				type: "POST",
				data: {
					id: id
				},
				dataType: "text",
				success: function (result) {
					alert('시간이 삭제되었습니다.');
					location.reload();
				},
				error: function (request, status, error) {
					console.log("code: " + request.status)
					console.log("message: " + request.responseText)
					console.log("error: " + error);
				}
			})
		}
	}
}

async function add_memo(id, memo) {
	var placeholder = '메모를 입력해주세요.';
	if (memo != ''){
		placeholder = memo;
	}
	const { value: text } = await Swal.fire({
		input: 'textarea',
		inputLabel: '메모를 추가해보세요.',
		inputPlaceholder: placeholder,
		inputValue: placeholder,
		showCancelButton: true,
		confirmButtonText: '저장',
		cancelButtonText: '취소',
		inputValidator: (text) => {
			if (!text) {
				return '내용을 입력해주세요!'
			}
		}
	})

	if (text) {
		$.ajax({
			url: `/plan/add_memo`,
			type: "POST",
			data: {
				id: id,
				memo: text
			},
			dataType: "text",
			success: function (result) {
				alert('메모가 추가되었습니다.');
				location.reload();
			},
			error: function (request, status, error) {
				console.log("code: " + request.status)
				console.log("message: " + request.responseText)
				console.log("error: " + error);
			}
		})
	}
}

function delete_memo(id, memo) {
	console.log(memo);
	if (memo == '') {
		window.alert('작성된 메모가 없습니다.');
	}
	else {
		if (window.confirm('메모를 삭제하시겠습니까?')) {
			$.ajax({
				url: `/plan/delete_memo`,
				type: "POST",
				data: {
					id: id
				},
				dataType: "text",
				success: function (result) {
					alert('메모가 삭제되었습니다.');
					location.reload();
				},
				error: function (request, status, error) {
					console.log("code: " + request.status)
					console.log("message: " + request.responseText)
					console.log("error: " + error);
				}
			})
		}
	}

}

// 일정 순서 변경 기본 세팅
var orderBtn = document.querySelector("#setOrder");
var orderP = document.querySelector('#orderP')
var saveBtn = document.querySelector('#saveBtn')
var addBtn = document.querySelector('#addBtn')

function setOrder() {
	console.log(orderBtn);
	if (orderP.style.display == "none")
		orderP.style.display = "block";
	else
		orderP.style.display = "none";

	if (saveBtn.style.display == "block")
		saveBtn.style.display = "none";
	else
		saveBtn.style.display = "block";

	var s_list = document.getElementsByClassName('sList');

	for (var i = 0; i < s_list.length; i++) {
		if (s_list[i].getAttribute('draggable'))
			s_list[i].removeAttribute('draggable');
		else
			s_list[i].setAttribute('draggable', 'true');
	}
	addBtn.onclick = function () {
		if (orderP.style.display == "block")
			orderP.style.display = "none";

		if (saveBtn.style.display == "block")
			saveBtn.style.display = "none";
	}
}


// 드래그 앤 드롭 
(() => {
	const $ = (select) => document.querySelectorAll(select);
	const draggables = $('.sList');
	const containers = $('ul[id^="sList"]');

	draggables.forEach(el => {
		el.addEventListener('dragstart', () => {
			el.classList.add('dragging');
		});

		el.addEventListener('dragend', () => {
			el.classList.remove('dragging')
		});
	});

	function getDragAfterElement(container, y) {
		const draggableElements = [...container.querySelectorAll('.sList:not(.dragging)')]

		return draggableElements.reduce((closest, child) => {
			const box = child.getBoundingClientRect() //해당 엘리먼트에 top값, height값 담겨져 있는 메소드를 호출해 box변수에 할당
			const offset = y - box.top - box.height / 2 //수직 좌표 - top값 - height값 / 2의 연산을 통해서 offset변수에 할당
			if (offset < 0 && offset > closest.offset) { // (예외 처리) 0 이하 와, 음의 무한대 사이에 조건
				return { offset: offset, element: child } // Element를 리턴
			} else {
				return closest
			}
		}, { offset: Number.NEGATIVE_INFINITY }).element
	};

	containers.forEach(container => {
		container.addEventListener('dragover', e => {
			//console.log(e);
			e.preventDefault()
			const afterElement = getDragAfterElement(container, e.clientY);
			//console.log(afterElement);
			const draggable = document.querySelector('.dragging');
			//console.log(draggable);  // 드래그한 요소
			// container.appendChild(draggable)
			container.insertBefore(draggable, afterElement)
		})
		container.addEventListener('dragend', e => {
			console.log(e);
			console.log('드래그 끝');
		})
	});
})();

var temp = document.querySelector('#s_list323');

var day = $("div[id^='sBox']");
var list = $(".sList button[id^='sList']");
console.log(list);
console.log(day[0].getAttribute('id').split('_')[1]);

// 일정 순서 변경사항 저장
function saveChange() {
	var res = '';
	var list = $("ul[id^='sList']");
	var idArr = [],
		date = [];
	list.each(function (index, element) {
		var str = element.getAttribute('id').split('_');	//ul#sList_date
		date.push(str[1]);
		var child = element.childNodes;	// li

		for (var i = 0; i < child.length; i++) {
			if (child[i].className) {		// li .sList
				var grandchild = child[i].childNodes;	// button#sList_date_singleID

				for (var j = 0; j < grandchild.length; j++) {
					if (grandchild[j].tagName == 'BUTTON' && grandchild[j].className != 'link') {
						console.log(grandchild[j]);

						var idName = grandchild[j].getAttribute("id").split('_');
						var sID = idName[2];
						idArr.push([date[index], sID]);
					}
				}
			}
		}


	})
	console.log(idArr[0][0], idArr[0][1]);
	$.ajax({
		url: `/plan/update_order`,
		type: "POST",
		data: {
			singleID: JSON.stringify(idArr)
		},
		dataType: "text",
		success: function (result) {
			console.log('success');
			alert('일정 순서가 변경되었습니다!');
			location.reload();
		},
		error: function (err) {
			console.log("실패");
			return false;
		}
	})
}

function updown_number(singleID, ud){
	$.ajax({
		url: `/plan/updown_number`,
		type: "POST",
		data: {
			singleID: singleID,
			updown: ud
		},
		dataType: "text",
		success: function (result) {
			console.log('success');
			location.reload();
		},
		error: function (err) {
			console.log("실패");
			return false;
		}
	})
}