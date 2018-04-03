/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4: */
/* eslint-env es6, mocha, node */
/* eslint-extends: eslint:recommended */
'use strict';



// Variables
const events = require('events'),
    path = require('path'),
    karmia_lambda_jsonrpc_methods = require(path.resolve(__dirname, './method'));

/**
 * KarmiaLambdaJSONRPC
 *
 * @class
 */
class KarmiaLambdaJSONRPC extends events.EventEmitter {
    /**
     * Constructor
     *
     * @constructs KarmiaLambdaJSONRPC
     * @param   {Object} methods
     * @param   {Object} parameters
     * @returns {Object}
     */
    constructor(methods, parameters) {
        super();

        const self = this;
        self.methods = new karmia_lambda_jsonrpc_methods(methods);
        self.converter = self.methods.converter;
        self.parameters = {};

        return self.set(parameters || {});
    }

    /**
     * Set parameters
     *
     * @param   {string} key
     * @param   {Function|Object} value
     * @returns {Object}
     */
    set(key, value) {
        const self = this;

        let parameters = {};
        if (key instanceof Object) {
            parameters = Object.assign(parameters, key);
        } else {
            parameters[key] = value;
        }

        self.parameters = Object.assign(self.parameters, parameters);

        return self;
    }

    /**
     * Clear parameters
     *
     * @returns {Object}
     */
    clear() {
        const self = this;
        self.parameters = {};

        return self;
    }

    /**
     * Get parameter
     *
     * @param   {string} path
     * @returns {*}
     */
    get(path) {
        const self = this;
        if (!path) {
            return self.parameters || {};
        }

        return (function parameter (object, path) {
            path = path || '';
            const properties = path.split('.'),
                result = object[properties[0]];
            if (result instanceof Object) {
                return (1 < properties.length) ? parameter(result, path.substring(path.indexOf('.') + 1)) : result;
            }

            return (1 < properties.length) ? undefined : result;
        })(self.parameters, path);
    }

    /**
     * List parameters
     *
     * @returns {Object}
     */
    list() {
        const self = this;

        return self.parameters || {};
    }

    /**
     * Call method
     *
     * @param {Object} event
     * @param {Object} context
     * @param {Array|Object} body
     * @returns {*}
     */
    call(event, context, body) {
        const self = this;

        return self.methods.call.call(self, event, context, body, self.parameters);
    }
}


// Export modules
module.exports = KarmiaLambdaJSONRPC;



/*
 * Local variables:
 * tab-width: 4
 * c-basic-offset: 4
 * c-hanging-comment-ender-p: nil
 * End:
 */
