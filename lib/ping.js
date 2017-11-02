const io = require('socket.io')(server);

function ping(urls) {
  urls.forEach(function(url) {
    request.get(url, {
      timeout: 5000 //If url doesn't respond in 5 seconds we will show timeout or connection taking too long...
    }, function(err, res, body) {
      io.on('connection', function(socket) {
        console.log('a user connected');
        // socket.broadcast.emit('chat message', function(msg) {
        //   console.log('message: ' + msg);
        // });
        if (!err) {
          console.log(`Response status from ${url} is ${res.statusCode}`);
          socket.emit('status', 'Please check your connection...');
        } else {
          console.log(`Exception occurred while connecting to ${url} ERR:: ${err}`);
          socket.emit('status', 'Ping was successful...');
        }
        // socket.on('status', function());
      });
    });
  });
}

// io.on('connection', function(socket) {
//   console.log('a user connected');
//   // socket.broadcast.emit('chat message', function(msg) {
//   //   console.log('message: ' + msg);
//   // });
//   socket.on('status', function());
// });

module.exports = {
  run: function() {
    const urls = ['https://google.com', 'http://localhost:1337'];
    setInterval(function() {
      ping(urls);
    }, 1000);
  }
};
