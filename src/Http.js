

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
