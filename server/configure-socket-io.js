var socketio = require('socket.io');

function configureSocketIo(server, repo) {
    var io = socketio.listen(server),
        omxViewer = null;

    // If this is a raspberry pi viewer.
    var viewerMode = process.argv[2] ? process.argv[2].toLowerCase() : 'none';
    if(viewerMode === 'omx' || viewerMode == '-omx') {
        console.log('omxplayer viewer enabled');
        omxViewer = require('./omx-viewer');
    }

    io.on('connection', function(socket) {
        console.log('connection made');
        socket.on('disconnect', function() {
            console.log('user disconnected');
        });
        socket.on('select video', function(args) {
            console.log('select video');
            console.log(args);
            //socket.broadcast.emit('select video');
            var videoDetails = repo.loadVideoDetails(args.videoId);
            socket.broadcast.emit('video selected', videoDetails);
            if(omxViewer) {
                omxViewer.videoSelected(videoDetails);
                socket.broadcast.emit('video playing');
            }
            console.log('video selected');
        });
        socket.on('play video', function(args) {
            console.log('play video');
            socket.broadcast.emit('play video');
            if(omxViewer) {
                omxViewer.play(args);
                socket.broadcast.emit('video playing');
            }
        });
        socket.on('video playing', function(args) {
            console.log('video playing');
            socket.broadcast.emit('video playing');
        });
        socket.on('pause video', function(args) {
            console.log('pause video');
            socket.broadcast.emit('pause video');
            if(omxViewer) {
                omxViewer.pause(args);
                socket.broadcast.emit('video paused');
            }
        });
        socket.on('video paused', function(args) {
            console.log('video paused');
            socket.broadcast.emit('video paused');
        });
        socket.on('stop video', function(args) {
            console.log('stop video');
            socket.broadcast.emit('stop video');
            if(omxViewer) {
                omxViewer.stop(args);
                socket.broadcast.emit('video stopped');
            }
        });
        socket.on('video stopped', function(args) {
            console.log('video stopped');
            socket.broadcast.emit('video stopped');
        });
        socket.on('seek video', function(args) {
            console.log('seek video');
            console.log(args);
            socket.broadcast.emit('seek video', args);
            if(omxViewer) {
                omxViewer.seek(args);
                socket.broadcast.emit('video seeked');
            }
        });
        socket.on('video seeked', function(args) {
            console.log('video seeked');
            socket.broadcast.emit('video seeked');
        });
        socket.on('jump video', function(args) {
            console.log('jump video');
            console.log(args);
            socket.broadcast.emit('jump video', args);
            if(omxViewer) {
                omxViewer.jump(args);
                socket.broadcast.emit('video jumped');
            }
        });
        socket.on('video jumped', function(args) {
            console.log('video jumped');
            socket.broadcast.emit('video jumped');
        });
    });
}

module.exports = configureSocketIo;