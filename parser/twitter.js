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
  obj.textFields.nick = parsed.screen_name;
  obj.textFields.fullName = parsed.name;
  obj.textFields.bio = parsed.description;
  obj.images.avatar = parsed.profile_image_url;
  cb(null, obj);
};
