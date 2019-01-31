const express = require('express');
const http = require('http');
const path = require('path');
const proxy = require('http-proxy-middleware');

const app = express();

const port = process.env.PORT || 4200;

app.use(express.static(path.join(__dirname, '/dist/airound')));

app.use('/serverapi', proxy({ target: 'http://somnium.me:8080' }));

app.get('/*', (req, res) => res.sendFile(path.join(__dirname)));

const server = http.createServer(app);

server.listen(port, () => console.log(`Airound Client is Running at 4200 port`));


