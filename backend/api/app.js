"use strict";
let express = require("express");
let path = require("path");
let favicon = require("static-favicon");
let logger = require("morgan");
let cookieParser = require("cookie-parser");
let bodyParser = require("body-parser");

let routes = require("./routes/index");
const session = require("express-session");

let app = express();
let secretString = require("./config/serverConfig").cookieKey;
//session setup
app.use(session({
	"secret": secretString,
	"cookie": {
		"maxAge": 186000000,
	},
	"path": "/",
}));
app.use(express.static('public'));
app.use(favicon());
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", routes);

/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
	let err = new Error("Not Found");
	err.status = 404;
	next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get("env") === "development") {
	app.use(function(err, req, res) {
		res.status(err.status || 500);
		res.json({
			message: err.message,
			error: err
		});
	});
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res) {
	res.status(err.status || 500);
	res.json({
		message: err.message,
		error: err
	});
});


module.exports = app;
