var fetcher=require('./fetcher');

function doParse(url, type, docRel, headers, content, cb) {
  require('./parser/'+type).parse(url, docRel, headers, content, function(err, data) {
    //data = {
    //  textFields: {},
    //  images: {},
    //  documents: {},
    //  follows: {},
    //  tools: {},
    //  data: undefined
    //};
    var outstanding = 0;
    for(var i in data.documents) {
      outstanding++;//map
      parse(i, data.documents[i], function(err2, data2) {
        outstanding--;//reduce
        if(err2) {
          err = err2;
        } else {
          for(var i in data2.data) {
            if(data.documents[i]) {
              for(var j in data2.data[i]) {
                for(var k in data2.data[i][j]) {
                  data[j][k]=data2.data[i][j][k];
                }
              }
            }
          }
          for(var j in data2) {
            if(j != 'data') {
              for(var k in data2[j]) {
                data[j][k]=data2[j][k];
              }
            }
          }
        }
        if(outstanding == 0) {
          cb(err, data);
        }
      });
    }
    if(outstanding == 0) {
      for(var i in data.data) {
        if(data.documents[i]) {
          for(var j in data.data[i]) {
            for(var k in data.data[i][j]) {
              data[j][k]=data.data[i][j][k];
            }
          }
        }
      }
      cb(err, data);
    }
  });
}

function chooseParser(contentType) {
  if(contentType=='js' || contentType=='json') {
    return 'json';
  } else if(contentType=='rdf') {
    return 'rdf';
  } else if(contentType=='xrd') {
    return 'xrd';
  } else if(contentType=='turtle') {
    return 'turtle';
  } else {
    return 'html';
  }
}
function webfingerize(url) {
  var parts = url.split('@');
  if(parts.length==2 && parts[0].length>0 && parts[1].length>2) {
    if(parts[0].indexOf(':')==-1 && parts[0].indexOf('/')==-1 && parts[1].indexOf('.')!=-1) {
      return 'https://'+parts[1]+'/.well-known/host-meta?resource=acct:'+url;
    }
  }
  return url;
}
function parse(url, docRel, cb) {
  //console.log('parse called for '+url);
  //console.log(cb);
  url = webfingerize(url);
  var urlToFetch = url;
  fetcher.fetch(urlToFetch, function(err, data) {
    if(err) {
      //console.log('fetch error '+url+' '+err);
      cb(err);
    } else {
      var parser = chooseParser(data.headers['Content-Type']);
      if(!parser) {
        cb('unsupported Content-Type '+data.headers['Content-Type']);
      } else {
        doParse(url, parser, docRel, data.headers, data.content, function(err, data) {
          if(url.indexOf('gmail')!=-1) {
            data.tools['mailto:'+data.textFields.nick+'@gmail.com']='M';
            data.tools['xmpp:'+data.textFields.nick+'@gmail.com']='PM';
          }
          if(url.indexOf('facebook')!=-1) {
            data.tools['mailto:'+data.textFields.nick+'@facebook.com']='M';
            data.tools['xmpp:'+data.textFields.nick+'@facebook.com']='PM';
            data.tools['facebook:'+data.textFields.nick]='PMRFC';
          }
          if(url.indexOf('twitter')!=-1) {
            data.tools['twitter:'+data.textFields.nick]='MRF';
          }
          cb(err, data);
        });
      }
    }
  });
}
exports.setEnv = function(env) {
  fetcher.setEnv(env);
}
exports.parse = parse;
