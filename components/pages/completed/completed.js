'use strict';

var tpl = __inline('completed.tpl');
var head = require('widgets/head');
var list =  require('widgets/list');
var footer = require('widgets/footer');

/**
 * 首页模块
 *
 * @class completed
 * @constructor
 */
var completed = Vue.extend({
    template: tpl,
    components: {
        "c-head": head(),
        "c-list" : list(),
        "c-footer":footer()
    },
    ready:function () {
        this.$broadcast('onUpdateVis','completed');
    },
    events: {
        'onAddTodo': function (value) {
            this.$broadcast('onAddListItem',value);
        }
    }
});

/**
 * My method description.  Like other pieces of your comment blocks,
 * this can span multiple lines.
 *
 * @method init
 * @return {Object} Returns completed page component
 */
var init = function () {
    return new completed({
        el: "#page-main",
        replace: false
    })
}

module.exports = {
    init: init
}