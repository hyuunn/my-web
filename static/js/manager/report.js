// 읽음 표시
function checked(post) {
  const tr = post.parentNode.parentNode;
  const manageId = tr.dataset.id;

  $.ajax({
    url: "/manager/update_progress",
    type: "POST",
    data: { id: manageId },
    success: function (result) {
      console.log(result);

    },
    error: function (err) {
      console.log('fail');
    }
  })
}

// 누적 신고 수 내림차순 정렬
function sortTable(n) {
  var table, rows, switching, o, x, y, shouldSwitch, dir, switchcount = 0;
  table = document.getElementById('report_table');
  switching = true;
  dir = 'desc';

  while (switching) {
    switching = false;
    rows = table.getElementsByTagName('tr');

    for (o = 1; o < (rows.length - 1); o++) {
      shouldSwitch = false;
      x = rows[o].getElementsByTagName('td')[n];
      y = rows[o + 1].getElementsByTagName('td')[n];
  
      if (x.innerHTML < y.innerHTML) {
        shouldSwitch = true;
        break;
      }

      // if (dir == 'asc') {
      //   if (x.innerHTML > y.innerHTML) {
      //     shouldSwitch = true;
      //     break;
      //   }
      // } else if (dir == 'desc') {
      //   if (x.innerHTML < y.innerHTML) {
      //     shouldSwitch = true;
      //     break;
      //   }
      // }
    }
    if (shouldSwitch) {
      rows[o].parentNode.insertBefore(rows[o + 1], rows[o]);
      switching = true;
      switchcount++;
    } else {
      // 원래대로 되돌리기
      if (switchcount == 0) {
        sortTable(0);
      }
    }
  }
}

function show_box(count, id){
  const box = document.querySelectorAll('.delete_reported');

  for(b of box){
    if(id == b.dataset.id){
      if(b.style.display == 'block')
        b.style.display = 'none';
      else
        b.style.display = 'block';
    }
  }
}

function del_reported(postID, userID){
  if(window.confirm("게시글 삭제를 진행합니다. 계속하시겠습니까?")){
    $.ajax({
      url: "/manager/delete_reported",
      type: "POST",
      data: { 
        postID: postID,
        userID: userID
      },
      success: function (result) {
        if(result == 'success'){
          alert('회원님에게 신고로 인한 게시글 삭제 안내 메일을 전송했습니다.');
          location.reload();
        }
      },
      error: function (err) {
        console.log('fail');
      }
    })
  }
}