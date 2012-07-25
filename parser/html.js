//---
function parseSubTree(subTree, cb) {
  for(var eltType in subTree) {
    if(eltType != '@' && eltType != '#') {
      if(!subTree[eltType].length) {
        subTree[eltType]=[subTree[eltType]];
      }
      for(var j=0; j<subTree[eltType].length; j++) {
        if(typeof(subTree[eltType][j]) == 'object') {
          if(subTree[eltType][j]['@']) {
            if(subTree[eltType][j]['@'].property) {
              cb(subTree[eltType][j]['@'].property, subTree[eltType][j]['@'].content);
            }
          } else if(subTree[eltType][j].rel) {
            cb(subTree[eltType][j].rel, subTree[eltType][j].href);
          }
          parseSubTree(subTree[eltType][j], cb);
        }
      }
    }
  }
}
//---

exports.parse = function(data2, identifiers, cb) {
  var obj= {
    identifiers: identifiers,
    textFields: {},
    images: {},
    seeAlso: {},
    follows: {},
    tools: {},
    data: data2
  };
  for(var i=0; i<data2.length; i++) {
    parseSubTree(data2[i], function(property, content) {
      if(property== 'foaf:name') {
        obj.textFields.fullName = content; 
      } else if(property== 'foaf:knows') {
        obj.follows[content]=true; 
      } else if(property== 'foaf:depiction') {
        obj.images.avatar = content; 
      } else if(property== 'me' && (
          content.substring('http://'.length)=='http' ||
          content.substring('https://'.length)=='https')) {
        obj.seeAlso[content]='magic'; 
      }
    });
  }
  cb(null, obj);
};
