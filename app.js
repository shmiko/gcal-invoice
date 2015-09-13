var express = require('express');
var app = express();

app.use('/bower_components', express.static(__dirname + '/bower_components'));
app.use('/', express.static(__dirname + '/public'));

var port = process.env.PORT ? process.env.PORT : 3003;
var hostname = process.env.IP ? process.env.IP : 'localhost';
app.listen(port, hostname);
console.log('listening on ' + hostname + ':' + port);