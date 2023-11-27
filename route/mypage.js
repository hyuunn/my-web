const express = require('express');
const router = express.Router();
const crypto = require('crypto');
var db = require('../lib/db');
var template = require('../lib/template.js');
var myTemplate = require('../lib/mypageTm.js');
var planTemplate = require('../lib/planTm.js');
var authCheck = require('../lib/authCheck.js');
var fs = require('fs');

const { id } = process.env;

function getToday() {
    var date = new Date();
    var year = date.getFullYear();
    var month = ("0" + (1 + date.getMonth())).slice(-2);
    var day = ("0" + date.getDate()).slice(-2);

    return year + "-" + month + "-" + day;
}


// router.get('/', function (req, res) {
//     sql1 = 'SELECT userID, name, email, barrier_type FROM user WHERE userID=?; ';
//     sql2 = 'SELECT postID FROM manage_post;';

//     db.query(sql1 + sql2, [req.session.userID], function (err, results) {
//         if (err) throw err;
//         console.log(results);

//         var info = myTemplate.info(results[0], '');
//         var body = myTemplate.main(info, '');
//         var css = `<link href="/css/mypage.css" rel="stylesheet">`;
//         var header = template.header(authCheck.statusUI(req, res), authCheck.statusUI_mp(req, res));
//         var html = template.HTML(css, header, body);
//         res.send(html);
//     })

// })


router.get('/myinfo', function (req, res) {

    sql1 = 'SELECT userID, name, email, barrier_type FROM user WHERE userID=?; ';
    sql2 = 'SELECT progress, COUNT(progress) AS count FROM manage_post GROUP BY progress;';
    sql3 = `SELECT checked, COUNT(checked) AS count FROM update_info GROUP BY checked;`;

    db.query(sql1 + sql2 + sql3, [req.session.userID], function (err, results) {
        if (err) throw err;
        console.log(results);

        if (req.session.userID == id) { // 관리자
            var info = myTemplate.info(results[0], results[1], results[2], true);
        } else {
            var info = myTemplate.info(results[0], results[1], results[2], '');
        }
        var body = myTemplate.main(info, '');
        var css = `<link href="/css/mypage/mypage.css" rel="stylesheet">`;
        var header = template.header(authCheck.statusUI(req, res), authCheck.statusUI_mp(req, res));

        var text_mode = req.cookies.text;
        var color_mode = req.cookies.color;

        if (text_mode == 1) {
            css = `<link href="/css/mypage/mypage_text.css" rel="stylesheet">`;
        } else if (color_mode == 1) {
            css = `<link href="/css/mypage/mypage_color.css" rel="stylesheet">`;
        }
        var html = template.HTML(css, header, body);
        res.send(html);
    })
})

router.get('/checkPassword', function (req, res) {
    var checkPwd = myTemplate.checkPwd();
    var body = myTemplate.main(checkPwd, '');
    var css = `<link href="/css/mypage.css" rel="stylesheet">`;
    var header = template.header(authCheck.statusUI(req, res), authCheck.statusUI_mp(req, res));
    var text_mode = req.cookies.text;

    var color_mode = req.cookies.color;

    if (text_mode == 1) {
        css = `<link href="/css/mypage/mypage_text.css" rel="stylesheet">`;
    } else if (color_mode == 1) {
        css = `<link href="/css/mypage/mypage_color.css" rel="stylesheet">`;
    }
    var html = template.HTML(css, header, body);
    res.send(html);
})

// 비밀번호 확인 프로세스
router.post('/checking', function (req, res) {
    var pwd = req.body.password;

    db.query('SELECT password, salt FROM user WHERE userID=?', [req.session.userID], function (err, result) {
        // 비밀번호 검증
        crypto.pbkdf2(pwd, result[0].salt, 100000, 64, 'sha512', (err, key) => {
            const pw = key.toString('base64');
            if (pw != result[0].password) {
                res.send("<script>alert('비밀번호가 일치하지 않습니다.');history.back();</script>");
            }
            else {
                res.redirect('/mypage/modify_info');
            }
        })
    })

})

