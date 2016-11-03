"use strict";

var Element = require("neat-elements").Element;
var Promise = require("bluebird");

module.exports = class Footer extends Element {
    executeFooter(resolve) {
        resolve();
    }
}