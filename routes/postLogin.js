var express = require('express');
var crypto = require('crypto');

module.exports = function(connection){
	var router = express.Router();
	
	router.get('/', function(req, res, next){
		res.end('403 Forbidden');
	});
	
	router.post('/', function(req, res, next){
		connection.query('SELECT * FROM client WHERE id = ?', [req.body.user_id], function(err, results, fields){
				if(err){
					console.log(err);
					res.end("ERROR: Could not get the user from the database, please try again later!");
				}
				else{
					if(results !== null && results.length === 1){
						req.session.user_id = results[0].id;
						req.session.user_type = results[0].type;
						res.redirect('/');
					}else{
						res.end("ERROR: There is no such user!");
					}
				}
		});
	});
	return router;
};
