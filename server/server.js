var express = require('express');
var app = express();
var repo = require('./video-repository');
var ipUtil = require('./ip-utility');

// Serve the client directory as static files.
app.use(express.static('client/default'));
app.use('/lib', express.static('client/lib'));
app.use('/style', express.static('client/style'));
app.use('/remote', express.static('client/remote'));
app.use('/viewer', express.static('client/viewer'));

// Configure routes.
require('./configure-routes')(app);

var server = app.listen(process.env.PORT || 8080, process.env.IP || '0.0.0.0', function() {
    var host = server.address().address,
        port = server.address().port,
        addys;

    console.log('Server configured to listen at http://%s:%s', host, port);
    console.log('IP addresses:');
    addys = ipUtil.getIpAddresses();
    for (var i = 0; i < addys.length; i++) {
        console.log(addys[i].description);
    }
});

// Socket IO for remote control.
require('./configure-socket-io')(server, repo);