function checkSelectAll() {
    const checkboxes = document.querySelectorAll("input[name='select']");
    const checked = document.querySelectorAll("input[name='select']:checked");
    const selectAll = document.querySelector("input[name='selectAll']");
    // 전체 체크박스의 개수와 체크된 체크박스의 개수 비교
    if (checkboxes.length == checked.length) {
      selectAll.checked = true;
    } else {
      selectAll.checked = false;
    }
  }
  
  function selectAll(selectAll) {
    const checkboxes = document.getElementsByName('select');
    checkboxes.forEach((checkbox) => {
      checkbox.checked = selectAll.checked;
    })
  }
  
    function delPosts() {
      const checked = document.querySelectorAll("input[name='select']:checked");
      let result = '';
      var delArr = [];
    
      checked.forEach((el) => {
        result += el.value + ' ';
        delArr.push(el.value);
      })
      console.log(result);
      var delList = { 'data': JSON.stringify(delArr) };
      console.log(delList);
    
      $.ajax({
        url: "/mypage/delete_comments",
        type: "POST",
        traditional: true,
        data: { data: delArr },
        success: function (result) {
          var ment ;
          if(result == 'comment'){
            ment ='선택한 댓글이 모두 삭제되었습니다.'
          }else if(result =='recommend'){
            ment ='선택한 게시글의 좋아요가 모두 해제되었습니다.'
          }
          console.log('success');
          swal.fire({
            type: 'success',
            html: ment,
          }).then((isConfirm) => {
            if (isConfirm) location.reload();
            return false;
          })
        },
        error: function (err) {
          console.log(err);
        }
      })
    }