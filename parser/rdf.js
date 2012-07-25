var xml2js=require('xml2js');
exports.parse = function(url, docRel, headers, content, cb) {
  new xml2js.Parser().parseString(content, function(err, data2) {
    var obj= {
      textFields: {},
      images: {},
      documents: {},
      follows: {},
      tools: {},
      data: {}
    };
    if(data2.PersonalProfileDocument) {
      for(var i=0; i<data2.PersonalProfileDocument.length; i++) {
        if(data2.PersonalProfileDocument[i]
            && data2.PersonalProfileDocument[i].primaryTopic
            && data2.PersonalProfileDocument[i].primaryTopic['@']
            && data2.PersonalProfileDocument[i].primaryTopic['@']['rdf:resource']) {
          obj.follows[data2.PersonalProfileDocument[i].primaryTopic['@']['rdf:resource']]=true;
        }
      }
    }
    if(data2.Person) {
      if(data2.Person['@'] && data2.Person['@']['rdf:nodeID'] && data2.Person['@']['rdf:nodeID']=='me') {
        obj.textFields.fullName = data2.Person.name;
        obj.textFields.nick = data2.Person.nick;
      }
    }
    if(data2.Agent) {
      for(var i=0; i<data2.Agent.length; i++) {
        var thisObj = {
          textFields: {},
          images: {},
          documents: {},
          follows: {},
          tools: {},
          data: {}
        };
        thisObj.textFields.fullName = data2.Agent[i].name;
        thisObj.textFields.bio = data2.Agent[i]['bio:olb'];
        if(data2.Agent[i].account && data2.Agent[i].account.OnlineAccount && data2.Agent[i].account.OnlineAccount.accountName) {
          thisObj.textFields.nick = data2.Agent[i].account.OnlineAccount.accountName;
        }
        if(data2.Agent[i].img && data2.Agent[i].img.Image && data2.Agent[i].img.Image['@'] && data2.Agent[i].img.Image['@']['rdf:about']) {
          thisObj.images.avatar = data2.Agent[i].img.Image['@']['rdf:about'];
        }
        obj.data[data2.Agent[i]['@']['rdf:about']] = thisObj;
      }
    }
    if(data2['con:Male'] && data2['con:Male']['owl:sameAs']) {
      for(var i=0; i<data2['con:Male']['owl:sameAs'].length; i++) {
        if(data2['con:Male']['owl:sameAs'][i]['@'] && data2['con:Male']['owl:sameAs'][i]['@']['rdf:resource']) {
          obj.documents[data2['con:Male']['owl:sameAs'][i]['@']['rdf:resource']]='magic';
        }
      }
    }
    cb(null, obj);
  });
};
