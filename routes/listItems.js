var express = require('express');
	
module.exports = function(database){
	var router = express.Router();
	var moment = require('moment');
	
	router.get('/', function(req, res, next) {
		database.query("SELECT * FROM items", null, function(error, results){
			res.render('listItems', {items: results});
		});
	});
	
	return router;
};