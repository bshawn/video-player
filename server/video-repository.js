var path = require('path'),
    fs = require('fs'),
    _ = require('lodash'),
    errors = require('./errors/errors'),
    videos = require('./videos/videos.json'),
    repo = {};

var errMsg = {
    filePathNotFound: 'Could not resolve file path for video ',
    videoDetailsNotFound: 'Could not load details for video ',
    fileStatError: 'Could not load stats for video '
};

repo.loadVideoList = function () {
    // Loads summary data for all videos in our list.
    var summaryList;

    try {
        summaryList = _.map(videos.list, function(vid) {
            return {
                id: vid.id,
                name: vid.name
            };
        });
    } catch(err) {
        console.log(err);
        console.log(err.stack);
        throw(new errors.ListLoadError());
    }

    return summaryList;
};

repo.loadVideoDetails = function (videoId) {
    var streamUrl = '/api/videos/' + videoId + '/stream';

    // Loads detailed data for a particular video.
    switch(videoId) {
        case 1:
            return {
                id: videoId,
                name: 'Big Buck Bunny',
                src: streamUrl
            };
        case 2:
            return {
                id: videoId,
                name: 'Lions',
                src: streamUrl
            };
        case 3:
            return {
                id: videoId,
                name: 'Incredible Mara Leopard Attack',
                src: streamUrl
            };
        default:
            throw(new errors.NotFoundError(errMsg.videoDetailsNotFound + videoId));
    }
};

repo.startVideoStream = function (videoId, res, range) {
    var filePath,
        start,
        end;

    range = range || {};
    start = range.start;
    end = range.end;

    filePath = resolveFilePath(videoId);

    // Write the response header for this stream.
    fs.stat(filePath, function(err, stats) {
        var total, end, chunksize;

        if(err) {
            console.log(err);
            throw(new Error(errMsg.fileStatError + videoId + '. Details: ' + err.toString()));
        }

        total = stats.size;
        end = end || total - 1;
        chunksize = (end - start) + 1;

        res.writeHead(206, {
            'Content-Range': 'bytes ' + start + '-' + end + '/' + total,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunksize,
            'Content-Type': 'video/mp4'
        });

        fs.createReadStream(filePath, { start: start, end: end })
            .on('open', function() {
                this.pipe(res);
            }).on('error', function(err) {
                res.end(err);
            });
    });
};

function resolveFilePath(videoId) {
    switch(videoId) {
        case 1:
            return path.resolve(__dirname, 'videos/', 'big_buck_bunny.mp4');
        case 2:
            return path.resolve(__dirname, 'videos/', 'Die leeutemmer.mp4');
        case 3:
            return path.resolve(__dirname, 'videos/', 'Incredible Mara Leopard Attack21.mp4');
        default:
            throw(new errors.NotFoundError(errMsg.filePathNotFound + videoId));
    }
}

module.exports = repo;
