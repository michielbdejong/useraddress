var xml2js=require('xml2js'),
  htmlparser = require("htmlparser"),
  fs=require('fs'),
  http=require('http'),
  https=require('https'),
  url=require('url'),
  _env='production';

function doParse(content, language, identifiers, cb) {
  console.log('parsing as '+language);
  require('./parser/'+language).parse(content, identifiers, function(err, data) {
    //data = {
    //  textFields: {},
    //  images: {},
    //  seeAlso: {},
    //  follows: {},
    //  tools: {},
    //  data: undefined
    //};
    var outstanding = 0;
    for(var i in data.seeAlso) {
      outstanding++;//map
      parse(i, data.seeAlso[i], identifiers, function(err2, data2) {
        outstanding--;//reduce
        if(err2) {
          err = err2;
        }
        for(var attr in data2) {
          for(var j in data2[attr]) {
            data[attr][j]=data2[attr][j];
          }
        }
        if(outstanding == 0) {
          for(var i in identifiers) {
            if(i.substring(0, 'acct:'.length) == 'acct:') {
              data.textFields.nick=i.substring('acct:'.length).split('@')[0];
            }
          }
          delete data.data;
          cb(err, data);
        }
      });
    }
    if(outstanding == 0) {
      for(var i in identifiers) {
        if(i.substring(0, 'acct:'.length) == 'acct:') {
          data.textFields.nick=i.substring('acct:'.length).split('@')[0];
        }
      }
      delete data.data;
      cb(err, data);
    }
  });
}

