var data = {},
  index = {},
  webfinger = require('./webfinger'),
  fs = require('fs');

function add(userAddress, fullName, avatarUrl) {
  data[userAddress] = {
    n: fullName,
    a: avatarUrl
  }
  var words = fullName.split(' ');
  for(var i in words) {
    for(var j=3; j<words[i].length; j++) {
      var prefix = words[i].substring(0, j);
      if(!index[prefix]) {
        index[prefix.toLowerCase()]={};
      }
      index[prefix.toLowerCase()][userAddress]=true;
    }
  }
}
function search(str) {
  var hits = [];
  for(var i in index[str]) {
    if(data[i]) {
      hits.push(data[i]);
    }
  }
  webfinger.get(str, function(fullName, avatarUrl) {
    add(str, fullName, avatarUrl);
    console.log('add:');
    console.log(str);
    console.log(fullName);
    console.log(avatarUrl);
  });
  return hits;
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
//  console.log(search('mic'));
//console.log(search('michiel@unhosted.org'));
console.log(search('michielbdejong@identi.ca'));
//console.log(search('mic'));
//dumpDb();
