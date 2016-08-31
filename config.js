'use strict'
var uae = require('./conf/config.json');
var config = {}
    ;
var env = process.env.NODE_ENV || process.env.UAE_MODE;
config.api = {
    apihost:''
}
module.exports = config;