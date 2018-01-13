const express = require('express');
const path = require('path');
const app = express();
// const rp = require('request-promise');
// const request = require('request')
const config = require('./config.js')
var proxy = require('http-proxy-middleware');
app.use(express.static(path.join(__dirname, 'dist')));
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});
// app.use('/api',async (req, res) => {
//   const requrl = url.api + req.originalUrl
//   let body = await rp(requrl)
//   res.send(body)
// })
app.use('/api', proxy({target:config.api, changeOrigin: true}));

// app.use('/api',(req, res) => {
//   const requrl = url.api + req.originalUrl
//   // req.pipe(request(requrl)).pipe(res);
// })
app.listen(process.env.PORT||config.PORT||3000,()=>{
  console.log('成功起动',process.env.PORT||config.PORT||3000)
});


// 这代码是因为他们需要先接收 然后再转发过去
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({extended: false, limit: '100kb'}));

// //上传文件测试
// const request = require('request');
// const lodash = require('lodash');
// app.post('/upload', (req, res) => {
  // 这是以前用来 七鱼上传图片的
//     console.log('进来了');
//     let localReq = request({
//         url: 'http://localhost:6006/app/uploadApk',
//         headers: {
//             'content-type': req.get('content-type')
//         }
//     });
//     req.pipe(localReq);
//     localReq.pipe(res);
// });

// app.post('/api/*', (req, res) => {
//     let mH = filterHeader(req.headers);
//     request({
//         url: 'http://localhost:3030' + req.originalUrl,
//         method: 'POST',
//         form: req.body,
//         headers: mH
//     }).pipe(res);
// });

// function filterHeader(headers) {
  // 这代码是为去掉 请求转发的大小
//     let myHeader = {};
//     let array = ['user-agent', 'origin', 'cookie', 'referer'];
//     for (let key in headers) {
//         if (lodash.indexOf(array, key) >= 0) {
//             myHeader[key] = headers[key];
//         }
//     }
//     return myHeader;
// }
