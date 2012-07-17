var data = {},
  index = {},
  webfinger = require('./webfinger'),
  fs = require('fs');

function add(userAddress, obj) {
  data[userAddress] = {
    userAddress: userAddress,
    name: obj.name,
    avatar: obj.avatar
  }
  var words = obj.name.split(' ');
  for(var i in words) {
    for(var j=3; j<=words[i].length; j++) {
      var prefix = words[i].substring(0, j);
      if(!index[prefix]) {
        index[prefix.toLowerCase()]={};
      }
      index[prefix.toLowerCase()][userAddress]=true;
    }
  }
  dumpDb();
}
function search(str) {
  for(var i in index[str]) {
    if(data[i]) {
      var obj = data[i];
      obj.from = 'index';
      obj.query = str;
      rowCb(obj);
    }
  }
  webfinger.get(str, function(obj) {
    obj.userAddress = str;
    add(str, obj);
    obj.from='live';
    obj.query=str;
    rowCb(obj);
  });
}
function dumpDb() {
  fs.writeFile("./dump.json", JSON.stringify({data: data, index: index}), function(err) {
      if(err) {
          console.log(err);
      } else {
          console.log("The file was saved!");
      }
  });
}
function readDb() {
  fs.readFile("./dump.json", function(err, str) {
      if(err) {
          console.log(err);
      } else {
        try {
          var parsed = JSON.parse(str);
          data = parsed.data;
          index = parsed.index;
          console.log("The file was loaded!");
        } catch(e) {
        }
      }
  });
}
readDb();
var rowCb = function(row) {
  console.log(row);
};
exports.on = function(eventType, cb) {
  if(eventType == 'row') {
    rowCb = cb;
  }
};
exports.search = search;
