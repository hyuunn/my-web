const contents = document.querySelector('tbody');
const buttons = document.querySelector('.page_buttons');

var e = document.querySelectorAll('table tbody tr');
const numOfContent = document.querySelectorAll('table tbody tr').length;
const maxContent = 15;
const maxButton = 5;
const maxPage = Math.ceil(numOfContent / maxContent);
let page = 1;

const makeButton = (id) => {
    const button = document.createElement('button');
    button.classList.add("button");
    button.dataset.num = id;
    button.innerText = id;
    button.addEventListener("click", (e) => {
        Array.prototype.forEach.call(buttons.children, (button) => {
            if (button.dataset.num)
                button.classList.remove("active");
        });
        e.target.classList.add("active");
        renderContent(parseInt(e.target.dataset.num));
    });
    return button;
}

const goPrevPage = () => {
    page -= maxButton;
    render(page);
};

const goNextPage = () => {
    page += maxButton;
    render(page);
};

const prev = document.createElement("button");
prev.classList.add("button", "prev");
prev.innerText = '<';
prev.addEventListener("click", goPrevPage);

const next = document.createElement("button");
next.classList.add("button", "next");
next.innerText = '>';
next.addEventListener("click", goNextPage);

const renderContent = (page) => {
    while (contents.hasChildNodes()) {
        contents.removeChild(contents.lastChild);
    }
    for (let id = (page - 1) * maxContent; id < page * maxContent && id < numOfContent; id++) {
        contents.appendChild(e[id]);
    }
}
const renderButton = (page) => {
    // 버튼 리스트 초기화
    while (buttons.hasChildNodes()) {
        buttons.removeChild(buttons.lastChild);
    }
    // 화면에 최대 5개의 페이지 버튼 생성

    if (maxPage == 0) // 필터링 결과가 없는 경우
        buttons.appendChild(makeButton(1));
    else {
        for (let id = page; id < page + maxButton && id <= maxPage; id++) {
            buttons.appendChild(makeButton(id));
        }
    }

    // 첫 버튼 활성화
    buttons.children[0].classList.add("active");

    buttons.prepend(prev);
    buttons.append(next);

    // 이전, 다음 페이지 버튼이 필요한지 체크
    if (page - maxButton < 1) buttons.removeChild(prev);
    if (page + maxButton > maxPage) buttons.removeChild(next);
};

const render = (page) => {
    renderContent(page);
    renderButton(page);
};
render(page);

const searchTarget = function (target) {
    console.log(target.value);
    return target.value;
}