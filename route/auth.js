const express = require('express');
const router = express.Router();
var db = require('../lib/db');
var template = require('../lib/template.js');
var authCheck = require('../lib/authCheck.js');
const crypto = require('crypto');
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

const { email_service, user, pass } = process.env;

// 로그인 화면
router.get('/login', function (req, res) {
  console.log(req.query);
  var header = template.header(authCheck.statusUI(req, res), authCheck.statusUI_mp(req, res));
  var body = template.login(req.query.path);
  var css = '<link rel = "stylesheet" href="/css/auth/login.css">';

  var color_mode = req.cookies.color;
  if(color_mode == 1){
    css = '<link rel = "stylesheet" href="/css/auth/login_color.css">';
  }
  var html = template.HTML(css, header, body);
  res.send(html);
});

// 로그인 프로세스
router.post('/login_process', function (req, res) {
  var post = req.body;
  var userID = post.userID;
  var password = post.pwd;

  console.log(req.query);
  if (userID && password) { // id, pw 입력 여부 확인
    db.query('SELECT * FROM user WHERE userID = ?',
      [userID], function (error, results) {
        if (error) throw error;
        if (results.length > 0) {
          // 비밀번호 검증
          crypto.pbkdf2(password, results[0].salt, 100000, 64, 'sha512', (err, key) => {
            const pw = key.toString('base64');
            if (pw == results[0].password) {  // 비밀번호 일치
              // 세션 정보 갱신
              req.session.is_logined = true;
              req.session.userID = results[0].userID;
              req.session.nickname = results[0].name;
              // 비밀번호 찾기한 경우
              if (results[0].pw_reset == true) {
                //req.session.userID = results[0].userID;
                console.log('logined', req.session.userID);
                res.send('<script>location.href="/auth/reset_password";</script>');
              } else {
                req.session.save(function () {
                  // 이전에 방문한 페이지가 있는 경우 이동
                  if (req.query.path) {
                    res.redirect(req.query.path)
                  } else {
                    res.redirect('/');
                  }
                });
              }

            } else {
              res.send(`<script type="text/javascript">alert("로그인 정보가 일치하지 않습니다.");history.back();</script>`);
            }
          })
        } else {
          res.send(`<script type="text/javascript">alert("로그인 정보가 일치하지 않습니다."); location.href="/auth/login";</script>`);
        }
      });
  } else {
    res.send("<script>alert('아이디와 비밀번호를 입력하세요'); window.location.replace('/auth/login');</script>")
  }
})

// 아이디 찾기
router.get('/find_id', function (req, res) {
  var header = template.header(authCheck.statusUI(req, res), authCheck.statusUI_mp(req, res));
  var css = '<link href="/css/auth.css" rel="stylesheet">';
  var body = template.findID();
  var html = template.HTML(css, header, body);
  res.send(html);
})

router.post('/findID_process', function (req, res) {
  var name = req.body.name;
  var email = req.body.email;

  if (name && email) {  // 회원 정보 확인
    db.query('SELECT userID FROM user WHERE name=? AND email=?', [name, email], function (err, result) {
      if (err) throw err;

      console.log(result);
      if (result.length == 0) {
        res.send("<script>alert('일치하는 회원 정보가 없습니다. 다시 입력해주세요.');history.back();</script>")
      } else {

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
          to: email,
          subject: '회원님의 아이디 정보입니다.',
          html:
            `<div style="text-align:center;">
          <p>회원님의 아이디는 <b>${result[0].userID}</b>입니다.</p>
          <p>다시 로그인을 원하시는 경우 <a href="http://localhost:3000/auth/login">로그인하기</a>로 이동해주세요.</p>
          <p>비밀번호 찾기를 원하시는 경우 <a href="http://localhost:3000/auth/find_password">비밀번호 찾기</a>로 이동해주세요.</p>
          </div>`
        };

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error(error);
          } else {
            console.log('Email Sent : ', info);
          }
        })

        res.send('<script>alert("회원님의 메일로 아이디 정보를 담은 메일을 발송했습니다.메일을 확인해주세요.");history.back();</script>');
      }
    })
  } else {
    res.send("<script>alert('정보를 모두 입력해주세요.');history.back();</script>")
  }
})

router.get('/find_password', function (req, res) {
  var css = '<link href="/css/auth.css" rel="stylesheet">';
  var header = template.header(authCheck.statusUI(req, res), authCheck.statusUI_mp(req, res));
  var body = template.findPassword();
  var html = template.HTML(css, header, body);
  res.send(html);
})

