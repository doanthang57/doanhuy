var http = require('http');
var server = http.createServer(function(req,res){
    res.write('HELLO');
    res.end();
  });
  server.listen(8000);
  console.log('Server is running..');
