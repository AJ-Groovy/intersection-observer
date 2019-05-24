const helpers = (() => {

    const isIterable = function (obj) {
        if (obj == null) {
            return false;
        }
        return typeof obj[Symbol.iterator] === 'function';
    };

    return {
        isIterable
    }

})();

export default helpers;