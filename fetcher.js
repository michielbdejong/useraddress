var fs=require('fs'),
  http=require('http'),
  https=require('https'),
  url=require('url'),
  _env='production';

function fetch(urlStr, cb) {
  if(getEnv()=='test') {
    urlStr = checkStubs(urlStr);
  }
  if(urlStr.substring(0, 'file://exampleFiles/'.length) == 'file://exampleFiles/') {
    fs.readFile(urlStr.substring('file://'.length), function(err, content) {
      var urlStrParts = urlStr.split('.');
      cb(err, {
        content: content,
        headers: {
          'Content-Type': urlStrParts[urlStrParts.length-1]//html, xrd, rdf, js, json
        }
      });
    });
  } else {
    console.log('********* CACHE MISS: '+urlStr);
    var urlObj = url.parse(urlStr);
    var timer;
    var lib = (urlObj.protocol=='https:'?https:(urlObj.protocol=='http:'?http:undefined));
    if(lib) {
      var options = {
        method: 'GET',
        host: urlObj.hostname,
        path: urlObj.path,
        port: (urlObj.port?port:(urlObj.protocol=='https:'?443:80)),
        rejectUnauthorized: false,
        requestCert: true,
        headers: {
          'user-agent': 'Mozilla/5.0',
          'accept': 'text/turtle; q=1.0, application/rdf+xml; q=0.8, application/xrd+xml; 0.6, application/json; 0.4, text/html; q=0.2;'
        }
      };
      
      var request = lib.request(options, function(response) {
        var str='';
        response.setEncoding('utf8');
        response.on('data', function(chunk) {
          str+=chunk;
        });
        response.on('end', function() {
          console.log('got a '+response.statusCode+' with '+str.length+' chars for '+urlStr);
          if(timer) {//not timed out yet
            if(response.statusCode==200 || response.statusCode==201 || response.statusCode==204) {
              cb(null, {
                content: str,
                headers: response.headers
              });
            } else if(response.statusCode==301 || response.statusCode==302 || response.statusCode==303) {
              fetch(response.headers.location, cb);
            } else {
              cb(response.statusCode);
            }
            clearTimeout(timer);
            //console.log('responded ok');
          } else {
            //console.log('got response after timeout');
          }
        });
      });
      
      timer=setTimeout(function() { 
        cb('timeout');
        console.log('timed out for '+urlStr);
        clearTimeout(timer);
        //console.log('responded timeout');
      }, 10000);//no thing on the web should ever take more than 3 seconds, except I'm testing over 3G, so setting 10 seconds
      request.on('error', function(e) {
        //console.log('got error');
        if(timer) {//not timed out yet
          console.log('got error for '+urlStr);
          console.log(e);
          cb(e);
          clearTimeout(timer);
          //console.log('responded error');
        } else {
          //console.log('got error after timeout');
        }
        });
      request.end();
    } else {
      console.log('not a URL');
      cb('not a URL');
    }
  }
}
function checkStubs(urlStr) {
  var cache = {
   'https://identi.ca/.well-known/host-meta?resource=acct:michielbdejong@identi.ca': 'file://exampleFiles/id-hostmeta.xrd',
   'http://identi.ca/main/xrd?uri=acct:michielbdejong@identi.ca': 'file://exampleFiles/id-lrdd.xrd',
   'http://identi.ca/michielbdejong/foaf': 'file://exampleFiles/id-foaf.rdf',
   'http://identi.ca/michielbdejong': 'file://exampleFiles/id-profile.html',
   'http://identi.ca/user/425878': 'file://exampleFiles/id-profile.html',

   'https://gmail.com/.well-known/host-meta?resource=acct:dejong.michiel@gmail.com': 'file://exampleFiles/gm-hostmeta.xrd',
   'http://www.google.com/s2/webfinger/?q=acct:dejong.michiel@gmail.com': 'file://exampleFiles/gm-lrdd.xrd',
   'http://www.google.com/s2/webfinger/?q=acct%3Adejong.michiel%40gmail.com&fmt=foaf': 'file://exampleFiles/gm-foaf.rdf',
   'http://www-opensocial.googleusercontent.com/api/people/108912615873187638071/': 'file://exampleFiles/gm-poco-me.json',
   'http://www.google.com/profiles/dejong.michiel': 'file://exampleFiles/gm-hcard.html',

   'https://revolutionari.es/.well-known/host-meta?resource=acct:michiel@revolutionari.es': 'file://exampleFiles/fr-hostmeta.xrd',
   'https://revolutionari.es/xrd/?uri=acct:michiel@revolutionari.es': 'file://exampleFiles/fr-lrdd.xrd',
   'https://revolutionari.es/poco/michiel': 'file://exampleFiles/fr-poco.json',
   'https://revolutionari.es/hcard/michiel': 'file://exampleFiles/fr-hcard.html',
   'https://revolutionari.es/profile/michiel': 'file://exampleFiles/fr-profile.html',

   'https://joindiaspora.com/.well-known/host-meta?resource=acct:michielbdejong@joindiaspora.com': 'file://exampleFiles/jd-hostmeta.xrd',
   'https://joindiaspora.com/webfinger?q=acct:michielbdejong@joindiaspora.com': 'file://exampleFiles/jd-lrdd.xrd',
   'https://joindiaspora.com/hcard/users/e583028f23ce0302': 'file://exampleFiles/jd-hcard.html',

   'https://api.twitter.com/1/users/show.json?screen_name=michielbdejong': 'file://exampleFiles/twitter-api.json',
   'https://graph.facebook.com/dejong.michiel': 'file://exampleFiles/fb-api.turtle',
   'http://melvincarvalho.com/': 'file://exampleFiles/melvin.html',
   
   'http://www.w3.org/People/Berners-Lee/card.rdf': 'file://exampleFiles/timbl-foaf.rdf',
   'http://graph.facebook.com/512908782': 'file://exampleFiles/timbl-fb.turtle',
   'http://identi.ca/user/45563': 'file://exampleFiles/timbl-id.html',
   'http://www.advogato.org/person/timbl/foaf.rdf': 'file://exampleFiles/timbl-foaf2.rdf',
   'http://www4.wiwiss.fu-berlin.de/bookmashup/persons/Tim+Berners-Lee': 'file://exampleFiles/timbl-fu1.rdf',
   'http://www4.wiwiss.fu-berlin.de/dblp/resource/person/100007': 'file://exampleFiles/timbl-fu2.rdf',

   'http://tantek.com/': 'file://exampleFiles/tantek.html',
   'http://www.facebook.com/tantek.celik': 'file://exampleFiles/tantek-fb.html',
   'http://twitter.com/t': 'file://exampleFiles/tantek-twitter.html',
   'http://flickr.com/tantek/': 'file://exampleFiles/tantek-flickr.html',
   
   'http://last.fm/user/tantekc': 'file://exampleFiles/tantek-lastfm.html',
   'http://www.last.fm/user/tantekc': 'file://exampleFiles/tantek-lastfm.html',

   'http://plancast.com/t': 'file://exampleFiles/tantek-plancast.html',
   
   'http://upcoming.yahoo.com/user/6623': 'file://exampleFiles/tantek-yahoo.html',
   
   'http://lanyrd.com/people/t': 'file://exampleFiles/tantek-lanyrd.html',
   'http://lanyrd.com/profile/t': 'file://exampleFiles/tantek-lanyrd2.html',
   'http://lanyrd.com/profile/t/': 'file://exampleFiles/tantek-lanyrd3.html',
   
   'http://foursquare.com/t': 'file://exampleFiles/tantek-foursquare.html',
   'https://foursquare.com/t': 'file://exampleFiles/tantek-foursquare2.html',
   
   'http://google.com/profiles/tantek': 'file://exampleFiles/tantek-google.html',
   'http://www.google.com/profiles/tantek': 'file://exampleFiles/tantek-google2.html',
   'https://profiles.google.com/tantek': 'file://exampleFiles/tantek-google3.html',
   'https://plus.google.com/109182513536739786206': 'file://exampleFiles/tantek-google4.html',
  }

  if(cache[urlStr.split('#')[0]]) {
    return cache[urlStr.split('#')[0]];
  } else {
    return urlStr;
  }
}
function getEnv() {
 return _env;
}

exports.setEnv = function(env) {
  _env = env;
}
exports.fetch = fetch;
