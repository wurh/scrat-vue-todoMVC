'use strict';

var express = require('express'),
    router = express.Router();
    //control = require('../models/db/control');

router.get('/', function (req, res, next) {
    req.url = router.options.index || '/';
    next();
});
//
//router.post('/api/register', function (req, res, next) {
//    control.opt.register(req, res);
//});

module.exports = function (options) {
    router.options = options || {};
    return router;
};