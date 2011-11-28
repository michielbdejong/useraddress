exports.handler = (function() {
  var http = require('http'),
    url = require('url'),
    config = require('./config').config;

  function serve(req, res) {
      var urlObj = url.parse(req.url, true);
      console.log(urlObj);
      //if(urlObj.pathname=='/single-origin-webfinger...really') {
      if(true) {
        res.writeHead(200, {
          'Content-Type': 'xrd+xml',
          'Access-Control-Allow-Origin': '*'});
        var userAddressParts = (urlObj.query.userAddress.split('@'));
        while(userAddressParts.length <2) {//avoid breaking errors
          userAddressParts.push(undefined);
        }
        res.end('<?xml version="1.0" encoding="UTF-8"?>\n'
          +'<XRD xmlns="http://docs.oasis-open.org/ns/xri/xrd-1.0" xmlns:hm="http://host-meta.net/xrd/1.0">\n'
	        +'  <hm:Host xmlns="http://host-meta.net/xrd/1.0">'+userAddressParts[1]+'</hm:Host>\n'
	        +'  <Link rel="remoteStorage"\n'
          +'    template="http://'+config.subdomainCouchHosting+'/CouchDB/proxy/'+userAddressParts[0]+'.'+userAddressParts[1]+'/{category}/"\n'
          +'    auth="http://'+config.subdomainCouchHosting+'/CouchDB/auth/'+userAddressParts[0]+'.'+userAddressParts[1]+'/"\n'
          +'    api="CouchDB"\n'
          +'  ></Link>\n'
          +'</XRD>\n');
      } else {
        res.writeHead(404, {'Content-Type': 'text/plain'});
        res.end('Not found\n');
      }
  }
  return {
    serve: serve
  }

})();
