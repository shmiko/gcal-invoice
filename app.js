var express = require('express');
var app = express();

app.use(express.static('/bower_components', __dirname + '/bower_components'));
app.use(express.static('/', __dirname + '/public'));
app.listen(3000);
