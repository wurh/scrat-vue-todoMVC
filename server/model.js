'use strict'

var request = require('superagent'),
    q = require('q');


function fetchListData(url) {
    var deferred = q.defer(),
        timeout = 5;
    request.get(url)
        .timeout(timeout * 1000)
        .buffer()
        .end(function (err, res) {
            //console.log(res);
            err = err || res.error;
            if (err) {
                deferred.reject(err);
            } else {
                deferred.resolve(res.text);
            }
        });
    return deferred.promise;
}

module.exports = {
    fetchListData: fetchListData
};