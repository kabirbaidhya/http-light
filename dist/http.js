(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

/**
 * Normalizes the object/array specially before sending it in a HTTP payload
 *
 * @author Kabir Baidhya
 */
function Normalizer() {
    this.normalize = normalize;

    function normalize(data) {
        if (!_.isObject(data)) {
            return data;
        }

        var temp = _.cloneDeep(data);

        if (_.isArray(temp)) {
            temp = normalizeArray(temp);
        }

        for (var key in temp) {
            var value = temp[key];

            if (isEmpty(value)) {
                delete temp[key];
            } else if (_.isObject(value)) {
                temp[key] = normalize(value);
            }
        }

        return temp;
    }

    function isEmpty(value) {
        return _.isUndefined(value) || _.isNull(value) || _.isNaN(value);
    }

    function normalizeArray(data) {
        var temp = [];

        for (var i in data) {
            var value = data[i];

            if (!isEmpty(value)) {
                temp.push(value);
            }
        }

        return temp;
    }
}

module.exports = Normalizer;

},{}],2:[function(require,module,exports){


var Normalizer = require('./Normalizer.js');

/**
 * @author Kabir Baidhya
 */
function Http() {

    /**
     * An array of default handlers for the request promise
     *
     * @type {Array}
     */
    var defaultHandlers = [];

    this.request = function (url, method, data) {
        data = filterData(data);

        // TODO: Use a Promises/A+ Compliant promise library instead on relying on jQuery
        var promise = createXhr(url, method, data);

        // Add a new handler 'error' to the promise
        addErrorHandler(promise);

        // register default handlers in the promise
        registerDefaultHandlers(promise);

        return promise;
    };

    this.get = function (url, data) {
        return this.request(url, Http.METHOD_GET, data);
    };

    this.head = function (url, data) {
        return this.request(url, Http.METHOD_HEAD, data);
    };

    this.post = function (url, data) {
        return this.request(url, Http.METHOD_POST, data);
    };

    this.delete = function (url, data) {
        return this.request(url, Http.METHOD_DELETE, data);
    };

    this.put = function (url, data) {
        return this.request(url, Http.METHOD_PUT, data);
    };

    this.patch = function (url, data) {
        return this.request(url, Http.METHOD_PATCH, data);
    };

    this.addDefaultHandler = function (key, handler) {
        if (typeof (handler) !== 'function') {
            throw new Error('Invalid handler provided.');
        }

        defaultHandlers.push({key: key, handler: handler});
    };

    this.getDefaultHandlers = function () {
        return defaultHandlers;
    };

    /**
     * Ensure the payload to be sent is a regular JSON data
     */
    function filterData(data) {

        data = (new Normalizer()).normalize(data);

        // If data is an object change it to JSON string
        if (_.isObject(data)) {
            data = JSON.stringify(data);
        }

        return data;
    }

    /**
     * Creates the XHR request and returns the promise object.
     *
     * TODO: Do not rely on jQuery just for XHR, we can implement our own.
     * We are currently having jquery as a dependency for this package, which is abit weird
     * as we have to pull whole jQuery just to use it's ajax in our package.
     *
     * TODO: For promises we can use some lightweight Promises/A+ Compliant library.
     *
     */
    function createXhr(url, method, payload) {
        var config = {
            url: url,
            type: method,
            data: payload,
            dataType: 'json'
        };

        // Make Content-Type: application/json only if it has payload
        // That is don't send content-type header explicitly if no payload is present
        if (payload) {
            config.contentType = Http.CONTENT_TYPE_JSON;
        }

        return $.ajax(config);
    }

    function registerDefaultHandlers(promise) {
        defaultHandlers.forEach(function (handler) {
            if (promise[handler.key]) {
                promise[handler.key](handler.handler);
            }
        });
    }

    function addErrorHandler(promise) {
        promise.error = function (callback) {
            promise.fail(function (jqXHR, textStatus, errorThrown) {
                var response = jqXHR.responseJSON || jqXHR.responseText;

                callback(response, textStatus, jqXHR, errorThrown);
            });

            return promise;
        };
    }
};

// Common Http Verbs
Http.METHOD_GET = 'GET';
Http.METHOD_PUT = 'PUT';
Http.METHOD_HEAD = 'HEAD';
Http.METHOD_POST = 'POST';
Http.METHOD_PATCH = 'PATCH';
Http.METHOD_DELETE = 'DELETE';

// Misc
Http.CONTENT_TYPE_JSON = 'application/json';

module.exports = Http;

// For browsers, have Http class globally available
if (typeof(window) !== 'undefined') {
    window.Http = Http;
}

},{"./Normalizer.js":1}]},{},[2])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2thYmlyL0Rlc2t0b3AvbGZ0LWh0dHAvbm9kZV9tb2R1bGVzL2d1bHAtYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiL2hvbWUva2FiaXIvRGVza3RvcC9sZnQtaHR0cC9zcmMvTm9ybWFsaXplci5qcyIsIi9ob21lL2thYmlyL0Rlc2t0b3AvbGZ0LWh0dHAvc3JjL2Zha2VfNGZjNWViYTkuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3Rocm93IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIil9dmFyIGY9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGYuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sZixmLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIlxuLyoqXG4gKiBOb3JtYWxpemVzIHRoZSBvYmplY3QvYXJyYXkgc3BlY2lhbGx5IGJlZm9yZSBzZW5kaW5nIGl0IGluIGEgSFRUUCBwYXlsb2FkXG4gKlxuICogQGF1dGhvciBLYWJpciBCYWlkaHlhXG4gKi9cbmZ1bmN0aW9uIE5vcm1hbGl6ZXIoKSB7XG4gICAgdGhpcy5ub3JtYWxpemUgPSBub3JtYWxpemU7XG5cbiAgICBmdW5jdGlvbiBub3JtYWxpemUoZGF0YSkge1xuICAgICAgICBpZiAoIV8uaXNPYmplY3QoZGF0YSkpIHtcbiAgICAgICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHRlbXAgPSBfLmNsb25lRGVlcChkYXRhKTtcblxuICAgICAgICBpZiAoXy5pc0FycmF5KHRlbXApKSB7XG4gICAgICAgICAgICB0ZW1wID0gbm9ybWFsaXplQXJyYXkodGVtcCk7XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKHZhciBrZXkgaW4gdGVtcCkge1xuICAgICAgICAgICAgdmFyIHZhbHVlID0gdGVtcFtrZXldO1xuXG4gICAgICAgICAgICBpZiAoaXNFbXB0eSh2YWx1ZSkpIHtcbiAgICAgICAgICAgICAgICBkZWxldGUgdGVtcFtrZXldO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChfLmlzT2JqZWN0KHZhbHVlKSkge1xuICAgICAgICAgICAgICAgIHRlbXBba2V5XSA9IG5vcm1hbGl6ZSh2YWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGVtcDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpc0VtcHR5KHZhbHVlKSB7XG4gICAgICAgIHJldHVybiBfLmlzVW5kZWZpbmVkKHZhbHVlKSB8fCBfLmlzTnVsbCh2YWx1ZSkgfHwgXy5pc05hTih2YWx1ZSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbm9ybWFsaXplQXJyYXkoZGF0YSkge1xuICAgICAgICB2YXIgdGVtcCA9IFtdO1xuXG4gICAgICAgIGZvciAodmFyIGkgaW4gZGF0YSkge1xuICAgICAgICAgICAgdmFyIHZhbHVlID0gZGF0YVtpXTtcblxuICAgICAgICAgICAgaWYgKCFpc0VtcHR5KHZhbHVlKSkge1xuICAgICAgICAgICAgICAgIHRlbXAucHVzaCh2YWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGVtcDtcbiAgICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gTm9ybWFsaXplcjtcbiIsIlxuXG52YXIgTm9ybWFsaXplciA9IHJlcXVpcmUoJy4vTm9ybWFsaXplci5qcycpO1xuXG4vKipcbiAqIEBhdXRob3IgS2FiaXIgQmFpZGh5YVxuICovXG5mdW5jdGlvbiBIdHRwKCkge1xuXG4gICAgLyoqXG4gICAgICogQW4gYXJyYXkgb2YgZGVmYXVsdCBoYW5kbGVycyBmb3IgdGhlIHJlcXVlc3QgcHJvbWlzZVxuICAgICAqXG4gICAgICogQHR5cGUge0FycmF5fVxuICAgICAqL1xuICAgIHZhciBkZWZhdWx0SGFuZGxlcnMgPSBbXTtcblxuICAgIHRoaXMucmVxdWVzdCA9IGZ1bmN0aW9uICh1cmwsIG1ldGhvZCwgZGF0YSkge1xuICAgICAgICBkYXRhID0gZmlsdGVyRGF0YShkYXRhKTtcblxuICAgICAgICAvLyBUT0RPOiBVc2UgYSBQcm9taXNlcy9BKyBDb21wbGlhbnQgcHJvbWlzZSBsaWJyYXJ5IGluc3RlYWQgb24gcmVseWluZyBvbiBqUXVlcnlcbiAgICAgICAgdmFyIHByb21pc2UgPSBjcmVhdGVYaHIodXJsLCBtZXRob2QsIGRhdGEpO1xuXG4gICAgICAgIC8vIEFkZCBhIG5ldyBoYW5kbGVyICdlcnJvcicgdG8gdGhlIHByb21pc2VcbiAgICAgICAgYWRkRXJyb3JIYW5kbGVyKHByb21pc2UpO1xuXG4gICAgICAgIC8vIHJlZ2lzdGVyIGRlZmF1bHQgaGFuZGxlcnMgaW4gdGhlIHByb21pc2VcbiAgICAgICAgcmVnaXN0ZXJEZWZhdWx0SGFuZGxlcnMocHJvbWlzZSk7XG5cbiAgICAgICAgcmV0dXJuIHByb21pc2U7XG4gICAgfTtcblxuICAgIHRoaXMuZ2V0ID0gZnVuY3Rpb24gKHVybCwgZGF0YSkge1xuICAgICAgICByZXR1cm4gdGhpcy5yZXF1ZXN0KHVybCwgSHR0cC5NRVRIT0RfR0VULCBkYXRhKTtcbiAgICB9O1xuXG4gICAgdGhpcy5oZWFkID0gZnVuY3Rpb24gKHVybCwgZGF0YSkge1xuICAgICAgICByZXR1cm4gdGhpcy5yZXF1ZXN0KHVybCwgSHR0cC5NRVRIT0RfSEVBRCwgZGF0YSk7XG4gICAgfTtcblxuICAgIHRoaXMucG9zdCA9IGZ1bmN0aW9uICh1cmwsIGRhdGEpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucmVxdWVzdCh1cmwsIEh0dHAuTUVUSE9EX1BPU1QsIGRhdGEpO1xuICAgIH07XG5cbiAgICB0aGlzLmRlbGV0ZSA9IGZ1bmN0aW9uICh1cmwsIGRhdGEpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucmVxdWVzdCh1cmwsIEh0dHAuTUVUSE9EX0RFTEVURSwgZGF0YSk7XG4gICAgfTtcblxuICAgIHRoaXMucHV0ID0gZnVuY3Rpb24gKHVybCwgZGF0YSkge1xuICAgICAgICByZXR1cm4gdGhpcy5yZXF1ZXN0KHVybCwgSHR0cC5NRVRIT0RfUFVULCBkYXRhKTtcbiAgICB9O1xuXG4gICAgdGhpcy5wYXRjaCA9IGZ1bmN0aW9uICh1cmwsIGRhdGEpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucmVxdWVzdCh1cmwsIEh0dHAuTUVUSE9EX1BBVENILCBkYXRhKTtcbiAgICB9O1xuXG4gICAgdGhpcy5hZGREZWZhdWx0SGFuZGxlciA9IGZ1bmN0aW9uIChrZXksIGhhbmRsZXIpIHtcbiAgICAgICAgaWYgKHR5cGVvZiAoaGFuZGxlcikgIT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBoYW5kbGVyIHByb3ZpZGVkLicpO1xuICAgICAgICB9XG5cbiAgICAgICAgZGVmYXVsdEhhbmRsZXJzLnB1c2goe2tleToga2V5LCBoYW5kbGVyOiBoYW5kbGVyfSk7XG4gICAgfTtcblxuICAgIHRoaXMuZ2V0RGVmYXVsdEhhbmRsZXJzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gZGVmYXVsdEhhbmRsZXJzO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBFbnN1cmUgdGhlIHBheWxvYWQgdG8gYmUgc2VudCBpcyBhIHJlZ3VsYXIgSlNPTiBkYXRhXG4gICAgICovXG4gICAgZnVuY3Rpb24gZmlsdGVyRGF0YShkYXRhKSB7XG5cbiAgICAgICAgZGF0YSA9IChuZXcgTm9ybWFsaXplcigpKS5ub3JtYWxpemUoZGF0YSk7XG5cbiAgICAgICAgLy8gSWYgZGF0YSBpcyBhbiBvYmplY3QgY2hhbmdlIGl0IHRvIEpTT04gc3RyaW5nXG4gICAgICAgIGlmIChfLmlzT2JqZWN0KGRhdGEpKSB7XG4gICAgICAgICAgICBkYXRhID0gSlNPTi5zdHJpbmdpZnkoZGF0YSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZGF0YTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIHRoZSBYSFIgcmVxdWVzdCBhbmQgcmV0dXJucyB0aGUgcHJvbWlzZSBvYmplY3QuXG4gICAgICpcbiAgICAgKiBUT0RPOiBEbyBub3QgcmVseSBvbiBqUXVlcnkganVzdCBmb3IgWEhSLCB3ZSBjYW4gaW1wbGVtZW50IG91ciBvd24uXG4gICAgICogV2UgYXJlIGN1cnJlbnRseSBoYXZpbmcganF1ZXJ5IGFzIGEgZGVwZW5kZW5jeSBmb3IgdGhpcyBwYWNrYWdlLCB3aGljaCBpcyBhYml0IHdlaXJkXG4gICAgICogYXMgd2UgaGF2ZSB0byBwdWxsIHdob2xlIGpRdWVyeSBqdXN0IHRvIHVzZSBpdCdzIGFqYXggaW4gb3VyIHBhY2thZ2UuXG4gICAgICpcbiAgICAgKiBUT0RPOiBGb3IgcHJvbWlzZXMgd2UgY2FuIHVzZSBzb21lIGxpZ2h0d2VpZ2h0IFByb21pc2VzL0ErIENvbXBsaWFudCBsaWJyYXJ5LlxuICAgICAqXG4gICAgICovXG4gICAgZnVuY3Rpb24gY3JlYXRlWGhyKHVybCwgbWV0aG9kLCBwYXlsb2FkKSB7XG4gICAgICAgIHZhciBjb25maWcgPSB7XG4gICAgICAgICAgICB1cmw6IHVybCxcbiAgICAgICAgICAgIHR5cGU6IG1ldGhvZCxcbiAgICAgICAgICAgIGRhdGE6IHBheWxvYWQsXG4gICAgICAgICAgICBkYXRhVHlwZTogJ2pzb24nXG4gICAgICAgIH07XG5cbiAgICAgICAgLy8gTWFrZSBDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24gb25seSBpZiBpdCBoYXMgcGF5bG9hZFxuICAgICAgICAvLyBUaGF0IGlzIGRvbid0IHNlbmQgY29udGVudC10eXBlIGhlYWRlciBleHBsaWNpdGx5IGlmIG5vIHBheWxvYWQgaXMgcHJlc2VudFxuICAgICAgICBpZiAocGF5bG9hZCkge1xuICAgICAgICAgICAgY29uZmlnLmNvbnRlbnRUeXBlID0gSHR0cC5DT05URU5UX1RZUEVfSlNPTjtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiAkLmFqYXgoY29uZmlnKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiByZWdpc3RlckRlZmF1bHRIYW5kbGVycyhwcm9taXNlKSB7XG4gICAgICAgIGRlZmF1bHRIYW5kbGVycy5mb3JFYWNoKGZ1bmN0aW9uIChoYW5kbGVyKSB7XG4gICAgICAgICAgICBpZiAocHJvbWlzZVtoYW5kbGVyLmtleV0pIHtcbiAgICAgICAgICAgICAgICBwcm9taXNlW2hhbmRsZXIua2V5XShoYW5kbGVyLmhhbmRsZXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBhZGRFcnJvckhhbmRsZXIocHJvbWlzZSkge1xuICAgICAgICBwcm9taXNlLmVycm9yID0gZnVuY3Rpb24gKGNhbGxiYWNrKSB7XG4gICAgICAgICAgICBwcm9taXNlLmZhaWwoZnVuY3Rpb24gKGpxWEhSLCB0ZXh0U3RhdHVzLCBlcnJvclRocm93bikge1xuICAgICAgICAgICAgICAgIHZhciByZXNwb25zZSA9IGpxWEhSLnJlc3BvbnNlSlNPTiB8fCBqcVhIUi5yZXNwb25zZVRleHQ7XG5cbiAgICAgICAgICAgICAgICBjYWxsYmFjayhyZXNwb25zZSwgdGV4dFN0YXR1cywganFYSFIsIGVycm9yVGhyb3duKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByZXR1cm4gcHJvbWlzZTtcbiAgICAgICAgfTtcbiAgICB9XG59O1xuXG4vLyBDb21tb24gSHR0cCBWZXJic1xuSHR0cC5NRVRIT0RfR0VUID0gJ0dFVCc7XG5IdHRwLk1FVEhPRF9QVVQgPSAnUFVUJztcbkh0dHAuTUVUSE9EX0hFQUQgPSAnSEVBRCc7XG5IdHRwLk1FVEhPRF9QT1NUID0gJ1BPU1QnO1xuSHR0cC5NRVRIT0RfUEFUQ0ggPSAnUEFUQ0gnO1xuSHR0cC5NRVRIT0RfREVMRVRFID0gJ0RFTEVURSc7XG5cbi8vIE1pc2Ncbkh0dHAuQ09OVEVOVF9UWVBFX0pTT04gPSAnYXBwbGljYXRpb24vanNvbic7XG5cbm1vZHVsZS5leHBvcnRzID0gSHR0cDtcblxuLy8gRm9yIGJyb3dzZXJzLCBoYXZlIEh0dHAgY2xhc3MgZ2xvYmFsbHkgYXZhaWxhYmxlXG5pZiAodHlwZW9mKHdpbmRvdykgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgd2luZG93Lkh0dHAgPSBIdHRwO1xufVxuIl19
