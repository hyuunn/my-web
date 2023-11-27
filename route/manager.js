const express = require('express');
const router = express.Router();
const db = require('../lib/db');
const template = require('../lib/template.js');
const authCheck = require('../lib/authCheck.js');
const managerTemplate = require('../lib/managerTm.js');
const nodemailer = require("nodemailer");

const {id, email_service, user, pass} = process.env;
const report_type = {
    0: '성적 콘텐츠', 1: '스팸홍보/도배글', 2: '불법정보', 3: '청소년 유해',
    4: '욕설/혐오/차별적 표현', 5: '개인정보 노출', 6: '불쾌한 표현'
};
// router.get('/', function (req, res) {
//     var css = `<link href="/css/manager.css" rel="stylesheet">`;
//     var header = template.header(authCheck.statusUI(req, res), authCheck.statusUI_mp(req, res));
//     var body = managerTemplate.main();
//     var html = template.HTML(css, header, body);
//     res.send(html);
// })

router.get('/report', function (req, res) {
    var sql1 = 'SELECT id, type, manage_post.date, title, userID, progress, manage_post.postID FROM manage_post, post WHERE manage_post.postID = post.postID ORDER BY id DESC; '
    var sql2 = 'SELECT postID, COUNT(postID) AS count FROM manage_post GROUP BY postID';
    if (req.session.userID != id) {
        res.send('잘못된 접근입니다.');
    }
    else {
        db.query(sql1 + sql2, function (err, results) {
            if (err) throw err;
            console.log(results[1]);
            var list = [];
            for (var i = 0; i < results[0].length; i++) {
                list.push(managerTemplate.lists(results[0][i], results[1]));
            }
            var lists = list.join('');
            var css = `<link href="/css/manager.css" rel="stylesheet">`;
            var header = template.header(authCheck.statusUI(req, res), authCheck.statusUI_mp(req, res));
            var body = managerTemplate.reports(lists);
            var html = template.HTML(css, header, body);
            res.send(html);
        })
    }
})

router.post('/update_progress', function(req, res){
    console.log(req.body);
    db.query('UPDATE manage_post SET progress=? WHERE id=?', [1, req.body.id], function(err, result){
        if(err) throw err;
        res.send('success');
    })
})

router.post('/delete_reported', function(req, res){
    console.log(req.body);
    const postID = req.body.postID;
    const userID = req.body.userID;

    db.query(`SELECT email FROM user WHERE userID=?;
    select type, title from manage_post, post where post.postID=manage_post.postID and post.postID=?;`, [userID, postID], function(err, result){
        if(err) throw err;
        console.log(result[0]);
        console.log(result[1]);
        console.log(report_type[result[1][0].type]);

        var count = {};
        for(var i = 0; i < result[1].length; i++){
            if(count[result[1][i].type]){
                count[result[1][i].type] += 1;
            } else {
                count[result[1][i].type] = 1;
            }        }
        
        console.log(count);

        var list = '';
        for(var key in count){
            list += `<li>${report_type[key]} ${count[key]}건</li>`;
        }

        const transporter = nodemailer.createTransport({
            service: email_service,
            port: 465,
            secure: true,
            auth: {
              user: user,
              pass: pass
            }
          });
  
          const mailOptions = {
            from: user,
            to: result[0][0].email,
            subject: '다수의 신고 접수로 인해 회원님의 게시글이 삭제되었습니다.',
            html:
              `<div style="margin-bottom:15px;">
            <p>회원님의 게시글( <b>${result[1][0].title}</b> )이 하기의 사유로 인해 신고가 접수되어 삭제되었습니다.</p>
            <p>건강한 인터넷 문화를 위해 예의를 지켜주시길 바랍니다.</p>
            </div>
            <p><b><신고 사유></b></p>
            <ul>${list}</ul>`
          };
  
          transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              console.error(error);
            } else {
              console.log('Email Sent : ', info);
            }
          })
  
          res.send('success');
    })

    db.query(`DELETE FROM a, b USING post a 
                LEFT JOIN manage_post b ON a.postID = b.postID 
                WHERE b.postID = ?;`, [postID], function(err, result){
                    if(err) throw err;
    })
})


router.get('/update', function(req, res) {
    db.query('SELECT * FROM update_info  ORDER BY id DESC', function (err, results) {
      if (err) throw err;
  
      var post_list = [];
      for (var i = 0; i < results.length; i++) {
          post_list[i] = managerTemplate.update_lists(results[i]);
      }
      var post_lists = post_list.join('');    // list of posts
      

      var css = `<link href="/css/mypage/mypage.css" rel="stylesheet"><link href="/css/manager/update_info.css" rel="stylesheet"><link href="/css/manager/modal.css" rel="stylesheet">`;
      var js = '<script src="/js/pagination.js"></script><script src="/js/manager/update.js"></script>';
      var table = managerTemplate.manage_update(post_lists);
      var body = managerTemplate.update_main(table,js)
      var header = template.header(authCheck.statusUI(req, res), authCheck.statusUI_mp(req, res));
      var html = template.HTML(css, header, body);
      res.send(html);
  })
  });
  router.post('/progress', function(req, res) {
    db.query(`UPDATE update_info SET progress=? WHERE id=?`, [req.body.progress, req.body.id],
    function (error, results) {
        if (error) throw error;
        console.log('success');
        res.send('success');
    })
  })
  router.post('/update/delete', function(req, res) {
    var post = req.body;
    var data = post.data;
    var s = data.toString();
    console.log(data);
    db.query(`DELETE FROM update_info WHERE id IN (?)`, [data], function (error, results) {
        if (error) throw error;
        console.log('success');
        res.redirect('/');
    })
  })
  router.post('/getinfo', function(req, res) {
    db.query(`UPDATE update_info SET \`checked\`=1 WHERE id=?`, [req.body.id],
    function (error, results1) {
        if (error) throw error;
        console.log('success');
    })

    db.query(`SELECT * FROM update_info WHERE  id=?`, [ req.body.id],
    function (error, results) {
        if (error) throw error;
        console.log('success');
        res.send(results);
    })
  })

module.exports = router;