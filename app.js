var express = require("express");
var bodyParser = require("body-parser");
var request = require('request');
var moment = require('moment');
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.HostIP = process.env.HOST_IP; 
var routes = require("./routes/routes.js")(app);
 
var server = app.listen(process.env.PORT || 3000, function () {
    console.log("Listening on port %s...", server.address().port);
});
