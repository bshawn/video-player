var omx = require('omxcontrol'),
    repo = require('./video-repository'),
    viewer = {};

viewer.videoSelected = function(videoDetails) {
    var id = videoDetails.id;
    omx.start(repo.resolveFilePath(id));
};

viewer.play = function(args) {
    omx.sendKey('.');
};

viewer.pause = function(args) {
    omx.sendKey('p');
};

viewer.seek = function(args) {
    // TODO: Add support for delta (if possible)
    if(args.delta > 0) {
        omx.sendKey("$'\\x1b\\x5b\\x43'");
    } else {
        omx.sendKey("$'\\x1b\\x5b\\x44'");
    }
};

viewer.jump = function(args) {
    // TODO: Add jump functionality (if possible)
};

module.exports = viewer;