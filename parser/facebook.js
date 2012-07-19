exports.parse = function(parsed, identifiers, cb) {
  var obj= {
    textFields: {},
    pictures: {},
    seeAlso: {},
    follows: {},
    tools: {},
    data: parsed
  };
  obj.textFields.fullName = parsed.name;
  obj.textFields.nick = parsed.username;
  obj.images.avatar = 'http://graph.facebook.com/'+parsed.username+'/picture';
  cb(null, obj);
};
