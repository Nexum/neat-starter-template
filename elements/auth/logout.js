"use strict";

var Element = require("neat-elements").Element;

module.exports = class Logout extends Element {

    executeLogout(resolve) {
        this.req.logout();
        resolve({
            REDIRECT_TO: "/"
        });
    }

}