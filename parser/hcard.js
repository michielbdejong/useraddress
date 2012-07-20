function parseTree(tree, cb) {
  var fullNamer=false;
  if(tree.attribs && tree.attribs.class) {
    var classTags=tree.attribs.class.split(' ');
    for(var i=0; i<classTags.length; i++) {
      if(classTags[i]=='fn') {
        fullNamer=true;
      } else if(classTags[i]=='avatar') {
        cb('images', 'avatar', tree.attribs.src);
      }
    }
  }
  if(tree.children) {
    for(var i=0; i<tree.children.length; i++) {
      if(fullNamer && tree.children[i].type=='text') {
        cb('textFields', 'fullName', tree.children[i].raw);
      }
      parseTree(tree.children[i], cb);
    }
  }
}

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
  parseTree(data2[0], function(thing, key, value) {
    obj[thing][key]=value;
  });
  //console.log('calling back from hcard');
  cb(null, obj);
};
