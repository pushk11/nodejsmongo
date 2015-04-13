var express = require('express');
var session = require('express-session');
var http = require('http');
var path = require('path');

var bodyParser = require('body-parser');

var app = express();

var _ = require('underscore');
var config = require('./routes/config');

var cors = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    next();
};

//////////////// configure ///

// all environments
app.set('port', process.env.PORT || 4300);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(session({
    genuuid: function() {
        return genuuid();
    },
    secret: 'ookkkk'
}));

app.use(cors);

// parse application/x-www-form-urlencoded 
app.use(bodyParser.urlencoded({
    extended: false
}));

// parse application/json 
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
    app.use(function(err, req, res, next) {
        console.error(err.stack);
        res.status(500).send('Something broke!');
    });
}
/////////

var admin = require('./routes/admin');

app.get('/admin', admin.home);
app.get('/admin/add', admin.addDevice);
app.post('/admin/save', admin.addDeviceSave);
app.get('/admin/edit/:id', admin.editDevice);
app.post('/admin/edit/save', admin.editDeviceSave);
app.get('/admin/delete/:id', admin.removeDevice);
app.post('/admin/device/search', admin.searchDevice);

app.get('/admin/login', function(req, res) {
    if (req.session.login) {
        res.redirect('/admin');
    } else {
        res.render('login', {
            tab: 'login',
            err: false
        });
    }
});

app.get('/admin/logout', function(req, res) {

    req.session.destroy(function(err) {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/admin/login');
        }
    });

});

app.post('/admin/login/validate', function(req, res) {

    var user = req.body.username;
    var pass = req.body.userpass;

    var found = _.where(config.adminUsers, {
        username: user,
        password: pass
    });
    if (found.length) {
        console.log(found);
        var session = req.session;

        session.email = found[0].username;
        session.login = true;

        res.redirect('/admin');
    } else {
        res.render('login', {
            tab: 'login',
            err: 'Invalid Username/Password'
        });
    }
});

////
http.createServer(app).listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});
