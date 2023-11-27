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

const sidoCode = JSON.parse(fs.readFileSync('./data/areacode/sidoCode.json', 'utf-8'));
const gyeonggi = JSON.parse(fs.readFileSync('./data/areacode/json/gyeonggi.json', 'utf-8'));
const gangwon = JSON.parse(fs.readFileSync('./data/areacode/json/gangwon.json', 'utf-8'));
const chungbuk = JSON.parse(fs.readFileSync('./data/areacode/json/chungbuk.json', 'utf-8'));
const chungnam = JSON.parse(fs.readFileSync('./data/areacode/json/chungnam.json', 'utf-8'));
const gyeongbuk = JSON.parse(fs.readFileSync('./data/areacode/json/gyeongbuk.json', 'utf-8'));
const gyeongnam = JSON.parse(fs.readFileSync('./data/areacode/json/gyeongnam.json', 'utf-8'));
const jeonbuk = JSON.parse(fs.readFileSync('./data/areacode/json/jeonbuk.json', 'utf-8'));
const jeonnam = JSON.parse(fs.readFileSync('./data/areacode/json/jeonnam.json', 'utf-8'));

router.get('/', function (req, res) {

 var text_mode = req.cookies.text;
var color_mode = req.cookies.color;
var css = `<link href="/css/place/placeMain.css" rel="stylesheet">
`;

    if (text_mode == 1) {
        css = ` <link href="/css/place/text_place1.css" rel="stylesheet">`;
    } else if(color_mode == 1){
        css = `<link href="/css/place/contrast_place1.css" rel="stylesheet"> `;
    } 


var body = template_place.placeMainBody();

var header = template.header(authCheck.statusUI(req, res), authCheck.statusUI_mp(req, res));
var html = template.HTML(css,header, body);
res.send(html);
       
});


//const fetch = require('node-fetch').default;
router.get('/test', function (req, res) {
  var css = ``;
  var body = template_place.test('<script src="/place/read_spot/read_spot2번.js"></script>');
  
  var header = template.header(authCheck.statusUI(req, res), authCheck.statusUI_mp(req, res));
  var html = template.HTML(css,header, body);
  res.send(html);
         
  });

  router.get('/content/:sido/:sigun/:contentType/:contentID', function (req, res) {
    var text_mode = req.cookies.text;
var color_mode = req.cookies.color;
    var css = `<link href="/css/place/place.css" rel="stylesheet">
    
    <link href="/css/place/read_place.css" rel="stylesheet">
    `;
  
    if (text_mode == 1) {
        css = ` <link href="/css/place/text_place3.css" rel="stylesheet">`;
    } else if(color_mode == 1){
        css = `<link href="/css/place/place.css" rel="stylesheet">
        <link href="/css/place/contrast_place3.css" rel="stylesheet">
        <link href="/css/place/read_place.css" rel="stylesheet">`;
    } 

    contentId=req.params.contentID 
    sido=req.params.sido 
    sigun=req.params.sigun 
    contentType=req.params.contentType 
    res.cookie('sido',req.params.sido)
    res.cookie('sigun',req.params.sigun)
    res.cookie('contentType',req.params.contentType)
    res.cookie('contentID',contentId)
    //const url =`/place/content/${sido}/${sigun}/${contentType}/${contentID}`
    //var js = template_place.place_readJS('',post.type);
    
    var body = template_place.content_inform(`<script src='/js/content_comment.js'></script><script src='/js/place/content_inform.js'></script>`,contentId,authCheck.isOwner(req, res),`${sido}/${sigun}/${contentType}/${contentId
    }`);
    var header = template.header(authCheck.statusUI(req, res), authCheck.statusUI_mp(req, res));
    var html = template.HTML(css,header, body);
       res.send(html);
  
           
    });


