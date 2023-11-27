const express = require('express');
const router = express.Router();
var db = require('../lib/db');
var template = require('../lib/template.js');
var authCheck = require('../lib/authCheck.js');
var planTemplate = require('../lib/planTm.js');
var fs = require('fs');

const sidoCode = JSON.parse(fs.readFileSync('./data/areacode/sidoCode.json', 'utf-8'));
const gyeonggi = JSON.parse(fs.readFileSync('./data/areacode/json/gyeonggi.json', 'utf-8'));
const gangwon = JSON.parse(fs.readFileSync('./data/areacode/json/gangwon.json', 'utf-8'));
const chungbuk = JSON.parse(fs.readFileSync('./data/areacode/json/chungbuk.json', 'utf-8'));
const chungnam = JSON.parse(fs.readFileSync('./data/areacode/json/chungnam.json', 'utf-8'));
const gyeongbuk = JSON.parse(fs.readFileSync('./data/areacode/json/gyeongbuk.json', 'utf-8'));
const gyeongnam = JSON.parse(fs.readFileSync('./data/areacode/json/gyeongnam.json', 'utf-8'));
const jeonbuk = JSON.parse(fs.readFileSync('./data/areacode/json/jeonbuk.json', 'utf-8'));
const jeonnam = JSON.parse(fs.readFileSync('./data/areacode/json/jeonnam.json', 'utf-8'));

function findByAreaCode(sido, rnum) {
    var location, sigun;
    if (sido == 31) {
        location = gyeonggi[rnum - 1].name;
        sigun = gyeonggi[rnum - 1].code;
    }
    else if (sido == 32) {
        location = gangwon[rnum - 1].name;
        sigun = gangwon[rnum - 1].code;
    }
    else if (sido == 33) {
        location = chungbuk[rnum - 1].name;
        sigun = chungbuk[rnum - 1].code;
    }
    else if (sido == 34) {
        location = chungnam[rnum - 1].name;
        sigun = chungnam[rnum - 1].code;
    }
    else if (sido == 35) {
        location = gyeongbuk[rnum - 1].name;
        sigun = gyeongbuk[rnum - 1].code;
    }
    else if (sido == 36) {
        location = gyeongnam[rnum - 1].name;
        sigun = gyeongnam[rnum - 1].code;
    }
    else if (sido == 37) {
        location = jeonbuk[rnum - 1].name;
        sigun = jeonbuk[rnum - 1].code;
    }
    else if (sido == 38) {
        location = jeonnam[rnum - 1].name;
        sigun = jeonnam[rnum - 1].code;
    }
    else if (sido == 39) {    // 제주
        location = sidoCode[16].name;
    }
    else {  // 광역시
        location = sidoCode[sido - 1].name;;
    }
    return [location, sigun];
}
// 메인 페이지
router.get('/', function (req, res) {
    var css = `<link href="/css/plan/planMain.css" rel="stylesheet">`;
    var header = template.header(authCheck.statusUI(req, res), authCheck.statusUI_mp(req, res));
    var scheBox = planTemplate.scheBox();
    var popular = planTemplate.popular();
    var body = planTemplate.planMain(scheBox, popular);

    var text_mode = req.cookies.text;
    var color_mode = req.cookies.color;

    if (text_mode == 1) {
        var css = `<link href="/css/plan/planMain_text.css" rel="stylesheet">`;
    } else if (color_mode == 1) {
        css = '<link href="/css/plan/planMain_color.css" rel="stylesheet">';
    }
    var html = template.HTML(css, header, body);

    if (authCheck.isOwner(req, res)) {    // 로그인 상태
        db.query(`SELECT * FROM tour_plan WHERE userID = '${req.session.userID}'`,
            function (error, results, fields) {
                if (error) throw error;
                if (results.length > 0) { // 일정이 있는 경우 일정 목록페이지
                    res.redirect('/plan/list');
                    return false;
                } else { // 일정이 없는 경우 기본 화면
                    res.send(html);
                }
            })
    } else {     // 로그인이 안 되어있으면 기본 화면
        res.send(html);
    }

})


