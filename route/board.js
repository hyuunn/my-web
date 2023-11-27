const express = require('express');
const router = express.Router();
const db = require('../lib/db');
const template = require('../lib/template.js');
const boardTemplate = require('../lib/boardTm.js');
const template_board = require('../lib/template_board.js');
const authCheck = require('../lib/authCheck.js');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const fsExtra = require('fs-extra');

const post_cate = { 'any': 1, 'review': 2, 'qna': 3 };
const barrier_cate = { 'eye': 1, 'ear': 2, 'body': 3, 'baby': 4 };

function filtering(queryData, category) {
    if (category == 'post') {
        var post = post_cate[queryData.category];
        return post;
    }
    else if (category == 'barrier') {
        var barrier = barrier_cate[queryData.barrier_category];
        return barrier;
    }
}

// ip 받아오기
function getUserIP(req) {
    const addr = req.headers['x-forwarded-for'] || req.connection.remoteAddress
    return addr;
}

function countViews(views, num, req, res) {
    // 조회수
    // var views = result1[0].views;
    if (req.cookies[num] == undefined) {  // 정의된 게 없으면
        res.cookie(num, getUserIP(req), { // 쿠키 값에 IP 주소
            maxAge: 720000  //12분
        })
        db.query('UPDATE post SET views=? WHERE postID=?', [views + 1, num], function (err, result3) {
            if (err) throw err;
            console.log('success');
        })
    }
}
router.get('/', function (req, res) {

    var css = `<link href="/css/board/main.css" rel="stylesheet"> <link href="/css/board/boardMain.css" rel="stylesheet">`;
    var body = template_board.boardMainBody();
    var header = template.header(authCheck.statusUI(req, res), authCheck.statusUI_mp(req, res));
    var text_mode = req.cookies.text;
    var color_mode = req.cookies.color;

    if (text_mode == 1) {
        css = ` <link href="/css/board/text_boardMain.css" rel="stylesheet">`;
    } else if (color_mode == 1) {
        css = `<link href="/css/board/main.css" rel="stylesheet"> <link href="/css/board/boardMain.css" rel="stylesheet">
        <link href="/css/board/contrast_boardMain.css" rel="stylesheet">`;
    }
    var html = template.HTML(css, header, body);
    res.send(html);

});

router.get('/write', function (req, res) {
    if (authCheck.isOwner(req, res)) {
        var css = `
       <link href="/css/board/boardModal.css" rel="stylesheet">
       <link href="https://stackpath.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css" rel="stylesheet">
       <script src="https://code.jquery.com/jquery-3.5.1.min.js"></script>
       <script src="https://stackpath.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js"></script>
       <link href="https://cdn.jsdelivr.net/npm/summernote@0.8.18/dist/summernote.min.css" rel="stylesheet">
       <script src="https://cdn.jsdelivr.net/npm/summernote@0.8.18/dist/summernote.min.js"></script>
       <style>body{
        background-color: #F9F9F9;
        font-family: 'Noto Sans KR', sans-serif;
    }</style>
       `;
        var body = template_board.boardWriteBody(false, "none");
        var header = template.header(authCheck.statusUI(req, res), authCheck.statusUI_mp(req, res));
        var html = template.HTML(css, header, body);
        res.send(html);
    }
    else {
        return res.send(`<script type="text/javascript">alert("로그인이 필요한 서비스입니다."); 
        location.href="http://localhost:3000/auth/login?path=${req.originalUrl}";</script>`);
    }
});

//글 submit 했을 때 저장하는 부분 

