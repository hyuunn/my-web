var latitude = 33.4273366;       //위도
var longitude = 126.5758344;    //경도

//var loca = document.getElementById('loca').innerText;
// 마커를 담을 배열입니다
var markers = [];

var mapContainer = document.getElementById('map'), // 지도를 표시할 div 
    mapOption = {
        center: new kakao.maps.LatLng(latitude, longitude), // 지도의 중심좌표
        level: 13 // 지도의 확대 레벨
    };  

// 지도를 생성합니다    
var map = new kakao.maps.Map(mapContainer, mapOption); 

var geocoder = new kakao.maps.services.Geocoder();

//주소로 좌표를 검색합니다
geocoder.addressSearch('대전광역시', function(result, status) {

    // 정상적으로 검색이 완료됐으면 
     if (status === kakao.maps.services.Status.OK) {

        var coords = new kakao.maps.LatLng(result[0].y, result[0].x);

        map.setCenter(coords);
    } 
});    

const Url = new URL(window.location.href);
const urlParams_ = Url.searchParams;
console.log(urlParams_.get('location'))

function setCenter(){
    var location = urlParams_.get('location');
    console.log(location);
    geocoder.addressSearch(location, function(result, status) {

        // 정상적으로 검색이 완료됐으면 
         if (status === kakao.maps.services.Status.OK) {
    
            var coords = new kakao.maps.LatLng(result[0].y, result[0].x);
    
            map.setCenter(coords);
        } 
    }); 

    if(location == null){
        console.log(location);
        map.setLevel(13);
    } else {
        map.setLevel(9);
    }
}

setCenter();

var list = $(".place");
var title = $(".place_title");

displayMarkedPlaces(list, title);

function displayMarkedPlaces(list, title) {
    
    for ( var i=0; i < list.length; i++ ) {
        var lg = title[i].dataset.lng;
        var lt = title[i].dataset.lat;
        var tle = title[i].innerHTML;

        var marker = addMarker(lg, lt),
            itemEl = list[i];
        // 마커와 검색결과 항목에 mouseover 했을때
        // 해당 장소에 인포윈도우에 장소명을 표시합니다
        // mouseout 했을 때는 인포윈도우를 닫습니다
        (function(marker, tle) {
            kakao.maps.event.addListener(marker, 'mouseover', function() {
                displayInfowindow(marker, tle);
            });

            kakao.maps.event.addListener(marker, 'mouseout', function() {
                infowindow.close();
            });

            itemEl.onmouseover =  function () {
                displayInfowindow(marker, tle);
            };

            itemEl.onmouseout =  function () {
                infowindow.close();
            };
        })(marker, tle);

    }

}

function addMarker(lg, lt) {
    var imageSrc = 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png', // 마커이미지의 주소입니다    
        imageSize = new kakao.maps.Size(26, 37), // 마커이미지의 크기입니다
        imageOption = {offset: new kakao.maps.Point(13, 37)}; // 마커이미지의 옵션입니다. 마커의 좌표와 일치시킬 이미지 안에서의 좌표를 설정합니다.

    // 마커의 이미지정보를 가지고 있는 마커이미지를 생성합니다
        var markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imageOption),
            markerPosition = new kakao.maps.LatLng(lt, lg); // 마커가 표시될 위치입니다

        // 마커를 생성합니다
        var marker = new kakao.maps.Marker({
            position: markerPosition, 
            image: markerImage // 마커이미지 설정 
        });

        // 마커가 지도 위에 표시되도록 설정합니다
        marker.setMap(map);
    
    return marker;
}

// 검색 결과 목록이나 마커를 클릭했을 때 장소명을 표출할 인포윈도우를 생성합니다
var infowindow = new kakao.maps.InfoWindow({zIndex:1});
// 검색결과 목록 또는 마커를 클릭했을 때 호출되는 함수입니다
// 인포윈도우에 장소명을 표시합니다
function displayInfowindow(marker, title) {
    var content = '<div class="map_title" style="padding:5px;z-index:1;">' + title + '</div>';
    infowindow.setContent(content);
    infowindow.open(map, marker);
}