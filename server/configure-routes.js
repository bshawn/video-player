/*jshint*/
/*global require*/
/*global console*/
/*global module*/
/*global __dirname*/

var path = require('path'),
    fs = require('fs'),
    repo = require('./video-repository'),
    errors = require('./errors/errors');

function configureRoutes(app) {
    app.get('/api/videos', function(req, res) {
        // Load data.
        var data;

        try {
            data = repo.loadVideoList();
        } catch(err) {
            console.log(err);
            res.status(err.number).send(err.message);
        }

        res.status(200).send(data);
    });

    app.get('/api/videos/:id', function(req, res) {
        var id = parseInt(req.params.id, 10);
        var data;
        try {
            data = repo.loadVideoDetails(id);
        } catch(err) {
            console.log(err);
            res.status(err.number).send(err.message);
        }
        res.status(200).send(data);
    });

    app.get('/api/videos/:id/stream', function(req, res) {
        var id = parseInt(req.params.id);
        var range = parseRange(req.headers.range);
        try {
            repo.startVideoStream(id, res, range);
        } catch(err) {
            console.log(err);
        }
    });

    app.post('/api/videos', function(req, res) {

    });

    app.put('/api/videos/:id', function(req, res) {

    });
}

function parseRange(rangeHeader) {
    var positions,
        start,
        end;

    if(!rangeHeader) {
        return;
    }
    positions = rangeHeader.replace(/bytes=/, "").split("-");
    start = parseInt(positions[0], 10);
    end = positions[1] ? parseInt(positions[1], 10) : 0;

    return { start: start, end: end };
}

module.exports = configureRoutes;