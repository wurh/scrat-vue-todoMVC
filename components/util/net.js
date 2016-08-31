'use strict';

var config = require('config/a-config.js');

//获取URL参数
var getQueryString = function (name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = (decodeURIComponent(window.location.search) || decodeURIComponent(window.location.hash)).substr(1).match(reg);
    if (r != null) return decodeURI(r[2]);
    return "";
}

// 网络请求
var net = function (url, type, data, successFn, errorFn) {
    $.ajax({
        type: type || 'get',
        url: url || '',
        data: data || {},
        dataType: 'json',
        cache: false,
        success: function (data) {
            if (data && parseInt(data.code) == config.code.common.succ) {
                if (typeof successFn === 'function') {
                    successFn(data.data);
                } else {
                    console.log('successFn undefine');
                }
            } else {
                console.log('code: ' + data.code + 'msg: ' + data.msg);
                if (typeof errorFn === 'function') {
                    errorFn(data);
                }
            }
        },
        error: function (xhr, type) {
            if (typeof errorFn === 'function') {
                errorFn()
            } else {
                console.log('error');
            }
        }
    });
}

module.exports = {
    getQueryString: getQueryString,
    net: net
}