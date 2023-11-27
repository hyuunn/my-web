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

function getDt(dt){
  const temp = new Date(dt);
  const year = temp.getFullYear();
  const month = temp.getMonth() + 1;
  const date = temp.getDate();

  return `${year}-${month >= 10 ? month : '0' + month}-${date >= 10 ? date : '0' + date}`;
}

var title = document.getElementsByClassName('card-title');
var start = document.getElementsByClassName('start');
var el_end = document.getElementsByClassName('end');

var end = [];

for(var i = 0; i < title.length; i++){
  end[i] = el_end[i].textContent;
  var d = new Date(end[i]);
  d = new Date(d.setDate(d.getDate() + 1));
  end[i] = getDt(d);
}

var data = [];

for(i in title){
  data.push({
    title: title[i].textContent,
    start: start[i].textContent,
    end: end[i]
  })
}

console.log(data);

var now = new Date();
document.addEventListener('DOMContentLoaded', function() {
  var calendarEl = document.getElementById('calendar');

  var calendar = new FullCalendar.Calendar(calendarEl, {
    locale: 'kor',
    initialDate: now,
    //editable: true,
    selectable: true,
    businessHours: true,
    dayMaxEvents: true, // allow "more" link when too many events
    events: data
  });

  calendar.render();
});