// 일정 생성
router.post('/create_process', function (req, res) {
    if (!authCheck.isOwner(req, res)) {    // 로그인이 안 되어있으면 로그인 페이지 이동
        return res.send(`<script type="text/javascript">alert("로그인이 필요한 서비스입니다."); 
        location.href="http://localhost:3000/auth/login?path=/plan";</script>`);
    }
    var post = req.body;
    var startDate = post.startDate;
    var endDate = post.endDate;
    var sido = post.sido;
    var rnum = post.sigun;

    var [location, sigun] = findByAreaCode(sido, rnum);

    var title = location + "여행";
    var today = new Date();
    db.query(`INSERT INTO tour_plan (startDate, endDate, sidoCode, sigunCode, location, userID, title) VALUES(?,?,?,?,?,?,?);
                INSERT INTO popular_place (place_name, date, sido_code, sigun_code) VALUES(?,?,?,?);`,
        [startDate, endDate, sido, sigun, location, req.session.userID, title, location, today, sido, sigun], function (error2, data) {
            if (error2) throw error2;
            res.redirect('/plan/list');
        });
})


// 일정 삭제
router.post('/delete_process/:planID', function (req, res) {
    db.query(`DELETE FROM tour_plan WHERE planID = ${req.params.planID}`,
        function (error, results) {
            if (error) throw error;
            res.send(`<script type="text/javascript"> 
                document.location.href="/plan/list";</script>`);
        })
})

// 여행 지역 수정
router.post('/update/location/:planID', function (req, res) {
    var post = req.body;
    var sido = post.sido;
    var sigunNum = post.sigun;
    var [location, sigun] = findByAreaCode(sido, sigunNum);
    var title = location + "여행";
    // db.query('SELECT title FROM tour_plan WHERE planID=?', [req.params.planID], function(err, result){
    //     if(result.title != null){
    //         title = result.title;
    //     }
    // })
    var today = new Date();

    db.query(`UPDATE tour_plan SET sidoCode=?, sigunCode=?, location=?, title=? WHERE planID = ?;
                INSERT INTO popular_place (place_name, date, sido_code, sigun_code) VALUES(?,?,?,?);`,
        [sido, sigun, location, title, req.params.planID, location, today, sido, sigun], function (error, results) {
            if (error) throw error;
            res.redirect(`/plan/detail/${req.params.planID}`);
        })
})


// 여행 날짜 수정
router.post('/update/date/:planID', function (req, res) {
    var post = req.body;
    var startDate = post.startDate;
    var endDate = post.endDate;

    db.query(`UPDATE tour_plan SET startDate=?, endDate=? WHERE planID = ${req.params.planID}`,
        [startDate, endDate], function (error, results) {
            if (error) throw error;
            res.redirect(`/plan/detail/${req.params.planID}`);
        })
})

// 여행 제목 수정
router.post('/update/title/:planID', function (req, res) {
    var post = req.body;
    var title = post.title;

    db.query(`UPDATE tour_plan SET title=? WHERE planID = ${req.params.planID}`,
        [title], function (error, results) {
            if (error) throw error;
            res.redirect(`/plan/detail/${req.params.planID}`);
        })
})

// yy-mm-dd
function getToday() {
    var date = new Date();
    var year = date.getFullYear();
    var month = ("0" + (1 + date.getMonth())).slice(-2);
    var day = ("0" + date.getDate()).slice(-2);

    return year + "-" + month + "-" + day;
}

function getDt(dt) {
    const temp = new Date(dt);
    const year = temp.getFullYear();
    const month = temp.getMonth() + 1;
    const date = temp.getDate();

    return `${year}-${month >= 10 ? month : '0' + month}-${date >= 10 ? date : '0' + date}`;
}

