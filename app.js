let express = require("express")
let svgCaptcha = require("svg-captcha")

let path = require("path");
let app = express();

let session = require('express-session')

let bodyParser = require('body-parser')

app.use(express.static('static'));

app.set('trust proxy', 1) 
app.use(session({
  secret: 'keyboard cat',
 
}))


// 路由1
app.get('/login',(req,res)=>{
    res.sendFile(path.join(__dirname,"static/views/login.html"));
})

//路由2
app.post('login',(req,res)=>{
    let userName = req.body.userName;
    let userPass = req.body.userPass;

    let code = req.body.code;
    if(code==req.session.captcha){
        req.session.userInfo={
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
  
    
    res.type('svg');
    res.status(200).send(captcha.data);

    res.session.captcha = captcha.text.toLocaleLowerCase();
})

app.listen(8848,'192.168.72.113',()=>{
    console.log('开始了');
    
})