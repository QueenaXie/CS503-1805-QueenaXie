const express = require('express');
const path = require('path');

var http = require('http');
var socketIO = require('socket.io');
var io = socketIO();
var editorSocketService = require('./services/editorSocketService')(io);

const app = express();

// connect to mongodb
const mongoose = require('mongoose');
mongoose.connect('mongodb://user:user@ds117858.mlab.com:17858/problems');

// This is to run restful API, through regular http
const restRouter = require('./routes/rest');

// This is to run static file/index.html, through regular http
const indexRouter = require('./routes/index');

// app.get('/', (req, res) => {
// 	res.send('Hello world from express!');
// });
app.use('/api/v1', restRouter);
app.use(express.static(path.join(__dirname, '../public')));

// app.listen(3000, () => {
// 	console.log('App is listening to port 3000!');
// });

// start socket connection, based on the http server
const server = http.createServer(app);
io.attach(server);
server.listen(3000);
server.on('listening', () => {
 	console.log('App is listening to port 3000!');
 });


app.use((req, res) => {
	res.sendFile('index.html', {root: path.join(__dirname, '../public')});
})