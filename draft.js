var data = {},
  index = {};

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
  return hits;
}
add('michiel@unhosted.org', 'Michiel de Jong', 'http://unhosted.org/img/michiel.jpg');
console.log(data);
console.log(index);
console.log(search('mic'));