function content_reviewDB(post, num, userID) {
    var sigun;
    if (!Array.isArray(post.contentTitle)) {
        if (post.contentSigun === '/') {
            sigun = '0';
        } else {
            sigun = post.contentSigun;
        }
        db.query('INSERT INTO content_review(userID, postID, content_title, contentID,sido,sigun,type) VALUES (?,?,?,?,?,?,?)', [userID, num, decodeURIComponent(post.contentTitle), post.contentID, post.contentSido, sigun, post.placecontentType], function (error2, placetopics) {
            if (error2) {
                console.log(error2)
                throw error2;
            }

            return;
        });
    } else {
        for (var i = 0; i < post.contentTitle.length; i++) {
            console.log(post.contentSigun[i]);
            if (post.contentSigun[i] === '/') {

                sigun = '0';
            } else {

                sigun = post.contentSigun[i];

            }
            db.query('INSERT INTO content_review(userID, postID, content_title, contentID,sido,sigun,type) VALUES (?,?,?,?,?,?,?)', [userID, num, decodeURIComponent(post.contentTitle[i]), post.contentID[i], post.contentSido[i], sigun, post.placecontentType[i]], function (error2, placetopics) {

                if (error2) {
                    console.log(error2)
                    throw error2;
                }

            });
        }

        return;
    }
}
router.post('/write/post/:post', function (req, res) { //post/:post
    const value = req.params.post;
    var post = req.body;
    console.log(post);

    // const currentDateTime = moment().format('YYYY-MM-DD HH:mm:ss');
    var sigun;

    // console.log('현재 날짜와 시간:', currentDateTime);
    if (value == 'false') {//새로 작성한 글인 경우 
        //req.session.userID;
        db.query('INSERT INTO post(title, description, category, barrier_category, userID) VALUES (?,?,?,?,?)', [post.title, post.editordata, post.postType, post.handicap, req.session.userID]);
        console.log("planID");

        db.query('select max(postID) as num FROM post WHERE userID=? ', [req.session.userID], function (error, topics) {
            if (error) {
                console.log(error);
                throw error;
            }
            content_reviewDB(post, topics[0].num, req.session.userID)
            res.redirect(`/board/post/${topics[0].num}`);

        })
    } else {//수정하는 글인 경우 


        db.query('UPDATE post SET title=?, description=?, barrier_category=?, category=? WHERE postID=?', [post.title, post.editordata, post.handicap, post.postType, value], function (error, topics) {
            if (error) {
                throw error;
            }


        });

        db.query('DELETE FROM content_review WHERE postID=?', [value], function (error, topics) {
            if (error) {
                throw error;
            }

        })


        content_reviewDB(post, value, req.session.userID);
        res.redirect(`/board/post/${value}`);
    }

});

//글 출력하는 부분
function getDt_time(dt) { // yy.mm.dd hh:mm
    const temp = new Date(dt);
    const year = temp.getFullYear();
    const month = temp.getMonth() + 1;
    const date = temp.getDate();
    const hour = temp.getHours();
    const min = temp.getMinutes();

    return `${year - 2000}.${month >= 10 ? month : '0' + month}.${date >= 10 ? date : '0' + date}  ${hour >= 10 ? hour : '0' + hour}:${min >= 10 ? min : '0' + min}`;
}

router.get('/post/:num', function (req, res) {//:num
    const num = req.params.num;
    res.cookie('postNum', `${num}`)
    db.query('select * FROM post WHERE postID=? ', [num], function (error, topics) {
        if (error) { throw error; }
        console.log(topics);
        // 조회수
        countViews(topics[0].views, num, req, res);

        db.query('select * FROM content_review WHERE postID=? ', [num], function (error, topic) {
            //res.send(post.editordata)
            var temp = '';
            for (var i = 0; i < topic.length; i++) {

                temp += `<span style="color:blue; margin-left:2px; font-size:12px;"><a href="/place/content/${topic[i].sido}/${topic[i].sigun}/${topic[i].type}/${topic[i].contentID}?title=${topic[i].content_title}">#${topic[i].content_title}</a></span>`;
            }
            if (authCheck.isOwner(req, res)) {//수정버튼 보일지 말지 결정하는 부분
                if (req.session.userID == topics[0].userID) {
                    var display = " ";
                    var declare = "none";
                } else {
                    var display = "none";
                    var declare = ""
                }
            }
            else var display = "none";

            if (topics[0].userID == req.session.userID) {
                var report = false;
            } else {
                var report = true;
            }

            var css = `<link href="/css/board/boardPost.css" rel="stylesheet"> <link href="/css/board/comment.css" rel="stylesheet">`;
            console.log('topics');
            console.log(topics);
            js = `<script src="/js/board/comment.js"></script> <script src="/js/board/post.js"></script>`
            var body = template_board.boardPostBody(topics[0].title, getDt_time(topics[0].date), topics[0].description, topics[0].userID, topics[0].postID, declare, display, authCheck.isOwner(req, res), temp, report, js);

            var header = template.header(authCheck.statusUI(req, res), authCheck.statusUI_mp(req, res));

            var text_mode = req.cookies.text;
            var color_mode = req.cookies.color;

            if (text_mode == 1) {
                css = '<link href="/css/board/boardPost_text.css" rel="stylesheet"> <link href="/css/board/comment_text.css" rel="stylesheet">';
            } else if (color_mode == 1) {
                css = '<link href="/css/board/boardPost_color.css" rel="stylesheet"> <link href="/css/board/comment_color.css" rel="stylesheet">';
            }
            var html = template.HTML(css, header, body);
            res.send(html);
        })
    })


});
// router.get('/delete/:num', function (req, res) {
//     const num = req.params.num;
//     db.query('DELETE FROM recommend WHERE postID=?', [num], function (error, topics) {
//         if (error) {
//             throw error;
//         }

//     })
//     db.query('DELETE FROM comment WHERE postID=?', [num], function (error, topics) {
//         if (error) {
//             throw error;
//         }

//     })
//     db.query('DELETE FROM content_review WHERE postID=?', [num], function (error, topics) {
//         if (error) {
//             throw error;
//         }

