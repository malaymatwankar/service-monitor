const express = require('express');
const app = express();
const server = require('http')
  .createServer(app);
const bodyParser = require('body-parser')
const io = require('socket.io')(server);
const fs = require('fs');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
  extended: false
}));

// parse application/json
app.use(bodyParser.json())
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
  const port = 3002;
  loadControllers();
  server.listen(port, function() {
    console.log(`Service Monitor Running on port ${port}`);
  });
}

startServer();
