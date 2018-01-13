const express = require('express');
const path = require('path');
const app = express();
const rp = require('request-promise');
const request = require('request')
const url = require('./config.js')
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
app.use('/api', proxy({target:url.api, changeOrigin: true}));

// app.use('/api',async (req, res) => {
//   const requrl = url.api + req.originalUrl
//   // req.pipe(request(requrl)).pipe(res);
// })
app.listen(9000);