//     })
//     db.query('DELETE FROM post WHERE postID=? and userID =? ', [num, req.session.userID], function (error, topics) {
//         if (error) {
//             throw error;
//         }
//         res.send("게시판 목록페이지로 이동");
//     })

// })
//글 수정하는 부분 
router.get('/write/:num', function (req, res) {
    const num = req.params.num;
    db.query('select * FROM post WHERE postID=? ', [num], function (error, topics) {
        if (error) {
            throw error;
        }
        //res.send(post.editordata)
        var css = `
           <link href="/css/board/boardModal.css" rel="stylesheet">
       <link href="https://stackpath.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css" rel="stylesheet">
       <script src="https://code.jquery.com/jquery-3.5.1.min.js"></script>
       <script src="https://stackpath.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js"></script>
       <link href="https://cdn.jsdelivr.net/npm/summernote@0.8.18/dist/summernote.min.css" rel="stylesheet">
       <script src="https://cdn.jsdelivr.net/npm/summernote@0.8.18/dist/summernote.min.js"></script>
       
       `;
        db.query('select * FROM content_review WHERE postID=? ', [num], function (error, topic) {
            var temp = '';
            for (var i = 0; i < topic.length; i++) {
                console.log("topic" + topic[i].contentID)
                temp += `<p class="choicePlace">#${topic[i].content_title}<input type="hidden" name="contentID" value=${topic[i].contentID} />
          <input type="hidden" name="contentTitle" value=${encodeURIComponent(topic[i].content_title)} />
          
            <input type="hidden" name="contentSido" value=${topic[i].sido} />
            <input type="hidden" name="contentSigun" value=${topic[i].sigun} />
            <input type="hidden" name="placecontentType" value=${topic[i].type} />
                 
          </p>`;
            }
            var body = template_board.boardWriteBody(num, '', topics[0].title, topics[0].description, topics[0].barrier, topics[0].category, temp);

            var header = template.header(authCheck.statusUI(req, res), authCheck.statusUI_mp(req, res));
            var html = template.HTML(css, header, body);
            res.send(html);
        })
    })
})

router.all('/readTopPost/:num', function (req, res) {
    const num = parseInt(req.params.num);
    if (num == 1) {


        db.query('SELECT * FROM post WHERE planID IS NOT NULL ORDER BY recommend DESC LIMIT 12; ', function (error, topic) {
            if (error) {
                throw error;
            }
            res.send(topic)

        })
    }
    if (num == 0) {
        db.query('SELECT * FROM post WHERE planID IS NULL ORDER BY recommend DESC LIMIT 12; ', function (error, topic) {
            if (error) {
                throw error;
            }
            res.send(topic)

        })
    }
})

function search(queryData) {
    var sql = '';
    if (queryData.search_target == 'whole') {
        sql = 'whole';
    } else if (queryData.search_target == 'title') {
        sql = ` AND post.title LIKE '%${queryData.search_keyword}%' `;
    } else if (queryData.search_target == 'place') {
        sql = `place`;
    } else {
        sql = ` AND description LIKE '%${queryData.search_keyword}%' `
    }
    return sql;
}

