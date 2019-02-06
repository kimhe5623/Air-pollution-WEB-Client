const http2 = require('spdy');
const logger = require('morgan');
const fs = require('fs');

const express = require('express');
const path = require('path');
const proxy = require('http-proxy-middleware');

const app = express();

const port = process.env.PORT || 4200;

/********/
app.use(logger('dev'));

var options = {
    key: fs.readFileSync('./keys/server.key'),
    cert: fs.readFileSync('./keys/server.crt')
};

/********/

app.use(express.static(path.join(__dirname, '/dist/airound')));

app.use('/serverapi', proxy({ target: 'http://somnium.me:8080' }));

app.get('/*', (req, res) => res.sendFile(path.join(__dirname)));

const server = http2.createServer(options, app);

server.listen(port, () => console.log(`Airound Client is listening on https://localhost:4200. You can open the URL in the browser`));