router.get('/modify_info', function (req, res) {
    db.query('SELECT userID, name, barrier_type, email FROM user WHERE userID=?', [req.session.userID], function (err, result) {
        if (err) throw err;

        var modifyInfo = myTemplate.modifyInfo(result);
        var body = myTemplate.main(modifyInfo, '');
        var css = `<link href="/css/mypage.css" rel="stylesheet">`;
        var header = template.header(authCheck.statusUI(req, res), authCheck.statusUI_mp(req, res));
        var text_mode = req.cookies.text;

        var color_mode = req.cookies.color;

        if (text_mode == 1) {
            css = `<link href="/css/mypage/mypage_text.css" rel="stylesheet">`;
        } else if (color_mode == 1) {
            css = `<link href="/css/mypage/mypage_color.css" rel="stylesheet">`;
        }
        var html = template.HTML(css, header, body);
        res.send(html);
    })
})

// 이메일 중복 확인
router.post('/check_email', function (req, res) {
    console.log(req.body);

    db.query('SELECT * FROM user WHERE NOT userID=? AND email=?', [req.body.id, req.body.email], function (err, result) {
        if (err) throw err;
        console.log(result);
        if (result.length == 0) {
            res.send({ result: true });
        } else {
            res.send({ result: false });
        }
    })
})

// 회원 정보 수정 프로세스
router.post('/modifying', function (req, res) {
    var post = req.body;
    console.log(post);
    var name = post.name;
    var email = post.email;
    var barrier_type = post.bType;

    req.session.nickname = name;
    db.query('UPDATE user SET name=?, email=?, barrier_type=? WHERE userID=?', [name, email, barrier_type, req.session.userID],
        function (err, result) {
            if (err) throw err;
            console.log('success');
            res.send('<script>alert("수정이 완료되었습니다!");location.href="/mypage/myinfo";</script>')
        })

})

router.get('/changePassword', function (req, res) {
    var changePwd = myTemplate.changePassword();
    var body = myTemplate.main(changePwd, '');
    var css = `<link href="/css/mypage.css" rel="stylesheet">`;
    var header = template.header(authCheck.statusUI(req, res), authCheck.statusUI_mp(req, res));
    var text_mode = req.cookies.text;

    var color_mode = req.cookies.color;

    if (text_mode == 1) {
        css = `<link href="/css/mypage/mypage_text.css" rel="stylesheet">`;
    } else if (color_mode == 1) {
        css = `<link href="/css/mypage/mypage_color.css" rel="stylesheet">`;
    }
    var html = template.HTML(css, header, body);
    res.send(html);
})

// 비번 변경 프로세스
router.post('/changing', function (req, res) {
    var current = req.body.current;
    var newpw = req.body.new;
    var check = req.body.check;
    var reg = new RegExp("^(?=.*[A-Za-z])(?=.*[0-9])(?=.{8,})");
    console.log(reg.test(newpw));

    db.query('SELECT password, salt FROM user WHERE userID=?', [req.session.userID], function (err, result) {
        if (err) throw err;

        // 비밀번호 검증
        crypto.pbkdf2(current, result[0].salt, 100000, 64, 'sha512', (err, key) => {
            const pw = key.toString('base64');
            if (pw != result[0].password) {
                res.send("<script>alert('현재 비밀번호와 일치하지 않습니다. 다시 입력해주세요.');history.back();</script>");
            }
            else if (!reg.test(newpw)) {
                res.send("<script>alert('새 비밀번호는 영문과 숫자를 포함하여 8자 이상으로 설정해야 합니다.');history.back();</script>");
            }
            else if (newpw != check) { // 새 비밀번호 확인
                res.send("<script>alert('새 비밀번호와 일치하지 않습니다. 다시 입력해주세요.');history.back();</script>");
            }
            else {
                crypto.randomBytes(64, (err, buf) => {
                    const salt = buf.toString('base64');
                    crypto.pbkdf2(newpw, salt, 100000, 64, 'sha512', (err, key) => {
                        const hashedPassword = key.toString('base64');
                        console.log(hashedPassword);

                        db.query(`UPDATE user SET password=?, salt=? WHERE userID=?`, [hashedPassword, salt, req.session.userID], function (err, result) {
                            if (err) throw err;
                            console.log('success');
                            res.send("<script>alert('비밀번호 변경이 완료되었습니다!');location.href='/mypage/myinfo';</script>");
                        })
                    })
                })
            }
        })


    })
})
// 회원 탈퇴
router.post('/delete_user', function (req, res) {
    console.log(req.body);
    var id = req.body.id;
    var password = req.body.password;

    db.query('SELECT password, salt FROM user WHERE userID=?', [id], function (err, results) {
        if (err) throw err;
        // 비밀번호 검증
        crypto.pbkdf2(password, results[0].salt, 100000, 64, 'sha512', (err, key) => {
            const pw = key.toString('base64');
            if (pw == results[0].password) {
                db.query('DELETE FROM user WHERE userID=?', [id], function (err, result) {
                    if (err) throw err;
                    console.log('탈퇴 성공');
                    req.session.destroy((err) => {
                        res.send({ result: true });
                    })
                })
            } else {
                res.send({ result: false });
            }
        })
    })

})



