'use strict';

var each = require('each');
var router = require('router');
var config = require('../config/n-config.js');
var pages = require('../config/p-config.js');

//----- 路由中间件 -----
// 初始化用户状态
function initSys(ctx, next) {
    next();
}

// 加载页面
var currentPage;
function loadPage(ctx, next) {
    var rootPage;
    var page = ctx.params.page;
    if ('/' + ctx.params.page !== ctx.path) {
        rootPage = ctx.path.split('/' + page)[0].split('/')[1];
    }
    var prectx = ctx;
    if (rootPage) {
        require.async(pages[rootPage], function (p) {
            if (currentPage && currentPage.destory) currentPage.destory(ctx);
            currentPage = p;
            var parentcom;
            if (currentPage.init) {
                parentcom = currentPage.init(ctx);
            }
            //debugger;
            var renpage = page;
            //if(page === 'detaillist'){
            //    renpage = 'filelist'
            //}
            parentcom.$broadcast('navi-update', renpage, prectx.params.router);
            runPage(prectx, next, page);
        });
    } else {
        runPage(ctx, next, page)
    }
}

/**
 * 渲染页面
 * @param ctx
 * @param next
 * @param page
 */
function runPage(ctx, next, page) {
    if (pages.hasOwnProperty(page)) {
        require.async(pages[page], function (p) {
            if (currentPage && currentPage.destory) currentPage.destory(ctx);
            currentPage = p;
            if (currentPage.init) currentPage.init(ctx);
        });
    } else {
        next();
    }
}


//----- 页面路由 -----

router('/:page', function (ctx, next) {
    sessionStorage.setItem('excess', 'page');
    next()
}, initSys, loadPage);

router('/dash/:page', function (ctx, next) {
    next()
}, initSys, loadPage);

router('/dash/:router/:page', function (ctx, next) {
    next()
}, initSys, loadPage);


router('/', function (ctx, next) {
    ctx.params.page = 'index';
    next();
}, initSys, loadPage);


router('*', function (ctx) {
    router.replace('/' + config.default);
});

module.exports = function () {
    router.start();
}