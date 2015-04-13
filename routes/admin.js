/*
 * GET home page.
 */

var config = require('./config');
var MongoClient = config.db;
var table = 'devices';

var _ = require('underscore');

var Admin = {

    home: function(req, res) {
        console.log("inside admin template");

        config.checkLogin(req, res);

        //console.log(config);

        MongoClient.connect(config.url, function(err, db) {
            if (!err) {
                console.log("We are connected");
            }

            Admin.getResults(req, res, db);
        });
    },

    getResults: function(req, res, db, search) {

        var search = (search) ? search : {};
        var keyword = (req.body) ? req.body.keyword : null;

        db.collection(table).find(search).sort({
            '_id': -1
        }).limit(100).toArray(function(err, result) {
            //console.dir(result);
            res.render('index', {
                'data': result,
                keyword: keyword,
                tab: 'devices'
            });
            return false;
        });
    },

    addDevice: function(req, res) {
        config.checkLogin(req, res);
        res.render('add_device', {
            tab: 'devices', err : '', data : {}
        });
    },

    addDeviceSave: function(req, res) {
        config.checkLogin(req, res);

        console.log("inside add");
        //console.log(req.body);
        var input = req.body;

        MongoClient.connect(config.url, function(err, db) {
            if (err) {
                res.end({
                    "error": "DB connection error: Couldn't connect"
                });
                return false;
            }

            var insertData = {
                reg_id: input.reg_id,
                name: input.name,
                model: input.model,
                os: input.os,
                version: input.version,
                assigned_to: input.assigned_to // pick user email from logged in user session
            };

            db.collection(table).insert(insertData, function(err, result) {
                if (!err) {
                    console.log(result);
                    res.redirect('/admin');
                } else {
                    console.log(err);
                    console.log(insertData);
                    res.render('add_device', {
                        tab: 'devices', err : 'Error: Duplicate Registration ID', data : insertData
                    });
                }
            });

        });

    },

    editDevice: function(req, res) {
        config.checkLogin(req, res);

        var id = req.params.id;
        //console.log(id);

        MongoClient.connect(config.url, function(err, db) {
            if (err) {
                res.end({
                    "error": "DB connection error: Couldn't connect"
                });
                return false;
            }

            db.collection(table).find({
                _id: config.ObjectID(id)
            }).toArray(function(err, items) {
                if (!err) {
                    res.render('edit_device', {
                        'data': items[0],
                        tab: 'devices',
                        err: ''
                    });
                }
            });

        });
    },

    editDeviceSave: function(req, res) {
        config.checkLogin(req, res);

        console.log("inside edit save");
        //console.log(req.body);
        var input = req.body;

        MongoClient.connect(config.url, function(err, db) {
            if (err) {
                res.end({
                    "error": "DB connection error: Couldn't connect"
                });
                return false;
            }

            var data = {
                reg_id: input.reg_id,
                name: input.name,
                model: input.model,
                os: input.os,
                version: input.version,
                assigned_to: input.assigned_to // pick user email from logged in user session
            };

            db.collection(table).update({
                _id: config.ObjectID(input.id)
            }, data, function(err, result) {
                if (!err) {
                    res.redirect('/admin');
                } else {
                    
                    res.render('edit_device', {
                        data: data,
                        tab: 'devices',
                        err: 'Error: Duplicate Registration ID'
                    });
                }
            });

        });

    },

    removeDevice: function(req, res) {
        config.checkLogin(req, res);

        console.log("inside remove");
        var id = req.params.id;
        //console.log(id);

        MongoClient.connect(config.url, function(err, db) {
            if (err) {
                res.end({
                    "error": "DB connection error: Couldn't connect"
                });
                return false;
            }

            db.collection(table).remove({
                _id: config.ObjectID(id)
            }, function(err, result) {
                if (!err) {
                    res.redirect('/admin');
                }
            });

        });

    },

    searchDevice: function(req, res) {
        config.checkLogin(req, res);

        console.log("inside search");

        //console.log(id);

        MongoClient.connect(config.url, function(err, db) {
            if (err) {
                res.end({
                    "error": "DB connection error: Couldn't connect"
                });
                return false;
            }

            var keyword = req.body.keyword;
            var search = {};
            if (keyword) {
                var pattern = new RegExp('^.*' + keyword + '.*$', 'i');
                search = {
                    '$or': [
                    { name: pattern }, 
                    { assigned_to: pattern},
                    { reg_id: pattern}
                    ]
                };
            };

            //console.log(search);

            Admin.getResults(req, res, db, search);

        });
    },

};

module.exports = Admin;
