/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4: */
/* eslint-env es6, mocha, node */
/* eslint-extends: eslint:recommended */
'use strict';



// Variables
const fs = require('fs'),
    path = require('path');


// Export modules
module.exports = fs.readdirSync(__dirname).reduce((collection, filename) => {
    if ('index.js' === filename) {
        return collection;
    }

    const name = filename.replace(path.extname(filename), '');
    collection[name] = require(path.resolve(__dirname, name));

    return collection;
}, {});



/*
 * Local variables:
 * tab-width: 4
 * c-basic-offset: 4
 * c-hanging-comment-ender-p: nil
 * End:
 */

