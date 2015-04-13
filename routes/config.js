/*
 * GET home page.
 */

module.exports = {
    
    url: 'mongodb://localhost:27017/device_management',

    db: require('mongodb').MongoClient,

    ObjectID: require('mongodb').ObjectID,

    adminUsers: [{
        username: 'admin',
        password: 'abc',
        name: 'Pushpender K. Chauhan'
    }],

    checkLogin: function(req, res) {
        if (!(req.session.login)) {
            res.redirect('/admin/login');
            res.end();
        }
    }

};
