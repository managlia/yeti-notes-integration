/*******************************************/
/*******************************************/
/************   with express   *************/
/*******************************************/
/*******************************************/
// const express = require('express');
// const bodyParser = require('body-parser');
// const app = express();
//
// app.use(bodyParser.json());
//
// const yetiRoutes = require('./api/routes/yeti-routes');
// app.use(function(req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     next();
// });
// app.use('/yetix', yetiRoutes);
// const port = process.env.PORT || 5000;
// app.listen(port, () => console.log(`Listening on port ${port}`));

/*******************************************/
/*******************************************/
/************   without express   **********/
/*******************************************/
/*******************************************/
const http = require('http');
const finalhandler = require('finalhandler');
const fs = require('fs');
// use with "gulp watch": const plainRouter = require('./dist/routes/plain-routes');
const plainRouter = require('./api/routes/plain-routes'); //for local using "npm start"

const server = http.createServer(function (req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Cache-Control, Accept, X-TEST-EXTRA");
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }
    plainRouter(req, res, finalhandler(req, res))
});

const port2 = 5001;
server.listen(port2, () => console.log(`Listening on port ${port2}`));
