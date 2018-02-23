/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4: */
/* eslint-env es6, mocha, node */
/* eslint-extends: eslint:recommended */
'use strict';



// Variables
const karmia_converter_jsonrpc = require('karmia-converter-jsonrpc');


/**
 * KarmiaLambdaJSONRPCMethod
 *
 * @class
 */
class KarmiaLambdaJSONRPCMethod {
    /**
     * Constructor
     *
     * @constructs KarmiaLambdaJSONRPC
     * @returns {Object}
     */
    constructor(options) {
        const self = this;
        self.converter = karmia_converter_jsonrpc();
        self.methods = {};

        return self.set(options || {});
    }

    /**
     * Set methods
     *
     * @param   {string} key
     * @param   {Function|Object} value
     * @returns {Object}
     */
    set(key, value) {
        const self = this;

        let methods = {};
        if (key instanceof Object) {
            methods = Object.assign(methods, key);
        } else {
            methods[key] = value;
        }

        self.methods = Object.assign(self.methods, methods);

        return self;
    }

    /**
     * Clear methods
     *
     * @returns {Object}
     */
    clear() {
        const self = this;
        self.methods = {};

        return self;
    }

    /**
     * Get method
     *
     * @param   {string} path
     * @returns {Function}
     */
    get(path) {
        const self = this;

        return (function method (object, path) {
            path = path || '';
            const properties = path.split('.'),
                result = object[properties[0]];
            if (result instanceof Object) {
                return (1 < properties.length) ? method(result, path.substring(path.indexOf('.') + 1)) : result;
            }

            return (1 < properties.length) ? undefined : result;
        })(self.methods, path);
    }

    /**
     * List methods
     *
     * @returns {Object}
     */
    list() {
        const self = this;

        return self.methods || {};
    }

    /**
     * Call method
     *
     * @param {Object} event
     * @param {Object} context
     * @param {Array|Object} body
     * @param {Object} parameters
     */
    call(event, context, body, parameters) {
        const self = this,
            batch = Array.isArray(body),
            requests = (batch) ? body : [body],
            parallels = requests.reduce((collection, request) => {
                if (!request.method || '2.0' !== request.jsonrpc) {
                    const error = new Error('Invalid request');
                    error.code = -32600;

                    collection.push(Promise.resolve(error));

                    return collection;
                }

                const method = request.method || '',
                    params = Object.assign({}, parameters || {}, request.params || {}),
                    func = self.methods.get(method);
                if (!func) {
                    const error = new Error('Method not found');
                    error.code = -32601;

                    collection.push(Promise.resolve(error));

                    return collection;
                }

                collection.push(func.call(self, event, context, Object.assign({params: params}, params)).catch((error) => {
                    return Promise.resolve(error);
                }));

                return collection;
            }, []);

        return Promise.all(parallels).then((result) => {
            return self.methods.converter.convert(body, (batch) ? result : result[0]);
        }).then((result) => {
            return {
                status: (null === result) ? 204 : 200,
                body: result
            };
        });
    }
}


// Export modules
module.exports = KarmiaLambdaJSONRPCMethod;



/*
 * Local variables:
 * tab-width: 4
 * c-basic-offset: 4
 * c-hanging-comment-ender-p: nil
 * End:
 */