// 일정 목록
router.get('/list', function (req, res) {
    db.query(`SELECT planID, title, location, date_format(startDate, '%Y-%m-%d') AS startDate, date_format(endDate, '%Y-%m-%d') AS endDate FROM tour_plan 
    WHERE userID = '${req.session.userID}' ORDER BY startDate`, function (error, results) {
        if (error) throw error;

        var scheBox = planTemplate.scheBox();

        if (results.length == 0) {
            res.redirect('/');
        }
        else {
            var list = [];
            for (var i = 0; i < results.length; i++) {
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

                list[i] = planTemplate.list(results[i], d_day);
            }
            var plist = list.join('');
            var body = planTemplate.planList(scheBox, plist, req.session.nickname);
            var css = `<link href="/css/plan/planList.css" rel="stylesheet">`;
            var header = template.header(authCheck.statusUI(req, res), authCheck.statusUI_mp(req, res));

            var text_mode = req.cookies.text;
            var color_mode = req.cookies.color;

            if (text_mode == 1) {
                var css = `<link href="/css/plan/planList_text.css" rel="stylesheet">`;
            } else if (color_mode == 1) {
                css = '<link href="/css/plan/planList_color.css" rel="stylesheet">';
            }
            var html = template.HTML(css, header, body);
            res.send(html);
        }
    })
})

// 일정 상세 페이지
router.get('/detail/:planID', function (req, res) {
    var sql1 = `SELECT * FROM tour_plan WHERE planID = '${req.params.planID}'; `;
    var sql2 = `SELECT bookID, title, longitude, latitude, addr, planID, placeID FROM bookmark WHERE planID = '${req.params.planID}'; `;
    var sql3 = `SELECT title, date, startTime, singleID, memo, placeID FROM single_plan 
    WHERE planID = '${req.params.planID}' ORDER BY number; `;

    var text_mode = req.cookies.text;

    db.query(sql1 + sql2 + sql3, function (error, results) {
        if (error) throw error;
        // sql1 result
        var location = results[0][0].location;
        var startDate = getDt(results[0][0].startDate);
        var endDate = getDt(results[0][0].endDate);
        var planID = results[0][0].planID;
        var title = results[0][0].title;

        // sql2 result
        var blist = [];
        for (var i = 0; i < results[1].length; i++) {
            blist[i] = planTemplate.bm_list(results[1][i]);
        }
        var bm_list = blist.join('');

        // sql3 result
        var s_info = [];
        for (var i = 0; i < results[2].length; i++) {
            s_info.push({
                title: results[2][i].title,
                date: results[2][i].date
            })
        }

        var days = (new Date(startDate).getTime() - new Date(getToday()).getTime()) / (24 * 60 * 60 * 1000);
        var travel_days = (new Date(endDate).getTime() - new Date(startDate).getTime()) / (24 * 60 * 60 * 1000);
        var d_day = `여행이 ${days}일 남았네요!`;
        if (days <= 0 && days >= travel_days * -1) {
            d_day = '오늘은 여행일입니다. 즐거운 여행 되세요!';
        } else if (days < travel_days * -1) {
            d_day = '지난 여행입니다. 즐거운 여행 되셨나요?';
        }

        var s_list = [];
        for (var i = 0; i < results[2].length; i++)
            s_list[i] = planTemplate.s_list(results[2], i);

        // 배열 초기화
        var listByDate = [];
        for (var i = 0; i <= travel_days; i++)
            listByDate[i] = '';

        for (var i = 0; i < s_list.length; i++) {
            for (var j = 1; j <= travel_days + 1; j++) {
                if (s_list[i].includes(`List_${j}`)) {
                    listByDate[j - 1] += s_list[i];
                }
            }
        }

        var scheTable = '';
        for (var j = 1; j <= travel_days + 1; j++) {
            scheTable += planTemplate.create_box(j, listByDate[j - 1]);
        }

        var header = template.header(authCheck.statusUI(req, res), authCheck.statusUI_mp(req, res));
        var css = `<link href="/css/plan/planDetail.css" rel="stylesheet">`;
        var body = planTemplate.planDetail(results[0][0], startDate, endDate, d_day, scheTable, bm_list, '');


        var color_mode = req.cookies.color;

        if (text_mode == 1) {
            var css = `<link href="/css/plan/planDetail_text.css" rel="stylesheet">`;
        } else if (color_mode == 1) {
            css = '<link href="/css/plan/planDetail_color.css" rel="stylesheet">';
        }
        var html = template.HTML(css, header, body);
        res.send(html);
    })
})

