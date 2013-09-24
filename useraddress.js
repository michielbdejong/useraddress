var https = require('https'),
  fs = require('fs'),
  sockjs = require('sockjs'),
  search = require('./search'),
  config = require('./config');

var sockServer = sockjs.createServer();
sockServer.on('connection', function(conn) {
  var searchSession = search.getSession();
  searchSession.on('row', function(row) {
    row.type='row';
    console.log(row);
    conn.write(JSON.stringify(row));
  });
  searchSession.on('status', function(status) {
    console.log(status);
    conn.write(JSON.stringify({
      type: 'status',
      status: status
    }));
  });
  conn.on('data', function(message) {
    console.log(message.toString());
    searchSession.search(message.toString());
  });
  conn.on('close', function() {
    searchSession.close();
  });
});

var server = https.createServer(config.https, function (req, res) {
  console.log(req.url);
  if(req.url == '/sockjs-0.3.min.js') {
    fileName = 'sockjs-0.3.min.js';
  } else if(req.url.substring(0,5)=='/demo') {
    fileName = 'demo.html';
  } else {
    fileName = 'index.html';
  }
  console.log(fileName);
  fs.readFile(fileName, function(err, data) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(data);
  });
}).listen(12380);
sockServer.installHandlers(server, {prefix:'/q'});
console.log('Server running');
