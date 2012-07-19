exports.parse = function(parsed, identifiers, cb) {
  var obj= {
    identifiers: identifiers,
    textFields: {},
    images: {},
    seeAlso: {},
    follows: {},
    tools: {},
    data: parsed
  };
  for(var i=0; i<parsed.entry.length; i++) {
    obj.follows.push(parsed.entry[i].urls[0].value);
  }
  cb(null, obj);
};
