const url = new URL(window.location.href);
const urlParmas = url.searchParams;
const postID = url.pathname.split('/')[3];
console.log(postID);

$(document).ready(function () {
    if (postID){ //글수정하는 부분 summernote 세팅
        console.log('update');
        $('#summernote').summernote({
            height: 500, // set editor height
            minHeight: null, // set minimum height of editor
            maxHeight: null, // set maximum height of editor
            focus: true,
            lang: 'ko-KR', // 기본 메뉴언어 US->KR로 변경
            callbacks: {
                onImageUpload: function (files) {
                    sendFile(files[0], this);

                    // for (var i = files.length - 1; i >= 0; i--) {
                    //     sendFile(files[i], this);
                    // }
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
                    sendFile(files[0], this);

                    // for (var i = files.length - 1; i >= 0; i--) {
                    //     sendFile(files[i], this);
                    // }
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

const img = $('#summernote img');
console.log(img);
const images = [];
for(i of img){
    var fname = i.src.split('/');
    images.push(fname[3]);
}
console.log(images);

