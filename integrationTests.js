var masterParser = require('./masterParser');

function doFile(url, expect) {
  masterParser.parse(url, 'input', function(err, data) {
    console.log(err);
    console.log(data);
    console.log(expect);
    if(err) {
      console.log('********** FAIL '+url+': '+err);
    } else {
      for(var i in expect) {
        if(!data[i]) {
          console.log(data);
          console.log('********** FAIL '+url+': missing data.'+i);
        } else { 
          for(var j in expect[i]) {
            if(data[i][j] != expect[i][j]) {
              console.log(data);
              console.log('********** FAIL '+url+': expected '+expect[i][j]+' instead of '+data[i][j]+' for data.'+i+'.'+j);
            } else {
              console.log('PASS '+url+' '+i+' '+j);
            }
          }
        }
      }
      for(var i in data) {
        if(!expect[i]) {
          console.log('********** EXTRA '+url+': extra category.'+i);
        } else { 
          for(var j in data[i]) {
            if(expect[i][j] != data[i][j]) {
              console.log('********** EXTRA '+url+': expected '+expect[i][j]+' instead of '+data[i][j]+' for data.'+i+'.'+j);
            }
          }
        }
      }
    }
  });
}
masterParser.setEnv('live');
doFile('michielbdejong@identi.ca', {
  textFields: 
   { fullName: 'Michiel de Jong',
     bio: 'Lived in Bali last winter and was \'the guy that did unhosted\'. Now live in Berlin and proud to be just one of many \'people who do unhosted\'.',
     nick: 'michielbdejong',
     type: 'user' },
  images: { avatar: 'http://avatar.identi.ca/425878-480-20110427110559.jpeg' },
  documents: {
    'http://identi.ca/michielbdejong/foaf': 'describedby',
    'http://identi.ca/user/425878': true,
    'http://identi.ca/main/xrd?uri=acct:michielbdejong@identi.ca': 'lrdd' },
  follows: 
   { 'http://identi.ca/user/425878': true,
     'http://identi.ca/user/136': true,
     'http://identi.ca/user/126137': true,
     'http://identi.ca/user/432896': true,
     'http://identi.ca/user/44188': true,
     'http://identi.ca/user/465489': true,
     'http://identi.ca/user/58458': true,
     'http://identi.ca/user/453647': true,
     'http://identi.ca/user/499580': true },
  tools: {
    'http://identi.ca/michielbdejong': 'R',
    'http://identi.ca/api/statuses/user_timeline/425878.atom': 'S',
  }
});
doFile('michiel@revolutionari.es', {
 documents: {
   'https://revolutionari.es/profile/michiel': true,
   'https://revolutionari.es/hcard/michiel': 'hcard',
   'https://revolutionari.es/poco/michiel': 'poco',
   'https://revolutionari.es/xrd/?uri=acct:michiel@revolutionari.es': 'lrdd' },
  textFields: { fullName: 'Michiel De Jong', type: 'user' },
  images: { avatar: 'https://revolutionari.es/photo/custom/50/55.jpg' },
  follows: 
   { 'http://friendika.skilledtests.com/profile/erkan_yilmaz': true,
     'https://macgirvin.com/profile/mike': true,
     'http://bjerke.dk/ven/profile/flemming': true,
     'http://prate.io/profile/mike': true,
     'https://friendica.eu/profile/thomas_bierey': true,
     'http://friendika.hipatia.net/profile/lnxwalt': true,
     'http://friend.elsmussols.net/profile/elmussol': true,
     'https://kakste.com/profile/bruce': true,
     'http://kirgroup.com/profile/fabrixxm': true,
     'https://fnode.schirr.org/profile/harry': true,
     'https://friendica.dszdw.net/profile/klaus': true,
     'https://friendica.mafiaspiel.org/profile/leberwurscht': true },
  tools: {
    'https://revolutionari.es/dfrn_poll/michiel': 'S',
    'https://revolutionari.es/profile/michiel': 'R'
  } 
});
doFile('dejong.michiel@gmail.com', {
 documents: {
   'http://www.google.com/s2/webfinger/?q=acct:dejong.michiel@gmail.com': 'lrdd',
   'http://www.google.com/profiles/dejong.michiel': 'hcard',
   'http://www-opensocial.googleusercontent.com/api/people/108912615873187638071/': 'poco-me',
   'http://www.google.com/s2/webfinger/?q=acct%3Adejong.michiel%40gmail.com&fmt=foaf': 'describedby' },
  textFields: { fullName: 'Michiel de Jong', nick: 'dejong.michiel', type: 'user' },
  images: { avatar: 'http://www.google.com/ig/c/photos/public/AIbEiAIAAABDCLfW7aamnf7XeyILdmNhcmRfcGhvdG8qKGIwYzNhNDg4ZWEwMTg4OWUwOGJmYzViZGU1NTQ0YzY0MWQ2Y2I2YWIwAf39FvvCldqF7AbAvi1Dprjs7_jF' },
  follows: {},
  tools: {
    'mailto:dejong.michiel@gmail.com': 'M',
    'xmpp:dejong.michiel@gmail.com': 'SM',
    'http://www.google.com/profiles/dejong.michiel': 'R',
    'https://www.googleapis.com/buzz/v1/activities/108912615873187638071/@public': 'S',
  }
});
doFile('https://api.twitter.com/1/users/show.json?screen_name=michielbdejong', {
  textFields: 
   { fullName: 'Michiel de Jong',
     bio: 'Freedom hacker at unhosted.org',
     nick: 'michielbdejong',
     locale: 'en',
     type: 'user'},
  images: { avatar: 'http://a0.twimg.com/profile_images/2194941545/picresized_th_5a6d23f1e8567cc9ccdac00ace4761c7_normal.jpg' },
  follows: {},
  tools: {
    'https://twitter.com/michielbdejong': 'R',
    'twitter:michielbdejong': 'RSM'
  }
});
doFile('https://graph.facebook.com/dejong.michiel', {
  textFields:
    { fullName: 'Michiel De Jong',
      nick: 'dejong.michiel',
      locale: 'en_US',
      gender: 'male',
      type: 'user'},
  documents: {},
  images: { avatar: 'https://graph.facebook.com/dejong.michiel/picture' },
  follows: {},
  tools: {
    'mailto:dejong.michiel@facebook.com': 'M',
    'xmpp:dejong.michiel@facebook.com': 'SM',
    'https://facebook.com/dejong.michiel': 'R',
    'facebook:dejong.michiel': 'RSCM'
  }
});
doFile('michielbdejong@joindiaspora.com', {
  textFields: { fullName: 'Michiel de Jong', type: 'user' },
  images: { avatar: 'https://joindiaspora.s3.amazonaws.com/uploads/images/thumb_small_ffbd568ab8d948d72703.jpg' },
  documents: {
    'https://joindiaspora.com/webfinger?q=acct:michielbdejong@joindiaspora.com': 'lrdd',
    'https://joindiaspora.com/hcard/users/e583028f23ce0302': 'hcard' },
  follows: {},
  tools: {
    'https://joindiaspora.com/u/michielbdejong': 'R',
    'https://joindiaspora.com/public/michielbdejong.atom': 'S',
  }
});
doFile('http://melvincarvalho.com/', {
  textFields: { fullName: 'Melvin Carvalho', nick: 'melvincarvalho', type: 'user' },
  images: { avatar: 'http://melvincarvalho.com/melvincarvalho.png' },
  documents: {},
  follows: 
   { 'http://bblfish.net/people/henry/card#me': true,
     'http://webr3.org/nathan#me': true,
     'http://tobyinkster.co.uk/#i': true,
     'http://sw-app.org/mic.xhtml#i': true,
     'http://wojciechpolak.org/foaf.rdf#me': true,
     'https://my-profile.eu/people/deiu/card#me': true,
     'http://id.myopenlink.net/dataspace/person/KingsleyUyiIdehen#this': true,
     'http://mmt.me.uk/foaf.rdf#mischa': true,
     'http://bart.netage.nl/foaf#bvl': true,
     'http://presbrey.mit.edu/foaf#presbrey': true,
     'http://www.bergnet.org/people/bergi/card#me': true },
  tools: {
    'mailto:melvincarvalho@gmail.com': 'M',
  }
});
doFile('http://tantek.com/', {
  textFields: { fullName: 'Tantek &#xC7;elik', nick: 'tantekc' },
  images: {},
  documents: {},
  follows: {},
  tools: {}
});
doFile('http://www.w3.org/People/Berners-Lee/card.rdf', {
  textFields: 
   { fullName: 'Tim Berners-Lee',
     nick: 'tim.bernerslee.9',
     locale: 'en_US',
     gender: 'male',
     type: 'user' },
  images: { avatar: 'https://graph.facebook.com/tim.bernerslee.9/picture' },
  documents: 
   { 'http://graph.facebook.com/512908782#': 'magic',
     'http://identi.ca/user/45563': 'magic',
     'http://www.advogato.org/person/timbl/foaf.rdf#me': 'magic',
     'http://www4.wiwiss.fu-berlin.de/bookmashup/persons/Tim+Berners-Lee': 'magic',
     'http://www4.wiwiss.fu-berlin.de/dblp/resource/person/100007': 'magic' },
  follows: { 'http://www.w3.org/People/Berners-Lee/card#i': true },
  tools: 
   { 'mailto:tim.bernerslee.9@facebook.com': 'M',
     'xmpp:tim.bernerslee.9@facebook.com': 'SM',
     'https://facebook.com/tim.bernerslee.9': 'R',
     'facebook:tim.bernerslee.9': 'RSCM' }
});
