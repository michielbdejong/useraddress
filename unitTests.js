var masterParser = require('./masterParser');

function doFile(url, docRel, identifiers, expect) {
  masterParser.parse(url, docRel, identifiers, function(err, data) {
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
masterParser.setEnv('test');
/*doFile('https://identi.ca/.well-known/host-meta?resource=acct:michielbdejong@identi.ca', 'lrdd', {'acct:michielbdejong@identi.ca': true}, {
  identifiers: 
   { 'acct:michielbdejong@identi.ca': true,
     'http://identi.ca/user/425878': true,
     'http://identi.ca/michielbdejong': true },
  textFields: 
   { fullName: 'Michiel de Jong',
     bio: 'Lived in Bali last winter and was \'the guy that did unhosted\'. Now live in Berlin and proud to be just one of many \'people who do unhosted\'.',
     nick: 'michielbdejong' },
  images: { avatar: 'http://avatar.identi.ca/425878-480-20110427110559.jpeg' },
  seeAlso: { 'http://identi.ca/michielbdejong/foaf': 'describedby' },
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
});
doFile('https://revolutionari.es/.well-known/host-meta?resource=acct:michiel@revolutionari.es', 'lrdd', {'acct:michiel@revolutionari.es': true}, {
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
});
doFile('https://gmail.com/.well-known/host-meta?resource=acct:dejong.michiel@gmail.com', 'lrdd', {'acct:dejong.michiel@gmail.com': true}, {
 identifiers: 
   { 'acct:dejong.michiel@gmail.com': true,
     'http://www.google.com/profiles/dejong.michiel': true },
  textFields: { fullName: 'Michiel de Jong', nick: 'dejong.michiel' },
  images: { avatar: 'http://www.google.com/ig/c/photos/public/AIbEiAIAAABDCLfW7aamnf7XeyILdmNhcmRfcGhvdG8qKGIwYzNhNDg4ZWEwMTg4OWUwOGJmYzViZGU1NTQ0YzY0MWQ2Y2I2YWIwAf39FvvCldqF7AbAvi1Dprjs7_jF' },
  seeAlso: 
   { 'http://www-opensocial.googleusercontent.com/api/people/108912615873187638071/': 'poco-me',
     'http://www.google.com/profiles/dejong.michiel': 'hcard',
     'http://www.google.com/s2/webfinger/?q=acct%3Adejong.michiel%40gmail.com&fmt=foaf': 'describedby' },
  follows: {},
  tools: {}
});
doFile('https://api.twitter.com/1/users/show.json?screen_name=michielbdejong', 'twitter', {'https://twitter.com/michielbdejong': true}, {
  identifiers: {},
  textFields: 
   { fullName: 'Michiel de Jong',
     bio: 'Freedom hacker at unhosted.org',
     nick: 'michielbdejong' },
  images: { avatar: 'http://a0.twimg.com/profile_images/2194941545/picresized_th_5a6d23f1e8567cc9ccdac00ace4761c7_normal.jpg' },
  seeAlso: {},
  follows: {},
  tools: {} 
});
doFile('https://graph.facebook.com/dejong.michiel', 'facebook', {'https://graph.facebook.com/dejong.michiel': true}, {
 identifiers: { 'https://graph.facebook.com/dejong.michiel': true },
  textFields: { fullName: 'Michiel De Jong', nick: 'dejong.michiel' },
  images: { avatar: 'http://graph.facebook.com/dejong.michiel/picture' },
  seeAlso: {},
  follows: {},
  tools: {}
});
doFile('https://joindiaspora.com/.well-known/host-meta?resource=acct:michielbdejong@joindiaspora.com', 'lrdd', {'acct:michielbdejong@joindiaspora.com': true}, {
  identifiers: { 'acct:michielbdejong@joindiaspora.com': true },
  textFields: { fullName: 'Michiel de Jong', nick: 'michielbdejong' },
  images: { avatar: 'https://joindiaspora.s3.amazonaws.com/uploads/images/thumb_small_ffbd568ab8d948d72703.jpg' },
  seeAlso: { 'https://joindiaspora.com/hcard/users/e583028f23ce0302': 'hcard' },
  follows: {},
  tools: {}
});
doFile('http://melvincarvalho.com/', '#me', {'http://melvincarvalho.com/#me': true}, {
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
doFile('http://www.w3.org/People/Berners-Lee/card.rdf', 'foaf', {}, {
  textFields: { fullName: 'Timothy Berners-Lee' }
});*/
doFile('http://tantek.com/', 'html', {}, {
  textFields: { fullName: 'Timothy Berners-Lee' }
});
