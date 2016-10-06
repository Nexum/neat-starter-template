"use strict";

var Application = require("neat-base").Application;
var stage = (process.env.STAGE || process.env.NODE_ENV || "dev").toLowerCase();

Application.configure({
    // STAGE
    stage: stage,
    stages: [
        "prod",
        "view",
        "dev"
    ],

    //homepage_atelier-kienzler

    // PATHS
    root_path: __dirname,
    modules_path: __dirname + "/modules",
    config_path: __dirname + "/config",
    application_config_path: __dirname + "/config/application",

    // LOG LEVELS
    logLevelConsole: stage == "dev" ? "debug" : "info",
    logLevelFile: stage == "dev" ? "info" : "info",
    logLevelRemote: stage == "dev" ? "debug" : "info",
    logFormat: "DD.MM.YYYY hh:mm:ss",
    logDir: __dirname + "/logs"
});

// RESOURCES
Application.registerModule("webserver", require("neat-webserver"));
Application.registerModule("sockets", require("neat-sockets"));
Application.registerModule("database", require("neat-database"));
Application.registerModule("cache", require("neat-cache"));
Application.registerModule("auth", require("neat-auth"));
Application.registerModule("elements", require("neat-elements"));

// FRONTENDS
Application.registerModule("api", require("neat-api"));
Application.registerModule("frontend", require("neat-frontend"));

Application.run();

process.on('SIGINT', function () {
    Application.stop();
});

process.on('exit', function () {
    Application.stop();
});