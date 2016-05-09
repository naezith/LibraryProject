var express = require('express');
	
module.exports = function(database){
	var router = express.Router();
	var moment = require('moment');

	//MAILER
	var nodemailer = require('nodemailer');
	// create reusable transporter object using SMTP transport 

	var senderEmail = 'ytuproj@gmail.com';
	var transporter = nodemailer.createTransport({
		service: 'Gmail',
		auth: {
			user: senderEmail,
			pass: 'ytuce1337'
		}
	});

	router.get('/', function(req, res, next) {
		var user_id = req.session.user_id;
		var client_type = req.session.user_type;
		
		var item_id = req.query.item_id;
		
		database.query("SELECT * FROM borrowlist WHERE item_id = ? AND client_id = ?", [item_id, user_id], function(error, results){
			if(error){
				console.log(error);
				res.end("DB Connection Error : Selecting borrowlist, getItem.js");
			}
			else{
				if(results.length > 0){
					console.log('CALCING DEBT');
					var due = moment(results[0].due_date);
					var dept = moment().diff(due, 'days');
					if(dept > 0){
						database.query("UPDATE client SET balance = balance - ? WHERE client.id = ?", [dept, user_id], function(error, results){
							if(error){
								console.log(error);
								res.end("DB Connection Error : Selecting borrowlist, getItem.js");
							}
						});
					}
				
					database.query("DELETE FROM borrowlist WHERE item_id = ? AND client_id = ?", [item_id, user_id], function(error, results){
						if(error){
							console.log(error);
							res.end("DB Connection Error : Selecting borrowlist, getItem.js");
						}
						else{
							database.query("SELECT client.email FROM client JOIN reservelist ON client.id = reservelist.client_id WHERE item_id = ?", [item_id], function(error, results){
								if(error){
									console.log(error);
									res.end("DB Connection Error : Selecting borrowlist, getItem.js");
								}
								else{
									for(var i = 0; i < results.length; ++i){
										//Send email
										mailOptions = {
											from : senderEmail,
											to : req.body.email,
											subject : 'YTUCE Kütüphanesi',
											html : "Rezerv ettiğiniz bir kitap şu an mevcut!"
										};
										
										transporter.sendMail(mailOptions, function(error, response){
											 if(error){
												console.log(error);
												console.log("ERROR: Could not send the e-mail, please try again later!");
											 }
										});
									}
									
									database.query("DELETE FROM reservelist WHERE item_id = ? AND client_id = ?", [item_id, user_id], function(error, results){
										if(error){
											console.log(error);
											res.end("DB Connection Error : Selecting borrowlist, getItem.js");
										}
										else{
											if(dept > 0) res.render('getItem', {status: 8, dept: dept});
											else res.render('getItem', {status: 7});
										}
									});
								}
							});
						}
					});
				}
			}
		});
	});
	return router;
};
