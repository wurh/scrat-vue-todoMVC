'use strict';

/**
 * 头部组件
 *
 * @class head
 * @constructor
 */

var tpl = __inline('head.tpl');
var head = Vue.extend({
    template: tpl,
    ready: function () {
        return {
            value:''
        }
    },
    props: ['page'],
    methods: {
        addTodo: function () {
            var value = this.newTodo && this.newTodo.trim();
            if (!value) {
                return;
            }
            this.$dispatch('onAddTodo',value);
            this.newTodo = '';
        },
    },
    replace: false
});


/**
 * My method description.  Like other pieces of your comment blocks,
 * this can span multiple lines.
 *
 * @method init
 * @return {Object} Returns head component
 */
var init = function () {
    return head;
}

module.exports = init;