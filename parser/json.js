exports.parse = function(url, docRel, headers, content, cb) {
  var parsed;
  try {
    parsed = JSON.parse(content);
  } catch(e) {//JSON failed, try xml
    cb('mime type was '+data.headers['Content-Type']+' but no valid JSON');
    return;
  }
  if(parsed) {
    var obj= {
      documents: {},
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
  } else {
    cb('empty JSON');
  }
};
