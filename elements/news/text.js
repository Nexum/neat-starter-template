"use strict";

var Element = require("neat-elements").Element;
var Promise = require("bluebird");

module.exports = class Text extends Element {
    executeText(resolve) {
        resolve({
            data: this.req.activePageItem
        });
    }
}