// 게시글 목록
router.get('/list', function (req, res) {
    var queryData = req.query;
    var sql = `
    SELECT postID, category, barrier_category, title, date, userID, recommend, views
    FROM post WHERE category != 4 `;
    var sql2 = `SELECT comment.postID, description FROM comment;`;
    var sql3 = '';

    if (queryData.category || queryData.barrier_category) {
        var post = filtering(queryData, 'post');
        var barrier = filtering(queryData, 'barrier');

        if (queryData.category && queryData.barrier_category)
            sql += ` AND category=${post} AND barrier_category=${barrier} `;
        else if (queryData.category && !queryData.barrier_category)
            sql += ` AND category=${post} `;
        else if (!queryData.category && queryData.barrier_category)
            sql += ` AND barrier_category=${barrier} `;

        if (queryData.search_keyword) {
            if (search(queryData) == 'whole') {
                sql += `AND (title LIKE '%${queryData.search_keyword}%' OR description LIKE '%${queryData.search_keyword}%') `;
                sql3 = `
                select post.postID, content_title, category, barrier_category, title, date, post.userID, recommend, views
                from content_review, post 
                where content_review.postID = post.postID 
                and content_title LIKE '%${queryData.search_keyword}%' `;

                if (queryData.category && queryData.barrier_category)
                    sql3 += ` AND category=${post} AND barrier_category=${barrier} `;
                else if (queryData.category && !queryData.barrier_category)
                    sql3 += ` AND category=${post} `;
                else if (!queryData.category && queryData.barrier_category)
                    sql3 += ` AND barrier_category=${barrier} `;

            } else if (search(queryData) == 'place') {
                sql = `
                select post.postID, content_title, category, barrier_category, title, date, post.userID, recommend, views
                from content_review, post where content_review.postID = post.postID 
                and content_title LIKE '%${queryData.search_keyword}%' `;

                if (queryData.category && queryData.barrier_category)
                    sql += ` AND category=${post} AND barrier_category=${barrier} `;
                else if (queryData.category && !queryData.barrier_category)
                    sql += ` AND category=${post} `;
                else if (!queryData.category && queryData.barrier_category)
                    sql += ` AND barrier_category=${barrier} `;
            } else {
                sql += search(queryData);
            }
        }
    }
    else {
        if (queryData.search_keyword) {
            if (search(queryData) == 'whole') {
                sql += `AND (post.title LIKE '%${queryData.search_keyword}%' OR description LIKE '%${queryData.search_keyword}%') `;
                sql3 = `select post.postID, content_title, category, barrier_category, title, date, post.userID, recommend, views
                from content_review, post where category != 4 and content_review.postID = post.postID 
                and content_title LIKE '%${queryData.search_keyword}%'`;
            } else if (search(queryData) == 'place') {
                sql = `
                select post.postID, content_title, category, barrier_category, title, date, post.userID, recommend, views
                from content_review, post where content_review.postID = post.postID 
                and content_title LIKE '%${queryData.search_keyword}%'`

            } else {
                sql += search(queryData);
            }
        }
    }

    sql += ' ORDER BY post.postID DESC;';
    console.log(sql)
    db.query(sql + sql2 + sql3, function (err, results) {
        // console.log(results[2]);
        console.log(results[2])
        if (err) throw err;
        var lists = [];
        for (var i = 0; i < results[0].length; i++) {
            lists[i] = boardTemplate.lists(results[0][i], results[1]);
        }
        if (sql3 != '' && results[2] != undefined) {
            console.log('아니라고')
            for (var i = 0; i < results[2].length; i++) {
                lists.push(boardTemplate.lists(results[2][i], results[1]));
                // console.log(boardTemplate.lists(results[2][i], results[1]));
            }
        }

        var list = lists.join('');
        list = [...new Set(lists)].join('');
        // console.log(list);
        var postCategory = boardTemplate.postCategory();
        var header = template.header(authCheck.statusUI(req, res), authCheck.statusUI_mp(req, res));
        var body = boardTemplate.postList(list, postCategory, '');
        var css = '<link href="/css/board/boardList.css" rel="stylesheet">';

        var text_mode = req.cookies.text;
        var color_mode = req.cookies.color;

        if (text_mode == 1) {
            css = '<link href="/css/board/boardList_text.css" rel="stylesheet">';
        } else if (color_mode == 1) {
            css = '<link href="/css/board/boardList_color.css" rel="stylesheet">';
        }
        var html = template.HTML(css, header, body);
        res.send(html);
    })
})

//const sidoCode = JSON.parse(fs.readFileSync('./data/areacode/sidoCode.json', 'utf-8'));

// 일정 공유글 목록
router.get('/list_plan', function (req, res) {
    var queryData = req.query;
    var sql =
        `SELECT postID, barrier_category, post.title, date, post.userID, recommend, views, post.planID, sidoCode, location, user.name 
        FROM post, tour_plan, user 
        WHERE post.category=4 AND post.planID=tour_plan.planID AND user.userID = post.userID `
    var sql2 = `SELECT postID, description FROM comment;`

    var barrier = filtering(queryData, 'barrier');

    if (queryData.barrier_category) {
        sql += ` AND barrier_category=${barrier}`;

        if (queryData.search_keyword) {
            if (queryData.search_target == 'whole') {
                sql += ` AND (post.title LIKE '%${queryData.search_keyword}%' OR description LIKE '%${queryData.search_keyword}%')`;
            } else if (queryData.search_target == 'title') {
                sql += ` AND post.title LIKE '%${queryData.search_keyword}%' `;
            } else {
                sql += ` AND description LIKE '%${queryData.search_keyword}%' `
            }
        }
    }
    else {
        if (queryData.search_keyword) {
            if (queryData.search_target == 'whole') {
                sql += `AND (post.title LIKE '%${queryData.search_keyword}%' OR description LIKE '%${queryData.search_keyword}%')`;
            } else if (queryData.search_target == 'title') {
                sql += ` AND post.title LIKE '%${queryData.search_keyword}%' `;
            } else {
                sql += ` AND description LIKE '%${queryData.search_keyword}%' `
            }
        }
    }

    sql += ' ORDER BY postID DESC;';

    db.query(sql + sql2, function (err, results) {
        if (err) throw err;
        console.log(sql);
        var header = template.header(authCheck.statusUI(req, res), authCheck.statusUI_mp(req, res));
        var regionSelect = boardTemplate.regionSelect();
        var css = '<link href="/css/board/boardList.css" rel="stylesheet">';

        if (results.length == 0) {    // 결과가 없는 경우
            var body = boardTemplate.postList('', '', regionSelect);
        }
        else {
            var lists = [];
            for (var i = 0; i < results[0].length; i++) {
                lists.push(boardTemplate.plan_lists(results[0][i], results[1]));
            }
            var list = lists.join('');
            var body = boardTemplate.postList(list, '', regionSelect);
        }

        var text_mode = req.cookies.text;
        var color_mode = req.cookies.color;

        if (text_mode == 1) {
            css = '<link href="/css/board/boardList_text.css" rel="stylesheet">';
        } else if (color_mode == 1) {
            css = '<link href="/css/board/boardList_color.css" rel="stylesheet">';
        }
        var html = template.HTML(css, header, body);
        res.send(html);
    })
})

