var gyeonggi = gyeonggi_data;
    var gangwon = gw_data;
    var chungbuk = cb_data;
    var chungnam = cn_data;
    var gyeongbuk = gb_data;
    var gyeongnam = gn_data;
    var jeonbuk = jb_data;
    var jeonnam = jn_data;

function categoryChange(e){
    const sigun = document.querySelector("#sigun");

    if( sigun.style.visibility == 'hidden')
        sigun.style.visibility = 'visible';
    
    if(e.value == "31") {
        var add = gyeonggi;
    } else if(e.value == "32") {
        var add = gangwon;
    } else if(e.value == "33") {
        var add = chungbuk;
    } else if(e.value == "34") {
        var add = chungnam;
    } else if(e.value == "35") {
        var add = gyeongbuk;
    } else if(e.value == "36") {
        var add = gyeongnam;
    } else if(e.value == "37") {
        var add = jeonbuk;
    } else if(e.value == "38") {
        var add = jeonnam;
    } else{
        sigun.style.visibility = 'hidden';
    }

    sigun.options.length = 0;

    for (x in add) {
		var opt = document.createElement("option");
		opt.value = add[x].rnum;
		opt.innerHTML = add[x].name;
		sigun.appendChild(opt);
	}	
}