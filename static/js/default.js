$(document).ready(function(){
    $("#create").click(function(){
       var box = $("#scheBox");

       if(box.is(":visible")){
            box.slideUp(500);
       } else{
            box.slideDown(500);
       }

    });
})


