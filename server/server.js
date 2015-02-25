/*jshint*/
/*global require*/
/*global process*/
/*global console*/
/*global __dirname*/

var express = require('express');
var app = express();
var socketio = require('socket.io');
var repo = require('./video-repository');

// Serve the client directory as static files.
app.use(express.static('client/default'));
app.use('/remote', express.static('client/remote'));
app.use('/viewer', express.static('client/viewer'));

// Configure routes.
require('./configure-routes')(app);

var server = app.listen(process.env.PORT || 3000, process.env.IP || '0.0.0.0', function() {
    var host = server.address().address,
        port = server.address().port;

    console.log('Server listening at http://%s:%s', host, port);
});

// Socket IO for separating the remote from the viewer.
var io = socketio.listen(server);
io.on('connection', function(socket) {
    console.log('connection made');
    socket.on('disconnect', function() {
        console.log('user disconnected');
    });
    socket.on('video selected', function(args) {
        console.log('video selected');
        console.log(args);
        var videoDetails = repo.loadVideoDetails(args.videoId);
        io.emit('video selected', videoDetails);
    });
    socket.on('play video', function(args) {
        console.log('play video');
        io.emit('play video');
    });
    socket.on('pause video', function(args) {
        console.log('pause video');
        io.emit('pause video');
    });
    socket.on('seek video', function(args) {
        console.log('seek video');
        console.log(args);
        io.emit('seek video', args);
    });
    socket.on('jump video', function(args) {
        console.log('jump video');
        console.log(args);
        io.emit('jump video', args);
    });
});