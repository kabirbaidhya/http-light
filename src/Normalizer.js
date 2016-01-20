
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
