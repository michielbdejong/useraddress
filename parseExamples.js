var fs=require('fs');
var xml2js=require('xml2js');
var harvest = {};

function doFile(fileName, identifiers) {
  if(fileName == 'http://identi.ca/michielbdejong/foaf') {
    fileName = 'id-foaf';
  }
  fs.readFile('exampleFiles/'+fileName, function(err, data) {
    console.log('parsing '+fileName);
    new xml2js.Parser().parseString(data, function(err, data2) {
      var obj = {
        url: 'exampleFiles/'+fileName,
        data: data2,
        identifiers: identifiers,// can be acct:user@host, user@host, http(s)://host/path(#fragment), xmpp:user@host, mailto:user@host
        seeAlso: [],// can be http(s)://host/path(#fragment), xmpp:user@host
        follows: [],// can be acct:user@host, user@host, http(s)://host/path(#fragment), xmpp:user@host, mailto:user@host
        textFields: {},
        images: {}
      };
      if(data2['@'] && data2['@'].xmlns && data2['@'].xmlns == 'http://docs.oasis-open.org/ns/xri/xrd-1.0') {
        console.log('xrd doc!');
        if(data2.Subject) {
          obj.identifiers[data2.Subject]=true;
        }
        if(data2.Alias) {
          for(var i in data2.Alias) {
            obj.identifiers[data2.Alias[i]]=true;
          }
        }
        for(var i=0; i<data2.Link.length; i++) {
          if(data2.Link[i]['@'] && data2.Link[i]['@'].rel == 'describedby' && data2.Link[i]['@'].type == 'application/rdf+xml') {
            obj.seeAlso.push(data2.Link[i]['@'].href);
          }
        }
      } else if(data2['@'] && data2['@'].xmlns && data2['@'].xmlns == 'http://xmlns.com/foaf/0.1/') {
        console.log('foaf doc!');
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

      }
      
      console.log(JSON.stringify(data2));
      harvest[fileName] = obj;
      console.log(obj);
      for(var i=0; i<obj.seeAlso.length; i++) {
        doFile(obj.seeAlso[i], obj.identifiers);
      }
    });
  });
}

doFile('id-xrd', {'acct:michielbdejong@identi.ca': true});
doFile('gm-xrd', {'acct:michielbdejong@identi.ca': true});
