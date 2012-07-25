var masterParser = require('./masterParser');

function doFile(url, expect) {
  masterParser.parse(url, '', function(err, data) {
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
    }
  });
}
masterParser.setEnv('test');/*
doFile('https://identi.ca/.well-known/host-meta?resource=acct:michielbdejong@identi.ca', {
  textFields: 
   { fullName: 'Michiel de Jong',
     bio: 'Lived in Bali last winter and was \'the guy that did unhosted\'. Now live in Berlin and proud to be just one of many \'people who do unhosted\'.',
     nick: 'michielbdejong' },
  images: { avatar: 'http://avatar.identi.ca/425878-480-20110427110559.jpeg' },
  documents: {
    'http://identi.ca/michielbdejong/foaf': 'describedby',
     'http://identi.ca/user/425878': true,
     'http://identi.ca/michielbdejong': true },
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
  tools: {}
});/*
doFile('https://revolutionari.es/.well-known/host-meta?resource=acct:michiel@revolutionari.es', {'acct:michiel@revolutionari.es': true}, {
 identifiers: 
   { 'acct:michiel@revolutionari.es': true,
     'https://revolutionari.es/profile/michiel': true },
  textFields: { nick: 'michiel' },
  images: { avatar: 'https://revolutionari.es/photo/profile/55.jpg' },
  seeAlso: 
   { 'https://revolutionari.es/hcard/michiel': 'hcard',
     'https://revolutionari.es/poco/michiel': 'poco' },
  follows: 
   { 'http://friendika.skilledtests.com/profile/erkan_yilmaz': true,
     'https://revolutionari.es/profile/michiel': true,
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
  tools: {} 
});*/
doFile('https://gmail.com/.well-known/host-meta?resource=acct:dejong.michiel@gmail.com', {
 documents: {
   'http://www.google.com/s2/webfinger/?q=acct:dejong.michiel@gmail.com': 'lrdd',
   'http://www.google.com/profiles/dejong.michiel': 'hcard',
   'http://www-opensocial.googleusercontent.com/api/people/108912615873187638071/': 'poco-me',
   'http://www.google.com/s2/webfinger/?q=acct%3Adejong.michiel%40gmail.com&fmt=foaf': 'describedby' },
  textFields: { fullName: 'Michiel de Jong', nick: 'dejong.michiel' },
  images: { avatar: 'http://www.google.com/ig/c/photos/public/AIbEiAIAAABDCLfW7aamnf7XeyILdmNhcmRfcGhvdG8qKGIwYzNhNDg4ZWEwMTg4OWUwOGJmYzViZGU1NTQ0YzY0MWQ2Y2I2YWIwAf39FvvCldqF7AbAvi1Dprjs7_jF' },
  follows: {},
  tools: {}
});/*
doFile('https://api.twitter.com/1/users/show.json?screen_name=michielbdejong', {
  textFields: 
   { fullName: 'Michiel de Jong',
     bio: 'Freedom hacker at unhosted.org',
     nick: 'michielbdejong',
     locale: 'en' },
  images: { avatar: 'http://a0.twimg.com/profile_images/2194941545/picresized_th_5a6d23f1e8567cc9ccdac00ace4761c7_normal.jpg' },
  follows: {},
  tools: {
    'https://twitter.com/michielbdejong': 'R',
    'twitter:michielbdejong': 'MRF'
  }
});
doFile('https://graph.facebook.com/dejong.michiel', {
  textFields:
    { fullName: 'Michiel De Jong',
      nick: 'dejong.michiel',
      locale: 'en_US',
      gender: 'male' },
  images: { avatar: 'https://graph.facebook.com/dejong.michiel/picture' },
  follows: {},
  tools: {
    'mailto:dejong.michiel@facebook.com': 'M',
    'xmpp:dejong.michiel@facebook.com': 'PM',
    'https://facebook.com/dejong.michiel': 'R',
    'facebook:dejong.michiel': 'PMRFC'
  }
});/*
doFile('https://joindiaspora.com/.well-known/host-meta?resource=acct:michielbdejong@joindiaspora.com', {'acct:michielbdejong@joindiaspora.com': true}, {
  identifiers: { 'acct:michielbdejong@joindiaspora.com': true },
  textFields: { fullName: 'Michiel de Jong', nick: 'michielbdejong' },
  images: { avatar: 'https://joindiaspora.s3.amazonaws.com/uploads/images/thumb_small_ffbd568ab8d948d72703.jpg' },
  seeAlso: { 'https://joindiaspora.com/hcard/users/e583028f23ce0302': 'hcard' },
  follows: {},
  tools: {}
});
doFile('http://melvincarvalho.com/', {
 identifiers: { 'http://melvincarvalho.com/#me': true },
  textFields: { fullName: 'Melvin Carvalho' },
  images: { avatar: 'http://melvincarvalho.com/melvincarvalho.png' },
  seeAlso: {},
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
  tools: {}
});
doFile('http://tantek.com/', {
  textFields: { fullName: 'Timothy Berners-Lee' }
});
doFile('http://www.w3.org/People/Berners-Lee/card.rdf', {}, {
  textFields: { fullName: 'Timothy Berners-Lee' }
});*/
