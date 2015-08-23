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
        summaryList = getVideoSummaryList();
    } catch(err) {
        throw(new errors.ListLoadError());
    }

    return summaryList;
};

function getVideoSummaryList() {
    return _.map(videos.list, mapVideoToVideoSummary);
}

function mapVideoToVideoSummary(vid) {
    return {
        id: vid.id,
        name: vid.name
    };
}

repo.loadVideoDetails = function (videoId) {
    var streamUrl = '/api/videos/' + videoId + '/stream';
    var vid = {};

    // Loads detailed data for a particular video.
    vid = getVideoById(videoId);

    if(!vid) {
        throw(new errors.NotFoundError(errMsg.videoDetailsNotFound + videoId));
    }

    return {
        id: videoId,
        name: vid.name,
        src: streamUrl
    };
};

function getVideoById (videoId) {
    return _.findWhere(videos.list, { id: videoId });
}

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
    var vid = getVideoById(videoId);
    if(!vid) {
        throw(new errors.NotFoundError(errMsg.videoDetailsNotFound + videoId));
    }

}

module.exports = repo;
