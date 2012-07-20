var data = {},
  index = {},
  masterParser = require('./masterParser'),
  fs = require('fs'),
  pending = 0;

function add(userAddress, obj) {
  console.log(obj);
  data[userAddress] = {
    userAddress: userAddress,
    name: obj.textFields.fullName || '',
    avatar: obj.images.avatar || '',
    type: 'row'
  }
  var words = data[userAddress].name.split(' ');
  for(var i in words) {
    for(var j=3; j<=words[i].length; j++) {
      var prefix = words[i].substring(0, j);
      if(!index[prefix.toLowerCase()]) {
        index[prefix.toLowerCase()]={};
      }
      index[prefix.toLowerCase()][userAddress]=true;
    }
  }
  dumpDb();
}
function findDocFor(str, cb) {
  if(str.substring(0, 'http://'.length)=='http://' || str.substring(0, 'https://'.length)=='https://') {
    console.log('doc for '+str);
    cb(null, str);
  }
}
function search(str) {
  for(var i in index[str]) {
    if(data[i]) {
      var obj = data[i];
      obj.from = 'index';
      obj.query = str;
      console.log('result from index');
      rowCb(obj);
    }
  }
  findDocFor(str, function(err, data) {
    pending++;
    console.log('pending++: '+pending);
    statusCb(pending>0?'busy':'idle');
    masterParser.parse(data, '', {}, function(err, obj) {
      pending--;
      console.log('pending--: '+pending);
      statusCb(pending>0?'busy':'idle');
      if(obj) {
        obj.userAddress = str;
        add(str, obj);
        obj.from='live';
        obj.query=str;
        console.log('result from live');
        rowCb(obj);
      }
    });
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
var statusCb = function(status) {
  console.log(status);
};
exports.on = function(eventType, cb) {
  if(eventType == 'row') {
    rowCb = cb;
  } else if(eventType == 'status') {
    statusCb = cb;
  }
};
exports.search = search;
