'use strict';

/**
 * 尾部组件
 *
 * @class footer
 * @constructor
 */

var tpl = __inline('footer.tpl');
var footer = Vue.extend({
    template: tpl,
    ready: function () {
    },
    props: ['page'],
    replace: false
});

/**
 * My method description.  Like other pieces of your comment blocks,
 * this can span multiple lines.
 *
 * @method init
 * @return {Object} Returns footer component
 */
var init = function () {
    return footer;
}

module.exports = init;