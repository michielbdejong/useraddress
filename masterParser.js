var xml2js=require('xml2js'),
  fs=require('fs'),
  http=require('http'),
  https=require('https'),
  url=require('url');

function doParse(content, language, identifiers, cb) {
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
      parse(data.seeAlso[i].url, data.seeAlso[i].rel, identifiers, function(err, data2) {
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
          cb(err, data);
        }
      });
    }
  });
}

function fetch(urlStr, cb) {
  console.log(urlStr);
  if(urlStr.substring(0, 'file://exampleFiles/'.length) == 'file://exampleFiles/') {
    fs.readFile(urlStr.substring('file://'.length), cb);
  } else {
    var timer, responded = false;
    var lib = (urlObj.protocol=='https:'?https:http);
    
    var urlObj = url.parse(urlStr);
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

function parse(url, docRel, identifiers, cb) {
  fetch(url, function(err, data) {
    var parsed;
    try {
      parsed = JSON.parse(data);
    } catch(e) {
      new xml2js.Parser().parseString(data, function(err, data2) {
        if(docRel=='lrdd' && data2['@'] && data2['@'].xmlns && data2['@'].xmlns == 'http://docs.oasis-open.org/ns/xri/xrd-1.0') {
          doParse(data2, 'lrdd', identifiers, cb);
        } else if(data2['@'] && data2['@'].xmlns && data2['@'].xmlns == 'http://xmlns.com/foaf/0.1/') {
          doParse(data2, 'foaf', identifiers, cb);
        } else if(data2['@'] && data2['@'].xmlns && data2['@'].xmlns == 'http://www.w3.org/1999/xhtml') {
          doParse(data2, 'html', docRel, identifiers, cb);
        }
      });
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
        console.log('JSON doc!');
      }
    } else {
      console.log('no idea what this is');
    }
  });
}

exports.parse = parse;
