const btn = document.querySelector('.more_btn');
const report_box = document.querySelector('#report');

if (btn) {
    btn.addEventListener("click", function (e) {
        if (report_box.style.display == 'block') {
            report_box.style.display = 'none';
        } else {
            report_box.style.display = 'block';
        }
    })
}

function report(postID) {
    const reason = document.getElementsByName('reason');
    console.log(reason);
    for (let r of reason) {
        if (r.checked == true) {
            console.log(r.value);
            $.ajax({
                url: `/board/report_process/${postID}`,
                type: 'POST',
                dataType: 'text',
                data: {
                    value: r.value
                },
                success: function (result) {
                    console.log('success');
                    alert("신고가 성공적으로 접수되었습니다.")
                    window.close();
                },
                error: function (request, status, error) {
                    console.log("code: " + request.status)
                    console.log("message: " + request.responseText)
                    console.log("error: " + error);
                }
            })
        }
    }
}

const img = $('#content img');
const images = [];
for (i of img) {
    var fname = i.src.split('/');
    images.push(decodeURI(fname[3]));   // decodeURI: 한글 깨짐 방지
}
console.log(images);

$.ajax({
    url: '/board/upload_real',
    type: 'POST',
    traditional: true,
    dataType: 'text',
    data: { images: images },
    success: function (result) {
        console.log(result);
    },
    error: function (err) {
        console.log(err);
        console.log('fail');
    }
})

function deletePost(postID) {
    if (confirm("글을 삭제하시겠습니까?")) {
        $.ajax({
            url: `/board/delete/${postID}`,
            type: 'POST',
            traditional: true,
            dataType: 'text',
            data: { images: images },
            success: function (result) {
                console.log('success');
                location.href = 'http://localhost:3000/board/list';
            },
            error: function (request, status, error) {
                console.log("code: " + request.status)
                console.log("message: " + request.responseText)
                console.log("error: " + error);
            }
        })
    }
}