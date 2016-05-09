var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
	var data = { error: req.session.error };
	req.session.error = undefined;
	
	res.render('login', data);
});

module.exports = router;
