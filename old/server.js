(function() {
  var http = require('http'),
    handler = require('./handler').handler,
    config = require('./config').config;

  http.createServer(handler.serve).listen(80);
  console.log('listening on port 80');
})();
