exports.handler = (function() {
  var http = require('http'),
    url = require('url'),
    config = require('./config').config;

  function serve(req, res) {
  //user.unhosted.org. handle PUT with params:
  //  - userAddress
  //  - assertion
  //  - audience
  //  - lrdd-location
  //
  //  - returns ok
  //
  //handle GET with params:
  //  - userAddress
  //
  //  - returns lrdd location - either stored previously or by looking up host-meta and resolving template
  //
      var urlObj = url.parse(req.url, true);
      console.log(urlObj);
      if(urlObj.pathname == '/') {
        if(req.method=='GET') {
          res.writeHead(200);
          res.end('<!DOCTYPE html><html lang="en"><head><title>Linking your user address to your lrdd file in a centralized way...</title><meta charset="utf-8"></head><body>'
            +'Loading, please wait...'
            +'<script src="http://browserid.org/include.js"></script>'
            +'<script>document.write(\'<input type="submit" value="Click me" onclick="go();">\');'
            +'function go() {'
            +'  navigator.id.get(function(assertion) {'
            +'    var xhr=new XMLHttpRequest();xhr.open(\'POST\', \'\', false);xhr.send(JSON.stringify({'
            +'      browserIdAssertion: assertion,'
            +'      lrdd: \''+urlObj.query.set_lrdd+'\''
            +'    }));'
            +'    window.location = \''+urlObj.query.assertion_also_to+'?assertion=\'+assertion'
            +'  }, {requiredEmail: \''+urlObj.query.userAddress+'\'});'
            +'}'
            +'</script>'
            +'</body></html>');
        } else if(req.method == 'POST') {
          console.log("It's a POST");
          var dataStr = '';
          req.on('data', function(chunk) { dataStr += chunk; });
          req.on('end', function() {
            var dataObj = JSON.parse(dataStr);
            console.log(dataObj);
            res.writeHead(200, {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': dataObj.audience});
            res.write(JSON.stringify({
                email: 'dejong.michiel@gmail.com',
                token: 'asdf'
              })
            );
            res.end();
          });
        }
      } else if(false) {
        res.writeHead(200, {
          'Content-Type': 'xrd+xml',
          'Access-Control-Allow-Origin': '*'});
        if(!urlObj.query.userAddress) {
          res.end('please specify ?userAddress=...@...');
        } else {
          var userAddressParts = (urlObj.query.userAddress.split('@'));
          while(userAddressParts.length <2) {//avoid breaking errors
            userAddressParts.push(undefined);
          }
          res.end('<?xml version="1.0" encoding="UTF-8"?>\n'
            +'<XRD xmlns="http://docs.oasis-open.org/ns/xri/xrd-1.0" xmlns:hm="http://host-meta.net/xrd/1.0">\n'
            +'  <hm:Host xmlns="http://host-meta.net/xrd/1.0">'+userAddressParts[1]+'</hm:Host>\n'
            +'  <Link rel="remoteStorage"\n'
            +'    template="http://'+config.subdomainCouchHosting+'/CouchDB/proxy/'+userAddressParts[1]+'/{category}/"\n'
            +'    auth="http://'+config.subdomainCouchHosting+'/CouchDB/auth/'+userAddressParts[1]+'/'+userAddressParts[0]+'"\n'
            +'    api="CouchDB"\n'
            +'  ></Link>\n'
            +'</XRD>\n');
         }
      } else {
        res.writeHead(404, {'Content-Type': 'text/plain'});
        res.end('Not Found\n');
      }
  }
  return {
    serve: serve
  }

})();