router.get('/myplans', function (req, res) {
    db.query(`SELECT planID, title, location, date_format(startDate, '%Y-%m-%d') AS startDate, date_format(endDate, '%Y-%m-%d') AS endDate 
         FROM tour_plan WHERE userID=? ORDER BY startDate `, [req.session.userID], function (err, results) {
        if (err) throw err;

        var plist = [];

        for (var i = 0; i < results.length; i++) {     //sql2
            var startDate = results[i].startDate;
            var endDate = results[i].endDate;
            var days = (new Date(startDate).getTime() - new Date(getToday()).getTime()) / (24 * 60 * 60 * 1000);
            var travel_days = (new Date(endDate).getTime() - new Date(startDate).getTime()) / (24 * 60 * 60 * 1000);
            var d_day = `D - ${days}`;

            if (days <= 0 && days >= travel_days * -1) {
                d_day = '오늘은 여행일입니다. 즐거운 여행 되세요!';
            } else if (days < travel_days * -1) {
                d_day = '지난 여행';
            }

            plist[i] = planTemplate.list(results[i], d_day);
        }
        var plists = plist.join(''); // list of plans
        var plans = myTemplate.plans(plists, results.length);
        var body = myTemplate.main(plans, '');
        var css = `<link href="/css/mypage/mypage.css" rel="stylesheet">`;
        var header = template.header(authCheck.statusUI(req, res), authCheck.statusUI_mp(req, res));

        var text_mode = req.cookies.text;
        var color_mode = req.cookies.color;

        if (text_mode == 1) {
            css = `<link href="/css/mypage/mypage_text.css" rel="stylesheet">`;
        } else if (color_mode == 1) {
            css = `<link href="/css/mypage/mypage_color.css" rel="stylesheet">`;
        }
        var html = template.HTML(css, header, body);
        res.send(html);
    })
})

router.get('/mybookmarks', function (req, res) {
    sql1 = `SELECT planID, title, location, date_format(startDate, '%Y-%m-%d') AS startDate, date_format(endDate, '%Y-%m-%d') AS endDate 
            FROM tour_plan WHERE userID=? ORDER BY startDate; `;
    sql2 = `SELECT bookID, title, addr, latitude, longitude, planID, placeID FROM bookmark WHERE userID=?; `;
    db.query(sql1 + sql2, [req.session.userID, req.session.userID], function (error, results) {
        if (error) throw error;
        var blist = [], place = [];

        for (var i = 0; i < results[0].length; i++) {     //sql1
            var startDate = results[0][i].startDate;
            var endDate = results[0][i].endDate;
            var planID = results[0][i].planID;
            var title = results[0][i].title;
            var location = results[0][i].location;

            blist[i] = myTemplate.blists(title, startDate, endDate, planID, location);
        }
        var blists = blist.join(''); // list of bookmarks

        for (var i = 0; i < results[1].length; i++) {     //sql2
            place[i] = myTemplate.places(results[1][i], i);
        }
        var places = place.join('');    // bookmarked places

        var bookmarks = myTemplate.bookmarks(blists, places, results[1].length);

        var css = `<link href="/css/mypage/mypage.css" rel="stylesheet">`;
        var js = `<script src="/js/mypage/markedPlaces.js"></script>
                    <script src="/js/place.js"></script>`;
        var body = myTemplate.main(bookmarks, js);
        var header = template.header(authCheck.statusUI(req, res), authCheck.statusUI_mp(req, res));

        var text_mode = req.cookies.text;
        var color_mode = req.cookies.color;

        if (text_mode == 1) {
            css = `<link href="/css/mypage/mypage_text.css" rel="stylesheet">`;
        } else if (color_mode == 1) {
            css = `<link href="/css/mypage/mypage_color.css" rel="stylesheet">`;
        }
        var html = template.HTML(css, header, body);
        res.send(html);
    })
})