// 일정 공유 글 작성, 수정
router.get('/write_plan/:postID/:planID', function (req, res) {
    var postID = req.params.postID;
    var planID = req.params.planID;

    var sql1 = `SELECT planID, title, startDate, endDate FROM tour_plan WHERE userID=?; `;
    var sql2 = `SELECT title, date, startTime, singleID FROM single_plan WHERE planID=? ORDER BY date, number; `;
    var sql3 = 'SELECT * FROM post WHERE postID=?; ';

    var color_mode = req.cookies.color;

    if (authCheck.isOwner(req, res)) {
        var header = template.header(authCheck.statusUI(req, res), authCheck.statusUI_mp(req, res));
        var css = `
                <link href="https://stackpath.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css" rel="stylesheet">
                <script src="https://stackpath.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js"></script>
                <script src="https://code.jquery.com/jquery-3.5.1.min.js"></script>
                <link href="https://cdn.jsdelivr.net/npm/summernote@0.8.18/dist/summernote.min.css" rel="stylesheet">
                <script src="https://cdn.jsdelivr.net/npm/summernote@0.8.18/dist/summernote.min.js"></script>
                `;

        if (color_mode == 1) {
            css += '<link href="/css/board/boardWrite_color.css" rel="stylesheet">';
        } else {
            css += '<link href="/css/board/boardWrite.css" rel="stylesheet">';
        }

        if (postID == 'none') {  // 새로운 글 작성
            if (planID == 'none') {     // 일정 선택 x
                db.query(sql1, [req.session.userID], function (err, results) {
                    if (err) throw err;
                    var body = boardTemplate.boardWriteBody(false, results, '', '');
                    var html = template.HTML(css, header, body);
                    res.send(html);
                })
            } else {    // 일정 선택시
                db.query(sql1 + sql2, [req.session.userID, planID], function (err, results) {
                    if (err) throw err;
                    if (results[1].length == 0) {
                        res.send(
                            `<script>alert('일정에 저장된 장소가 없습니다. 장소 추가 후 글을 작성해주세요.');
                            history.back();</script>`)
                    }
                    else {
                        var single_plans = boardTemplate.single_plans(results[1], true);
                        var body = boardTemplate.boardWriteBody(false, results[0], single_plans, '');
                        var html = template.HTML(css, header, body);
                        res.send(html);
                    }

                })
            }
        } else {    // 글 수정
            db.query(sql1 + sql2 + sql3, [req.session.userID, planID, postID], function (error, results) {
                if (error) throw error;
                var single_plans = boardTemplate.single_plans(results[1], true);
                var body = boardTemplate.boardWriteBody(postID, results[0], single_plans, results[2]);
                var html = template.HTML(css, header, body);

                res.send(html);
            });
        }

    }
    else {
        return res.send(`<script type="text/javascript">alert("로그인이 필요한 서비스입니다."); 
        location.href="http://localhost:3000/auth/login?path=${req.originalUrl}";</script>`);
    }
})

try {
    fs.readdirSync('uploads');  // 폴더 확인
} catch (err) {
    console.log("uploads 폴더가 없습니다. 폴더를 생성합니다.");
    fs.mkdirSync('uploads');  // 폴더 생성
}
try {
    fs.readdirSync('temp');  // 폴더 확인
} catch (err) {
    console.log("temp 폴더가 없습니다. 폴더를 생성합니다.");
    fs.mkdirSync('temp');  // 폴더 생성
}

// 임시 저장 파일 객체
const temp = multer({
    storage: multer.diskStorage({   // 저장한 공간 정보: 하드디스크에 저장
        destination: (req, file, done) => {   // 저장 위치
            done(null, 'temp/');     // uploads라는 폴더 안에 저장
        },
        filename: (req, file, done) => {  // 파일명을 어떤 이름으로 올릴지
            const ext = path.extname(file.originalname) // 파일의 확장자
            done(null, path.basename(file.originalname, ext) + Date.now() + ext);
        }
    }),
    limits: { fileSize: 30 * 1024 * 1024 }    // 30mb 용량 제한
})

