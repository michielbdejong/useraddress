(function() {
  var http = require('http'),
    handler = require('./handler').handler,
    config = require('./config').config;

  http.createServer(handler.serve).listen(config.port);
  console.log('listening on '+config.port);
})();
