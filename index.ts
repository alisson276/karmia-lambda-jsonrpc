/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4: */
/* eslint-env es6, mocha, node */
/* eslint-extends: eslint:recommended */
'use strict';



// Import modules
import events = require("events");
import KarmiaConverterJSONRPC = require("karmia-converter-jsonrpc");
import KarmiaLambdaJSONRPCMethods = require("./lib/method");


// Declarations
declare interface Methods {
    [index: string]: Function|object;
}

declare interface Parameters {
    [index: string]: any;
}



/**
 * KarmiaLambdaJSONRPC
 *
 * @class
 */
class KarmiaLambdaJSONRPC extends events.EventEmitter {
    /**
     * Properties
     */
    public methods: KarmiaLambdaJSONRPCMethods;
    public converter: KarmiaConverterJSONRPC;
    public parameters: Parameters;


    /**
     * Constructor
     *
     * @constructs KarmiaLambdaJSONRPC
     * @param   {Object} methods
     * @param   {Object} parameters
     * @returns {Object}
     */
    constructor(methods?: Methods, parameters?: Parameters) {
        super();

        this.methods = new KarmiaLambdaJSONRPCMethods(methods);
        this.converter = this.methods.converter;
        this.parameters = {};

        return this.set(parameters || {});
    }

    /**
     * Set parameters
     *
     * @param   {string} key
     * @param   {Function|Object} value
     * @returns {Object}
     */
    set(key: Parameters|string, value?: any): KarmiaLambdaJSONRPC {
        const self = this;

        let parameters = {} as Parameters;
        if ('object' === typeof key) {
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
    clear(): KarmiaLambdaJSONRPC {
        const self = this;
        self.parameters = {};

        return self;
    }


    /**
     * List parameters
     *
     * @returns {Object}
     */
    list(): Parameters {
        const self = this;

        return self.parameters || {};
    }

    /**
     * Get parameter
     *
     * @param   {string} path
     * @returns {*}
     */
    get(path?: string): any {
        const self = this;
        function parameter (object: Parameters, path?: string): any {
            path = path || '';
            const properties = path.split('.'),
                result = object[properties[0]];
            if (result instanceof Object) {
                return (1 < properties.length) ? parameter(result, path.substring(path.indexOf('.') + 1)) : result;
            }

            return (1 < properties.length) ? undefined : result;
        }

        if (!path) {
            return self.parameters || {};
        }

        return parameter(self.parameters, path);
    }

    /**
     * Call method
     *
     * @param {Object} event
     * @param {Object} context
     * @param {Array|Object} body
     * @returns {*}
     */
    call(event: Parameters, context: Parameters, body?: Parameters): any {
        const self = this;
        body = body || event.body;

        return self.methods.call.call(self, event, context, body, self.parameters);
    }
}


// Export modules
export = KarmiaLambdaJSONRPC;



/*
 * Local variables:
 * tab-width: 4
 * c-basic-offset: 4
 * c-hanging-comment-ender-p: nil
 * End:
 */
