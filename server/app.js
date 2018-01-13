const express = require('express');
const path = require('path');
const app = express();
const rp = require('request-promise');
const request = require('request')
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
console.log(config)
app.use('/api', proxy({target:config.api, changeOrigin: true}));

// app.use('/api',(req, res) => {
//   const requrl = url.api + req.originalUrl
//   // req.pipe(request(requrl)).pipe(res);
// })
app.listen(process.env.PORT||config.PORT||3000,()=>{
  console.log('成功起动',process.env.PORT||config.PORT||3000)
});
