var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	var data = { user_id: req.session.user_id, user_type: req.session.user_type, error: req.session.error };
	req.session.error = undefined;
	res.render('index', data);
});

module.exports = router;
