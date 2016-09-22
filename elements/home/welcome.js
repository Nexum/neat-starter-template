"use strict";

var Element = require("neat-elements").Element;
var Promise = require("bluebird");

module.exports = class Welcome extends Element {
    executeWelcome(resolve) {
        resolve();
    }
}