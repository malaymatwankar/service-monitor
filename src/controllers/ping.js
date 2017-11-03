const async = require('async');
const request = require('request');

module.exports = function(app, io) {
  app.get('/', function(req, res) {
    const urls = ['http://localhost:1337', 'https://yahoo.com', 'http://localhost:1337', 'http://localhost:1337', 'http://localhost:1337', 'http://localhost:1337', 'http://localhost:1337', 'http://localhost:1337', 'http://localhost:1337', 'http://localhost:1337', 'http://localhost:1337', 'http://localhost:1337', 'http://localhost:1337', 'http://localhost:1337', 'http://localhost:1337', 'http://localhost:1337', 'http://localhost:1337', 'http://localhost:1337', 'http://localhost:1337', 'http://localhost:1337', 'http://localhost:1337', 'http://localhost:1337'];
    ping(urls, io);
    res.render('pages/index');
  });
};

function ping(urls, io) {
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

function makeRequest(url, callback) {
  let options = {
    url: url,
    time: true,
    timeout: 5000
  };
  request.get(options, function(err, res) {
    if (err) {
      var resp = {
        url: url,
        status: '--',
        time: '--'
      }
      if (err.code === 'ECONNREFUSED') {
        resp['description'] = `The service seems to be down please check server logs...`;
      } else if (err.code === 'ETIMEDOUT' || err.code === 'ESOCKETTIMEDOUT') {
        resp['description'] = `The service is taking too long to respond please check server logs...`;
      } else {
        console.log(`Somthing bad happenned... ${err}`);
        resp['description'] = `Something bad happened please check logs of service monitor as well as the relevan service...`
      }
      return callback(null, resp);
    } else {
      return callback(null, {
        url: url,
        status: res.statusCode,
        description: res.statusMessage,
        time: `${res.elapsedTime.toFixed(2)} ms`
      });
    }
  });
}
