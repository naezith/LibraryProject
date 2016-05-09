var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
	req.session.error = undefined;
	req.session.user_id = undefined;
	req.session.user_type = undefined;
	res.redirect('/');
});

module.exports = router;
