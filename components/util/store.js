'use strict';

var STORAGE_KEY = 'todos-vuejs';

var todoStorage = {
    fetch: function () {
        return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    },
    save: function (todos) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    }
};

module.exports = todoStorage;