// 북마크 추가
router.post('/add_bookmark/:planID', function (req, res) {
    var post = req.body;
    var title = post.title;
    var longitude = post.longitude;
    var latitude = post.latitude;
    var addr = post.addr;
    var placeID = post.placeID;

    db.query('INSERT INTO bookmark (title, longitude, latitude, addr, placeID, userID, planID) VALUES(?,?,?,?,?,?,?)',
        [title, longitude, latitude, addr, placeID, req.session.userID, req.params.planID], function (err, data) {
            if (err) throw err;
            console.log('success');
            res.send('bookmark');
        });

})
// 북마크 삭제
router.post('/delete_bookmark', function (req, res) {
    var id = req.body.id;
    db.query(`DELETE FROM bookmark WHERE bookID=?`, [id], function (error, results) {
        if (error) throw error;
        console.log('success');
        res.redirect('/');
    })
})

// 일정에 장소 추가
router.post('/add_to_plan/:planID', function (req, res) {
    var post = req.body;
    var bookID = post.bookID;
    var date = post.date;
    if (isNaN(date)) return;
    console.log(post);

    db.query('SELECT title, latitude, longitude, placeID FROM bookmark WHERE bookID=?', [bookID], function (err, result) {
        if (err) throw err;

        console.log(result);
        db.query(`INSERT INTO single_plan (title, date, planID, number, latitude, longitude, placeID) VALUES(?,?,?,?,?,?,?)`,
            [result[0].title, date, req.params.planID, 0, result[0].latitude, result[0].longitude, result[0].placeID],
            function (err2, results) {
                if (err2) throw err2;
                console.log('success');
                res.redirect('/');
            })
    })
})
// 장소 검색 후 일정에 장소 바로 추가
router.post('/add_directly/:planID', function (req, res) {
    var post = req.body;
    var date = post.date;
    if (isNaN(date)) return;
    console.log(post);

    db.query(`INSERT INTO single_plan (title, date, planID, number, latitude, longitude, placeID) VALUES(?,?,?,?,?,?,?)`,
        [post.title, date, req.params.planID, 0, post.latitude, post.longitude, post.placeID],
        function (err2, results) {
            if (err2) throw err2;
            res.send('success');
        })

    // db.query('SELECT title, latitude, longitude, placeID FROM bookmark WHERE bookID=?', [bookID], function (err, result) {
    //     if (err) throw err;

    //     console.log(result);
    //     db.query(`INSERT INTO single_plan (title, date, planID, number, latitude, longitude, placeID) VALUES(?,?,?,?,?,?,?)`,
    //         [result[0].title, date, req.params.planID, 0, result[0].latitude, result[0].longitude, result[0].placeID],
    //         function (err2, results) {
    //             if (err2) throw err2;
    //             console.log('success');
    //             res.redirect('/');
    //         })
    // })
})

// 스케줄 삭제
router.post('/delete_schedule', function (req, res) {
    var post = req.body;
    var singleID = post.singleID;
    db.query(`DELETE FROM single_plan WHERE singleID = ?`, [singleID],
        function (error, results) {
            if (error) throw error;
            console.log('success');
            res.redirect('/');
        })
})

