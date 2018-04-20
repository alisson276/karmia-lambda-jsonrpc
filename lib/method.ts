/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4: */
/* eslint-env es6, mocha, node */
/* eslint-extends: eslint:recommended */
'use strict';



// Import modules
import KarmiaConverterJSONRPC = require("karmia-converter-jsonrpc");
import KarmiaLambdaJSONRPC = require("../");


// Declarations
declare interface Methods {
    [index: string]: Function|{[index: string]: any};
}

declare interface Parameters {
    [index: string]: any;
}

declare interface JSONRPCRequest {
    jsonrpc?: string;
    method?: string;
    params?: any;
    id: any;
}

declare class JSONRPCError extends Error {
    code?: number;
    data?: any;
}



/**
 * KarmiaLambdaJSONRPCMethod
 *
 * @class
 */
class KarmiaLambdaJSONRPCMethod {
    /**
     * Properties
     */
    public converter: KarmiaConverterJSONRPC;
    public methods: {[index: string]: Function|object};


    /**
     * Constructor
     *
     * @constructs KarmiaLambdaJSONRPC
     * @returns {Object}
     */
    constructor(options?: Methods) {
        this.converter = new KarmiaConverterJSONRPC();
        this.methods = {};

        return this.set(options || {});
    }

    /**
     * Set methods
     *
     * @param   {string} key
     * @param   {Function|Object} value
     * @returns {Object}
     */
    set(key: Methods|string, value?: any): KarmiaLambdaJSONRPCMethod {
        const self = this;

        let methods = {} as {[index: string]: any};
        if ('object' === typeof key) {
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
    clear(): KarmiaLambdaJSONRPCMethod {
        const self = this;
        self.methods = {};

        return self;
    }

    /**
     * Get method
     *
     * @param   {string} [path]
     * @returns {Function}
     */
    get(path?: string): Function|Methods|undefined {
        const self = this;
        function method (object: Methods, path?: string): Function|Methods|undefined {
            path = path || '';
            const properties = path.split('.'),
                result = object[properties[0]] as Methods;
            if ('object' === typeof result) {
                return (1 < properties.length) ? method(result, path.substring(path.indexOf('.') + 1)) : result;
            }

            return (1 < properties.length) ? undefined : result;
        }

        return method(self.methods, path);
    }

    /**
     * List methods
     *
     * @returns {Object}
     */
    list(): Methods {
        const self = this;

        return self.methods || {};
    }

    /**
     * Call method
     *
     * @param {Object} event
     * @param {Object} [context]
     * @param {Array|Object} [body]
     * @param {Object} [parameters]
     */
    call(this: KarmiaLambdaJSONRPC, event: Parameters, context?: Parameters, body?: Array<Parameters>|Parameters, parameters?: Parameters) {
        body = body || event.body;

        const self = this,
            batch = Array.isArray(body),
            requests = (batch) ? body : [body],
            parallels = requests.reduce((collection: Parameters, request: JSONRPCRequest) => {
                if (!request.method || '2.0' !== request.jsonrpc) {
                    const error = new Error('Invalid request') as JSONRPCError;
                    error.code = -32600;

                    collection.push(Promise.resolve(error));

                    return collection;
                }

                const method = request.method || '',
                    params = Object.assign({}, parameters || {}, request.params || {}),
                    func = self.methods.get(method) as Function;
                if (!func) {
                    const error = new Error('Method not found') as JSONRPCError;
                    error.code = -32601;

                    collection.push(Promise.resolve(error));

                    return collection;
                }

                collection.push(func.call(self, event, context, Object.assign({params: params}, params)).catch((error: Error) => {
                    return Promise.resolve(error);
                }));

                return collection;
            }, []);

        return Promise.all(parallels).then((result) => {
            return self.converter.convert(body, (batch) ? result : result[0]);
        }).then((result) => {
            return {
                status: (null === result) ? 204 : 200,
                body: result
            };
        });
    }
}


// Export modules
export = KarmiaLambdaJSONRPCMethod;



/*
 * Local variables:
 * tab-width: 4
 * c-basic-offset: 4
 * c-hanging-comment-ender-p: nil
 * End:
 */
