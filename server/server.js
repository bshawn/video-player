var express = require('express');
var app = express();

// Configure routes.
require('./configure-routes')(app);

// Serve static files from app and movies directories.
app.use('/client', express.static('client'));
app.use('/movies', express.static('movies'));

// Handle 404s.
app.use(function(req, res, next) {
   res.status(404).send('Unable to locate requested resource');
   
   // By not calling next(), we are terminating the pipeline.
});

var server = app.listen(process.env.PORT || 3000, process.env.IP || '0.0.0.0', function() {
    var host = server.address().address,
        port = server.address().port;
        
    console.log('Server listening at http://%s:%s', host, port);
});