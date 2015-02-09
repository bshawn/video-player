var path = require('path'),
    fs = require('fs');

function configureRoutes(app) {
    app.get('/', function(req, res) {
       res.sendFile('index.html', { root: '../' });
    });
    
    app.get('/api/videos', function(req, res) {
        // Load data.
        var data = loadVideoList();
        res.send(data);
    });
    
    app.get('/api/videos/:id', function(req, res, next) {
        var id = parseInt(req.params.id, 10);
        var data = loadVideoDetails(id);
        res.send(data);
    });
    
    app.get('/api/videos/:id/stream', function(req, res, next) {
        var id = parseInt(req.params.id);
        var range = parseRange(req.headers.range);
        startVideoStream(id, res, range);
    });
}

function parseRange(rangeHeader) {
    var positions = rangeHeader.replace(/bytes=/, "").split("-"),
        start = parseInt(positions[0], 10),
        end = positions[1] ? parseInt(positions[1], 10) : 0;
        
    return { start: start, end: end };
}

function loadVideoList() {
    // Loads summary data for all videos in our list.
    return [
        { id: 1, name: 'Big Buck Bunny' },
        { id: 2, name: 'Lions' },
        { id: 3, name: 'Incredible Mara Leopard Attack' }
    ];
}

function loadVideoDetails(videoId) {
    var retVal;
    
    // Loads detailed data for a particular video.
    switch(videoId) {
        case 1:
            retVal =  { id: 1, name: 'Big Buck Bunny' };
            break;
        case 2:
            retVal = { id: 2, name: 'Lions' };
            break;
        case 3:
            retVal = { id: 3, name: 'Incredible Mara Leopard Attack' };
            break;
        default:
            break;
    }
    
    retVal.src = '/api/videos/' + retVal.id + '/stream';
    
    return retVal;
}

function startVideoStream(videoId, res, range) {
    var filePath,
        start,
        end;
        
    range = range || {};
    start = range.start;
    end = range.end;
    
    switch(videoId) {
        case 1:
            filePath = path.resolve('../', 'videos/big_buck_bunny.mp4');
            break;
        case 2:
            filePath = path.resolve('../', 'videos/Die leeutemmer.mp4');
            break;
        case 3:
            filePath = path.resolve('../', 'videos/Incredible Mara Leopard Attack21.mp4');
            break;
        default:
            return;
    }
    
    
    // Write the response header for this stream.
    fs.stat(filePath, function(err, stats) {
        var total, end, chunksize, stream;
        
        if(err) {
            console.log(err);
            return;
        }
        
        total = stats.size,
        end = end || total - 1,
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
}

function getPositions(range) {
    var positions = range.replace(/bytes/, '').split('-');
}

module.exports = configureRoutes;