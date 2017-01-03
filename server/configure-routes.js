function configureRoutes(app) {
    app.get('/', function(req, res) {
       res.sendFile('index.html', { root: '.' });
    });
}

module.exports = configureRoutes;