exports.parse = function(data2, identifiers, cb) {
  var obj= {
    identifiers: identifiers,
    textFields: {},
    images: {},
    seeAlso: {},
    follows: {},
    tools: {},
    data: data2
  };
  if(data2.Subject) {
    obj.identifiers[data2.Subject]=true;
  }
  if(data2.Alias) {
    if(typeof(data2.Alias)=='string') {
      data2.Alias = [data2.Alias];
    }
    for(var i in data2.Alias) {
      if(data2.Alias[i] != '"https://joindiaspora.com/"') {//bug in that specific node
        obj.identifiers[data2.Alias[i]]=true;
      }
    }
  }
  if(data2.Property) {
    if(typeof(data2.Property)=='string') {
      data2.Property = [data2.Property];
    }
    for(var i=0; i<data2.Property.length; i++) {
      console.log(data2.Property[i]);
    }
  }
  for(var i=0; i<data2.Link.length; i++) {
    console.log(data2.Link[i]);
    if(data2.Link[i]['@'] && data2.Link[i]['@'].rel == 'http://webfinger.net/rel/avatar') {
      obj.images.avatar = data2.Link[i]['@'].href;
    }
    if(data2.Link[i]['@'] && data2.Link[i]['@'].rel == 'describedby' && data2.Link[i]['@'].type == 'application/rdf+xml') {
      obj.seeAlso[data2.Link[i]['@'].href] = 'describedby';
    }
    if(data2.Link[i]['@'] && data2.Link[i]['@'].rel == 'http://portablecontacts.net/spec/1.0') {
      if(data2.Link[i]['@'].href != 'http://www-opensocial.googleusercontent.com/api/people/') {//bug in that specific node
        obj.seeAlso[data2.Link[i]['@'].href] = 'poco';
      }
    }
    if(data2.Link[i]['@'] && data2.Link[i]['@'].rel == 'http://portablecontacts.net/spec/1.0#me') {
      obj.seeAlso[data2.Link[i]['@'].href] = 'poco#me';
    }
  }
  cb(null, obj);
};
