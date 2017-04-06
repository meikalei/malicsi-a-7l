const mysql = require('mysql');
const bodyParser = require('body-parser');
const connection = require('./../config/db-connection.js');

exports.searchCompetitor = (req, res) => {
	query = "CALL search_competitor(?)";

	connection.userType('A').query(query, 
		[
			"%" + req.query.search + "%"
		], (err, rows) => {
		    if(!err) {
		    	if(rows[0].length == 1) {
					return res.status(200).send(rows[0][0]);
				} else {
					return res.status(200).send(rows[0]);
				}
			} else {
				return res.status(500).send({'message' : 'Internal Server Error'});
			}
		}
	);
}

exports.getCompetitor = (req, res) => {
	query = "CALL get_competitor(?)";

	connection.userType('A').query(query, 
		[
			req.query.search
		], (err, rows) => {
		    if(!err) {
				// console.log(rows[0][0]);
				return res.status(200).send(rows[0][0]);
				
			} else {
				return res.status(500).send({'message' : 'Internal Server Error'});
			}
		}
	);
}

exports.getCompetitorTeams = (req, res) => {
	query = 'CALL get_competitor_teams(?)';

	console.log(req.session.user.id);
	connection.userType('A').query(query, 
		[
			req.session.id
		], (err, rows) => {
		    if(!err) {
				console.log(rows[0][0]);
				return res.status(200).send(rows[0][0]);				
			} else {
				return res.status(500).send({'message' : 'Internal Server Error'});
			}
	});
}

exports.editCompetitor = (req,res) => {
	currentUser = req.session.user;
	query = "CALL edit_competitor(?,?,?,?,?,?)";
	query1 = "CALL get_competitor(?)";
	
	console.log(req.body.id);
	connection.userType('A').query(query,
		[
			req.body.birthday,
			req.body.first_name, 
			req.body.last_name,  
			req.body.nickname, 
			req.body.sex, 
			req.body.id
		], (err, rows) => {
			if(!err) {
				console.log(req.body);
				connection.userType('A').query(query1, 
					[
						req.body.id
					], (err, rows) => {
						if(!err) {
							// console.log('Here');
							// console.log(rows[0][0]);
							return res.status(200).send(rows[0][0]);
						}
						else{
							return res.status(500).send({'message' : 'Internal Server Error'});
						}
					}
				);
			} else {
				return res.status(501).send({ 'message' : 'Not implemented'});
			}
		}
	);
}
