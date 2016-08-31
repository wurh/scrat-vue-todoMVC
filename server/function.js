/**
 * 处理api 地址转化工具
 */

'use strict';

var NOOP = function () {
}

module.exports = {

    queryRedirect: function (url) {
        var result = {};
        var nurl = url.split('#!')[0];
        if (nurl.indexOf('?') > -1) {
            nurl = nurl.split('?')[1];
            if (nurl.indexOf('&') > -1) {
                var narr = nurl.split('&');
                for (var i in narr) {
                    var key = narr[i].split('=')[0];
                    var val = narr[i].split('=')[1];
                    result[key] = val;
                }
            } else {
                result[nurl.split('=')[0]] = nurl.split('=')[1];
            }
        }
        return result;
    },

    /**
     *  获取 query 参数
     **/
    queryParse: function (search, spliter) {
        if (!search) return {};

        spliter = spliter || '&';

        var query = search.replace(/^\?/, ''),
            queries = {},
            splits = query ? query.split(spliter) : null;

        if (splits && splits.length > 0) {
            splits.forEach(function (item) {
                item = item.split('=');
                var key = item[0],
                    value = item[1];
                queries[key] = value;
            });
        }
        return queries;
    },
    queryStringify: function (queries, spliter) {
        spliter = spliter || '&';
        var keys = Object.keys(queries),
            queryArray = [];
        keys.forEach(function (key) {
            queryArray.push(key + '=' + queries[key]);
        });
        return queryArray.join(spliter);
    },
    /**
     *  @path /path/to/:app/:clazz
     *  @params {app: 'app', clazz: 'kevin'}
     *  @return /path/to/app/kevin
     **/
    paramsInject: function (path, params) {
        var keys = Object.keys(params);
        keys.forEach(function (key) {
            path = path.replace(':' + key, params[key])
        });
        return path;
    },
    /**
     *  set query value
     **/
    setQuery: function (queryString, name, value) {
        var queries = this.queryParse(queryString) || {};
        queries[name] = value;
        return this.queryStringify(queries);
    },
    /**
     *  @Param path /game/l_9001/list/1
     *  @Param rule /game/:game_id/list/:id
     *  @return {game_id: "l_9001", id: "1"}
     *
     **/
    paramParse: function (path, rule, _params) {
        if (!path || !rule) return {};

        var params = _params || {};

        if (this.type(rule) == 'array') {

            rule.forEach(function (r) {
                this.paramParse(path, r, params);
            }.bind(this));

            return params;
        }

        var pathReg = new RegExp(this.unRegexpStr(rule).replace(/:[^(\\\/)]+/g, '([^/]+)')),
            matches = pathReg.exec(path),
            keys = rule.match(/:[^\/]+/g);

        if (matches && matches.length > 1) {
            matches.shift();
            matches.forEach(function (item, index) {
                var key = keys[index].replace(/^:/, '');
                params = this.extend(params, this.keyOptionsParse(key, decodeURIComponent(item)))
                // params[key] = decodeURIComponent(item);
            }.bind(this));
        }
        return params;
    },
    /**
     *  @Param path /game/l_9001/list/1
     *  @Param rule /game/:game_id/list/:id
     *  @return Boolean
     *
     **/
    ruleMatch: function (rule, path) {
        var pathReg = new RegExp('^' + this.unRegexpStr(rule).replace(/:[^(\\\/)]+/g, '([^/]+)') + '$');
        return !!pathReg.exec(path)
    },
    getUriPath: function (uri) {
        var matched = uri.replace(/[a-zA-Z]+:\/\/[^\/]+/, '').match(/[^\?]+(?=[\?]*[^\?]*)/)

        return matched ? matched[0] : '';
    },
    /**
     *  @param key {String} app--appname
     *  @param value {String} l_9001--demo
     *  @return {app:"l_9001", appname: "demo"}
     **/
    keyOptionsParse: function (key, value) {
        var keys = key.split('--'),
            values = value.split('--'),
            params = {}

        // debugger
        keys.forEach(function (item, index) {
            if (item.match(/\+\+/g)) {
                var classKeys = item.split('++');
                if (values[index].match(/\+\+/g)) {
                    var classValues = values[index].split('++');
                    params[classKeys[0]] = classValues[0];
                    params[classKeys[1]] = (/page=(\d+)/.exec(classValues[1]) || {})[1];

                } else {
                    params[classKeys[0]] = values[index];
                }

            } else {
                params[item] = values[index];

            }

        });
        return params;
    },

    /**
     *  Class name match from a string
     **/
    hasClass: function (destStr, className) {
        if (!destStr) return false;
        var classList = destStr.split(/\s+/),
            has = false;
        classList.forEach(function (item) {
            item = item.trim();
            if (item && item == className) {
                has = true;
                return true;
            }
        })
        return has;
    },
    unRegexpStr: function (str) {
        return str.replace(/([\^\&\(\)\[\]\|\$\*\?\/])/g, '\\$1');
    },
    /**
     *  Collection Utils
     **/
    setAllTo: function (list, value) {
        if (this.type(list) == 'object') {
            var keys = Object.keys(list);
            keys.forEach(function (key) {
                list[key] = value;
            })
        } else if (this.type(list) == 'array') {
            list.forEach(function (item, index) {
                list[index] = value;
            });
        }
        return list;
    },
    createArray: function (length, value) {
        var array = [];
        length = length || 0;
        while (length--) {
            array.push(value)
        }
        return array;
    },
    type: function (obj) {
        return Object.prototype.toString.call(obj).match(/\[object ([a-zA-Z]+)\]/)[1].toLowerCase();
    },
    extend: function (obj) {
        if (this.type(obj) != 'object') return obj;
        var source, prop;
        for (var i = 1, length = arguments.length; i < length; i++) {
            source = arguments[i];
            for (prop in source) {
                obj[prop] = source[prop];
            }
        }
        return obj;
    },
    copy: function (obj) {
        return JSON.parse(JSON.stringify(obj))
    },
    saveCall: function (fn) {
        return (fn || NOOP);
    },
    isEmpty: function (collection) {
        if (this.type(collection) == 'array') {
            return !collection.length;
        } else if (this.type(collection) == 'object') {
            return !Object.keys(collection).length;
        } else if (this.type(collection) == 'string') {
            return !collection.length;
        } else {
            return !!collection;
        }
    }
}
