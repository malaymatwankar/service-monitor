const express = require('express');
const app = express();
const server = require('http')
  .createServer(app);
const io = require('socket.io')(server);
const fs = require('fs');

app.set('view engine', 'ejs');

function loadControllers() {
  let controllers = fs.readdirSync(__dirname + '/src/controllers');
  controllers.forEach(controller => {
    if (controller === 'ping.js') {
      require(__dirname + '/src/controllers/' + controller)(app, io);
    } else {
      require(__dirname + '/src/controllers/' + controller)(app);
    }
  });
}

function startServer() {
  const port = 3000;
  loadControllers();
  server.listen(port, function() {
    console.log(`Service Monitor Running on port ${port}`);
  });
}

startServer();
