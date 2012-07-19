var masterParser = require('./masterParser');

function doFile(url, docRel, identifiers) {
  masterParser.parse(url, docRel, identifiers, function(err, data) {
    console.log(err);
    console.log(data);
  });
}

doFile('file://exampleFiles/id-xrd', 'lrdd', {'acct:michielbdejong@identi.ca': true});
doFile('file://exampleFiles/fr-xrd', 'lrdd', {'acct:michiel@revolutionari.es': true});
doFile('file://exampleFiles/gm-xrd', 'lrdd', {'acct:dejong.michiel@gmail.com': true});
doFile('file://exampleFiles/twitter-api', 'twitter-api', {'http://twitter.com/michielbdejong': true});
doFile('file://exampleFiles/fb-api', 'facebook-api', {'http://facebook.com/dejong.michiel': true});
doFile('file://exampleFiles/jd-xrd', 'lrdd', {'acct:michielbdejong@joindiaspora.com': true});
doFile('file://exampleFiles/melvin.html', '#me', {'http://melvincarvalho.com/#me': true});
