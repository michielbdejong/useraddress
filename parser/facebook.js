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
  obj.textFields.fullName = parsed.name;
  obj.textFields.nick = parsed.username;
  obj.images.avatar = 'http://graph.facebook.com/'+parsed.username+'/picture';
  console.log(parsed);
  console.log(obj);
  cb(null, obj);
};
