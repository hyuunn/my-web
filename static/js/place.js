// http://localhost:3000/place/content/시도/시군/contenttypeid/contentid

const place = document.getElementsByClassName("place_title");
const link_btn = document.getElementsByClassName("link");

for (let p of place) {
    p.addEventListener("click", function (e) {
        console.log(e.target.innerHTML);
        console.log(e.target.dataset.placeid)
        var id = e.target.dataset.placeid;
        var keyword = e.target.innerHTML;
        read_image(keyword, id);
    })
}
for (let link of link_btn) {
    link.addEventListener("click", function (e) {
        console.log(e.target.dataset.title);
        console.log(e.target.dataset.placeid)
        var id = e.target.dataset.placeid;
        var keyword = e.target.dataset.title;
        read_image(keyword, id);
    })
}

async function read_image(title, id) {//이미지를 읽어오는부분
    const encodedText = encodeURIComponent(title);
    //console.log(encodedText);
    const url = `https://apis.data.go.kr/B551011/KorWithService1/searchKeyword1?numOfRows=10&pageNo=1&MobileOS=etc&MobileApp=test&keyword=${encodedText}&_type=json&serviceKey=TUMOhRKkJOHxh3bBw093oFlLM7YLA4Bo%2BfiXMnMWNU7uIMCjmG%2FAWH81KDyafJNQROiq97v%2BPEp7IwjKfmxDOw%3D%3D`;
    image_data = await fetch(url)
        .then((response) => response.json())
        .then(data => {
            //console.log(data);
            let items = data.response.body.items.item;
            if (items != undefined) {
                console.log(items);
                var sido = items[0].areacode;
                var sigun = items[0].sigungucode;
                if((sido >= 1 && sido <= 8) || sido == 39){ // 광역시
                    sigun = 0;
                } 
                var ctypeid = items[0].contenttypeid;
                var contentid = items[0].contentid;
                console.log(sigun)
                location.href = `http://localhost:3000/place/content/${sido}/${sigun}/${ctypeid}/${contentid}`;
            } else {
                console.log("undefined");
                location.href = `http://localhost:3000/board/undefinedPlace/${id}`;
            }
        });
}

