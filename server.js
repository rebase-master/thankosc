var express = require('express');

var path = require('path');
var bodyParser = require('body-parser');
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.set('port', process.env.PORT || 8080);
app.use(express.static('builds/development'));

/* GET home page. */
app.get('/', function(req, res, next) {
    //Path to your main file
    res.status(200).sendFile(path.join(__dirname+'/builds/development/index.html'));
});

// module.exports = app;

app.listen(app.get('port'), function(){
    console.log("Express server listening on port " + app.get('port'));
});
