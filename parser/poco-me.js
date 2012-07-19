exports.parse = function(parsed, identifiers, cb) {
  var obj= {
    textFields: {},
    pictures: {},
    seeAlso: {},
    follows: {},
    tools: {},
    data: parsed
  };
  obj.textFields.fullName = parsed.entry.name.formatted;
  obj.images.avatar = parsed.entry.thumbnailUrl;
  cb(null, obj);
};