router.post('/findPwd_process', function (req, res) {
  var id = req.body.id;
  var name = req.body.name;
  var email = req.body.email;

  //const token = crypto.randomBytes(20).toString('hex'); // 토큰 생성
  const randomPw = Math.random().toString(36).slice(2); // 임시 비밀번호
  // 토큰 db 삽입
  // db.query(`UPDATE user SET token=? WHERE userID=?`, [token, id], function(err, result){
  //   if(err) throw err;
  //   console.log('success');
  // })

  crypto.randomBytes(64, (err, buf) => {
    const salt = buf.toString('base64');
    crypto.pbkdf2(randomPw, salt, 100000, 64, 'sha512', (err, key) => {
      const hashedPassword = key.toString('base64');
      console.log(hashedPassword);

      db.query(`UPDATE user SET password=?, pw_reset=?, salt=? WHERE userID=?`, [hashedPassword, true, salt, id], function (err, result) {
        if (err) throw err;
        console.log('success');
      })
    })
  })

  // 회원 정보 확인
  db.query('SELECT * FROM user WHERE userID=? AND name=? AND email=?', [id, name, email], function (err, result) {
    if (err) throw err;

    if (result.length == 0) {
      res.send("<script>alert('일치하는 회원 정보가 없습니다. 다시 입력해주세요.');history.back();</script>")
    } else {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        secure: true,
        auth: {
          user: user,
          pass: pass
        }
      });

      const mailOptions = {
        from: user,
        to: email,
        subject: '회원님의 임시 비밀번호입니다.',
        html:
          `<div>
        <p>회원님의 임시 비밀번호는 <b>${randomPw}</b>입니다.</p>
        <p style="color:red;">로그인 후 반드시 비밀번호를 변경해주세요.</p>
        </div>`
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error(error);
        } else {
          console.log('success');
          console.log('Email Sent : ', info);
        }
      })

      res.send('<script>alert("회원님의 메일로 임시 비밀번호를 담은 메일을 발송했습니다. 메일을 확인해주세요.");history.back();</script>');
    }
  })
})

router.get('/reset_password', function (req, res) {
  var css = '<link href="/css/auth.css" rel="stylesheet">';
  var header = template.header(authCheck.statusUI(req, res), authCheck.statusUI_mp(req, res));
  var body = template.resetPassword(req.session.userID);
  console.log(req.session.userID);
  var html = template.HTML(css, header, body);
  res.send(html);
})

router.post('/resetPwd_process', function (req, res) {
  var newPw = req.body.new;
  var check = req.body.check;
  var id = req.body.id;
  console.log(req.body);
  var reg = new RegExp("^(?=.*[A-Za-z])(?=.*[0-9])(?=.{8,})");

  if (!reg.test(newPw)) { // 비밀번호 정규식 만족 여부 확인
    res.send("<script>alert('새 비밀번호는 영문과 숫자를 포함하여 8자 이상으로 설정해야 합니다.');history.back();</script>");
  }
  else if (newPw != check) { // 새 비밀번호 확인
    res.send("<script>alert('새 비밀번호와 일치하지 않습니다. 다시 입력해주세요.');history.back();</script>");
  }
  else {  // 암호화 후 비밀번호 갱신
    crypto.randomBytes(64, (err, buf) => {
      const salt = buf.toString('base64');
      crypto.pbkdf2(newPw, salt, 100000, 64, 'sha512', (err, key) => {
        const hashedPassword = key.toString('base64');
        console.log(hashedPassword);

        db.query(`UPDATE user SET password=?, pw_reset=?, salt=? WHERE userID=?`, [hashedPassword, false, salt, id], function (err, result) {
          if (err) throw err;
          console.log('success');
          // 세션 삭제 - 로그아웃
          req.session.destroy(function (err) {
            if(err) throw err;
          })
          res.send("<script>alert('비밀번호 재설정이 완료되었습니다! 다시 로그인해주세요.');location.href='/auth/login';</script>");
        })
      })
    })
  }
})

// 로그아웃
router.get('/logout', function (req, res) {
  // 세션 삭제
  req.session.destroy(function (err) {
    res.redirect(`/`);
  })
});

// 회원가입 화면
router.get('/signup', function (req, res) {
  var header = template.header(authCheck.statusUI(req, res), authCheck.statusUI_mp(req, res));
  var body = template.creatAccount('<script src="/js/creatAccount.js"></script>');
  var css = '<link rel = "stylesheet" href="/css/auth/creatAccount.css">';

  var color_mode = req.cookies.color;
  if(color_mode == 1){
    css = '<link rel = "stylesheet" href="/css/auth/createAccount_color.css">';
  }
  var html = template.HTML(css, header, body);
  res.send(html);
});

router.all('/creatAccount/checkID', function (req, res) {
  var post = req.body;
  console.log(post.data);
  db.query('SELECT * FROM user WHERE userID = ? ', [post.data], function (error, results, fields) {
    console.log(results.length);
    if (results.length == 0) {
      res.send(true);
      return;
    }
    res.send(false);
  })
});

