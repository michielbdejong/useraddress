var xml2js=require('xml2js'),
  htmlparser = require("htmlparser"),
  fs=require('fs'),
  http=require('http'),
  https=require('https'),
  url=require('url'),
  _env='production';

function doParse(content, language, identifiers, cb) {
  //console.log('parsing as '+language);
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
    var urlObj = url.parse(urlStr);
    var timer, responded = false;
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
        if(timer) {
          clearTimeout(timer);
        }
        if(!responded) {
          if(response.statusCode==200 || response.statusCode==201 || response.statusCode==204) {
            cb(null, str);
          } else {
            cb(response.statusCode);
          }
          responded = true;
        }
      });
    });
    
    timer=setTimeout(function() { 
      cb('timeout');
      responded = true;
    }, 3000);//no thing on the web should ever take more than 3 seconds
    request.on('error', function(e) {
      if(!responded) {
        cb(e);
        responded = true;
      }
    });
  }
}
function checkStubs(url) {
  if(url == 'http://identi.ca/michielbdejong/foaf') {
    return 'file://exampleFiles/id-foaf';
  }
  if(url == 'http://www.google.com/s2/webfinger/?q=acct%3Adejong.michiel%40gmail.com&fmt=foaf') {
    return 'file://exampleFiles/gm-foaf';
  }
  if(url == 'http://www-opensocial.googleusercontent.com/api/people/108912615873187638071/') {
    return 'file://exampleFiles/gm-poco-me';
  }
  if(url == 'https://revolutionari.es/poco/michiel') {
    return 'file://exampleFiles/fr-poco';
  }
  if(url == 'https://revolutionari.es/hcard/michiel') {
    return 'file://exampleFiles/fr-hcard';
  }
  if(url == 'http://www.google.com/profiles/dejong.michiel') {
    return 'file://exampleFiles/gm-hcard';
  }
  if(url == 'https://joindiaspora.com/hcard/users/e583028f23ce0302') {
    return 'file://exampleFiles/jd-hcard';
  }
  return url;
}
function getEnv() {
 return _env;
}
function parse(url, docRel, identifiers, cb) {
  if(getEnv()=='test') {
    url = checkStubs(url);
  }
  fetch(url, function(err, data) {
    if(err) {
      cb(err);
    } else {
      var parsed;
      try {
        parsed = JSON.parse(data);
      } catch(e) {//JSON failed, try xml
        new xml2js.Parser().parseString(data, function(err, data2) {
          if(err) {//XML failed, try html
            var handler = new htmlparser.DefaultHandler(function (err, data3) {
              if(err) {
               cb(err);
              } else {
                doParse(data3, docRel, identifiers, cb);
              }
            });
            var parser = new htmlparser.Parser(handler);
            parser.parseComplete(data);
          } else {
            if(docRel=='lrdd' && data2['@'] && data2['@'].xmlns && data2['@'].xmlns == 'http://docs.oasis-open.org/ns/xri/xrd-1.0') {
              doParse(data2, 'lrdd', identifiers, cb);
            } else if(data2['@'] && data2['@'].xmlns && data2['@'].xmlns == 'http://xmlns.com/foaf/0.1/') {
              doParse(data2, 'foaf', identifiers, cb);
            } else if(data2['@'] && data2['@'].xmlns && data2['@'].xmlns == 'http://www.w3.org/1999/xhtml') {
              doParse(data2, 'html', identifiers, cb);
            } else {
              //console.log(JSON.stringify(data2));
              cb('xml document type not recognized');
            }
          }
        });
        return;
      }
      if(parsed) {
        if(docRel == 'poco#me') {
          doParse(parsed, 'poco-me', identifiers, cb);
        } else if(docRel == 'twitter-api') {
          doParse(parsed, 'twitter', identifiers, cb);
        } else if(docRel == 'facebook-api') {
          doParse(parsed, 'facebook', identifiers, cb);
        } else if(docRel == 'poco') {
          doParse(parsed, 'poco', identifiers, cb);
        } else {
          cb('JSON doc!');
        }
      } else {
        cb('no idea what this is');
      }
    }
  });
}

exports.setEnv = function(env) {
  _env = env;
}
exports.parse = parse;
