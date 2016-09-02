var express = require('express');
var mysql = require('mysql');
var router = express.Router();
var connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: '123456789',
	database: 'poemsData'
});
connection.connect();

router.get('/',function(req,res) {
	var username = req.session.username;
	if(username) {
		res.redirect('/home');
	} else {
		var context = {
			entry: 'login',
			action: 'register'
		}
	}
	res.render('login',context);
});
router.post('/',function(req,res) {
	var username = req.body.user_name;
	var password = req.body.user_pwd;
	var searchStr = "SELECT user_pwd "+
					"FROM users " +
					"WHERE user_name = '" +
					username + "';";
	connection.query(searchStr,function(err,rows,fields) {
		if(err) {
			throw err;
		}
		if(rows[0].user_pwd == password) {
			res.json({success:1});
			//res.redirect('/edit');
		} else {
			res.json({success:0});
			//res.redirect('/');
		}
	});
});

router.get('/register',function(req,res) {
	var username = req.session.username;
	if(username) {
		entry = 'logout',
		action = 'edit'
	} else {
		entry = 'login',
		action = 'register'
	}
	var context = {
		entry:entry,
		action:action
	}
	res.render('register',context);
});
router.post('/register',function(req,res) {
	var username = req.body.user_name;
	var password = req.body.user_pwd;
	var searchStr = 'SELECT user_name FROM users WHERE user_name = "' +
									username + '";';
	connection.query(searchStr,function(err,rows,fields) {
			if(err) {
				throw err;
			}
			if(rows.length === 1) {
				res.json({success:0});		
			} else {
				var insertStr = 'INSERT INTO users ' +
								'VALUES ( "' + username +  
										'","' + password + 
										'"," " );';
				connection.query(insertStr,function(err,rows,fields) {
					if(err) {
						throw err;
					}
					res.json({
						success:1
					});
				});
			}
		});
});
//取得所有注册的用户名，遍历用户名，查询相应用户的诗歌信息，添加到模板的上下文中。
router.get('/home',function(req,res) {
	var session = req.session,
		entry,action;
	if(session && session['username']) {
		entry = 'logout',
		action = 'edit'
	} else {
		entry = 'login',
		action = 'register'
	}
	var searchStr = 'SELECT poem_name,poem_author,poem_content,poem_details ' +
					'FROM poems;' ;
	connection.query(searchStr,function(err,rows,fields) {
			if(err) {
				throw err;
			}
			var context = {
				entry:entry,
				action:action,
				items:rows
			};
				
			res.render('home',context);
		});
});
router.get('/home_announcements',function(req,res) {
	var session = req.session,
		entry,action;
	if(session && session['username']) {
		entry = 'logout',
		action = 'edit'
	} else {
		entry = 'login',
		action = 'register'
	}
	var context = {
		entry: entry,
		action: action,
	}
	res.render('home_announcements',context);
});
router.get('/edit',function(req,res) {
	var username = req.session.username;
	var context;
	if(username) {
		context = {
			entry: 'logout',
			action: 'edit'
		};
	} else {
		context = {
			entry: 'login',
			action: 'edit'
		};
	}
	res.render('edit',context);
});
router.post('/edit',function(req,res) {
	var userName = req.session.username;
	var poemName = req.body.poem_name;
	var poemAuthor = req.body.poem_author;
	var poemContent = req.body.poem_content;
	var insertStr = "INSERT INTO poems " +
					"VALUES ( '" + 
					 poemName +
					"', '" + userName +
					"', '" + poemContent +
					"', ' ', '" +
					poemAuthor + "');"; 
	connection.query(insertStr,function(err,rows,fields) {
		if(err) {
			throw err;
		}
		res.json({success:1});
	});
});
module.exports = router;