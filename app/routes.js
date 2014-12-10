module.exports = function(app) {

	// Anything but the AngularJS routes (/view) should render index.
	app.all('/*', function(req, res, next) {
		if (req.url.split('/')[1] !== 'views') {
			res.render('index');
		} else {
			next();
		}
	});

	// Front-end routes to handle all AngularJS requests.
	app.get('/views/:partial', function(req, res, next) {
		res.render('views/' + req.params.partial);
	});
};
