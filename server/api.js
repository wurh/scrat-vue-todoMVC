'use strict';

/**
 * api 对象
 * @type {{}}
 */
var api = {
    rootlist: '/api/rootlist',    //获取文件根目录列表
    getlistbyfid: '/api/getlistbyfid',//根据工程ID获取文件夹数据
    getdetaildata: '/api/getdetaildata', //根据文件夹ID获取文件数据
}

module.exports = api;