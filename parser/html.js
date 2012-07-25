var htmlparser = require("htmlparser");
//---
function parseSubTree(subTree, cb) {
  var fullNamer=false;
  if(subTree.attribs && subTree.attribs.class) {
    var classTags=subTree.attribs.class.split(' ');
    for(var i=0; i<classTags.length; i++) {
      if(classTags[i]=='fn') {
        fullNamer=true;
      } else if(classTags[i]=='mpfriend') {
        cb('follows', subTree.attribs.href, true);
      } else if(classTags[i]=='avatar') {
        cb('images', 'avatar', subTree.attribs.src);
      }
    }
  }
  if(subTree.children) {
    for(var i=0; i<subTree.children.length; i++) {
      if(fullNamer && subTree.children[i].type=='text') {
        cb('textFields', 'fullName', subTree.children[i].raw);
      }
    }
  }
  for(var eltType in subTree) {
    if(!subTree[eltType].length) {
      subTree[eltType]=[subTree[eltType]];
    }
    if(eltType != '@' && eltType != '#') {
      for(var j=0; j<subTree[eltType].length; j++) {
        if(typeof(subTree[eltType][j]) == 'object') {
          if(subTree[eltType][j]['@']) {
            if(subTree[eltType][j]['@'].property) {
              cb('foaf', subTree[eltType][j]['@'].property, subTree[eltType][j]['@'].content);
            }
          } else if(subTree[eltType][j].rel) {
            cb('foaf', subTree[eltType][j].rel, subTree[eltType][j].href);
          }
          parseSubTree(subTree[eltType][j], cb);
        }
      }
    }
  }
}
//---

exports.parse = function(url, docRel, headers, content, cb) {
  var handler = new htmlparser.DefaultHandler(function (err, data2) {
    if(err) {
      cb('mime type was '+data.headers['Content-Type']+' but no valid HTML');
    } else {
      var obj= {
        textFields: {},
        images: {},
        documents: {},
        follows: {},
        tools: {}
      };
      for(var i=0; i<data2.length; i++) {
        parseSubTree(data2[i], function(category, property, content) {
          if(category=='foaf') {
            if(property== 'foaf:name') {
              obj.textFields.fullName = content; 
            } else if(property=='foaf:knows') {
              obj.follows[content]=true; 
            } else if(property== 'foaf:depiction') {
              obj.images.avatar = content; 
            } else if(property== 'me' && (
                content.substring('http://'.length)=='http' ||
                content.substring('https://'.length)=='https')) {
              obj.documents[content]='magic'; 
            }
          } else {
            obj[category][property]=content;
          }
        });
      }
      cb(null, obj);
    }
  });
  var parser = new htmlparser.Parser(handler);
  parser.parseComplete(content);
};
