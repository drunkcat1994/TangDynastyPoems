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
		action:action,
		regSuccess: req.flash('regSuccess').toString(),
		loginSuccess: req.flash('loginSuccess').toString(),
		regError: req.flash('regError').toString(),
		loginError: req.flash('loginError').toString()
	}
	res.render('register',context);
});
router.post('/register',function(req,res) {
	var username = req.body.username;
	var password1 = req.body.password1;
	var password2 = req.body.password2;
	if(password1 !== password2) {
		req.flash('error','两次密码输入不相同');
		return res.redirect('/register');
	}
	var searchStr = 'SELECT user_name FROM users WHERE user_name = "' +
									username + '";';
	connection.query(searchStr,function(err,rows,fields) {
			if(err) {
				throw err;
			}
			if(rows.length === 1) {
				req.flash('regError','用户已存在');
				return res.redirect('/register');	
			} else {
				var insertStr = 'INSERT INTO users ' +
								'VALUES ( "' + username +  
										'","' + password1 + 
										'"," " );';
				connection.query(insertStr,function(err,rows,fields) {
					if(err) {
						req.flash('regError',err);
						return res.redirect('/register');
					}
					req.session.username = username;
					req.flash('regSuccess','注册成功');
					res.redirect('/home');
				});
			}
		});
});
//取得所有注册的用户名，遍历用户名，查询相应用户的诗歌信息，添加到模板的上下文中。
router.get('/home',function(req,res) {
	var username = req.session.username,
		entry,action;
	//console.log(username);
	//console.log(req.session.username.toString());//因为req.session 和cookie-parser相关
	if(username) {
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
				items:rows,
				regSuccess:req.flash('regSuccess').toString(),
				loginSuccess:req.flash('loginSuccess').toString(),
				regError:req.flash('regError').toString(),
				loginError:req.flash('loginError').toString()
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