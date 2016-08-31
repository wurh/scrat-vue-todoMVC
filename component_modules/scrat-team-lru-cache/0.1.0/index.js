/**
    LRUCache Module with localStorage support
    modified from https://github.com/isaacs/node-lru-cache
 */
/*jshint latedef: false, forin: false */
'use strict';

var hasOwn = Object.prototype.hasOwnProperty,
    proto = LRUCache.prototype;

/**
    @example
    var cache = new LRUCache({
        namespace: 'my-project',
        max: 30,
        maxAge: 60 * 60 * 24,
        dispose: function (key, value) {
            // do something when disposing
        },
        localStorage: true
    });
 */
function LRUCache(options) {
    if (!(this instanceof LRUCache)) {
        return new LRUCache(options);
    }

    this._ns = options.namespace || '';
    this._ns = '__elf_cache_' + this._ns + '_';
    this._max = options.max;
    if (typeof this._max !== 'number' || this._max <= 0) {
        this._max = Infinity;
    }
    this._maxAge = options.maxAge;
    if (typeof this._maxAge !== 'number' || this._maxAge <= 0) {
        this._maxAge = false;
    }
    this._dispose = options.dispose;
    this._storage = !!options.localStorage;

    init(this);
    if (this._storage) {
        restore(this);
    }
}

proto.set = function (key, value, expire) {
    var nudeKey = key;
    key = this._ns + key;
    if (hasOwn.call(this._cache, key)) {
        if (this._dispose) {
            this._dispose(key, this._cache[key].value);
        }
        if (expire) {
            this._cache[key].expire = Date.now() / 1000 + expire;
        }
        this._cache[key].value = value;
        this.get(nudeKey);
        return true;
    }

    if (typeof expire !== 'number' || expire <= 0) {
        expire = this._maxAge;
    }

    var hit = new Entry(key, value, this._mru++, expire);

    this._lruList[hit.lu] = this._cache[key] = hit;
    this._length++;

    if (this._storage) {
        localStorage.setItem(key, JSON.stringify(hit));
    }

    if (this._length > this._max) {
        trim(this);
    }
    return true;
};

proto.has = function (key) {
    key = this._ns + key;
    if (!hasOwn.call(this._cache, key)) {
        return false;
    }

    var hit = this._cache[key];
    if (hit.expire && hit.expire < Date.now() / 1000) {
        del(this, hit);
        return false;
    }

    return true;
};

proto.get = function (key) {
    key = this._ns + key;
    var hit = this._cache[key];
    if (hit) {
        if (hit.expire && hit.expire < Date.now() / 1000) {
            del(this, hit);
            hit = undefined;
        } else {
            use(this, hit);
        }
        if (hit) {
            hit = hit.value;
        }
    }
    return hit;
};

proto.del = function (key) {
    key = this._ns + key;
    return del(this, this._cache[key]);
};

proto.reset = function () {
    if (this._dispose && this._cache) {
        for (var k in this._cache) {
            this._dispose(k, this._cache[k].value);
        }
    }

    forEach(function (key) {
        localStorage.removeItem(key);
    }, this);

    init(this);
};

function Entry(key, value, lu, expire) {
    this.key = key;
    this.value = value;
    this.lu = lu;
    this.expire = expire && Date.now() / 1000 + expire;
}

function init(self) {
    self._cache = Object.create(null);
    self._lruList = Object.create(null);
    self._mru = 0;
    self._lru = 0;
    self._length = 0;
}

function use(self, hit) {
    shiftLU(self, hit);
    hit.lu = self._mru++;
    self._lruList[hit.lu] = hit;
    if (self._storage) {
        localStorage.setItem(hit.key, JSON.stringify(hit));
    }
}

function trim(self) {
    while (self._lru < self._mru && self._length > self._max) {
        del(self, self._lruList[self._lru]);
    }
}

function shiftLU(self, hit) {
    delete self._lruList[hit.lu];
    while (self._lru < self._mru && !self._lruList[self._lru]) {
        self._lru++;
    }
}

function del(self, hit) {
    if (hit) {
        if (self._dispose) {
            self._dispose(hit.key, hit.value);
        }
        self._length--;
        delete self._cache[hit.key];
        if (self._storage) {
            localStorage.removeItem(hit.key);
        }
        shiftLU(self, hit);
    }
}

function forEach(iterator, self) {
    var i, length = localStorage.length,
        key;

    for (i = 0; i < length; i++) {
        key = localStorage.key(i);
        if (key && key.indexOf(self._ns) === 0) {
            iterator.call(self, key);
        }
    }
}

function restore(self) {
    forEach(function (key) {
        var hit = localStorage.getItem(key);
        if (hit) {
            hit = JSON.parse(hit);
        }
        self._lruList[hit.lu] = self._cache[key] = hit;
        self._mru = hit.lu + 1 > self._mru ? hit.lu + 1 : self._mru;
        self._lru = (self._lru === 0 || hit.lu < self._lru) ? hit.lu : self._lru;
        self._length++;
    }, self);

    if (self._length > self._max) {
        trim(self);
    }
}

module.exports = LRUCache;