router.all('/inform/:contentType', function (req, res) {
  var text_mode = req.cookies.text;
  var color_mode = req.cookies.color;
  var css = `<link href="/css/place/detailPlace.css" rel="stylesheet">`;


    if (text_mode == 1) {
        css = `<link href="/css/place/text_place2.css" rel="stylesheet">`;
    } else if(color_mode == 1){
        css = `<link href="/css/place/detailPlace.css" rel="stylesheet">
        <link href="/css/place/contrast_place2.css" rel="stylesheet">`;
    } 
  res.cookie('contentType',req.params.contentType)
  //var js = template_place.place_readJS('',post.type);
  var js = "<script src='/js/place/read_spot.js'></script>"
  var body = template_place.place_inform(js);
  var header = template.header(authCheck.statusUI(req, res), authCheck.statusUI_mp(req, res));
  var html = template.HTML(css,header, body);
     res.send(html);
     
    
    
      
  });
  router.all('/creatTypeCookies',function(req,res){
    console.log(req.body);
     var post = req.body;
     var type = post.type;
     var sido = post.sido;
     res.cookie('sido',post.sido)
     
     var sigun = parseInt(post.sigun);
     if(isNaN(sigun)){
       res.cookie('sigun','0')
     }else{
       res.cookie('sigun',post.sigun)}
     console.log(post);
 
   
     
     
     for (const temp of sidoCode) {
       if(temp.code == sido){
         console.log(temp.code);
         var area = temp.name + "-";
       }
     }
     
     if(!isNaN(sigun) ){
       if(sido == 31){
        
         for(i=0; i<gyeonggi.length; i++){
           if(gyeonggi[i].code==sigun){
             sigun = gyeonggi[i].name
           }
         }
         
     }
     else if(sido == 32){
        
        for(i=0; i<gangwon.length; i++){
         if(gangwon[i].code==sigun){
           sigun = gangwon[i].name
         }
       }
   
     }
     else if(sido == 33){
       
        for(i=0; i<chungbuk.length; i++){
         if(chungbuk[i].code==sigun){
           sigun = chungbuk[i].name
         }
       }
         
     }
     else if(sido == 34){
 
       console.log( chungnam.length)
       for(i=0; i<chungnam.length; i++){
         if(chungnam[i].code==sigun){
           sigun = chungnam[i].name
         }
       }       
     }
     else if(sido == 35){
       
       for(i=0; i<gyeongbuk.length; i++){
         if(gyeongbuk[i].code==sigun){
           sigun = gyeongbuk[i].name
         }
       }
     }
     else if(sido == 36){
       
       for(i=0; i<gyeongnam.length; i++){
         if(gyeongnam[i].code==sigun){
           sigun = gyeongnam[i].name
         }
       }
     }
     else if(sido == 37){
       
       for(i=0; i<jeonbuk.length; i++){
         if(jeonbuk[i].code==sigun){
           sigun = jeonbuk[i].name
         }
       }
     }
     else if(sido == 38){
       
       for(i=0; i<jeonnam.length; i++){
         if(jeonnam[i].code==sigun){
           sigun = jeonnam[i].name
         }
       }
     }
       area+=sigun;
       
     }else{
       area += '0';
       
     }
     res.cookie('area',area)
     res.cookie('type',type)
     //res.send("gg");
     res.redirect(`/place/inform/14`)
   })

  router.get('/typeCheck',function(req,res){//사용자가 로그인 했는지 반환
    const {type} = req.cookies
    const {area}= req.cookies
    
    if(type == null || area == null){
      res.send(false);
      return;
    }
    else{
      var array =[];
        array.push({'type':type, 'area':area});
        res.send(array);
        return;
    }
    

  })

  /*
  router.all('/inform/:contentID', function (req, res) {
    const {type} = req.cookies
    console.log(type)
    content = req.params.contentID
    res.cookie('contentID',`${content}`)
    var css = `<link href="/place/spot-1.css" rel="stylesheet"><link href="/place/read_place.css" rel="stylesheet">`;
 
    console.log(type);
  if(content =='all'){
    console.log(content);
     var js = template_place.place_readJS('',type);}
  else{
   var js = template_place.place_readJS(content,type);
  }
  var body = template_place.place_inform(js);
  var header = template.header(authCheck.statusUI(req, res));
  var html = template.HTML(css,header, body);
     res.send(html);     
        
    });
    */

    router.get("/maptest",function(req,res){
      var css =''
      var body = template_place.test();
      var header = template.header(authCheck.statusUI(req, res), authCheck.statusUI_mp(req, res));
      var html = template.HTML(css,header, body);
     res.send(html);
    })

    router.post("/save",function(req,res){
   // if(authCheck.isOwner(req, res)){
      var post = req.body;
      var y = post.y;
      var x = post.x;
      var addr = post.addr;
      var title = post.title;
      var isSave = post.isSave;
      var planID = post.planID;

     console.log(planID);
     if(isSave=="delete"){
      if(planID=='false'){
        console.log("없덩 삭제");
        db.query('DELETE FROM bookmark WHERE latitude=? AND longitude=? AND userID=? AND planID IS NULL', [`${y}`,`${x}`,`${req.session.userID}`], function(error, result){
          if(error){
            throw error;
             }
         })
        res.send("save");
        return 0;
      }

      db.query('select * FROM bookmark WHERE latitude=? AND longitude=? AND planID=? AND userID=?', [`${y}`,`${x}`,`${planID}`, `${req.session.userID}`], function(error, topics){
        if(error){
          throw error;
           }
          
      if(topics.length==0){
        console.log("없덩");
      }
    else{
      db.query('DELETE FROM bookmark WHERE latitude=? AND longitude=? AND planID=? AND userID=?', [`${y}`,`${x}`,`${planID}`,`${req.session.userID}`], function(error, result){
        if(error){
          throw error;
           }
       })
      console.log("있덩 삭제함");
    }
  })
        
      }
      else if(isSave="save"){

        if(planID=='false'){
          console.log("없덩 저장함");
          db.query('INSERT INTO bookmark(title, latitude, longitude, userID, addr) VALUES (?,?,?,?,?)', [title, y, x ,req.session.userID,addr]);
          console.log("planID");
          res.send("save");
          return 0;
        }
        db.query('select * FROM bookmark WHERE latitude=? AND longitude=? AND planID=? AND userID=? AND addr=?', [`${y}`,`${x}`,`${planID}`,`${req.session.userID}`,`${addr}`], function(error, topics){
          if(error){
            throw error;
             }
            
        if(topics.length==0){
          console.log("없덩 저장함");
         db.query('INSERT INTO bookmark(title, latitude, longitude, userID, planID,addr) VALUES (?,?,?,?,?,?)', [title, y, x ,req.session.userID,planID,addr]);
         console.log("planID");
        }
      else{
        console.log("이미 있덩");
      }
    })
  }
   
       res.send("save");
    
    })

    var title='';


    router.get('/authCheck',function(req,res){//사용자가 로그인 했는지 반환
      if(authCheck.isOwner(req, res)){
        res.send("True");
      }
      else res.send("False")

    })
    
    router.all('/getContent',function(req,res){
      const {contentID} = req.cookies
        const {type} = req.cookies
        var array =[];
        array.push({'contentID':contentID, 'type':type});
       
        res.send(array);
    })
    router.all('/checkBookmark',function(req,res){ //해당장소가 북마크에 저장되어 있는지 확인
      var post = req.body;
      var resultTopic =[];
     
    if(post.x!=undefined){
      x = post.x;  
      y=post.y;
      res.cookie('x',`${post.x}`)
      res.cookie('y',`${post.y}`)
      
      res.send("false");
      }else{
        const {x} = req.cookies
        const {y} = req.cookies
        
       // console.log(request.session.nickname);
        console.log(x);
        db.query(`SELECT * FROM bookmark` , function(error2, topic){
          if(error2){       
            throw error2;
          } 
          console.log(topic.length)
          //console.log(topic);
          //bookmark.latitude=? AND bookmark.longitude=?
        db.query(`SELECT * FROM bookmark WHERE userID=? AND latitude=? AND longitude=?`,[`${req.session.userID}`,`${y}`,`${x}`], function(error,topics){
          if(error){
            throw error;
          }
          resultTopic = topics;
          console.log('topics');
          console.log(resultTopic);
        
          console.log(resultTopic);
            if(topics[0]){
             console.log("있다")
             res.send("flase");
             }
            else{
              res.send("true");
           }
        });
      });
      
      
      
    }
      

      
    })
    
    router.all('/post',function(req,res){ //해당장소가 북마크에 저장되어 있는지 확인
      var post = req.body;
      var resultTopic =[];
     
    if(post.content_ID!=undefined){
     
      res.cookie('content_ID',`${post.content_ID}`)
      
      
      res.send("post");
      return 0;
      }else{
        const {content_ID} = req.cookies
        
      
        db.query(`SELECT title, userID FROM post WHERE contentID=? AND category=1 `,[`${content_ID}`], function(error,topics){
          if(error){
            throw error;
          }
         console.log(topics);
         res.send(topics);
         return 0;
        });
   
    }  
    })
    
    router.all('/checkfolder/:content',async function(req,res){//사용자가 어쩌고
      var array = [];
      const {x} = req.cookies
      const {y} = req.cookies 
      const content = req.params.content
      
      if(content=="check"){
        db.query(`SELECT * FROM bookmark WHERE userID=? AND latitude=? AND longitude=? AND planID IS NULL`,[`${req.session.userID}`,`${y}`,`${x}`],async function(error,topic){
          console.log(topic);
          if(topic.length>0){res.send("true")}
        else{ 
          res.send("false"); 
        }
        })
        }
   

      })

    
    router.get('/planCheck/:isSave',async function(req,res){//사용자가 어쩌고
      var array = [];
      var array1=[];
      const {x} = req.cookies
       const {y} = req.cookies
      isSave = req.params.isSave
      console.log(x);
      // x_f = x.toFixed(3)
      // y_f = y.toFixed(3)
      // console.log('y_f');
      // console.log(y_f);
      async function readbookmark(topic,i){
        
        db.query(`SELECT * FROM bookmark WHERE planID=? AND latitude=? AND longitude=?  `,[topic[i].planID,`${y}`,`${x}`] ,function(error,topics){
          console.log('topics');
          console.log(topics.length);
          if(topics.length==0){
           array1.push({'title':topic[i].title, 'planID':topic[i].planID, 'isCheck':false})
          }else{
            console.log(topics);
            array1.push({'title':topic[i].title, 'planID':topic[i].planID, 'isCheck':true})
          }
          console.log(array1);
          if(i==topic.length-1){
            res.send(array1);
            return 0;
          }else{return array1;}
          
         // if(i==topic.length-1){
           // res.send(array);
         // }
        })
      }
     if(isSave =="save"){
       db.query(`SELECT * FROM tour_plan WHERE userID=?`,[`${req.session.userID}`],async function(error,topic){
        if(topic.length==0){
          res.send(false);
          //return 0;
        }
        else{
        for(var i=0; i<topic.length;i++){
          console.log(i);
         array=await readbookmark(topic,i);
         console.log('array1');
       console.log(array);    
        }
      }
        
       })
       
        
     
    }
    else if(isSave=="delete"){

      const {x} = req.cookies
       const {y} = req.cookies
       db.query(`SELECT * FROM bookmark WHERE latitude=? AND longitude=?`,[`${y}`,`${x}`], function(error,topics){
        for(var i=0; i<topics.length; i++){
          console.log(topics[i].planID);
        if(topics[i].planID!=null){
          console.log(topics[i].planID);
           db.query(`SELECT * FROM tour_plan WHERE startDate>'2023-04-05' AND planID=?`,[`${topics[i].planID}`], function(error,topic){
            console.log(topic.length);
            for(var j=0; j<topic.length; j++){
            array.push({'title':topic[0].title, 'planID':topic[0].planID})
            }
            console.log(array);
          // res.send(array);
           })
           }
          }
          res.send(array);
          
       })
       
    }

    })

    router.all('/readContentReview/:num', async function (req, res) {
      const contentID = parseInt(req.params.num);
      console.log('req.query');
      console.log(req.query.barrier_category);
      const type =req.query.barrier_category;
      
      console.log(type)
      
      if(type=='body' || type=='baby' || type=='ear'|| type=='eye'){
        var name=''
        var value=1;
        if(type=='eye'){
          name='barrier_category=?'
          value=1
        }else if(type=='ear'){
          name='barrier_category=?'
          value=2
        }else if(type=='body'){
          name='barrier_category=?'
          value=3
        }else if(type=='baby'){
          name='barrier_category=?'
          value=4
        }
        
        
        db.query(`SELECT p.* FROM 
        post p JOIN ( 
            SELECT postID
            FROM content_review
            WHERE contentID = ?
            
         ) cr ON p.postID = cr.postID where barrier_category=?  ORDER BY recommend DESC LIMIT 7 ;`,[contentID,value], function(error, topic) {
          console.log(value)
            res.send(topic);

        })
     
      }
      else{
       
        db.query(`SELECT p.* FROM 
        post p JOIN ( 
            SELECT postID
            FROM content_review
            WHERE contentID = ?
        
         ) cr ON p.postID = cr.postID  ORDER BY recommend DESC LIMIT 7 ; `,[contentID], function(error, topic) {
            res.send(topic);

        })
      }
     
 })

 router.get('/update/:sido/:sigun/:contentType/:contentId', function (req, res) {

  if(authCheck.isOwner(req,res)){
    res.cookie('sido',req.params.sido)
    res.cookie('sigun',req.params.sigun)
    res.cookie('contentType',req.params.contentType)
    res.cookie('contentID',req.params.contentId)
    var css = `<link href="/css/place/update_inform.css" rel="stylesheet">
    `;
    var text_mode = req.cookies.text;
    var color_mode = req.cookies.color;
  
    
        if (text_mode == 1) {
            css = ` `;
        } else if(color_mode == 1){
            css = `<link href="/css/place/update_inform.css" rel="stylesheet"><link href="/css/place/contrast_place4.css" rel="stylesheet"> `;
        } 
    
    
  var body = template_place.update_infom(`<script src="/js/place/update_inform.js"></script>`);
  
  var header = template.header(authCheck.statusUI(req, res), authCheck.statusUI_mp(req, res));
  var html = template.HTML(css,header, body);
  res.send(html);
  }
  else{
    // res.redirect('/auth/login')
    res.send(`<script>alert("로그인이 필요한 서비스입니다.");location.href="http://localhost:3000/auth/login?path=${req.originalUrl}";</script>`)

  }
   
  });

  const multer = require('multer'); 
  app.use(express.static(path.join(__dirname, 'static')));

