var xml2js=require('xml2js'),
  htmlparser = require("htmlparser"),
  fs=require('fs'),
  http=require('http'),
  https=require('https'),
  url=require('url'),
  _env='production';

function doParse(url, type, docRel, headers, content, documents, cb) {
  console.log('parsing as '+type);
  require('./parser/'+type).parse(url, docRel, headers, content, documents, function(err, data) {
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
      parse(i, data.seeAlso[i], documents, function(err2, data2) {
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
          for(var i in documents) {
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
      for(var i in documents) {
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
  console.log(urlStr);
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
            cb(null, {
              content: str,
              headers: response.headers
            });
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
   'https://identi.ca/.well-known/host-meta?resource=acct:michielbdejong@identi.ca': 'file://exampleFiles/id-hostmeta.xrd',
   'http://identi.ca/main/xrd?uri=acct:michielbdejong@identi.ca': 'file://exampleFiles/id-lrdd.xrd',
   'http://identi.ca/michielbdejong/foaf': 'file://exampleFiles/id-foaf.html',

   'https://gmail.com/.well-known/host-meta?resource=acct:dejong.michiel@gmail.com': 'file://exampleFiles/gm-hostmeta.xrd',
   'http://www.google.com/s2/webfinger/?q=acct:dejong.michiel@gmail.com': 'file://exampleFiles/gm-lrdd.xrd',
   'http://www.google.com/s2/webfinger/?q=acct%3Adejong.michiel%40gmail.com&fmt=foaf': 'file://exampleFiles/gm-foaf.html',
   'http://www-opensocial.googleusercontent.com/api/people/108912615873187638071/': 'file://exampleFiles/gm-poco-me.html',
   'http://www.google.com/profiles/dejong.michiel': 'file://exampleFiles/gm-hcard.html',

   'https://revolutionari.es/.well-known/host-meta?resource=acct:michiel@revolutionari.es': 'file://exampleFiles/fr-hostmeta.xml',
   'https://revolutionari.es/xrd/?uri=acct:michiel@revolutionari.es': 'file://exampleFiles/fr-lrdd.xrd',
   'https://revolutionari.es/poco/michiel': 'file://exampleFiles/fr-poco.html',
   'https://revolutionari.es/hcard/michiel': 'file://exampleFiles/fr-hcard.html',
   
   'https://joindiaspora.com/.well-known/host-meta?resource=acct:michielbdejong@joindiaspora.com': 'file://exampleFiles/jd-hostmeta.xrd',
   'https://joindiaspora.com/webfinger?q=acct:michielbdejong@joindiaspora.com': 'file://exampleFiles/jd-lrdd.xrd',
   'https://joindiaspora.com/hcard/users/e583028f23ce0302': 'file://exampleFiles/jd-hcard.html',

   'https://api.twitter.com/1/users/show.json?screen_name=michielbdejong': 'file://exampleFiles/twitter-api.json',
   'https://graph.facebook.com/dejong.michiel': 'file://exampleFiles/fb-api.js',
   'http://melvincarvalho.com/': 'file://exampleFiles/melvin.html',
   
   'http://www.w3.org/People/Berners-Lee/card.rdf': 'file://exampleFiles/timbl-foaf.html',
   'http://graph.facebook.com/512908782': 'file://exampleFiles/timbl-fb.html',
   'http://identi.ca/user/45563': 'file://exampleFiles/timbl-id.html',
   'http://www.advogato.org/person/timbl/foaf.rdf': 'file://exampleFiles/timbl-foaf2.html',
   'http://www4.wiwiss.fu-berlin.de/bookmashup/persons/Tim+Berners-Lee': 'file://exampleFiles/timbl-fu1.html',
   'http://www4.wiwiss.fu-berlin.de/dblp/resource/person/100007': 'file://exampleFiles/timbl-fu2.html',

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

  if(cache[url.split('#')[0]]) {
    return cache[url.split('#')[0]];
  } else {
    return url;
  }
}
function getEnv() {
 return _env;
}
function parse(url, docRel, documents, cb) {
  //console.log('parse called for '+url);
  //console.log(cb);
  var urlToFetch = url;
  if(getEnv()=='test') {
    urlToFetch = checkStubs(url);
  }
  fetch(urlToFetch, function(err, data) {
    if(err) {
      //console.log('fetch error '+url+' '+err);
      cb(err);
    } else {
      if(data.headers['Content-Type']=='js' || data.headers['Content-Type']=='json') {
        var parsed;
        try {
          parsed = JSON.parse(data.content);
        } catch(e) {//JSON failed, try xml
          cb('mime type was '+data.headers['Content-Type']+' but no valid JSON');
        }
        if(parsed) {
          doParse(url, 'json', docRel, data.headers, parsed, documents, cb);
        }
      } else if(data.headers['Content-Type']=='xml' || data.headers['Content-Type']=='xrd' || data.headers['Content-Type']=='rdf') {
        new xml2js.Parser().parseString(data.content, function(err, data2) {
          if(err || data2==null) {//XML failed, try html
            cb('mime type was '+data.headers['Content-Type']+' but no valid XML');
          } else {
            if(docRel=='lrdd' && data2['@'] && data2['@'].xmlns && data2['@'].xmlns == 'http://docs.oasis-open.org/ns/xri/xrd-1.0') {
              //console.log('doParse '+url);
              doParse(url, 'xml', 'lrdd', data.headers, data2, documents, cb);
            } else if(data2['@'] && data2['@'].xmlns && data2['@'].xmlns == 'http://xmlns.com/foaf/0.1/') {
              //console.log('doParse '+url);
              doParse(url, 'xml', 'foaf', data.headers, data2, documents, cb);
            } else if(data2['@'] && data2['@'].xmlns && data2['@'].xmlns == 'http://www.w3.org/1999/xhtml') {
              //console.log('doParse '+url);
              doParse(url, 'html', 'html', data.headers, data2, documents, cb);
            } else {
              console.log(JSON.stringify(data2));
              console.log('xml not recognized '+url);
              cb('xml document type not recognized');
            }
          }
        });
        return;
      } else if(data.headers['Content-Type']=='html') {
        var handler = new htmlparser.DefaultHandler(function (err, data3) {
          if(err) {
            cb('mime type was '+data.headers['Content-Type']+' but no valid HTML');
          } else {
            doParse(data3, 'html', docRel, documents, cb);
          }
        });
        var parser = new htmlparser.Parser(handler);
        parser.parseComplete(data.content);
      } else {
        cb('no idea what to do with Content-Type '+data.headers['Content-Type']);
      }
    }
  });
}

exports.setEnv = function(env) {
  _env = env;
}
exports.parse = parse;
