const express = require('express');
const router = express.Router();
var db = require('../lib/db');
var template = require('../lib/template.js');
var template_board = require('../lib/template_board.js');
var authCheck = require('../lib/authCheck.js');
var path = require('path');

var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');


router.get('/', function (req, res) {

    var css = `<link href="/board/main.css" rel="stylesheet">`;
    var body = template_board.boardMainBody();
    
    var header = template.header(authCheck.statusUI(req, res));
    var html = template.HTML(css,header, body);
    res.send(html);
  
    });

router.get('/write', function (req, res) {
   if(authCheck.isOwner(req, res)){
       var css = `
       <link href="https://stackpath.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css" rel="stylesheet">
       <script src="https://code.jquery.com/jquery-3.5.1.min.js"></script>
       <script src="https://stackpath.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js"></script>
       <link href="https://cdn.jsdelivr.net/npm/summernote@0.8.18/dist/summernote.min.css" rel="stylesheet">
       <script src="https://cdn.jsdelivr.net/npm/summernote@0.8.18/dist/summernote.min.js"></script>
       
       `;
        var body = template_board.boardWriteBody(false);
        
        var header = template.header(authCheck.statusUI(req, res));
        var html = template.HTML(css,header, body);
        res.send(html);
    }
     else { res.redirect('/auth/login')}
});

        //글 submit 했을 때 저장하는 부분 
        router.post('/write/post/:post', function (req, res) { //post/:post
            const value = req.params.post;
            var post = req.body;
            console.log(post);
            console.log(post.title.name);
            
            if(value=='false'){//새로 작성한 글인 경우 
                //req.session.userID;
                db.query('INSERT INTO post(title, description, category, barrier, userID) VALUES (?,?,?,?,?)', [post.title, post.editordata, post.postType ,post.handicap,req.session.userID]);
                console.log("planID");
            
                db.query('select max(postID) as num FROM post WHERE userID=? ', [req.session.userID], function(error, topics){
                    if(error){
                      throw error;
                       }
                       //res.send(post.editordata)
                       res.redirect(`/board/post/${topics[0].num}`);
                    })
                } else {//수정하는 글인 경우 
              db.query('UPDATE post SET title=?, description=?, barrier=?, category=? WHERE postID=?', [post.title, post.editordata, post.handicap, post.postType, value], function(error, topics) {
                if (error) {
                  throw error;
                }
                
                res.redirect(`/board/post/${value}`);
              });
            }
          });
          
//글 출력하는 부분
router.get('/post/:num', function (req, res) {//:num
    
    const num = req.params.num;
    res.cookie('postNum',`${num}`)
    db.query('select * FROM post WHERE postID=? ', [num], function(error, topics){
        if(error){
          throw error;
           }
           //res.send(post.editordata)
           if(authCheck.isOwner(req, res)){//수정버튼 보일지 말지 결정하는 부분
           if( req.session.userID==topics[0].userID){
            var display=" ";
           }else{
            var display="none";
           }
          }
          else var display="none";

           var css = `<link href="/board/main.css" rel="stylesheet">`;
           console.log('topics');
           console.log(topics);
           var body = template_board.boardPostBody(topics[0].title,topics[0].date,topics[0].description,topics[0].userID,topics[0].postID,display);
           
           var header = template.header(authCheck.statusUI(req, res));
           var html = template.HTML(css,header, body);
           res.send(html);
        })
       
   
});

//글 수정하는 부분 
router.get('/write/:num', function (req, res) {
    const num = req.params.num;
    db.query('select * FROM post WHERE postID=? ', [num], function(error, topics){
        if(error){
          throw error;
           }
           //res.send(post.editordata)
           var css = `
       <link href="https://stackpath.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css" rel="stylesheet">
       <script src="https://code.jquery.com/jquery-3.5.1.min.js"></script>
       <script src="https://stackpath.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js"></script>
       <link href="https://cdn.jsdelivr.net/npm/summernote@0.8.18/dist/summernote.min.css" rel="stylesheet">
       <script src="https://cdn.jsdelivr.net/npm/summernote@0.8.18/dist/summernote.min.js"></script>
       
       `;
        var body = template_board.boardWriteBody(num,topics[0].title,topics[0].description,topics[0].barrier,topics[0].category);
        var header = template.header(authCheck.statusUI(req, res));
        var html = template.HTML(css,header, body);
    
        res.send(html);
    })
})

/*

router.post('/commentinsert/:num', function (req, res) {
    const num = parseInt(req.params.num);
    var post = req.body;
   console.log(num)
    db.query('INSERT INTO comment(postID, userID, description) VALUES (?,?,?)', [num, req.session.userID, post.comment], function(error, results) {
        if (error) {
          throw error;
        }
    });
    res.redirect('back');
  
    });

  router.get('/comment', function (req, res) {
  const { postNum } = req.cookies;
  var array = [];
  var user = false;

  db.query('select * FROM comment WHERE postID=? ', [postNum], function(error, topics) {
    if (error) {
      throw error;
    }
    console.log(topics);

    for (let i = 0; i < topics.length; i++) {
      if (req.session.userID == topics[i].userID) {
        user = true;
      }
      array.push({
        'description': topics[i].description,
        'userID': topics[i].userID,
        'auth': user,
        'commentID': topics[i].commentID,
        'parents': topics[i].parents
      });
    }

    res.send(array);
  });
})

router.all('/comment/delete/:num', function (req, res) {
  const num = parseInt(req.params.num);
  const comment = req.params.comment;

    db.query('DELETE FROM comment WHERE commentID=? ', [num], function(error, topics) {
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
    
    db.query('UPDATE comment SET description=? WHERE commentID=?', [text, num], function(error, topics) {
      if (error) {
        throw error;
      }
      
    });
    db.query('select * FROM comment WHERE commentID=? ', [num], function(error, topics) {
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

     db.query('select * FROM comment WHERE commentID=? ', [num], function(error, topic) {
      if (error) {
        throw error;
      }
      
      db.query('INSERT INTO comment(postID, userID, description,parents) VALUES (?,?,?,?)', [topic[0].postID, req.session.userID, text,num], function(error, results) {
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
        db.query('select * FROM post WHERE postID=?  ', [num], function(error, topic) {
          if (error) {
            throw error;
          }
          
        db.query('select * FROM recommend WHERE postID=? and userID=? ', [num, req.session.userID], function(error, topics) {
          if (error) {
            throw error;
          }
          if(topics.length>0){
            array.push({
              'recommend': topic[0].recommend,
              'isRecommend': true 
            });
          }
          else{
            array.push({
              'recommend': topic[0].recommend,
              'isRecommend': false
            });
          }

          res.send(array);
         })
        })
      })

*/
module.exports = router;