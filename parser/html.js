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
            } else if(subTree[eltType][j]['@'].rel) {
              cb(subTree[eltType][j]['@'].rel, subTree[eltType][j]['@'].href);
            }
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
    textFields: {},
    images: {},
    seeAlso: {},
    follows: {},
    tools: {},
    data: data2
  };
  
  for(var containerEltType in data2.body) {
    for(var i=0; i<data2.body[containerEltType].length; i++) {
      if(data2.body[containerEltType][i]['@'] && data2.body[containerEltType][i]['@'].about == '#me') {
        parseSubTree(data2.body[containerEltType][i], function(property, content) {
          if(property== 'foaf:name') {
            obj.textFields.fullName = content; 
          } else if(property== 'foaf:knows') {
            obj.follows[content]=true; 
          } else if(property== 'foaf:depiction') {
            obj.images.avatar = content; 
          }
        });
      }
    }
  }
  cb(null, obj);
};
