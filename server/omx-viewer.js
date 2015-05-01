var omx = require('omxcontrol'),
    viewer = {};

viewer.videoSelected = function(videoDetails) {
    omx.quit();
    omx.start('http://localhost:8080' + videoDetails.src);
};

viewer.play = function() {
    omx.play();
};

viewer.pause = function() {
    omx.pause();
};

viewer.stop = function() {
    omx.quit();
};

viewer.seek = function(args) {
    // TODO: Add support for delta (if possible)
    if(args.delta > 0) {
        omx.forward();
    } else {
        omx.backward();
    }
};

viewer.jump = function() {
    // TODO: Add jump functionality (if possible)
};

module.exports = viewer;