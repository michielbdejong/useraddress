var http = require('http'),
  fs = require('fs'),
  sockjs = require('sockjs'),
  search = require('./search');

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

var server = http.createServer(function (req, res) {
  if(req.url == '/sockjs-0.3.min.js') {
    fileName = 'sockjs-0.3.min.js';
  } else {
    fileName = 'index.html';
  }
  console.log(fileName);
  fs.readFile(fileName, function(err, data) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(data);
  });
}).listen(80);
sockServer.installHandlers(server, {prefix:'/q'});
console.log('Server running');
