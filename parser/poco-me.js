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
  obj.textFields.fullName = parsed.entry.name.formatted;
  obj.images.avatar = parsed.entry.thumbnailUrl;
  cb(null, obj);
};