router.get('/myposts', function (req, res) {
    db.query('SELECT postID, title, date, category FROM post WHERE userID=? ORDER BY postID DESC', [req.session.userID], function (err, results) {
        if (err) throw err;

        var post_list = [];
        for (var i = 0; i < results.length; i++) {
            post_list[i] = myTemplate.post_lists(results[i]);
        }
        var post_lists = post_list.join('');    // list of posts
        var posts = myTemplate.posts(post_lists);

        var css = `<link href="/css/mypage/mypage.css" rel="stylesheet">`;
        var js = '<script src="/js/pagination.js"></script>';
        var body = myTemplate.main(posts, js);
        var header = template.header(authCheck.statusUI(req, res), authCheck.statusUI_mp(req, res));

        var text_mode = req.cookies.text;
        var color_mode = req.cookies.color;

        if (text_mode == 1) {
            css = `<link href="/css/mypage/mypage_text.css" rel="stylesheet">`;
        } else if (color_mode == 1) {
            css = `<link href="/css/mypage/mypage_color.css" rel="stylesheet">`;
        }
        var html = template.HTML(css, header, body);
        res.send(html);
    })
})

router.get('/mycomments', function (req, res) {
    const query1 = `SELECT c.commentID, c.userID, c.postID, c.description , c.parents, c.date,
     p.title, p.category
    FROM comment c
    LEFT OUTER JOIN post p ON c.postID = p.postID
    WHERE c.userID = ? ORDER BY commentID DESC`;

    db.query(query1, [req.session.userID], (err1, results1) => {
        if (err1) {
            console.error("Error in query 1:", err1);
            return res.status(500).json({ error: "Internal Server Error" });
        }

        // 여기에서 results1을 처리 또는 저장
        console.log("Query 1 results:", results1);

        // 이제 content_comment 테이블에서 userID가 "seonghye"인 행을 가져옵니다.
        const query2 = `SELECT *
                    FROM content_comment
                    WHERE userID = ?
                    ORDER BY date DESC;`;

        db.query(query2, [req.session.userID], (err2, results2) => {
            if (err2) {
                console.error("Error in query 2:", err2);
                return res.status(500).json({ error: "Internal Server Error" });
            }

            // 여기에서 results2를 처리 또는 저장
            console.log("Query 2 results:", results2);

            // results1 및 results2를 조합하거나 어플리케이션에서 필요한 대로 처리할 수 있습니다.
            // 예를 들어, 두 결과를 합치고 date를 기준으로 최근 순으로 정렬하는 등의 작업을 수행할 수 있습니다.

            // 예를 들어, 두 결과를 합쳐서 최종 결과를 정렬하는 방법은 다음과 같을 수 있습니다.
            const combinedResults = [...results1, ...results2];
            combinedResults.sort((a, b) => b.date - a.date); // date를 기준으로 내림차순 정렬

            var results = combinedResults;

            var comment_list = [];
            for (var i = 0; i < results.length; i++) {
                comment_list[i] = myTemplate.comment_lists(results[i]);
            }
            var comment_lists = comment_list.join('');    // list of posts
            var comments = myTemplate.comment(comment_lists);

            var css = `<link href="/css/mypage/mypage.css" rel="stylesheet">`;
            var js = '<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script><script src="/js/pagination.js"></script><script src="/js/mypage/comment.js"></script>';
            var body = myTemplate.main(comments, js);
            var header = template.header(authCheck.statusUI(req, res), authCheck.statusUI_mp(req, res));

            var text_mode = req.cookies.text;
            var color_mode = req.cookies.color;

            if (text_mode == 1) {
                css = `<link href="/css/mypage/mypage_text.css" rel="stylesheet">`;
            } else if (color_mode == 1) {
                css = `<link href="/css/mypage/mypage_color.css" rel="stylesheet">`;
            }
            var html = template.HTML(css, header, body);
            res.send(html);

            // 결과를 클라이언트에 반환하거나 다른 작업을 수행할 수 있습니다.

        });
    });
})

