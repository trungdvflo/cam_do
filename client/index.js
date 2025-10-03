var express = require('express');
var app = express();

var startHttps = false;
if (startHttps) {
    console.log("Server running https");
    var server = require('https').createServer(options, app);
} else {
    var server = require('http').createServer(app);
}
var bodyParser = require('body-parser');
app.use(express.static('./'));
app.use(express.static('./fonts/'));
app.use(express.static('./dist'));

var option = {}
var isHttps = false;
if (isHttps) {
    console.log("Server running https");
    const fs = require('fs');
    try {
        var https = {
            key: "./key/_.onehealth.vn.key",
            cert: "./key/onehealthvn.crt",
            ca_bundle: "./key/_.onehealth.vn-bundle.crt"
        }

        options = {
            key: fs.readFileSync(https.key),
            cert: fs.readFileSync(https.cert),
            ca: [
                fs.readFileSync(https.ca_bundle) // PEM format
            ]
        };
    } catch (ex) {
        console.log(ex);
    }
    var server = require('https').createServer(options, app);
} else {
    var server = require('http').createServer(app);
}
//app.listen(Configs.port, () => console.log('Server app listening on port '+Configs.port));
server.listen(4000, () => console.log('Server app listening on port '+4000));
