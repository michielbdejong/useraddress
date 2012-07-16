exports.get = function(str, cb) {
    if(str == 'michiel@unhosted.org') {
      cb('Michiel de Jong', 'http://unhosted.org/img/michiel.jpg');
    }
  };
