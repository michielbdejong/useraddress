var data = {},
  index = {},
  masterParser = require('./masterParser'),
  fs = require('fs'),
  pending = 0;

function add(userAddress, obj) {
  console.log(obj);
  data[userAddress] = {
    userAddress: userAddress,
    textFields: obj.textFields || [],
    images: obj.images || [],
    type: 'row'
  }
  var words = [];
  if(data[userAddress].textFields.fullName) {
    word = data[userAddress].textFields.fullName.split(' ');
  }
  if(data[userAddress].textFields.nick) {
    words.push(data[userAddress].textFields.nick);
  }
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
  var prefix;
  if(str.substring(0, 'http://'.length)=='http://') {
    prefix = 'http://'.length;
  }
  if(str.substring(0, 'https://'.length)=='https://') {
    prefix = 'https://'.length;
  }
  if(prefix) {
    var domainParts = str.substring(prefix).split('/')[0].split('.');
    if(domainParts.length > 1 && domainParts[1].length >= 2) {
      console.log('doc for '+str);
      var identifiers = {};
      identifiers[str]=true;
      cb(null, {
        url: str,
        docRel: 'html',
        identifiers: identifiers
      });
    }
  }
  var parts = str.split('@');
  if(parts.length==2 && parts[1].split('.').length>=1) {
    var identifiers = {};
    identifiers[str]=true;
    identifiers['acct:'+str]=true;
    cb(null, {
      url: 'https://'+parts[1]+'/.well-known/host-meta?resource=acct:'+str,
      docRel: 'lrdd',
      identifiers: identifiers
    });
  }
}
function search(str) {
  if(index[str]) {
    for(var i in index[str]) {
      if(data[i]) {
        var obj = data[i];
        obj.from = 'index';
        obj.query = str;
        console.log('result from index');
        rowCb(obj);
      }
    }
  }
  findDocFor(str, function(err, data) {
    pending++;
    console.log('pending++: '+pending+' '+data);
    statusCb(pending>0?'busy':'idle');
    masterParser.parse(data.url, data.docRel, data.identifiers, function(err, obj) {
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
