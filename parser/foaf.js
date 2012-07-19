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
  if(data2.PersonalProfileDocument) {
    for(var i=0; i<data2.PersonalProfileDocument.length; i++) {
      console.log(data2.PersonalProfileDocument[i]);
      if(data2.PersonalProfileDocument[i]
          && data2.PersonalProfileDocument[i].primaryTopic
          && data2.PersonalProfileDocument[i].primaryTopic['@']
          && data2.PersonalProfileDocument[i].primaryTopic['@']['rdf:resource']) {
        obj.follows.push(data2.PersonalProfileDocument[i].primaryTopic['@']['rdf:resource']);
      }
    }
  }
  if(data2.Person) {
    if(data2.Person['@'] && data2.Person['@']['rdf:nodeID'] && data2.Person['@']['rdf:nodeID']=='me') {
      obj.textFields.fullName = data2.Person.name;
      obj.textFields.nick = data2.Person.nick;
      console.log('found me');
    }
  }
  if(data2.Agent) {
    for(var i=0; i<data2.Agent.length; i++) {
      if(data2.Agent[i]['@'] && data2.Agent[i]['@']['rdf:about'] && obj.identifiers[data2.Agent[i]['@']['rdf:about']]) {
        obj.textFields.fullName = data2.Agent[i].name;
        obj.textFields.bio = data2.Agent[i]['bio:olb'];
        obj.images.avatar = data2.Agent[i].img.Image['@']['rdf:about'];
        console.log('found me');
      }
    }
  }
  cb(null, obj);
};
