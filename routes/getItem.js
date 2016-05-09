var express = require('express');
	
module.exports = function(database){
	var router = express.Router();
	var moment = require('moment');

	router.get('/', function(req, res, next) {
		var user_id = req.session.user_id;
		var client_type = req.session.user_type;
		
		var item_id = req.query.item_id;
		database.query("SELECT * FROM borrowlist WHERE item_id = ?", [item_id], function(error, results){
			if(error){
				console.log(error);
				res.end("DB Connection Error : Selecting borrowlist, getItem.js");
			}
			else{
				// RESERVE
				if(results.length != 0){ // Already taken
					var borrow_info = results[0]; // id, client_id, item_id, due_date
					if(borrow_info.client_id == user_id){
						res.render('getItem', {borrow_info: borrow_info, status: 5});
					}
					else{
						database.query("SELECT * FROM reservelist WHERE item_id = ?", [item_id], function(error, results){
							if(error){
								console.log(error);
								res.end("DB Connection Error : Inserting for reservation");
							}
							else{
								if(results.length != 0){
									if(results[0].client_id == user_id) 
										res.render('getItem', {status: 1});
									else 
										res.render('getItem', {status: 6});
								}
								else{
									database.query("INSERT INTO reservelist (client_id, item_id) VALUES(?, ?)", 
										[user_id, item_id], function(error, results){
										if(error){
											console.log(error);
											res.end("DB Connection Error : Inserting for reservation");
										}
										else{
											res.render('getItem', {status: 0});
										}
									});
								}
							}
						});
					}
				}
				
				// BORROW
				else {
					database.query("SELECT * FROM borrowlist WHERE client_id = ?", 
						[user_id], function(error, results){
						if(error){
							console.log(error);
							res.end("DB Connection Error : Getting borrowlist");
						}
						else{
							if((client_type == 1 && results.length >= 6) || // Teacher
								((client_type == 1 || client_type == 2) && results.length >= 3)) { // Student(0) or Official(1)
								res.render('getItem', {status: 2});
							}
							else { 
								// Failed to bring back?
								var curr_date = moment().format('YYYY-MM-DD');
								var can_borrow = true;
								
								for(var i = 0; i < results.length; ++i){
									if(results[i].due_date < curr_date){
										can_borrow = false;
									}
								}
								
								if(!can_borrow){
									res.render('getItem', {status: 3});
								}
								else{
									// Borrow it
									var months = client_type == 1 ? 3 : 1;
									database.query("INSERT INTO borrowlist (client_id, item_id, due_date, took_date) VALUES(?, ?, DATE_ADD(?, INTERVAL ? MONTH), ?)", 
										[user_id, item_id, curr_date, months, curr_date], function(error, results){
										if(error){
											console.log(error);
											res.end("DB Connection Error : Inserting for reservation");
										}
										else{
											res.render('getItem', {months: months, status: 4});
										}
									});
								}
							}
						}
					});
				}
			}
		});
	
	});
	return router;
};