// 일정에 시간 추가
router.post('/add_time', function (req, res) {
    var post = req.body;
    var time = post.time;
    var singleId = post.singleID;
    db.query(`UPDATE single_plan SET startTime=? WHERE singleID = ?`,
        [time, singleId], function (error, results) {
            if (error) throw error;
            res.send('success');
        })
})

router.post('/delete_time', function (req, res) {
    var post = req.body;
    var singleId = post.id;

    db.query(`UPDATE single_plan SET startTime=? WHERE singleID = ?`, [null, singleId], function (error, results) {
        if (error) throw error;
        res.send('success');
    })
})

// 일정에 메모 추가
router.post('/add_memo', function (req, res) {
    var post = req.body;
    console.log(post);
    var id = post.id;
    var memo = post.memo;

    db.query(`UPDATE single_plan SET memo=? WHERE singleID = ?`, [memo, id], function (error, results) {
        if (error) throw error;
        res.send('success');
    })
})
// 메모 삭제
router.post('/delete_memo', function (req, res) {
    var post = req.body;
    var id = post.id;
    console.log(post);

    db.query('UPDATE single_plan SET memo=? WHERE singleID=?', [null, id], function (err, results) {
        if (err) throw err;
        res.send('success');
    })
})

// 일정 순서 변경
router.post('/update_order', function (req, res) {
    var post = req.body;
    var singleID = post.singleID;
    console.log(singleID);
    singleID = JSON.parse(singleID);
    //console.log(singleID);
    for (var i = 0; i < singleID.length; i++) {
        db.query(`UPDATE single_plan SET date=?, number=? WHERE singleID=?`,
            [singleID[i][0], i, singleID[i][1]],
            function (err, results) {
                if (err) throw err;
                console.log('success');

            })
    }

    res.send('success');
})

// 일정 변경 - 텍스트 보기
router.post('/update_singlePlan', function (req, res) {
    var singleID = req.body.singleID;
    var date = req.body.date;
    console.log(date);

    db.query('UPDATE single_plan SET date=? WHERE singleID=?', [date, singleID], function (err, result) {
        if (err) throw err;
        res.send('success');
    })

})

// 일정 순서 변경 - 텍스트 보기
router.post('/updown_number', function (req, res) {
    console.log(req.body);
    var updown = req.body.updown;
    var sql = `UPDATE single_plan SET number=? WHERE singleID=?; `;

    db.query('SELECT number, planID, date FROM single_plan WHERE singleID=?', [req.body.singleID], function (err, result) {
        if (err) throw err;
        // console.log(result[0].number);
        var number = result[0].number;
        var planID = result[0].planID;
        var date = result[0].date;

        if (updown == 'up') { // 일정 위로 올리기: number - 1
            db.query('SELECT singleID, number FROM single_plan WHERE number=? AND planID=? AND date=?', 
            [number - 1, planID, date], function(err, smaller){
                console.log(smaller);
                if(smaller.length == 0){
                    console.log('cannot update');
                } else {
                    db.query(sql + sql, [smaller[0].number, req.body.singleID, number, smaller[0].singleID], function (err, result) {
                        if (err) throw err;
                        res.send('success');
                    })
                }
            })
            
        } else { // 일정 아래로 내리기: number + 1
            db.query('SELECT singleID, number FROM single_plan WHERE number=? AND planID=? AND date=?', 
            [number + 1, planID, date], function(err, bigger){
                if(bigger.length == 0){
                    console.log('cannot update');
                } else {
                    db.query(sql + sql, [bigger[0].number, req.body.singleID, number, bigger[0].singleID], function (err, result) {
                        if (err) throw err;
                        res.send('success');
                    })
                }
            })
        }

    })
    // if(updown == 'up'){
    //     db.query('UPDATE single_plan SET number=? WHERE singleID=?', [date, singleID], function (err, result) {
    //         if (err) throw err;
    //         res.send('success');
    //     })
    // }
})
module.exports = router;