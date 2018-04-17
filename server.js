/*******************************************/
/*******************************************/
/************   with express   *************/
/*******************************************/
/*******************************************/
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());

const yetiRoutes = require('./api/routes/yeti-routes');
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use('/yetix', yetiRoutes);
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Listening on port ${port}`));

/*******************************************/
/*******************************************/
/************   without express   **********/
/*******************************************/
/*******************************************/
const http         = require('http');
const finalhandler = require('finalhandler');
fs = require('fs');
const plainRouter = require('./api/routes/plain-routes');

const server = http.createServer(function(req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    if ( req.method === 'OPTIONS' ) {
        res.writeHead(200);
        res.end();
        return;
    }
    plainRouter(req, res, finalhandler(req, res))
});

const port2 = process.env.PORT || 5001;
console.log('listing on 5001 too');
server.listen(port2, () => console.log(`Listening on port ${port2}`));