// try {
//     fs.readdirSync('static/update_inform_img'); // 폴더 확인
// } catch (err) {
//     console.error('uploads 폴더가 없습니다. 폴더를 생성합니다.');
//     fs.mkdirSync('static/update_inform_img'); // 폴더 생성
// }
  
  const upload = multer({
    storage: multer.diskStorage({
        destination(req, file, done) {
            done(null, 'static/update_inform_img');
        },
        filename(req, file, done) {
            const ext = path.extname(file.originalname);
            const safeFilename = Date.now() + ext;
            done(null, safeFilename + Date.now() + ext);
        }
    }),
    limits: { fileSize: 5 * 1024 * 1024 }
});


  router.post('/update/inform', upload.array('image',2), function (req, res) {
    const {sido} = req.cookies
    const {sigun} = req.cookies
    const {contentType} = req.cookies
    const {contentID} = req.cookies
    var post = req.body;
    description = post.description.replace(/(?:\r\n|\r|\n)/g,'<br/>');
    console.log(post)
   console.log(req.files); // 업로드 결과도 req.file 대신 req.files 배열에 들어간다
    if(req.files.length != 0){
      db.query('INSERT INTO update_info(userID, sido, sigun, contentType, contentId,description, title, image) VALUES (?,?,?,?,?,?,?,?)', [req.session.userID, sido, sigun, contentType, contentID,description,post.title,req.files[0].filename]);
      
    }else{
      db.query('INSERT INTO update_info(userID, sido, sigun, contentType, contentId,description, title) VALUES (?,?,?,?,?,?,?)', [req.session.userID, sido, sigun, contentType, contentID,description,post.title]);
    
    }
    res.redirect(`/place/content/${sido}/${sigun}/${contentType}/${contentID}`)

  });

  router.all('/popular10', function(req, res) {
    var currentDate = new Date();
    var oneMonthAgo = new Date();
    var oneMonthAfter = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    oneMonthAfter.setMonth(oneMonthAfter.getMonth() + 1);
    // Format oneMonthAgo as "YYYY-MM-DD"
    var deletedDate = oneMonthAgo.toISOString().split('T')[0];
    var selectDate = oneMonthAfter.toISOString().split('T')[0];
    db.query('DELETE FROM popular_place WHERE date < ? ', [deletedDate], function (error, results) {
      if (error) {
        throw error;
      }
    })
    db.query('SELECT place_name, sido_code, sigun_code, COUNT(*) as count FROM popular_place WHERE date <= ? GROUP BY place_name, sido_code, sigun_code ORDER BY count DESC', [selectDate], function (error, results) {
      if (error) {
        throw error;
      }
      console.log(selectDate)
      res.send(results);
      return;
    })
   
  });


  const textToSpeech = require('@google-cloud/text-to-speech');
  const util = require('util');