router.all('/creatAccount/checkEmail', function (req, res) {
  var post = req.body;
  console.log(post.data);
  db.query('SELECT * FROM user WHERE email = ? ', [post.data], function (error, results, fields) {
    console.log(results.length);
    if (results.length == 0) {
      res.send(true);
      return;
    }
    res.send(false);
  })
});

// 회원가입 프로세스
router.post('/creatAccount/check', function (request, response) {
  var userID = request.body.id;
  var name = request.body.name;
  var email = request.body.email;
  var password = request.body.password;
  var password2 = request.body.password2;
  var handiType = request.body.handiType;

  if (handiType == undefined) {
    handiType = 0;
  }

  if (userID && password && password2) {
    crypto.randomBytes(64, (err, buf) => {
      const salt = buf.toString('base64');
      crypto.pbkdf2(password, salt, 100000, 64, 'sha512', (err, key) => {
        const hashedPassword = key.toString('base64');
        console.log(hashedPassword);

        db.query('INSERT INTO user (userID, password, salt, name, barrier_type, email) VALUES(?,?,?,?,?,?)', [userID, hashedPassword, salt, name, handiType, email], function (error2, data) {
          if (error2) throw error2;
          response.send(`<script type="text/javascript">alert("회원가입이 완료되었습니다!");
                  document.location.href="/place";</script>`);
        });
      })
    })

      // // 비밀번호 정규식 만족 여부 확인
      // if (!reg.test(password)) {
      //   res.send("<script>alert('새 비밀번호는 영문과 숫자를 포함하여 8자 이상으로 설정해야 합니다.');history.back();</script>");
      // }
      // else {  // 정규식 만족
      //   if (password == password2) {     // 비밀번호가 올바르게 입력된 경우 
      //     crypto.randomBytes(64, (err, buf) => {
      //       const salt = buf.toString('base64');
      //       crypto.pbkdf2(password, salt, 100000, 64, 'sha512', (err, key) => {
      //         const hashedPassword = key.toString('base64');
      //         console.log(hashedPassword);

      //         db.query('INSERT INTO user (userID, password, salt, name, barrier_type, email) VALUES(?,?,?,?,?)', [userID, hashedPassword, salt, name, handiType, email], function (error2, data) {
      //           if (error2) throw error2;
      //           response.send(`<script type="text/javascript">alert("회원가입이 완료되었습니다!");
      //                   document.location.href="/place";</script>`);
      //         });
      //       })
      //     })
      //   } else if (password != password2) {                     // 비밀번호가 올바르게 입력되지 않은 경우
      //     response.send(`<script type="text/javascript">alert("입력된 비밀번호가 서로 다릅니다."); 
      //           document.location.href="/auth/signup";</script>`);
      //   }
      // }



      // db.query('SELECT * FROM user WHERE userID = ?', [userID], function (error, results, fields) { // DB에 같은 이름의 회원아이디가 있는지 확인
      //   if (error) throw error;
      //   if (results.length <= 0 && password == password2) {     // DB에 같은 이름의 회원아이디가 없고, 비밀번호가 올바르게 입력된 경우 

      //     crypto.randomBytes(64, (err, buf) => {
      //       const salt = buf.toString('base64');
      //       crypto.pbkdf2(password, salt, 100000, 64, 'sha512', (err, key) => {
      //         const hashedPassword = key.toString('base64');
      //         console.log(hashedPassword);

      //         db.query('INSERT INTO user (userID, password, salt, name, barrier_type, email) VALUES(?,?,?,?,?)', [userID, hashedPassword, salt, name, handiType, email], function (error2, data) {
      //           if (error2) throw error2;
      //           response.send(`<script type="text/javascript">alert("회원가입이 완료되었습니다!");
      //                     document.location.href="/place";</script>`);
      //         });
      //       })
      //     })

      //   } else if (password != password2) {                     // 비밀번호가 올바르게 입력되지 않은 경우
      //     response.send(`<script type="text/javascript">alert("입력된 비밀번호가 서로 다릅니다."); 
      //             document.location.href="/auth/signup";</script>`);
      //   }
      //   else {                                                  // DB에 같은 이름의 회원아이디가 있는 경우
      //     response.send(`<script type="text/javascript">alert("이미 존재하는 아이디 입니다."); 
      //             document.location.href="/auth/signup";</script>`);
      //   }
      // });

    } else {        // 입력되지 않은 정보가 있는 경우
      response.send('<script type="text/javascript">alert("입력되지 않은 정보가 있습니다.");history.back();</script>');
    }
})

module.exports = router;  