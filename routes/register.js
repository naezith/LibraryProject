var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
	var data = { errors: req.session.error };
	req.session.error = undefined;
	res.render('register', data);
});

module.exports = router;
