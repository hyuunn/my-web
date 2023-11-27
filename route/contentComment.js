const express = require('express');
const router = express.Router();
var db = require('../lib/db');
var template = require('../lib/template.js');
var template_place = require('../lib/placeTm.js');
var authCheck = require('../lib/authCheck.js');
var path = require('path');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var fs = require('fs');
var app = express();
app.use(cookieParser());

router.get('/', function (req, res) {
   
var css = `<link href="/place/spot.css" rel="stylesheet">`;
var body = template_place.placeMainBody();

var header = template.header(authCheck.statusUI(req, res));
var html = template.HTML(css,header, body);
res.send(html);
       
});



router.post('/commentinsert/:num', function (req, res) {
  console.log(req.body)
    if(authCheck.isOwner(req, res)){
      const num = req.params.num;
  
      var post = req.body;
     console.log(post)
      db.query('INSERT INTO content_comment(contentID, userID, description, url,title) VALUES (?,?,?,?,?)', [num, req.session.userID, post.comment,post.url, post.title], function(error, results) {
          if (error) {
            throw error;
          }
      });
      res.redirect('back');
    }else{
      res.redirect("/auth/login");
    }
    
      });
  

      function getDt_time(dt) { // yy.mm.dd hh:mm
        const temp = new Date(dt);
        const year = temp.getFullYear();
        const month = temp.getMonth() + 1;
        const date = temp.getDate();
        const hour = temp.getHours();
        const min = temp.getMinutes();
      
        return `${year - 2000}.${month >= 10 ? month : '0' + month}.${date >= 10 ? date : '0' + date}  ${hour >= 10 ? hour : '0' + hour}:${min >= 10 ? min : '0' + min}`;
      }
    router.get('/comment', function (req, res) {
    const { contentID } = req.cookies;
    var array = [];
    var user = false;
  
    db.query('select * FROM content_comment WHERE contentID=? ', [contentID], function(error, topics) {
      if (error) {
        throw error;
      }
      console.log(req.session.userID);
  
      for (let i = 0; i < topics.length; i++) {
        if (req.session.userID == topics[i].userID) {
          user = true;
          console.log(req.session.userID);
          console.log(topics[i].userID);
        }else{
          user = false;
        }
        const date =getDt_time(topics[i].date);
        array.push({
          'description': topics[i].description,
          'userID': topics[i].userID,
          'auth': user,
          'commentID': topics[i].content_commentID,
          'parents': topics[i].parents,
          'date': date
        });
      }
  
      res.send(array);
    });
  })
  
  router.all('/comment/delete/:num', function (req, res) {
    const num = parseInt(req.params.num);
    const comment = req.params.comment;
  
      db.query('DELETE FROM content_comment WHERE content_commentID=? ', [num], function(error, topics) {
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
      const { contentID } = req.cookies;
      const { contentType} = req.cookies;
      const { sido } = req.cookies;
      const { sigun } = req.cookies;
      console.log(text);
      
      db.query('UPDATE content_comment SET description=? WHERE content_commentID=?', [text, num], function(error, topics) {
        if (error) {
          throw error;
        }
        
      });
      db.query('select * FROM content_comment WHERE content_commentID=? ', [num], function(error, topics) {
        if (error) {
          throw error;
        }
        res.redirect(`/place/content/${sido}/${sigun}/${contentType}/${contentID}`);
      });
      //res.redirect('back');
      });
  
      router.post('/recomment/:num', function (req, res) {
        const num = req.params.num;
        var post = req.body;
        const text = post.comment
        const { contentID } = req.cookies;
  
       db.query('select * FROM content_comment WHERE content_commentID=? ', [num], function(error, topic) {
        if (error) {
          throw error;
        }
        
        db.query('INSERT INTO content_comment(contentID, userID, description,parents, title, url) VALUES (?,?,?,?,?,?)', [topic[0].contentID, req.session.userID, text,num, topic[0].title, topic[0].url], function(error, results) {
          if (error) {
            throw error;
          }
      });
  
      });
  
        
        res.redirect('back');
      
        });
  
module.exports = router;