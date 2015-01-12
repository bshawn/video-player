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
        var id = parseInt(req.params.id);
        var data = loadVideoDetails(id);
        res.send(data);
    });
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
    // Loads detailed data for a particular video.
    switch(videoId) {
        case 1:
            return { id: 1, name: 'Big Buck Bunny', src: 'videos/big_buck_bunny.mp4' };
        case 2:
            return { id: 2, name: 'Lions', src: 'videos/Die leeutemmer.mp4' };
        case 3:
            return { id: 3, name: 'Incredible Mara Leopard Attack', src: 'videos/Incredible Mara Leopard Attack21.mp4' };
    }
}

module.exports = configureRoutes;