require('dotenv').config();
//var bodyParser = require('body-parser')
//app.use(bodyParser().json())
app.use(express.json());
const keyFilePath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
const client = new textToSpeech.TextToSpeechClient({ keyFilename: keyFilePath });

app.use(express.json());
const outputFile ='output.mp3'
async function generateVoice(text, res) {
  const request = {
    input: { text },
    voice: {  
      languageCode: 'ko-KR',
      name: 'ko-KR-Neural2-c',
      ssmlGender: 'MALE',
    },
    audioConfig: { audioEncoding: 'MP3' },
  };

  try {
    const [response] = await client.synthesizeSpeech(request);
    const writeFile = util.promisify(fs.writeFile);
    await writeFile(outputFile, response.audioContent, 'binary');
    
    // 오디오 파일을 클라이언트로 전송
    const file = fs.createReadStream(outputFile);
    file.pipe(res); // 이미 한 번 응답을 보내므로, 추가 응답을 시도하지 않음
  } catch (error) {
    console.error('Google Text-to-Speech API 오류:', error);
    res.status(500).send('음성 생성 중 오류 발생');
  }
}

// 기존 라우터를 함수로 변경
router.all('/voice', async function(req, res) {
  temp = Object.keys(req.body);
  //const text = '기당미술관은 제주도가 고향인 재일교포사업가 기당(奇堂) 강구범 선생에 의해 건립되어 서귀포시에 기증되었으며 1987년 7월 1일 개관하였다. 기당미술관은 전국에서 최초로 건립되어 개관한 시립미술관이며, 2017년 개관 30주년을 맞이하였다.기당미술관의 건축은 농촌의 [눌(단으로 묶은 곡식을 차곡차곡 쌓아놓은 더미를 가르키는 제주도 방언)]을 형상화하여 나선형의 동선으로 이루어진 전시실이 특징이며, 한국의 전통 가옥을 연상시키는 서까래 천정과 적절한 자연광이 들어올 수 있게 설계되 어 쾌적한 전시공간을 연출하고 있다.기당미술관은 개관 이후 우수한 현대미술작품을 소장하기 위하여 많은 노력을 기울여 왔으며, 현재 제주지역 작가뿐만 아니라 국내외 작가들의 회화, 조각, 공예, 판화, 서예 등 전 부문에 걸쳐 660여점을 소장하고 있다.김기창, 장우성, 서세옥, 송수남, 민경갑, 이왈종, 박노수, 장리석, 박서보, 김원, 이대원, 전광영, 강요배 등 국내 화단과 미술사에서 중요한 작가들의 작품을 소장하고 있으며, 연중 3 ~ 4차례의 기획전 및 소장품전을 통해 관람객들에게 소개하고 있다.특히, 상설 전시실에는 미국 스미소니언뮤지엄에 전시되기도 했었던 [폭풍의 화가]로 잘 알려진 변시지 화백의 작품이 연중 전시되고 있다.';
  text = temp[0]
  //text ='※ 7~9월 20:00까지 연장'
  console.log(text);

  // generateVoice 함수를 호출하여 음성 생성
  await generateVoice(text, res);
});

module.exports = router;