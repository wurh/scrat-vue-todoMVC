'use strict';

/**
 * 列表组件
 *
 * @class list
 * @constructor
 */

var tpl = __inline('list.tpl');
var todoStorage = require('util/store');
var filters = require('common/filters');

var list = Vue.extend({
    template: tpl,
    data: function () {
        return {
            todos: todoStorage.fetch(),
            newTodo: '',
            editedTodo: null,
            visibility: 'all'
        }
    },
    computed: {
        filteredTodos: function () {
            return filters[this.visibility](this.todos);
        },
        remaining: function () {
            return filters.active(this.todos).length;
        },
        allDone: {
            get: function () {
                return this.remaining === 0;
            },
            set: function (value) {
                this.todos.forEach(function (todo) {
                    todo.completed = value;
                });
            }
        }
    },
    watch: {
        todos: {
            deep: true,
            handler: todoStorage.save
        }
    },
    ready: function () {
    },
    props: ['page'],
    methods: {
        removeTodo: function (todo) {
            this.todos.$remove(todo);
            var arr = this.todos;
            todoStorage.save(arr);
        },
        removeCompleted:function(){
            this.todos = filters.active(this.todos);
            var arr = this.todos;
            todoStorage.save(arr);
        },
        editTodo: function (todo) {
            this.beforeEditCache = todo.title;
            this.editedTodo = todo;
        },
        doneEdit: function (todo) {
            if (!this.editedTodo) {
                return;
            }
            this.editedTodo = null;
            todo.title = todo.title.trim();
            if (!todo.title) {
                this.removeTodo(todo);
            }
        },
        cancelEdit: function (todo) {
            this.editedTodo = null;
            todo.title = this.beforeEditCache;
        },

    },
    events:{
        onAddListItem:function(value){
            this.todos.push({title: value, completed: false})
            var arr = this.todos;
            todoStorage.save(arr);
        },
        onUpdateVis:function(value){
            this.visibility = value;
        }
    },
    replace: false
});


/**
 * My method description.  Like other pieces of your comment blocks,
 * this can span multiple lines.
 *
 * @method init
 * @return {Object} Returns list component
 */
var init = function () {
    return list;
}

module.exports = init;