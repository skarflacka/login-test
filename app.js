var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mysql = require('mysql');
var session = require('express-session');

var port = 1337;

var connection = mysql.createConnection({
  host: 'localhost',
  user: 'admin',
  password: 'superhacker1',
  database: 'login'
});

//Session, cookies man
app.use(session({
  secret: 'asdfafskjhsdfkjhsdf',
  resave: 'false',
  saveUninitialized: 'false'
}));
//Static file server
app.use(express.static(__dirname));
//Need this to parse body
app.use(bodyParser.urlencoded({ extended: true }));
//Log cookie test

app.get('/login', function(req, res) {
  res.redirect('/login.html');
});

app.post('/login.html', function(req, res) {
  connection.query('SELECT * FROM users WHERE username="' + req.body.username + '" limit 1;', function(err, rows, fields) {
    if (err) {
      console.log(err.code);
    }
    //Check username and password.
    if (rows[0] === undefined) {
      console.log('Wrong username or password.');
      res.redirect('/login.html');
    } else if (req.body.username === rows[0].username && req.body.password === rows[0].password) {
      console.log('Logged in!');
      res.redirect('/');
    } else {
      console.log('Wrong username or password.');
      res.redirect('/login.html');
    }
  });
});

app.post('/register.html', function(req, res) {
  connection.query('INSERT INTO users VALUE ( "' + req.body.register_username.toLowerCase() +
    '", "' + req.body.register_password + '");', function(err, rows, fields) {
      //Check for duplicate
      if (err.code === 'ER_DUP_ENTRY') {
        console.log('Duplicate desu.');
      }
  });
  res.redirect('/login.html');
});

app.listen(port);
console.log('Listening on port: ' + port);
