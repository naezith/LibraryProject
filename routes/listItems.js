var express = require('express');
	
module.exports = function(database){
	var router = express.Router();
	var moment = require('moment');
	
	router.get('/', function(req, res, next) {
		database.query('SELECT items.*, ' +
						'(SELECT COUNT(*) = 0 FROM borrowlist WHERE borrowlist.item_id = items.id) AS available, ' + 
						'(SELECT COUNT(*) = 1 FROM borrowlist WHERE borrowlist.item_id = items.id AND borrowlist.client_id = ?) AS borrowed_by_me ' +
						'FROM items', 
			[req.session.user_id], function(error, results){
			res.render('listItems', {items: results});
		});
	});
	
	return router;
};