const upload = multer({
    storage: multer.diskStorage({   // 저장한 공간 정보: 하드디스크에 저장
        destination: (req, file, done) => {   // 저장 위치
            done(null, 'uploads/');     // uploads라는 폴더 안에 저장
        },
        filename: (req, file, done) => {  // 파일명을 어떤 이름으로 올릴지
            const ext = path.extname(file.originalname) // 파일의 확장자
            done(null, path.basename(file.originalname, ext) + Date.now() + ext);
        }
    }),
    limits: { fileSize: 100 * 1024 * 1024 }    // 30mb 용량 제한
})

router.post("/upload_image", temp.single('img'), function (req, res) {
    console.log(req.file);
    let response = {};
    response.url = `/${path.basename(req.file.path)}`
    // {"url":"/images/img-filename-12345.png"}
    res.json(response);
})

router.post("/delete_image", function (req, res) {
    var post = req.body;
    console.log(post.src);
    var filename = post.src.split('/');
    console.log(filename);

    if (fs.existsSync("uploads/" + decodeURI(filename[3]))) {
        try {
            fs.unlinkSync("uploads/" + decodeURI(filename[3]));
            console.log('delete image');
        } catch (error) {
            console.log(error);
        }
    }
})
// temp -> uploads 파일 이동
function arrangeFiles(oldPath, newPath) {
    if (fs.existsSync(oldPath)) {
        try {
            fs.rename(oldPath, newPath, function (err) {
                if (err) throw err;
                console.log('move files')
            })
        } catch (err) {
            console.log(err);
        }
    } else { return; }
}

router.post('/upload_real', function (req, res) {
    var post = req.body;
    const images = post['images'];
    console.log(images);

    if (images == undefined) { }   // 이미지가 없는 경우
    else if (typeof (images) == 'string') { // 이미지 파일이 한 개인 경우
        const oldPath = `temp/${images}`;
        const newPath = `uploads/${images}`
        console.log('외 않 되 . . .');
        arrangeFiles(oldPath, newPath);
    } else {
        for (let i of images) {
            console.log('여러개');
            const oldPath = `temp/${i}`;
            const newPath = `uploads/${i}`
            arrangeFiles(oldPath, newPath);
        }
    }

    fsExtra.emptyDirSync('temp');   // temp 파일 모두 삭제
})

// 일정 공유글 작성 프로세스
router.post('/write/plan_post/:postID', function (req, res) { //post/:post
    const postID = req.params.postID;
    var post = req.body;
    //console.log(post);

    db.query('SELECT * FROM single_plan WHERE planID=?', [post.planID], function (err, result) {
        if (err) throw err;
        if (result.length == 0) {
            res.send(
                `<script>alert('일정에 저장된 장소가 없습니다. 장소 추가 후 글을 작성해주세요.');
                history.back();</script>`)
        } else {
            if (postID == 'false') {//새로 작성한 글인 경우 
                db.query('INSERT INTO post(title, description, category, barrier_category, planID, userID) VALUES (?,?,?,?,?,?)',
                    [post.title, post.editordata, 4, post.handicap, post.planID, req.session.userID]);
                console.log("planID");

                db.query('select max(postID) as num FROM post WHERE userID=? ', [req.session.userID], function (error, topics) {
                    if (error) {
                        throw error;
                    }
                    //res.send(post.editordata)
                    res.redirect(`/board/plan_post/${topics[0].num}`);
                })
            } else {//수정하는 글인 경우 
                db.query('UPDATE post SET title=?, description=?, barrier_category=?, planID=? WHERE postID=?', [post.title, post.editordata, post.handicap, post.planID, postID], function (error, topics) {
                    if (error) {
                        throw error;
                    }

                    res.redirect(`/board/plan_post/${postID}`);
                });
            }
        }
    })

    // if (postID == 'false') {//새로 작성한 글인 경우 
    //     db.query('INSERT INTO post(title, description, category, barrier_category, planID, userID) VALUES (?,?,?,?,?,?)', 
    //     [post.title, post.editordata, 4, post.handicap, post.planID, req.session.userID]);
    //     console.log("planID");

    //     db.query('select max(postID) as num FROM post WHERE userID=? ', [req.session.userID], function (error, topics) {
    //         if (error) {
    //             throw error;
    //         }
    //         //res.send(post.editordata)
    //         res.redirect(`/board/plan_post/${topics[0].num}`);
    //     })
    // } else {//수정하는 글인 경우 
    //     db.query('UPDATE post SET title=?, description=?, barrier_category=?, planID=? WHERE postID=?', [post.title, post.editordata, post.handicap, post.planID, postID], function (error, topics) {
    //         if (error) {
    //             throw error;
    //         }

    //         res.redirect(`/board/plan_post/${postID}`);
    //     });
    // }
});

