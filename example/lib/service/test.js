/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4: */
/* eslint-env es6, mocha, node */
/* eslint-extends: eslint:recommended */
'use strict';



// Export module
module.exports = {
    /**
     * Test service method
     *
     * @params {Object} parameters
     * @returns {string}
     */
    hello(parameters) {
        if (parameters.name) {
            return Promise.resolve("Hello, " + parameters.name + ".");
        }

        const error = new Error('Bad request');
        error.data = 'Parameter "name" is required.';
        return Promise.reject(error);
    }
};



/*
 * Local variables:
 * tab-width: 4
 * c-basic-offset: 4
 * c-hanging-comment-ender-p: nil
 * End:
 */

