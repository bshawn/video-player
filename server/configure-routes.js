function configureRoutes(app) {
    app.get('/', function(req, res) {
       res.sendFile('index.html', { root: './web-client' });
    });
}

module.exports = configureRoutes;