// 게시글 페이지
router.get('/plan_post/:num', function (req, res) {
    const num = req.params.num;
    res.cookie('postNum', `${num}`)

    var sql = `SELECT singleID, single_plan.title as single_title, date, startTime, single_plan.latitude, single_plan.longitude, placeID, 
    tour_plan.planID, tour_plan.title as plan_title, startDate, endDate, location
    FROM single_plan, tour_plan
    WHERE single_plan.planID=tour_plan.planID AND tour_plan.planID=?
    ORDER BY date, number;`

    db.query('select * FROM post WHERE postID=? ', [num], function (error, post) {
        if (error) throw error;
        console.log(post[0].planID);
        // 조회수
        countViews(post[0].views, num, req, res);

        if (authCheck.isOwner(req, res)) {  //수정버튼 보일지 말지 결정하는 부분
            if (req.session.userID == post[0].userID) {
                var display = " ";
            } else {
                var display = "none";
            }
        }
        else var display = "none";

        // 자신이 쓴 게시글은 신고 불가
        if (post[0].userID == req.session.userID) {
            var report = false;
        } else {
            var report = true;
        }

        db.query(sql, [post[0].planID], function (err, plan) {
            if (err) throw err;
            console.log('plan' + plan);
            var css = `<link href="/css/board/boardPost.css" rel="stylesheet"> <link href="/css/board/comment.css" rel="stylesheet">`;
            var single_plans = boardTemplate.single_plans(plan, false);
            var body = boardTemplate.boardPostBody(post[0], report, display, single_plans, plan, authCheck.isOwner(req, res));
            var header = template.header(authCheck.statusUI(req, res), authCheck.statusUI_mp(req, res));


            var text_mode = req.cookies.text;
            var color_mode = req.cookies.color;

            if (text_mode == 1) {
                css = '<link href="/css/board/boardPost_text.css" rel="stylesheet"> <link href="/css/board/comment_text.css" rel="stylesheet">';
            } else if (color_mode == 1) {
                css = '<link href="/css/board/boardPost_color.css" rel="stylesheet"> <link href="/css/board/comment_color.css" rel="stylesheet">';
            }
            var html = template.HTML(css, header, body);
            res.send(html);
        });
    })
});

// 댓글
router.post('/commentinsert/:isPlan/:num', function (req, res) {
    const num = parseInt(req.params.num);
    const isPlan = req.params.isPlan;
    if (authCheck.isOwner(req, res)) {
        var post = req.body;
        console.log(num)
        db.query('INSERT INTO comment(postID, userID, description) VALUES (?,?,?)', [num, req.session.userID, post.comment], function (error, results) {
            if (error) {
                throw error;
            }
        });
        res.redirect('back');
    } else {
        if (isPlan == 'plan') {
            var path = `/board/plan_post/${num}`;
        } else {
            var path = `/board/post/${num}`
        }
        return res.send(`<script type="text/javascript">alert("로그인이 필요한 서비스입니다."); 
            location.href="http://localhost:3000/auth/login?path=${path}";</script>`);
    }

});

router.get('/comment', function (req, res) {
    const { postNum } = req.cookies;
    var array = [];
    var user = false;

    db.query('select * FROM comment WHERE postID=? ', [postNum], function (error, topics) {
        if (error) {
            throw error;
        }
        console.log(req.session.userID);

        for (let i = 0; i < topics.length; i++) {
            if (req.session.userID == topics[i].userID) {
                user = true;
                console.log(req.session.userID);
                console.log(topics[i].userID);
            } else {
                user = false;
            }
            array.push({
                'description': topics[i].description,
                'userID': topics[i].userID,
                'auth': user,
                'commentID': topics[i].commentID,
                'parents': topics[i].parents,
                'date': getDt_time(topics[i].date)
            });
        }

        res.send(array);
    });
})

router.all('/comment/delete/:num', function (req, res) {
    const num = parseInt(req.params.num);
    const comment = req.params.comment;

    db.query('DELETE FROM comment WHERE commentID=? ', [num], function (error, topics) {
        if (error) {
            throw error;
        }
        res.send("success");
    })



});

router.all('/comment/update/:num', function (req, res) {
    const num = parseInt(req.params.num);
    var post = req.body;
    const text = post.comment
    console.log(text);

    db.query('UPDATE comment SET description=? WHERE commentID=?', [text, num], function (error, topics) {
        if (error) {
            throw error;
        }

    });
    db.query('select * FROM comment WHERE commentID=? ', [num], function (error, topics) {
        if (error) {
            throw error;
        }
        res.redirect(`/board/post/${topics[0].postID}`);
    });
    //res.redirect('back');
});

router.post('/recomment/:num', function (req, res) {
    const num = parseInt(req.params.num);
    var post = req.body;
    const text = post.comment

    db.query('select * FROM comment WHERE commentID=? ', [num], function (error, topic) {
        if (error) {
            throw error;
        }

        db.query('INSERT INTO comment(postID, userID, description,parents) VALUES (?,?,?,?)', [topic[0].postID, req.session.userID, text, num], function (error, results) {
            if (error) {
                throw error;
            }
        });

    });


    res.redirect('back');

});

