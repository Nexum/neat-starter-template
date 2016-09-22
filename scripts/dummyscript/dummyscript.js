"use strict";

// @IMPORTS
var Script = require("neat-base").Script;
var Application = require("neat-base").Application;
var Tools = require("neat-base").Tools;
var Promise = require("bluebird");

module.exports = class DummyScript extends Script {
    static defaultConfig() {
        return {
            "say": "Hello "
        }
    }

    static registerModules() {
        Application.registerModule("cache", require("neat-cache"));
    }

    init(resolve, reject) {
        resolve();
    }

    run(resolve, reject) {
        console.log(Application.modules);
        var name = this.options.user || "World";
        var say = this.config.say || "Hello ";
        this.log.info(say + name);
        resolve();
    }
};