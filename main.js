const express = require('express')
const session = require('express-session')
const bodyParser = require('body-parser');
const FileStore = require('session-file-store')(session)
const cookieParser = require('cookie-parser');
//const path = require('path');

const app = express();
app.use(bodyParser.urlencoded({extended: false}));
app.use(session({
  HttpOnly: true,
  secure: true,
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  store: new FileStore()
}))
app.use(cookieParser());

var planRouter = require('./route/plan');
var authRouter = require('./route/auth');
var myRouter = require('./route/mypage');
var boardRouter = require('./route/board');
var placeRouter = require('./route/place');
var managerRouter = require('./route/manager');
var contentCommentRouter = require('./route/contentComment');

// 서버가 읽을 수 있도록 html 위치 정의
// app.set('views', __dirname);      

// // 서버가 html을 렌더링할 때 ejs 엔진을 사용하도록 설정
// app.set('view engine', 'ejs');    
// app.engine('html', require('ejs').renderFile);

// 정적파일
app.use(express.static('static'));  
app.use(express.static('data'));
app.use(express.static('uploads')); 
app.use(express.static('temp'));


//app.use('/node_modules', express.static(path.join(__dirname, '/node_modules')));
app.use('/plan', planRouter);
app.use('/auth', authRouter);
app.use('/mypage', myRouter);
app.use('/board', boardRouter);
app.use('/place', placeRouter);
app.use('/manager', managerRouter);
app.use('/contentComment', contentCommentRouter);


app.get('/', function (req, res) {
  res.redirect('/place')
})

// app.get('/header', function(req, res) {
//   res.sendFile(__dirname + '/header.html');
// });

// 404에러처리
app.use(function(req, res, next){
  res.status(404).send("Sorry can't find that!");
})
// 에러처리
app.use((err, req, res, next) => {
  console.error(err.stack)
  return res.status(500).send('Something broke!')
})

app.listen(3000);