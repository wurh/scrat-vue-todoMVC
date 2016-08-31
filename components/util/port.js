'use strict';

/**
 * This is the description for my class.
 *
 * @class Port  负责网络层调用
 * @constructor
 */

var net = require('./net'),
    config = require('config/a-config.js');

/**
 * @property send 发送数据接口对象
 * @type {Object}
 */
var send = {
    /**
     * @method 用户注册接口
     * @param {Object}  param 接口传参
     * @param {Function} successFn 成功回调
     * @param {Function} errorFn  失败回调
     * @param {Function} completeFn 完成回调
     */
    register: function (param, successFn, errorFn, completeFn) {
        net.net(config.path.register, config.ajaxType.post, param, successFn, errorFn);
    }
}

/**
 * @property fetch 获取数据接口对象
 * @type {Object}
 */
var fetch = {
    /**
     * @method 获取项目工程列表接口
     * @param {Object}  param 接口传参
     * @param {Function} successFn 成功回调
     * @param {Function} errorFn  失败回调
     * @param {Function} completeFn 完成回调
     */
    rootlist: function (param, successFn, errorFn, completeFn) {
        net.net(config.path.rootlist, config.ajaxType.get, param, successFn, errorFn);
    },
    /**
     * @method 根据工程ID获取相信数据信息
     * @param {Object}  param 接口传参
     * @param {Function} successFn 成功回调
     * @param {Function} errorFn  失败回调
     * @param {Function} completeFn 完成回调
     */
    detaillist: function (param, successFn, errorFn, completeFn) {
        net.net(config.path.detaillist, config.ajaxType.get, param, successFn, errorFn);
    },
    /**
     * @method 根据文件夹ID获取文件数据
     * @param {Object}  param 接口传参
     * @param {Function} successFn 成功回调
     * @param {Function} errorFn  失败回调
     * @param {Function} completeFn 完成回调
     */
    detaildata: function (param, successFn, errorFn, completeFn) {
        net.net(config.path.detaildata, config.ajaxType.get, param, successFn, errorFn);
    }
}

module.exports = {
    send: send,
    fetch: fetch
}