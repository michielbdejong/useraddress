var http = require('http');
var sockjs = require('sockjs');
var search = require('./search');

var echo = sockjs.createServer();
echo.on('connection', function(conn) {
  search.on('row', function(row) {
    console.log(row);
    conn.write(JSON.stringify(row));
  });
  conn.on('data', function(message) {
    console.log(message.toString());
    search.search(message.toString());
  });
  conn.on('close', function() {});
});

var server = http.createServer();
echo.installHandlers(server, {prefix:'/echo'});
server.listen(9999, '0.0.0.0');
