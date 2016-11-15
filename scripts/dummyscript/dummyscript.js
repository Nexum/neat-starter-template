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
        Application.registerModule("database", require("neat-database"));
        Application.registerModule("file", require("neat-file"));
    }

    init(resolve, reject) {
        resolve();
    }

    run(resolve, reject) {
        var name = this.options.user || "World";
        var say = this.config.say || "Hello ";
        this.log.info(say + name);


        var newsModel = Application.modules.database.getModel("news");

        new newsModel({
            title: "Hello World",
            text: "<h1>Hello World</h1><p>This is a news article for testing routing with models</p>"
        }).save().then(() => {
            return Application.modules.file.importFromUrl("https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/FuBK_testcard_vectorized.svg/2000px-FuBK_testcard_vectorized.svg.png")
        }, reject).then(resolve, reject);


    }
};