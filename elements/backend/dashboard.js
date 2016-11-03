"use strict";

var Element = require("neat-elements").Element;
var Promise = require("bluebird");

module.exports = class Header extends Element {
    executeHeader(resolve) {
        resolve();
    }
}