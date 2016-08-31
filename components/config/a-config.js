'use strict';

/**
 * api config
 * @type {{}}
 */


var host = '';

// 请求类型
var ajaxType = {
    get: 'GET',
    post: 'POST'
}

// 请求路径
var path = {
}


// 返回码配置
var code = {
    common: {
        succ: 200,
        miss: 1001
    }
}

module.exports = {
    ajaxType: ajaxType,
    path: path,
    code: code
}