router.all('/checkRecommend/:num', function (req, res) {
    const num = parseInt(req.params.num);
    var array = [];
    db.query('select * FROM post WHERE postID=?  ', [num], function (error, topic) {
        if (error) {
            throw error;
        }
        if (authCheck.isOwner(req, res)) {
            db.query('select * FROM recommend WHERE postID=? and userID=? ', [num, req.session.userID], function (error, topics) {
                if (error) {
                    throw error;
                }
                if (topics.length > 0) {
                    array.push({
                        'recommend': topic[0].recommend,
                        'isRecommend': true
                    });
                }
                else {
                    array.push({
                        'recommend': topic[0].recommend,
                        'isRecommend': false
                    });
                }

                res.send(array);
            })
        } else {
            array.push({
                'recommend': topic[0].recommend,
                'isRecommend': false
            });
            res.send(array);
        }

    })
})


router.all('/recommend/post', function (req, res) {
    if (authCheck.isOwner(req, res)) {
        var post = req.body;
        console.log(post.postID)
        if (post.recommend == "false") {
            db.query('INSERT INTO recommend(postID, userID) VALUES (?,?)', [post.postID, req.session.userID], function (error, results) {
                if (error) {
                    throw error;
                }
                db.query('UPDATE post SET recommend = recommend + 1 WHERE postID = ?', [post.postID], function (error, results) {
                    if (error) {
                        throw error;
                    }
                    res.json({ success: true });
                    return;
                });
            })
        } else {
            db.query('DELETE FROM recommend WHERE postID=? and userID=?', [post.postID, req.session.userID], function (error, results) {
                if (error) {
                    throw error;
                }
                db.query('UPDATE post SET recommend = recommend - 1 WHERE postID = ?', [post.postID], function (error, results) {
                    if (error) {
                        throw error;
                    }
                    res.json({ success: true });
                    return;
                });
            })
        }
    }
    else {
        res.json({ success: false });
    }
})

// 신고
router.get('/report/:postID', function (req, res) {
    var postID = req.params.postID;
    console.log(req.originalUrl);
    if (authCheck.isOwner(req, res)) {
        var css = `<link href="/css/board/boardPost.css" rel="stylesheet">`;
        var body = boardTemplate.report(postID);
        var text_mode = req.cookies.text;
        var color_mode = req.cookies.color;

        if (text_mode == 1) {
            css = `<link href="/css/board/boardPost_text.css" rel="stylesheet">`;
        } else if (color_mode == 1) {
            css = `<link href="/css/board/boardPost_color.css" rel="stylesheet">`;
        }
        var html = template.HTML(css, '', body);

        res.send(html);
    } else {
        res.send(`<script>alert("로그인이 필요한 서비스입니다.");location.href="http://localhost:3000/auth/login?path=${req.originalUrl}";</script>`)
    }

})

router.post('/report_process/:postID', function (req, res) {
    var postID = req.params.postID;
    var value = req.body.value;

    db.query('INSERT INTO manage_post (postID, type) VALUES (?,?)', [postID, value], function (err, result2) {
        if (err) throw err;
    })

    res.send(value);
})

// 게시글 삭제
router.post('/delete/:postID', function (req, res) {
    var postID = req.params.postID;
    var post = req.body;
    const images = post['images'];
    console.log(images);

    if (images == undefined) { }   // 이미지가 없는 경우
    else if (typeof (images) == 'string') { // 이미지 파일이 한 개인 경우
        if (fs.existsSync("uploads/" + decodeURI(images))) {
            try {
                fs.unlinkSync("uploads/" + decodeURI(images));
                console.log('delete image');
            } catch (error) {
                console.log(error);
            }
        }
    } else {
        for (let i of images) {
            if (fs.existsSync("uploads/" + decodeURI(i))) {
                try {
                    fs.unlinkSync("uploads/" + decodeURI(i));
                    console.log('delete image');
                } catch (error) {
                    console.log(error);
                }
            }
        }
    }
    db.query('DELETE FROM post WHERE postID=?', [postID], function (err, result) {
        if (err) throw err;
        res.send('success');
    })
})

router.get('/undefinedPlace/:id', function (req, res) {
    var id = req.params.id;
    var css = `<link href="/css/board/boardPost.css" rel="stylesheet">`;
    var body = boardTemplate.undefinedPlace(id);
    var header = template.header(authCheck.statusUI(req, res), authCheck.statusUI_mp(req, res));

    var text_mode = req.cookies.text;
    var color_mode = req.cookies.color;

    if (text_mode == 1) {
        css = `<link href="/css/board/boardPost_text.css" rel="stylesheet">`;
    } else if (color_mode == 1) {
        css = `<link href="/css/board/boardPost_color.css" rel="stylesheet">`;
    }
    var html = template.HTML(css, header, body);
    res.send(html);
})

module.exports = router;