router.all('/delete_comments', function (req, res) {
    var post = req.body;
    data = []
    if (!Array.isArray(post.data)) {
        data.push(post.data)
    }
    else {
        data = post.data
    }
    // var s = data.toString();
    console.log(data);
    var cc = []; //content_comment table
    var c = []; //content table
    var r = []; //recommend table

    for (var i = 0; i < data.length; i++) {
        console.log("data[i]" + data[i])

        temp = data[i].split('/')
        if (temp[0] == 'c') {
            c.push(temp[1])
        } else if (temp[0] == 'cc') {
            cc.push(temp[1])
        } else if (temp[0] == 'r') {
            r.push(temp[1])
        }

    }

    if (c.length != 0) {
        console.log("c=>", c)
        db.query(`DELETE FROM comment WHERE commentID IN (?)`, [c], function (error1, results1) {
            if (error1) throw error1;
            console.log('success');
            res.send('comment')
        })
    }
    if (cc.length != 0) {
        console.log("cc=>", cc)
        db.query(`DELETE FROM content_comment WHERE content_commentID IN (?)`, [cc], function (error2, results2) {
            if (error2) throw error2;
            console.log('success');
            res.send('comment')
        })
    }
    if (r.length != 0) {
        db.query(`DELETE FROM recommend WHERE recommendID IN (?)`, [r], function (error3, results3) {
            if (error3) throw error3;
            console.log('success');
            res.send('recommend')
        })
    }



})

router.get('/myscraps', function (req, res) {
    db.query(`SELECT r.recommendID, p.title, p.category,p.postID, p.userID, p.description, p.date
                FROM recommend r
                LEFT JOIN post p ON r.postID = p.postID
                WHERE r.userID=?
                ORDER BY r.recommendID DESC;`, [req.session.userID], function (err, results) {
        if (err) throw err;

        var like_list = [];
        for (var i = 0; i < results.length; i++) {
            like_list[i] = myTemplate.like_lists(results[i]);
        }
        var like_lists = like_list.join('');    // list of posts
        var likes = myTemplate.likes(like_lists);

        var css = `<link href="/css/mypage/mypage.css" rel="stylesheet">`;
        var js = '<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script><script src="/js/pagination.js"></script><script src="/js/mypage/comment.js"></script>';
        //  var js = '<script src="/js/pagination.js"></script><script src="/js/mypage/mypage.js"></script>';
        var body = myTemplate.main(likes, js);
        var header = template.header(authCheck.statusUI(req, res), authCheck.statusUI_mp(req, res));

        var text_mode = req.cookies.text;
        var color_mode = req.cookies.color;

        if (text_mode == 1) {
            css = `<link href="/css/mypage/mypage_text.css" rel="stylesheet">`;
        } else if (color_mode == 1) {
            css = `<link href="/css/mypage/mypage_color.css" rel="stylesheet">`;
        }
        var html = template.HTML(css, header, body);
        res.send(html);
    })
})


// 북마크 수정
router.post('/modify_bookmark/:bookID', function (req, res) {
    var bookID = req.params.bookID;
    var planID = req.body.planID;
    if (planID == null) return;

    db.query(`UPDATE bookmark SET planID=? WHERE bookID=?`, [planID, bookID],
        function (error, results) {
            if (error) throw error;
            console.log('success');
            res.redirect('/');
        })
})

// 게시글 여러개 삭제
router.post('/delete_posts', function (req, res) {
    var post = req.body;
    var data = post.data;
    var s = data.toString();
    console.log(data);
    db.query(`DELETE FROM post WHERE postID IN (?)`, [data], function (error, results) {
        if (error) throw error;
        console.log('success');
        res.redirect('/');
    })
})
module.exports = router;