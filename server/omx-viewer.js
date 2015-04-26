var omx = require('omxcontrol'),
    viewer = {};

viewer.videoSelected = function(videoDetails) {
    var id = videoDetails.id;
    omx.quit();
    omx.start('http://localhost:8080' + videoDetails.src);
};

viewer.play = function(args) {
    omx.play();
};

viewer.pause = function(args) {
    omx.pause();
};

viewer.stop = function(args) {
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

viewer.jump = function(args) {
    // TODO: Add jump functionality (if possible)
};

module.exports = viewer;