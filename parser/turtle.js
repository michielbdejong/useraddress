exports.parse = function(url, docRel, headers, content, cb) {
  var lines = content.toString().split('\n');
  var prefixes = {};
  var currObjName;
  var currObj = {};
  var objs = {};
  for(var i=0; i<lines.length; i++) {
    var words = lines[i].split(' ');
    if(words[0]=='@prefix') {
      prefixes[words[1]]=words[2].substring(1, words[2].length-1);
    }
    
    if(words.length==1 && words[0].substring(0, 2)=='</') {
      if(currObjName) {
        objs[currObjName]=currObj;
        currObj={};
      }
      currObjName = words[0].substring(2, words[0].length - 1);
    }
    if(words[0][0]=='\t') {
      var propertyParts = words[0].substring(1).split(':');
      if(propertyParts.length==2 && prefixes[propertyParts[0]+':']) {
        words.shift();
        var rest = words.join(' ');
        currObj[prefixes[propertyParts[0]+':']+propertyParts[1]]=rest.substring(1, rest.length-3);
      }
    }
  }
  if(currObjName) {
    objs[currObjName]=currObj;
    currObj={};
  }
      
  var obj= {
    documents: {},
    textFields: {},
    images: {},
    follows: {},
    tools: {}
  };
  for(var i in objs) {
    if(objs[i]['http://graph.facebook.com/schema/user#name']) {
      obj.textFields.fullName = objs[i]['http://graph.facebook.com/schema/user#name'];
    }
    if(objs[i]['http://graph.facebook.com/schema/user#username']) {
      var nick = objs[i]['http://graph.facebook.com/schema/user#username'];
      obj.textFields.nick = nick;
      obj.images.avatar = 'https://graph.facebook.com/'+nick+'/picture';
      obj.tools['mailto:'+nick+'@facebook.com']='M';
      obj.tools['xmpp:'+nick+'@facebook.com']='PM';
      obj.tools['https://facebook.com/'+nick]='R';
      obj.tools['facebook:'+nick]='PMRFC';
    }
    if(objs[i]['http://graph.facebook.com/schema/user#locale']) {
      obj.textFields.locale = objs[i]['http://graph.facebook.com/schema/user#locale'];
    }
    if(objs[i]['http://graph.facebook.com/schema/user#gender']) {
      obj.textFields.gender = objs[i]['http://graph.facebook.com/schema/user#gender'];
    }
  }
  cb(null, obj);
};
