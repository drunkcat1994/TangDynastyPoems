var express = require('express');
var mysql = require('mysql');

var app = express();

var connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: '123456789',
	database: 'poemsdata'
});
connection.connect();
/*
var sqlString = 'CREATE TABLE Orders (' + 
				' order_num   INTEGER   NOT NULL,'+
				' order_data   DATETIME   NOT NULL,'+
				' cust_id   CHAR(10)   NOT NULL '+
				');';
connection.query(sqlString,function(err,rows,fields) {
	if(err) {
		console.error('error connecting' + err.stack);
		return;
	}
	console.log('create new table Orders success');
});

var addData = 'INSERT INTO Orders(order_num, order_data, cust_id)' +
			'VALUES ( "200007","2012-05-01","1000000001" );';
connection.query(addData,function(err,rows,fields) {
	if(err) {
		console.error('error connection' + err.stack);
		return;
	}
	console.log('add new data');
});
*/
var searchStr = "SELECT user_pwd "+
				"FROM users " +
				"WHERE user_name = 'chensi';";
connection.query(searchStr,function(err,rows,fields) {
		if(err) {
			throw err;
		}
		console.log(rows[0].user_pwd); 
});

connection.end();
app.listen(8000,function() {
	console.log('app is listening');
});
