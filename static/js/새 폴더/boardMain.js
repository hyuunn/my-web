const planBox = document.querySelector(".planBox div");
const bottomBox = document.querySelector(".bottomBox div");

function area(sido,sigun){
    
    var array;
    if(sido==1){//서울
        array='서울'
        return array;
    }
    else if(sido ==2){//인천{
        array='인천'
        return array;
    }
    else if(sido ==3){//대전
        array='대전'
        return array;
    }else if(sido ==4){//대구
        array='대구'
        return array;
    }
    else if(sido ==5){//광주
        
        array='광주'
        return array;
    }
    else if(sido ==6){//부산
        array='부산'
        return array;
    }else if(sido ==7){//울산
        array='울산'
        return array;
    }else if(sido ==8){//세종
        array='세종'
        return array;
    }else if(sido ==33){//충북

        array="충북 / "+cb_data[sigun-1].name
        return array;
        
    }else if(sido ==31){//경기
        array="경기 / "+gyeonggi_data[sigun-1].name
        return array;
    
    }else if(sido ==32){//강원
        array="강원 / "+ gw_data[sigun-1].name
        return array;
        
    }else if(sido ==34){//충남
        array="충남 / "+cn_data[sigun-1].name
        return array;
        
    }else if(sido ==35){//경북
        array="경북 / "+gb_data[sigun-1].name
        return array;
        
    }else if(sido ==36){//경남
        array="경남 / "+ gn_data[sigun-1].name
        return array;
       
    }else if(sido ==37){//전북
        array="전북 / "+jb_data[sigun-1].name
        return array;
       
    }else if(sido ==38){//전남
        array="전남 / "+jn_data[sigun-1].nam
        return array;
        
    }else if(sido ==39){//제주
        array="제주"
        return array;
       
    }
}

$.ajax({
    url: `/board/readTopPost/1`,
    type: "get",
    data: {},
    dataType: "JSON",
    success: async function (data) {
        var handicap;
        for (var i = 0; i < data.length; i++) {
            
                // 각 조건문을 if-else if 구조로 수정하여 중복 실행을 방지합니다.
                if (data[i].barrier == '4') {
                    handicap = '🤱';
                } else if (data[i].barrier_category == '1') {
                    handicap = '👀';
                } else if (data[i].barrier_category == '2') {
                    handicap = '👂';
                } else if (data[i].barrier_category == '3') {
                    handicap = '🧑‍🦽';
                } else if (data[i].barrier_category == '0') {
                    handicap = '✔️';
                }
            
            console.log(handicap);
            planBox.insertAdjacentHTML("beforeend", `
        
            <div class="Bcard col-3 card-1" style="width:300px;">
            <div class="header" style="width:100%;" >
            <span >❤️+${data[i].recommend} </span>
            </div>
            <hr>
            <div class="Bcard-body ">
            <p style="position: relative; top:15px;font-size:14px;"><b>${handicap}${data[i].title}</b></p>
            <span style="font-size:12px;">${data[i].userID}</span>
           <a href="/board/post/${data[i].postID}"> <button class="cardBt">🔍</button></a>
            </div>
            
        </div>
        `)
        }
        planBox.insertAdjacentHTML("beforeend", `
        <div style="flex-basis:100%; height:90px;display:flex;align-items:center; justify-content:center;">
    <i class="fa-solid fa-angles-down fa-xl" style="color: #787878;"></i>
</div>
        `)

    },
    error: function (error) {
        // 에러 처리

    }
});

$.ajax({
    url: `/board/readTopPost/0`,
    type: "get",
    data: {},
    dataType: "JSON",
    success: async function (data) {
        var handicap;
        for (var i = 0; i < data.length ; i++) {

            if (data[i].barrier_category  == 4) {
                handicap = '🤱';
            } else if (data[i].barrier_category == 1) {
                handicap = '👀';
            } else if (data[i].barrier_category == 2) {
                handicap = '👂';
            } if (data[i].barrier_category  == 3) {
                handicap = '🧑‍🦽';
            } if (data[i].barrier_category  == 0) {
                handicap = '✔️';
            }
            console.log(handicap);
            

            bottomBox.insertAdjacentHTML("beforeend", `
        
            <div class="Bcard col-3 card-1" style="width:300px;">
            <div class="header" style="width:100%;" >
            <span >❤️+${data[i].recommend} </span>
            </div>
            <hr>
            <div class="Bcard-body ">
            <p style="position: relative; top:15px;font-size:14px;"><b>${handicap}${data[i].title}</b></p>
            <span style="font-size:12px;">${data[i].userID}</span>
           <a href="/board/post/${data[i].postID}"> <button class="cardBt">🔍</button></a>
            </div>
            
        </div>
        `)
        }
        bottomBox.insertAdjacentHTML("beforeend", `
        <div style="flex-basis:100%; height:90px;display:flex;align-items:center; justify-content:center;">
    <i class="fa-solid fa-angles-down fa-xl" style="color: #787878;"></i>
</div>
        `)

    },
    error: function (error) {
        // 에러 처리

    }
});

var icon = document.querySelector(".writeIcon");
var writeMenu = document.querySelector(".writeMenu");
var tri = document.querySelector(".tri");

function icon_click(){
    writeMenu.classList.toggle("noDisplay");
    tri.classList.toggle("noDisplay");
}
icon.addEventListener('click', function () { icon_click(); });