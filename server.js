var indexDoc = '<!DOCTYPE html>\n'
  +'<html lang="en">\n'
  +'<head>\n'
  +'  <script src="http://cdn.sockjs.org/sockjs-0.3.min.js">\n'
  +'  </script>\n'
  +'  <script>\n'
  +'    var rows={};\n'
  +'    var sock = new SockJS(\'http://useraddress.net/echo\');\n'
  +'    sock.onopen = function() {\n'
  +'      console.log(\'open\');\n'
  +'    };\n'
  +'    sock.onmessage = function(e) {\n'
  +'      console.log(\'message\', e.data);\n'
  +'      var e = JSON.parse(e.data);\n'
  +'      if(e.type == \'row\') {\n'
  +'        addRow(e);\n'
  +'        show();\n'
  +'      } else if(e.type == \'status\') {\n'
  +'        showStatus(e.status);\n'
  +'      }\n'
  +'    };\n'
  +'    sock.onclose = function() {\n'
  +'      console.log(\'close\');\n'
  +'    };\n'
  +'    function key() {\n'
  +'      sock.send(document.getElementById(\'in\').value);\n'
  +'      show();\n'
  +'    }\n'
  +'    function addRow(data) {\n'
  +'      rows[data.userAddress] = data;\n'
  +'    }\n'
  +'    function matches(row, str) {\n'
  +'      if(str.length < 3) {\n'
  +'        return;\n'
  +'      }\n'
  +'      if(str == row.userAddress) {\n'
  +'        return row.name;\n'
  +'      }\n'
  +'      var words = row.name.split(\' \');\n'
  +'      for(var i=0; i<words.length; i++) {\n'
  +'        if(words[i].toLowerCase().substring(0, str.length) == str) {\n'
  +'          return words.slice(0, i).join(\' \')+\'<strong>\'+words[i].substring(0, str.length)+\'</strong>\'+words[i].substring(str.length)+\' \'+words.slice(i+1).join(\' \');\n'
  +'        }\n'
  +'      }  \n'
  +'    }\n'
  +'    function showStatus(status) {\n'
  +'      document.getElementById(\'spinner\').style.display = (status == \'busy\' ? \'inline\' : \'none\');\n'
  +'    }\n'
  +'    function show() {\n'
  +'      var str = \'\';\n'
  +'      for(var i in rows) {\n'
  +'        var nameMatch = matches(rows[i], document.getElementById(\'in\').value);\n'
  +'        if(nameMatch) {\n'
  +'          str += \'<li><img src="\'+rows[i].avatar+\'" style="width:64px;height:64px"> \'+nameMatch+\' &lt;\'+rows[i].userAddress+\'&gt;</li>\';\n'
  +'        }\n'
  +'      }\n'
  +'      document.getElementById(\'results\').innerHTML = str;\n'
  +'    }\n'
  +'  </script>\n'
  +'  <title>useraddress.net</title>\n'
  +'  <meta charset="utf-8">\n'
  +'</head>\n'
  +'<body>\n'
  +'  <input onkeyup="key();" id="in">  \n'
  +'  <span id="spinner" style="display:none"><h2>hmmmmmm...</h2></span>\n'
  +'  <ul id="results"></ul>\n'
  +'</body>\n'
  +'</html>\n';
var http = require('http');
var sockjs = require('sockjs');
var search = require('./search');

var echo = sockjs.createServer();
echo.on('connection', function(conn) {
  search.on('row', function(row) {
    row.type='row';
    console.log(row);
    conn.write(JSON.stringify(row));
  });
  search.on('status', function(status) {
    console.log(status);
    conn.write(JSON.stringify({
      type: 'status',
      status: status
    }));
  });
  conn.on('data', function(message) {
    console.log(message.toString());
    search.search(message.toString());
  });
  conn.on('close', function() {});
});

var server = http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.end(indexDoc);
}).listen(80);
echo.installHandlers(server, {prefix:'/echo'});
console.log('Server running');
