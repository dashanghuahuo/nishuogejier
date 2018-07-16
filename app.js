let express = require("express")
let svgCaptcha = require("svg-captcha")

let path = require("path");
let app = express();

app.use(express.static('static'));

app.get('/login',(req,res)=>{
    res.sendFile(path.join(__dirname,"static/views/login.html"));
})

app.get('/login/captchaImg.png',(req,res)=>{
    var captcha = svgCaptcha.create();
  
    
    res.type('svg');
    res.status(200).send(captcha.data);
})

app.listen(8848,'192.168.72.113',()=>{
    console.log('开始了');
    
})