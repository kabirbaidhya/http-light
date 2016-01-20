// Dependencies
// TODO: Let's not use loadash in this package, as its too heavy for us
// Our whole source files (unminified) is < 5KB
// but when bundled with jQuery & lodash it becomes 235KB
// even minified version is 40KB
// Have to implement these stuffs on our own in the future.
var isNaN = require('lodash/lang/isNaN');
var isArray = require('lodash/lang/isArray');
var isObject = require('lodash/lang/isObject');
var isNull = require('lodash/lang/isUndefined');
var cloneDeep = require('lodash/lang/cloneDeep');
var isUndefined = require('lodash/lang/isUndefined');

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
