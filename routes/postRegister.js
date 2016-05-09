var express = require('express');
var crypto = require('crypto');
var custom_utils = require('./custom_utils.js');

module.exports = function(connection){
	var router = express.Router();
	
	router.get('/', function(req, res, next) {
	  res.send('respond with a resource');
	});

	router.post('/', function(req, res, next){
		var required = {
			user_id: null,
			user_type: null,
			email: null
		};
		
		var errors = custom_utils.validation(req.body, required);
		
		if(errors.length > 0){
			req.session.error = errors;
			res.redirect(req.header('Referer') || '/');
			return;
		}
		
		
		var user_type = req.session.user_type;
		
		connection.query("INSERT INTO client (id, balance, type, email) VALUES (?, ?, ?, ?)", 
			[req.body.user_id, 50, req.body.user_type, req.body.email], function(err, results){
			if(err){
				console.log(err);
				req.session.error = ["MYSQL table: user Connection"];
				res.redirect(req.header('Referer') || '/');
			}else{
				res.render('postRegister', {user_id: req.body.user_id, user_type: req.body.user_type});
			}
		});
	});
	
	return router;
};
