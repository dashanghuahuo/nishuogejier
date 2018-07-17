let express = require("express")
let svgCaptcha = require("svg-captcha")

let path = require("path");


let session = require('express-session')

let bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';
const dbName = 'test';

let app = express();
app.use(express.static('static'));

app.use(session({
  secret: 'kkeyboard cat love west blue flower hahahaha',
 
}))

app.use(bodyParser.urlencoded({
    extended: false
}))


// 路由1
app.get('/login',(req,res)=>{
    res.sendFile(path.join(__dirname,"static/views/login.html"));
})

//路由2验证验证码对错
app.post('/login',(req,res)=>{
    let userName = req.body.userName;
    let userPass = req.body.userPass;

    let code = req.body.code;

    if(code == req.session.captcha){
        req.session.userInfo = {
            userName,
            userPass
        }
       
        res.redirect('/index');
    }else{
        res.setHeader('content-type','text/html')
        res.send('<script>alert("验证失败");window.location.href="/login"</script>');
    }
})

//路由3
app.get('/login/captchaImg.png',(req,res)=>{
    var captcha = svgCaptcha.create();
  
    
    req.session.captcha = captcha.text.toLocaleLowerCase();
    
    res.type('svg');
    res.status(200).send(captcha.data);

})

//路由4判断登录
app.get('/index',(req,res)=>{
    if(req.session.userInfo){
        res.sendFile(path.join(__dirname,'static/views/index.html'))
    }else{
        res.setHeader('content-type','text/html')
        res.send('<script>alert("请登录");window.location.href="/login"</script>');
    }
})
//路由5删除session
app.get('/logout',(req,res)=>{
    delete req.session.userInfo;
    res.redirect('/login')
})

//路由6
app.get('/register',(req,res)=>{
    res.sendFile(path.join(__dirname,'static/views/register.html'));
})

//路由7注册
app.post('/register',(req,res)=>{

    let userName = req.body.userName
    let userPass = req.body.userPass
    MongoClient.connect(url,(err, client)=> {
        const db = client.db(dbName);
        let collection = db.collection('arxseven');
        collection.find({
            userName,
        }).toArray((err,doc)=>{
            if(doc.length==0){
                collection.insertOne({
                    userName,
                    userPass
                },(err,resullt)=>{
                    res.setHeader('content-type','text/html')
                    res.send("<script>alert('欢迎入坑');window.location='/login'</script>")
                    client.close();
                })
            }
        })     
        
      });
  
       
})

app.listen(8848,'192.168.72.113',()=>{
    console.log('开始了');
    
})