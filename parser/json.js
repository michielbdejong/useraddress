exports.parse = function(url, docRel, headers, parsed, documents, cb) {
  var obj= {
    documents: documents,
    textFields: {},
    images: {},
    follows: {},
    tools: {}
  };
  var isFacebook = (url.indexOf('facebook')!=-1);
  var isTwitter = (url.indexOf('twitter')!=-1);

  obj.textFields.nick = (parsed.screen_name?parsed.screen_name:parsed.username);
  obj.textFields.fullName = parsed.name;
  obj.textFields.bio = parsed.description;
  obj.textFields.locale = (parsed.locale?parsed.locale:parsed.lang);
  obj.images.avatar = (isFacebook?'https://graph.facebook.com/'+parsed.username+'/picture':parsed.profile_image_url);
  if(parsed.link) {
    obj.tools[parsed.link]='R';
  }
  if(isFacebook) {
    obj.tools['mailto:'+parsed.username+'@facebook.com']='M';
    obj.tools['xmpp:'+parsed.username+'@facebook.com']='PM';
    obj.tools['https://facebook.com/'+parsed.username]='R';
    obj.tools['facebook:'+parsed.username]='PMRFC';
  } else if(isTwitter) {
    obj.tools['https://twitter.com/'+parsed.screen_name]='R';
    obj.tools['twitter:'+parsed.screen_name]='MRF';
  }
  cb(null, obj);
};