function fetch(urlStr, cb) {
  //console.log(urlStr);
  if(urlStr.substring(0, 'file://exampleFiles/'.length) == 'file://exampleFiles/') {
    fs.readFile(urlStr.substring('file://'.length), cb);
  } else {
    console.log('********* CACHE MISS: '+urlStr);
    var urlObj = url.parse(urlStr);
    var timer;
    var lib = (urlObj.protocol=='https:'?https:http);
    
    var options = {
      method: 'GET',
      host: urlObj.hostname,
      path: urlObj.path,
      port: (urlObj.port?port:(urlObj.protocol=='https:'?443:80)),
      headers: {}
    };
    
    var request = lib.request(options, function(response) {
      var str='';
      response.setEncoding('utf8');
      response.on('data', function(chunk) {
        str+=chunk;
      });
      response.on('end', function() {
        //console.log('got end');
        if(timer) {//not timed out yet
          if(response.statusCode==200 || response.statusCode==201 || response.statusCode==204) {
            cb(null, str);
          } else if(response.statusCode==301 || response.statusCode==302) {
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
      clearTimeout(timer);
      //console.log('responded timeout');
    }, 10000);//no thing on the web should ever take more than 3 seconds, except I'm testing over 3G, so setting 10 seconds
    request.on('error', function(e) {
      //console.log('got error');
      if(timer) {//not timed out yet
        cb(e);
        clearTimeout(timer);
        //console.log('responded error');
      } else {
        //console.log('got error after timeout');
      }
    });
    request.end();
  }
}
function checkStubs(url) {
  var cache = {
   'https://identi.ca/.well-known/host-meta?resource=acct:michielbdejong@identi.ca': 'file://exampleFiles/id-hostmeta',
   'http://identi.ca/main/xrd?uri=acct:michielbdejong@identi.ca': 'file://exampleFiles/id-lrdd',
   'http://identi.ca/michielbdejong/foaf': 'file://exampleFiles/id-foaf',

   'https://gmail.com/.well-known/host-meta?resource=acct:dejong.michiel@gmail.com': 'file://exampleFiles/gm-hostmeta',
   'http://www.google.com/s2/webfinger/?q=acct:dejong.michiel@gmail.com': 'file://exampleFiles/gm-lrdd',
   'http://www.google.com/s2/webfinger/?q=acct%3Adejong.michiel%40gmail.com&fmt=foaf': 'file://exampleFiles/gm-foaf',
   'http://www-opensocial.googleusercontent.com/api/people/108912615873187638071/': 'file://exampleFiles/gm-poco-me',
   'http://www.google.com/profiles/dejong.michiel': 'file://exampleFiles/gm-hcard',

   'https://revolutionari.es/.well-known/host-meta?resource=acct:michiel@revolutionari.es': 'file://exampleFiles/fr-hostmeta',
   'https://revolutionari.es/xrd/?uri=acct:michiel@revolutionari.es': 'file://exampleFiles/fr-lrdd',
   'https://revolutionari.es/poco/michiel': 'file://exampleFiles/fr-poco',
   'https://revolutionari.es/hcard/michiel': 'file://exampleFiles/fr-hcard',
   
   'https://joindiaspora.com/.well-known/host-meta?resource=acct:michielbdejong@joindiaspora.com': 'file://exampleFiles/jd-hostmeta',
   'https://joindiaspora.com/webfinger?q=acct:michielbdejong@joindiaspora.com': 'file://exampleFiles/jd-lrdd',
   'https://joindiaspora.com/hcard/users/e583028f23ce0302': 'file://exampleFiles/jd-hcard',

   'https://api.twitter.com/1/users/show.json?screen_name=michielbdejong': 'file://exampleFiles/twitter-api', 
   'https://graph.facebook.com/dejong.michiel': 'file://exampleFiles/fb-api', 
   'http://melvincarvalho.com/': 'file://exampleFiles/melvin-html', 
   
   'http://www.w3.org/People/Berners-Lee/card.rdf': 'file://exampleFiles/timbl-foaf',
   'http://graph.facebook.com/512908782': 'file://exampleFiles/timbl-fb',
   'http://identi.ca/user/45563': 'file://exampleFiles/timbl-id',
   'http://www.advogato.org/person/timbl/foaf.rdf': 'file://exampleFiles/timbl-foaf2',
   'http://www4.wiwiss.fu-berlin.de/bookmashup/persons/Tim+Berners-Lee': 'file://exampleFiles/timbl-fu1',
   'http://www4.wiwiss.fu-berlin.de/dblp/resource/person/100007': 'file://exampleFiles/timbl-fu2',

   'http://tantek.com/': 'file://exampleFiles/tantek-html',
   'http://www.facebook.com/tantek.celik': 'file://exampleFiles/tantek-fb',
   'http://twitter.com/t': 'file://exampleFiles/tantek-twitter',
   'http://flickr.com/tantek/': 'file://exampleFiles/tantek-flickr',
   
   'http://last.fm/user/tantekc': 'file://exampleFiles/tantek-lastfm',
   'http://www.last.fm/user/tantekc': 'file://exampleFiles/tantek-lastfm',

   'http://plancast.com/t': 'file://exampleFiles/tantek-plancast',
   
   'http://upcoming.yahoo.com/user/6623': 'file://exampleFiles/tantek-yahoo',
   
   'http://lanyrd.com/people/t': 'file://exampleFiles/tantek-lanyrd',
   'http://lanyrd.com/profile/t': 'file://exampleFiles/tantek-lanyrd2',
   'http://lanyrd.com/profile/t/': 'file://exampleFiles/tantek-lanyrd3',
   
   'http://foursquare.com/t': 'file://exampleFiles/tantek-foursquare',
   'https://foursquare.com/t': 'file://exampleFiles/tantek-foursquare2',
   
   'http://google.com/profiles/tantek': 'file://exampleFiles/tantek-google',
   'http://www.google.com/profiles/tantek': 'file://exampleFiles/tantek-google2',
   'https://profiles.google.com/tantek': 'file://exampleFiles/tantek-google3',
   'https://plus.google.com/109182513536739786206': 'file://exampleFiles/tantek-google4',
}

  if(cache[url.split('#')[0]]) {
    return cache[url.split('#')[0]];
  } else {
    return url;
  }
}
function getEnv() {
 return _env;
}
function parse(url, docRel, identifiers, cb) {
  //console.log('parse called for '+url);
  //console.log(cb);
  if(getEnv()=='test') {
    url = checkStubs(url);
  }
  fetch(url, function(err, data) {
    if(err) {
      //console.log('fetch error '+url+' '+err);
      cb(err);
    } else {
      var parsed;
      try {
        parsed = JSON.parse(data);
      } catch(e) {//JSON failed, try xml
        new xml2js.Parser().parseString(data, function(err, data2) {
          if(err || data2==null) {//XML failed, try html
            var handler = new htmlparser.DefaultHandler(function (err, data3) {
              if(err) {
               //console.log('handler error '+url);
               cb(err);
              } else {
                //console.log('doParse '+url);
                doParse(data3, docRel, identifiers, cb);
              }
            });
            var parser = new htmlparser.Parser(handler);
            parser.parseComplete(data);
          } else {
            if(docRel=='lrdd' && data2['@'] && data2['@'].xmlns && data2['@'].xmlns == 'http://docs.oasis-open.org/ns/xri/xrd-1.0') {
              //console.log('doParse '+url);
              doParse(data2, 'lrdd', identifiers, cb);
            } else if(data2['@'] && data2['@'].xmlns && data2['@'].xmlns == 'http://xmlns.com/foaf/0.1/') {
              //console.log('doParse '+url);
              doParse(data2, 'foaf', identifiers, cb);
            } else if(data2['@'] && data2['@'].xmlns && data2['@'].xmlns == 'http://www.w3.org/1999/xhtml') {
              //console.log('doParse '+url);
              doParse(data2, 'html', identifiers, cb);
            } else {
              console.log(JSON.stringify(data2));
              console.log('xml not recognized '+url);
              cb('xml document type not recognized');
            }
          }
        });
        return;
      }
      if(parsed) {
        doParse(parsed, docRel, identifiers, cb);
      } else {
        //console.log('no idea '+url);
        cb('no idea what this is');
      }
    }
  });
}

exports.setEnv = function(env) {
  _env = env;
}
exports.parse = parse;
