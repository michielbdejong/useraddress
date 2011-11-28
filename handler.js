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
        var userName = (urlObj.query.userAddress.split('@'))[0];
        res.end('<?xml version="1.0" encoding="UTF-8"?>\n'
          +'<XRD xmlns="http://docs.oasis-open.org/ns/xri/xrd-1.0" xmlns:hm="http://host-meta.net/xrd/1.0">\n'
	        +'  <hm:Host xmlns="http://host-meta.net/xrd/1.0">'+config.facadeHost+'</hm:Host>\n'
	        +'  <Link rel="remoteStorage"\n'
          +'    template="http://'+userName+'.'+config.proxyParentDomain+'/{category}/"\n'
          +'    auth="http://'+config.facadeHost+'/auth?userName='+userName+'"\n'
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
