var express = require('express');
var app = express();
var socketio = require('socket.io');
var repo = require('./video-repository');

// If this is a raspberry pi viewer.
var viewerMode = process.args[3] || 'None';
if(viewerMode.toLowerCase() === 'omx') {
    var omxViewer = require('./omx-viewer')();
}

// Serve the client directory as static files.
app.use(express.static('client/default'));
app.use('/remote', express.static('client/remote'));
app.use('/viewer', express.static('client/viewer'));

// Configure routes.
require('./configure-routes')(app);

var server = app.listen(process.env.PORT || 8080, process.env.IP || '0.0.0.0', function() {
    var host = server.address().address,
        port = server.address().port;

    console.log('Server listening at http://%s:%s', host, port);
});

// Socket IO for remote control.
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
        if(omxViewer) {
            omxViewer.videoSelected(videoDetails);
        }
    });
    socket.on('play video', function(args) {
        console.log('play video');
        io.emit('play video');
        if(omxViewer) {
            omxViewer.play(args);
        }
    });
    socket.on('pause video', function(args) {
        console.log('pause video');
        io.emit('pause video');
        if(omxViewer) {
            omxViewer.pause(args);
        }
    });
    socket.on('seek video', function(args) {
        console.log('seek video');
        console.log(args);
        io.emit('seek video', args);
        if(omxViewer) {
            omxViewer.seek(args);
        }
    });
    socket.on('jump video', function(args) {
        console.log('jump video');
        console.log(args);
        io.emit('jump video', args);
        if(omxViewer) {
            omxViewer.jump(args);
        }
    });
});