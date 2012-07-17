exports.get = (function () {
  var platform = require('./platform');
      ///////////////
     // Webfinger //
    ///////////////

    function userAddress2hostMetas(userAddress, cb) {
      var parts = userAddress.toLowerCase().split('@');
      if(parts.length < 2) {
        cb('That is not a user address. There is no @-sign in it');
      } else if(parts.length > 2) {
        cb('That is not a user address. There is more than one @-sign in it');
      } else {
        if(!(/^[\.0-9a-z\-\_]+$/.test(parts[0]))) {
          cb('That is not a user address. There are non-dotalphanumeric symbols before the @-sign: "'+parts[0]+'"');
        } else if(!(/^[\.0-9a-z\-]+$/.test(parts[1]))) {
          cb('That is not a user address. There are non-dotalphanumeric symbols after the @-sign: "'+parts[1]+'"');
        } else {
          var query = '?resource=acct:'+encodeURIComponent(userAddress);
          if(parts[1] == 'facebook.com') {
            console.log('using special facebook rule');
            cb(null, ['http://graph.facebook.com/'+parts[0]]);
          } else if(parts[1] == 'twitter.com') {
            console.log('using special twitter rule');
            cb(null, ['http://api.twitter.com/1/users/lookup.json?screen_name='+parts[0]]);
          } else {
            cb(null, [
              'https://'+parts[1]+'/.well-known/host-meta.json'+query,
              'https://'+parts[1]+'/.well-known/host-meta'+query,
              'http://'+parts[1]+'/.well-known/host-meta.json'+query,
              'http://'+parts[1]+'/.well-known/host-meta'+query
              ]);
          }
        }
      }
    }
    function fetchXrd(addresses, timeout, cb) {
      var firstAddress = addresses.shift();
      if(firstAddress) {
        platform.ajax({
          url: firstAddress,
          success: function(data) {
            parseAsJrd(data, function(err, obj){
              if(err) {
                parseAsXrd(data, function(err, obj){
                  if(err) {
                    fetchXrd(addresses, timeout, cb);
                  } else {
                    cb(null, obj);
                  }
                });
              } else {
                cb(null, obj);
              }
            });
          },
          error: function(data) {
            fetchXrd(addresses, timeout, cb);
          },
          timeout: timeout
        });
      } else {
        cb('could not fetch xrd');
      }
    }
    function parseAsXrd(str, cb) {
      platform.parseXml(str, function(err, obj) {
        if(err) {
          cb(err);
        } else {
          if(obj && obj.Link) {
            var links = {};
            if(obj.Link && obj.Link['@']) {//obj.Link is one element
              if(obj.Link['@'].rel) {
                links[obj.Link['@'].rel]=obj.Link['@'];
              }
            } else {//obj.Link is an array
              for(var i=0; i<obj.Link.length; i++) {
                if(obj.Link[i]['@'] && obj.Link[i]['@'].rel) {
                  links[obj.Link[i]['@'].rel]=obj.Link[i]['@'];
                }
              }
            }
            cb(null, links);
          } else if (obj && obj.Agent) {
            cb(null, obj.Agent); //TODO: split this
          } else {
            cb('found valid xml but with no Link elements in there');
          }
        }
      });
    }
    function parseAsJrd(str, cb) {
      var obj;
      try {
        obj = JSON.parse(str);
        console.log('got JSON!');
        console.log(obj);
      } catch(e) {
        cb('not valid JSON');
        return;
      }
      if(obj.links) {
        var links = {};
        for(var i=0; i<obj.links.length; i++) {
          //just take the first one of each rel:
          if(obj.links[i].rel) {
            links[obj.links[i].rel]=obj.links[i];
          }
        }
        cb(null, links);
      } else if(obj.length == 1) {//twitter
        cb(null, {
          name: obj[0].name,
          avatar: obj[0].profile_image_url
        });
      } else if(obj.name) {//facebook
        cb(null, {
          name: obj.name,
          avatar: 'http://graph.facebook.com/{userName}/picture'
        });
      } else if(obj.entry) {//google
        cb(null, {
          name: obj.entry.name.formatted,
          avatar: obj.entry.thumbnailUrl
        });
      }
    }
    function parseFoaf(agents, cb) {
      for(var i=0; i<agents.length; i++) {
        if(agents[i] && agents[i].name && agents[i].img && agents[i].img.Image && agents[i].img.Image['@'] && agents[i].img.Image['@']['rdf:about']) {
          cb(null, {
            name: agents[i].name,
            avatar: agents[i].img.Image['@']['rdf:about']
          });
          return;
        }
      }
      cb('could not extract storageInfo from lrdd');
    }
    function getFoaf(userAddress, options, cb) {
      userAddress2hostMetas(userAddress, function(err1, hostMetaAddresses) {
        console.log(hostMetaAddresses);
        if(err1) {
          cb(err1);
        } else {
          fetchXrd(hostMetaAddresses, options.timeout, function(err2, hostMetaLinks) {
            console.log(hostMetaLinks);
            if(err2) {
              cb('could not fetch host-meta for '+userAddress);
            } else {
              if(hostMetaLinks.name && hostMetaLinks.avatar) {
                if(hostMetaLinks.avatar == 'http://graph.facebook.com/{userName}/picture') {//facebook
                  hostMetaLinks.avatar = 'http://graph.facebook.com/'+userAddress.split('@')[0]+'/picture';
                }
                cb(null, hostMetaLinks);
              } else if(hostMetaLinks['lrdd'] && hostMetaLinks['lrdd'].template) {
                var parts = hostMetaLinks['lrdd'].template.split('{uri}');
                var lrddAddresses=[parts.join('acct:'+userAddress), parts.join(userAddress)];
                 fetchXrd(lrddAddresses, options.timeout, function(err4, lrddLinks) {
                  console.log(lrddLinks);
                  if(err4) {
                    cb('could not fetch lrdd for '+userAddress);
                  } else if(lrddLinks['http://portablecontacts.net/spec/1.0#me']) {//Google
                     fetchXrd([lrddLinks['http://portablecontacts.net/spec/1.0#me'].href], options.timeout, cb);
                  } else if(lrddLinks['describedby'] && lrddLinks['describedby'].href) {
                    fetchXrd([lrddLinks['describedby'].href], options.timeout, function(err5, foaf) {
                      if(err5) {
                        cb(err5);
                      } else {
                        parseFoaf(foaf, cb);
                      }
                    });
                  } else {
                    cb('could not extract foaf from lrdd');
                  }
                }); 
              } else if(hostMetaLinks['describedby'] && hostMetaLinks['describedby'].href) {
                fetchXrd([hostMetaLinks['describedby'].href], options.timeout, function(err3, foaf) {
                  if(err3) {
                    cb(err3);
                  } else {
                    parseFoaf(foaf, cb);
                  }
                });
              } else {
                cb('could not extract lrdd template from host-meta');
              }
            }
          });
        }
      });
    }
    return function(str, cb) {
      getFoaf(str, {}, function(err, data) {
        if(!err) {
          cb(data);
        } else {
          cb();
        }
      });
    };
})();
