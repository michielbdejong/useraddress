var masterParser = require('./masterParser');

function doFile(url, docRel, identifiers) {
  if(url == 'http://identi.ca/michielbdejong/foaf') {
    url = 'file://exampleFiles/id-foaf';
  }
  if(url == 'http://www.google.com/s2/webfinger/?q=acct%3Adejong.michiel%40gmail.com&fmt=foaf') {
    url = 'file://exampleFiles/gm-foaf';
  }
  if(url == 'http://www-opensocial.googleusercontent.com/api/people/108912615873187638071/') {
    url = 'file://exampleFiles/gm-poco-me';
  }
  if(url == 'https://revolutionari.es/poco/michiel') {
    url = 'file://exampleFiles/fr-poco';
  }
  masterParser.parse(url, docRel, identifiers, function(err, data) {
    console.log(err);
    console.log(data);
  });
}

//doFile('file://exampleFiles/id-xrd', 'lrdd', {'acct:michielbdejong@identi.ca': true});
//doFile('file://exampleFiles/fr-xrd', 'lrdd', {'acct:michiel@revolutionari.es': true});
//doFile('file://exampleFiles/gm-xrd', 'lrdd', {'acct:dejong.michiel@gmail.com': true});
doFile('file://exampleFiles/twitter-api', 'twitter-api', {'http://twitter.com/michielbdejong': true});
//doFile('file://exampleFiles/fb-api', 'facebook-api', {'http://facebook.com/dejong.michiel': true});
//doFile('file://exampleFiles/jd-xrd', 'lrdd', {'acct:michielbdejong@joindiaspora.com': true});
//doFile('file://exampleFiles/melvin.html', '#me', {'http://melvincarvalho.com/#me': true});
