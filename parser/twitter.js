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
  for(var i in identifiers) {
    if(i.substring(0, 'https://twitter.com/#!/'.length)=='https://twitter.com/#!/') {
      obj.textFields.nick = '@'+i.substring('https://twitter.com/#!/'.length);
    } else if(i.substring(0, 'http://twitter.com/#!/'.length)=='http://twitter.com/#!/') {
      obj.textFields.nick = '@'+i.substring('http://twitter.com/#!/'.length);
    } else if(i.substring(0, 'https://twitter.com/'.length)=='https://twitter.com/') {
      obj.textFields.nick = '@'+i.substring('https://twitter.com/'.length);
    } else if(i.substring(0, 'http://twitter.com/'.length)=='http://twitter.com/') {
      obj.textFields.nick = '@'+i.substring('http://twitter.com/'.length);
    }
  }
  obj.images.avatar = parsed[0].profile_image_url;
  cb(null, obj);
};
