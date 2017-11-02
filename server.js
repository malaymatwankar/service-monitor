const request = require('request');
const express = require('express');
const app = express();
const server = require('http')
  .createServer(app);
const io = require('socket.io')(server);


let timeInterval = 0;

function makeRequest(url, callback) {
  request.get(url, {
    timeout: 5000
  }, function(err, res) {
    if (err) {
      var resp = {
        url: url,
        status: '--',
      }
      if (err.code === 'ECONNREFUSED') {
        resp['description'] = 'The service seems to be down please check server logs...';
      } else if (err.code === 'ETIMEDOUT' || err.code === 'ESOCKETTIMEDOUT') {
        resp['description'] = 'The service is taking too long to respond please check server logs...';
      } else {
        console.log(`Somthing bad happenned... ${err}`);
        resp['description'] = 'Something bad happened please check logs of service monitor as well as the relevan service...'
      }
      return callback(null, resp);
    } else {
      return callback(null, {
        url: url,
        status: res.statusCode,
        description: res.statusMessage
      });
    }
  });
}

function ping(urls) {
  var async = require('async');
  io.on('connection', function(socket) {
    console.log('Page loading successful...');
    setInterval(function asyncRequest() {
      async.map(urls, makeRequest, function(err, res) {
        if (err) {
          // Write socket programming code here...
          console.log("ERR:: ", err);
          socket.emit('status', err);
        } else {
          // Write socket programming code here...
          console.log(res);
          socket.emit('status', res);
        };
      });
      return asyncRequest;
    }(), 10000);
  });
}

// function run() {
//   const urls = ['http://localhost:1337', 'https://yahoo.com'];
//   ping(urls);
// }

app.set('view engine', 'ejs');
app.get('/', function(req, res) {
  const urls = ['http://localhost:1337', 'https://yahoo.com'];
  ping(urls);
  res.render('pages/index');
});


const port = 3002;
server.listen(port, function() {
  console.log(`Service Monitor Running on port ${port}`);
})
