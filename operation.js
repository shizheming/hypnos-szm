import {forEach, isPlainObject, isArray, identity, isNumber,isFunction} from 'lodash';
/*
    递归
*/
const processFunction = function (value) {
    return isFunction(value) ? value : identity;
};
export const recursive = function (collection, baseCallback, ObjectCallback, level) {
    baseCallback = processFunction(baseCallback);
    ObjectCallback = processFunction(ObjectCallback);
    level = isNumber(level) ? ++level : 1;
    var result = {
        collection: [],
        value: []
    };

    forEach(collection, function (currentValue, key, collection) {
        if (isArray(currentValue) || isPlainObject(currentValue)) {
            // 对象值的时候一个断点回调
            var output = ObjectCallback(currentValue, key, collection, level);

            output && result.collection.push(output);
            var recursiveValue = recursive(currentValue, baseCallback, ObjectCallback, level);

            result.value = result.value.concat(recursiveValue.value);
            result.collection = result.collection.concat(recursiveValue.collection);
        } else {
            // 基础值的时候一个断点回调
            result.value.push(baseCallback(currentValue, key, collection, level));
        }
    });
    return result;
};