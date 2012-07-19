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

  obj.textFields.fullName = parsed[0].name;
  obj.textFields.bio = parsed[0].description;
  obj.images.avatar = parsed[0].profile_image_url;
  cb(null, obj);
};
