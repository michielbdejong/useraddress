var fs=require('fs');
var xml2js=require('xml2js');
var harvest = {};

function doFile(fileName, docRel, identifiers) {
  if(fileName == 'http://identi.ca/michielbdejong/foaf') {
    fileName = 'id-foaf';
  }
  if(fileName == 'http://www.google.com/s2/webfinger/?q=acct%3Adejong.michiel%40gmail.com&fmt=foaf') {
    fileName = 'gm-foaf';
  }
  if(fileName == 'http://www-opensocial.googleusercontent.com/api/people/108912615873187638071/') {
    fileName = 'gm-poco-me';
  }
  if(fileName == 'https://revolutionari.es/poco/michiel') {
    fileName = 'fr-poco';
  }
  fs.readFile('exampleFiles/'+fileName, function(err, data) {
    console.log('parsing '+fileName);
    var parsed;
    try {
      parsed = JSON.parse(data);
    } catch(e) {
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
            if(typeof(data2.Alias)=='string') {
              data2.Alias = [data2.Alias];
            }
            for(var i in data2.Alias) {
              obj.identifiers[data2.Alias[i]]=true;
            }
          }
          for(var i=0; i<data2.Property.length; i++) {
            console.log(data2.Property[i]);
          }
          for(var i=0; i<data2.Link.length; i++) {
            console.log(data2.Link[i]);
            if(data2.Link[i]['@'] && data2.Link[i]['@'].rel == 'http://webfinger.net/rel/avatar') {
              obj.images.avatar = data2.Link[i]['@'].href;
            }
            if(data2.Link[i]['@'] && data2.Link[i]['@'].rel == 'describedby' && data2.Link[i]['@'].type == 'application/rdf+xml') {
              obj.seeAlso.push({
                url: data2.Link[i]['@'].href,
                docRel: 'describedby'
              });
            }
            if(data2.Link[i]['@'] && data2.Link[i]['@'].rel == 'http://portablecontacts.net/spec/1.0') {
              obj.seeAlso.push({
                url: data2.Link[i]['@'].href,
                docRel: 'poco'
              });
            }
            if(data2.Link[i]['@'] && data2.Link[i]['@'].rel == 'http://portablecontacts.net/spec/1.0#me') {
              obj.seeAlso.push({
                url: data2.Link[i]['@'].href,
                docRel: 'poco#me'
              });
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
        }
        
        console.log(JSON.stringify(data2));
        harvest[fileName] = obj;
        console.log(obj);
        for(var i=0; i<obj.seeAlso.length; i++) {
          doFile(obj.seeAlso[i].url, obj.seeAlso[i].docRel, obj.identifiers);
        }
      });
    }
    if(parsed) {
      console.log(parsed);
      var obj = {
        url: 'exampleFiles/'+fileName,
        data: parsed,
        identifiers: identifiers,// can be acct:user@host, user@host, http(s)://host/path(#fragment), xmpp:user@host, mailto:user@host
        seeAlso: [],// can be http(s)://host/path(#fragment), xmpp:user@host
        follows: [],// can be acct:user@host, user@host, http(s)://host/path(#fragment), xmpp:user@host, mailto:user@host
        textFields: {},
        images: {}
      };
      if(docRel == 'poco#me') {
        obj.textFields.fullName = parsed.entry.name.formatted;
        obj.images.avatar = parsed.entry.thumbnailUrl;
      } else if(docRel == 'twitter-api') {
        obj.textFields.fullName = parsed[0].name;
        obj.textFields.bio = parsed[0].description;
        obj.images.avatar = parsed[0].profile_image_url;
      } else if(docRel == 'facebook-api') {
        obj.textFields.fullName = parsed.name;
        obj.textFields.nick = parsed.username;
        obj.images.avatar = 'http://graph.facebook.com/'+parsed.username+'/picture';
      } else if(docRel == 'poco') {
        for(var i=0; i<parsed.entry.length; i++) {
          obj.follows.push(parsed.entry[i].urls[0].value);
        }
      } else {
        console.log('JSON doc!');
      }
      console.log(obj);
    }
  });
}

//doFile('id-xrd', 'lrdd', {'acct:michielbdejong@identi.ca': true});
doFile('fr-xrd', 'lrdd', {'acct:michiel@revolutionari.es': true});
//doFile('gm-xrd', 'lrdd', {'acct:dejong.michiel@gmail.com': true});
//doFile('twitter-api', 'twitter-api', {'http://twitter.com/michielbdejong': true});
//doFile('fb-api', 'facebook-api', {'http://facebook.com/dejong.michiel': true});
