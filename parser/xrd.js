var xml2js=require('xml2js');
exports.parse = function(url, docRel, headers, content, cb) {
  new xml2js.Parser().parseString(content, function(err, data2) {
    var obj= {
      documents: {},
      textFields: {},
      images: {},
      follows: {},
      tools: {}
    };
    //if(data2.Subject) {
    //  obj.documents[data2.Subject]=true;
    //}
    if(data2.Alias) {
      if(typeof(data2.Alias)=='string') {
        data2.Alias = [data2.Alias];
      }
      for(var i in data2.Alias) {
        if(data2.Alias[i].substring(0, 'http://'.length)=='http://' || data2.Alias[i].substring(0, 'https://'.length)=='https://') {
          if(data2.Alias[i].split('/').length != 4) {//both diaspora and friendica nodes advertise the host root as an alias of each user! :(
            obj.documents[data2.Alias[i]]=true;
          }
        }
      }
    }
    if(data2.Property) {
      if(typeof(data2.Property)=='string') {
        data2.Property = [data2.Property];
      }
    }
    //if(data2.XRD) {
    //  data2=data2.XRD;
    //}
    if(!data2.Link) {
      console.log('no .Link:');
      console.log(data2);
    }
    if(data2.Link['@']) {
      data2.Link = [data2.Link];
    }
    for(var i=0; i<data2.Link.length; i++) {
      if(data2.Link[i]['@'] && data2.Link[i]['@'].rel == 'http://webfinger.net/rel/avatar') {
        obj.images.avatar = data2.Link[i]['@'].href;
      } else if(data2.Link[i]['@'] && data2.Link[i]['@'].rel == 'describedby' && data2.Link[i]['@'].type == 'application/rdf+xml') {
        obj.documents[data2.Link[i]['@'].href] = 'describedby';
      } else if(data2.Link[i]['@'] && data2.Link[i]['@'].rel == 'http://portablecontacts.net/spec/1.0') {
        if(data2.Link[i]['@'].href != 'http://www-opensocial.googleusercontent.com/api/people/') {//bug in that specific node
          obj.documents[data2.Link[i]['@'].href] = 'poco';
        }
      } else if(data2.Link[i]['@'] && data2.Link[i]['@'].rel == 'http://microformats.org/profile/hcard') {
        obj.documents[data2.Link[i]['@'].href] = 'hcard';
      } else if(data2.Link[i]['@'] && data2.Link[i]['@'].rel == 'http://portablecontacts.net/spec/1.0#me') {
        obj.documents[data2.Link[i]['@'].href] = 'poco-me';
      } else if(data2.Link[i]['@'] && data2.Link[i]['@'].rel == 'lrdd') {
        var templateParts = data2.Link[i]['@'].template.split('{uri}');
        if(url.indexOf('/.well-known/host-meta?resource=acct:')) {
          obj.documents[templateParts[0]+url.substring(url.indexOf('/.well-known/host-meta?resource=acct:')+'/.well-known/host-meta?resource='.length)+templateParts[1]] = 'lrdd';
        }
      } else if(data2.Link[i]['@'] && data2.Link[i]['@'].rel == 'http://webfinger.net/rel/profile-page') {
        obj.tools[data2.Link[i]['@'].href] = 'R';
      } else if(data2.Link[i]['@'] && data2.Link[i]['@'].rel == 'http://schemas.google.com/g/2010#updates-from') {
        obj.tools[data2.Link[i]['@'].href] = 'S';
      }
    }
    cb(null, obj);
  });
};
