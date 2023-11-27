const url = new URL(window.location.href);
const urlParmas = url.searchParams;
const postID = url.pathname.split('/')[3];
const planID = url.pathname.split('/')[4];
// const postID = urlParams.get('postID');
// const planID = urlParams.get('planID');

console.log(url);

if (planID != 'false') {
    $(`#plan option[value=${planID}]`).attr('selected', 'selected');
    // var single_plans = $("[id^='sList']");
    // console.log(single_plans);
    // single_plans.each((i, el) => {
    //     console.log(i);
    //     console.log(el.textContent);
    //     el.click(function () {
    //         console.log(el);
    //         $('#summernote').summernote('editor.insertText', el.textContent);
    //     })
       
    // })
}
$(document).ready(function () {
    if (postID != 'false'){ //글수정하는 부분 summernote 세팅
        $('#summernote').summernote({
            height: 500, // set editor height
            minHeight: null, // set minimum height of editor
            maxHeight: null, // set maximum height of editor
            focus: true,
            lang: 'ko-KR', // 기본 메뉴언어 US->KR로 변경
            callbacks: {
                onImageUpload: function (files) {
                    // for (var i = files.length - 1; i >= 0; i--) {
                    //     sendFile(files[i], this);
                    // }
                    sendFile(files[0], this);
                },
                onMediaDelete: function(target){
                    deleteFile(target[0].src);
                }
            },
            toolbar: [
                ['style', ['style']],
                ['font', ['bold', 'underline', 'clear']],
                ['fontname', ['fontname']],
                ['color', ['color']],
                ['para', ['ul', 'ol', 'paragraph']],
                ['table', ['table']],
                ['insert', ['link', 'picture', 'video']],
                ['view', ['fullscreen', 'codeview', 'help']],
              ],
            popover: {
                image: [
                  ['image', ['resizeFull', 'resizeHalf', 'resizeQuarter', 'resizeNone']],
                  ['float', ['floatLeft', 'floatRight', 'floatNone']],
                  ['remove', ['removeMedia']]
                ],
                link: [
                  ['link', ['linkDialogShow', 'unlink']]
                ],
                table: [
                  ['add', ['addRowDown', 'addRowUp', 'addColLeft', 'addColRight']],
                  ['delete', ['deleteRow', 'deleteCol', 'deleteTable']],
                ],
                air: [
                  ['color', ['color']],
                  ['font', ['bold', 'underline', 'clear']],
                  ['para', ['ul', 'paragraph']],
                  ['table', ['table']],
                  ['insert', ['link', 'picture']]
                ]
              }
        });
        
    }
    else {
        $('#summernote').summernote({//글쓰는 부분 summernote 세팅
            placeholder: '내용을 작성해주세요',
            height: 500,
            callbacks: {
                onImageUpload: function (files) {
                    console.log(files);
                    // for (var i = files.length - 1; i >= 0; i--) {
                    //     sendFile(files[i], this);
                    // }
                    sendFile(files[0], this);
                },
                onMediaDelete: function(target){
                    deleteFile(target[0].src);
                }
            }

        });
    }
});

function sendFile(file, editor){
    data = new FormData();
    data.append("img", file)
    console.log(data);
    $.ajax({
        data: data,
        type: "POST",
        url: "/board/upload_image",
        chache: false,
        contentType: false,
        enctype: "multipart/form-data",
        processData: false,
        success: function(result){
            console.log('url' + result.url);
            
            $("#summernote").summernote("insertImage", result.url);
            // var json = JSON.parse(result);
            // $("#summernote").summernote("insertImage", json['url']);
            // jsonArray.push(json['url']);
            // console.log(jsonArray);

        },
        error : function(e) {
            console.log(e);
        }
    })
}

function deleteFile(src){
    $.ajax({
        data: {src: src},
        type: "POST",
        url: "/board/delete_image",
        cache: false,
        success: function(result){
            console.log(result);
        }
    })
}

const img = $('#write_wrap img');
console.log(img);
const images = [];
for(i of img){
    var fname = i.src.split('/');
    images.push(fname[3]);
}
console.log(images);

function showSinglePlans() {
    var plan = $("select[name=planID]").val();
    if(postID != 'none'){
        location.href = `/board/write_plan/${postID}/${plan}`;
    } else {
        location.href = `/board/write_plan/none/${plan}`;
    }
    // location.href = `/board/write_plan?planID=${plan}`;
}



function checkEmpty(){
    var title = $('input[name=title]').val();
    var content = $('textarea').val();
    const realText = content.replace(/<[^>]*>?/g, ''); // html 태그를 제거하는 정규식
    var plan = $('select[name=planID]').val();

    if(plan == 0){
        alert('여행 일정을 선택해주세요.');
        return false;
    }
    else if(title == ''){
        alert("제목을 입력해주세요.");
        return false;
    }
    // 이미지와 글자가 모두 없다면
    else if((content.indexOf('img') == -1) && realText == ''){
        alert("내용을 입력해주세요.");
        return false;
    } 
    return true;
}
