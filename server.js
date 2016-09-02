var express = require('express');
var bodyParser = require('body-parser');
var connectFlash = require('connect-flash');
var session = require('express-session');
var routes = require('./routes/routes');
var cors = require('cors');
var path = require('path');
//var morgan = require('morgan');
var app = express();

var handlebars = require('express3-handlebars')
			.create({
				defaultLayout:'main',
				helpers:{
					section:function(name,options){
						if(!this._sections) {
							this._sections = {};
						}
						this._sections[name]= options.fn(this);
						return null;
					},
					if:function(conditional,options) {
						if(conditional) {
							return options.fn(this);
						} else {
							return options.reverse(this);
						}
					}
				}});

app.engine('handlebars',handlebars.engine);
app.set('view engine','handlebars');
app.set('views',path.join(__dirname,'views'));

//app.use(morgan('common'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extened:false}));
app.use(express.static(path.join(__dirname,'public')));
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}));
app.use(routes);

app.listen(8000,function() {
	console.log('app is listenting');
});
