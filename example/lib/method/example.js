/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4: */
/* eslint-env es6, mocha, node */
/* eslint-extends: eslint:recommended */
'use strict';



// Export module
module.exports = {
    /**
     * Test method
     *
     * @params {Object} event
     * @params {Object} context
     * @params {Object} parameters
     * @returns {Promise}
     */
    hello(event, context, parameters) {
        const service = this.get('service');

        // Exclude invalid parameters
        const params = ['name'].reduce((collection, key) => {
                collection[key] = parameters[key];

                return collection;
            });

        return service.test.hello({name: parameters.name});
    }
}



/*
 * Local variables:
 * tab-width: 4
 * c-basic-offset: 4
 * c-hanging-comment-ender-p: nil
 * End:
 */

