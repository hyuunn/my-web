const url = new URL(window.location.href);
const urlParmas = url.searchParams;
console.log(url);

function changeBtn(buttons) {
    buttons.forEach(element => {
        element.addEventListener("click", (e) => {
            buttons.forEach(el => {
                el.classList.remove("active");
            })
            e.target.classList.add("active");
        })
    });
}

var category = 'false';
var barr_category = 'false';

function filtering(el, category) {   // 카테고리별 필터링
    var value = el.getAttribute('id');
    el.addEventListener('click', function () {
        var current = urlParmas.get(category);
        if (value == 'all' || value == 'b_all')
            urlParmas.delete(category);
        else {
            if (current) {
                urlParmas.set(category, value);
            }
            else
                urlParmas.append(category, value);

        }
        window.open(location.pathname + '?' + urlParmas, '_self');
    })
}

var post_cate = document.querySelectorAll('#post_cate li button');
var barrier_cate = document.querySelectorAll('#barrier_cate li button');

post_cate.forEach(function (e, i) {  // 게시글 카테고리
    filtering(e, 'category');
    console.log(urlParmas.get('category'));
    post_cate.forEach(el => {
        if (el.getAttribute('id') == urlParmas.get('category')) {
            post_cate[0].classList.remove("active");
            el.classList.add("active");
        }
    })

});

barrier_cate.forEach(function (e, i) {   // 장애 유형
    filtering(e, 'barrier_category');
    barrier_cate.forEach(el => {
        if (el.getAttribute('id') == urlParmas.get('barrier_category')) {
            barrier_cate[0].classList.remove("active");
            el.classList.add("active");
        }
    })
});
// 지역 코드
const region_cate = {
    'seoul': 1, 'gyeonggi': [2, 31], 'gangwon': 32, 'chungcheong': [3, 8, 33, 34],
    'gyeongbuk': [4, 35], 'gyeongnam': [6, 7, 36], 'jeolla': [5, 37, 38], 'jeju': 39
}

// 지역별 필터링
function filteringRegion(value) {
    console.log(value);

    var row = document.getElementsByTagName('tr');

    if (value == 'all') { // 전체
        for (let r of row) {
            r.style.display = '';
        }
    }
    else {
        var code = region_cate[value];

        for (var i = 1; i < row.length; i++) {
            if (typeof (code) == 'number') {    // code 값이 하나인 경우
                if (code != row[i].dataset.code) {  // 값이 다르면 숨김
                    row[i].style.display = 'none';
                } else {
                    row[i].style.display = '';
                }
            }
            else {
                row[i].classList.remove('active');
                for (let c of code) {
                    if (c != row[i].dataset.code) {
                        if(row[i].classList.contains('active') && row[i].style.display == '')
                            continue;
                        else
                            row[i].style.display = 'none';
                    } else {
                        row[i].style.display = '';
                        row[i].classList.add('active');
                    }
                }
            }

        }
    }
}

// 검색
function searchKeyword() {
    var keyword = document.querySelector('input[name=keyword]').value;
    var search_target = $("select[name=search_target]").val();

    if (!keyword) {
        alert("검색어를 입력해주세요.");
        return false;
    }
    var current = urlParmas.get('search_keyword');
    if (current) {
        urlParmas.set('search_target', search_target);
        urlParmas.set('search_keyword', keyword);
    }
    else {
        urlParmas.append('search_target', search_target);
        urlParmas.append('search_keyword', keyword);
    }
    console.log(urlParmas.toString());
    window.open(location.pathname + '?' + urlParmas, '_self');
}

if (urlParmas.get('search_keyword')) {
    $('input[name=keyword]').attr("value", urlParmas.get('search_keyword'));
    $(`option[value=${urlParmas.get('search_target')}]`).attr('selected', 'selected');
}