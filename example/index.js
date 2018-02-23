/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4: */
/* eslint-env es6, mocha, node */
/* eslint-extends: eslint:recommended */
'use strict';



// Test parameters
const context = {};
const event = {
    body: {
        jsonrpc: '2.0',
        method: 'example.hello',
        params: {name: 'world'},
        id: 1
    }
}


// Setup
const karmia_jsonrpc = require('karmia-lambda-jsonrpc');
const jsonrpc = karmia_jsonrpc();
jsonrpc.set('service', require('./lib/service'));
jsonrpc.methods.set(require('./lib/method'));


// Test execution
(async () => {
    try {
        const result = await jsonrpc.call(event, context, event.body);
        console.log(result); // Hello, world.
    } catch (error) {
        console.error(error);
    }
})();



/*
 * Local variables:
 * tab-width: 4
 * c-basic-offset: 4
 * c-hanging-comment-ender-p: nil
 * End:
 */

