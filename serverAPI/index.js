'use strict';
global.ROOT_PATH = __dirname;
const express = require('express')
var Memcached = require('memcached');
const app = express()
var bodyParser = require('body-parser');
var timeout = require('express-timeout-handler');
const Configs = require('./config/configs.js');
const baseC = require('./controllers/baseC.js');
const framework = require('./lib/framework.js');
const dbconnMyssql = require('./lib/dbconnMysql.js');
const logger = require('./lib/logger.js');
const bwipjs = require('bwip-js');
const fs = require('fs');

app.use(express.static('./logs'));
app.use(express.static('./client'));

var jsonParser = bodyParser.json({ type: 'application/json', limit: "50mb" });
var rawParser = bodyParser.raw();
var textParser = bodyParser.text({ type: 'text/plain' });
var urlencodedParser = bodyParser.urlencoded({ extended: true })
app.use(urlencodedParser); // support encoded bodies
app.use(jsonParser); // support json encoded bodies
app.use(rawParser);
app.use(textParser);
app.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));

var tOptions = {
    timeout: 50000,
    onTimeout: function(req, res) {
        if(req){
            if(req.reqDb){
                try{
                    req.reqDb.rollback(function () {});
                }catch(err){ console.log('req.reqDb.rollback',err); 
                    logger.error(err, 'req.reqDb.rollback ' + req.path);
                }
                try{
                    req.reqDb.release();
                }catch(err){ console.log('req.reqDb.release',err); 
                    logger.error(err, 'req.reqDb.release ' + req.path);
                }
            }
            logger.error('TIMEOUT', 'Timeout ' + req.path); 
        }
        res.status(503).send('Service timeout. Please retry');
    },
    onDelayedResponse: function(req, method, args, requestTime) {
        console.log(`Attempted to call ${method} after timeout`);
    },
    disable: ['write', 'setHeaders', 'send', 'json', 'end']
};
app.use(timeout.handler(tOptions));

global.db = new dbconnMyssql();
db.checkDBConn();
global.memcache = null;
if(Configs.cache_type=='memcache'){
    memcache = new Memcached(Configs.memcacheConf, Configs.memcacheOpt);
}
if(Configs.e_invoice && Configs.e_invoice.partner_api){
    var API_EInvoice = require(ROOT_PATH+'/lib/' + Configs.e_invoice.partner_api);
    var e_invoice = new API_EInvoice();
}

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type, appkey, userkey, X-Requested-With, Origin, Accept");
    res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
    next();
});

app.use(framework({}));

app.use('/api',baseC({}));
app.all('/api*', function(req, res){ 
    if(!res.resData){ 
        res.send({
            success: false,
            error: { code: 1301, message: "no data response" },
            data: "no data"
        });
    }else{
        res.json(res.resData)
    }
});
app.all('/bqrcode*', function(req, res){ 
    // If the url does not begin /?bcid= then 404.  Otherwise, we end up
    // returning 400 on requests like favicon.ico.
    if (req.url.indexOf('/bqrcode/?bcid=') != 0) {
        res.writeHead(404, { 'Content-Type':'text/plain' });
        res.end('BWIPJS: Unknown request format.', 'utf8');
    } else {
        bwipjs(req, res);
    }
});

var ver = '';
try{
    ver = fs.readFileSync('version.txt','utf8');
    ver = ver.replace('\n', '');
    ver = ver.trim();
}catch(err){
    console.log('errr read version::', err);
}

app.get('/', function(req, res){ 
    //res.send('Hello World!')
    res.redirect('/'+ver);
});
app.get('*', function(req, res){
    res.sendFile(ROOT_PATH+'/client/'+ver+'/index.html')
    // if(ver !==''){ 
    //     res.redirect(req.path.replace(ver, ver+'/#!'));
    // }else{
    //     res.redirect('/');
    // }
});

var options = {}
if (Configs.https) {
    console.log("Server running https");
    try {
        var https = {
            key: "./ssl_phongkham/private.key",
            cert: "./ssl_phongkham/certificate.crt",
            ca_bundle: "./ssl_phongkham/ca_bundle.crt"
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
server.listen(Configs.port, () => console.log('Server app listening on port '+Configs.port));