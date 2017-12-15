var express = require("express");
const path = require('path');
var fs = require('fs');
var https = require('https');
var bodyParser = require("body-parser");
var request = require('request');
var app = express();
var server;
var options = {};
var port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.HostIP = process.env.HOST_IP; 
var routes = require("./routes/routes.js")(app);

if ((process.env.CERTIFICATE_AUTH_ENABLED || 0) == 1) {

  port = 443;
  options = {
    key: fs.readFileSync(path.join(process.env.CERTIFICATE_BASEPATH || '/certs', 'server-key.pem')),
    cert: fs.readFileSync(path.join(process.env.CERTIFICATE_BASEPATH || '/certs', 'server-crt.pem')),
    ca: fs.readFileSync(path.join(process.env.CERTIFICATE_BASEPATH || '/certs', 'ca.pem')),
    requestCert: true, 
    rejectUnauthorized: false // set to true when not using self-signed certs
  };

  app.use(function (req, res, next) {
    var allowedCerts = JSON.parse(fs.readFileSync(process.env.WHITELIST_FILEPATH || '/whitelist/allowed.json', 'utf8'));
    var cert = req.socket.getPeerCertificate();
    if (!allowedCerts.includes(cert.fingerprint)) {
        return res.status(401).send('User is not authorized');
    }
    next();
  });
}

app.use(function (err, req, res, next) {
  console.log("error: " + util.inspect(err));
});

if ((process.env.CERTIFICATE_AUTH_ENABLED || 0) == 1) {
    server = https.createServer(options, app).listen(process.env.PORT || port, function () {
    console.log("Listening (https) on port %s...", server.address().port);
  });
} else {
    server = app.listen(process.env.PORT || port, function () {
    console.log("Listening (http) on port %s...", server.address().port);
  });
}
