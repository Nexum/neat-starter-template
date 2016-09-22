#!/usr/bin/env node
"use strict";

var commander = require("commander");
var fs = require("fs");
var Tools = require("neat-base").Tools;
var Application = require("neat-base").Application;
var Promise = require("bluebird");

var scriptRootPath = __dirname + "/scripts";
var commandRunning = false;

// Setup default command line options
commander.option("-v, --verbose", "Script verbosity");
commander.option("-q, --quiet", "Disables script output");
commander.option("-V, --view", "Enables view stage");
commander.option("-d, --dev", "Enables dev stage");

// Parse all script package.json files
new Promise((resolve, reject) => {
    fs.readdir(scriptRootPath, (err, data) => {
        if (err) {
            return reject(err);
        }
        return resolve(data);
    })
}).then((files) => {
    return Promise.all(files.map((script) => {
        return new Promise((resolve, reject)=> {
            var packageData = null;

            return new Promise((resolve) => {
                fs.readFile(scriptRootPath + "/" + script + "/package.json", (err, data) => {
                    if (err) {
                        return reject(err);
                    }

                    return resolve(data);
                });
            }).then((packageJson) => {
                packageData = JSON.parse(packageJson.toString());
                packageData.scriptConfig = null;

                return new Promise((resolve) => {
                    fs.readFile(scriptRootPath + "/" + script + "/script.json", (err, data) => {
                        if (err) {
                            return reject(err);
                        }

                        return resolve(data);
                    });
                })
            }).then((data) => {
                var scriptConfig = JSON.parse(data.toString());
                packageData.scriptConfig = scriptConfig;
                packageData.scriptConfig.arguments = packageData.scriptConfig.arguments || [];
                packageData.scriptConfig.useLockFile = packageData.scriptConfig.useLockFile || false;
                return Promise.resolve();
            }).then(() => {
                var command = commander.command(packageData.name);
                command.description(packageData.description);

                var requiredArguments = [];

                for (var i = 0; i < packageData.scriptConfig.arguments.length; i++) {
                    var argument = packageData.scriptConfig.arguments[i];
                    argument.shortName = argument.shortName ? argument.shortName[0].toLowerCase() : undefined;

                    if (argument.required) {
                        requiredArguments.push(argument.longName || argument.shortName)
                    }

                    if (argument.shortName) {
                        argument.shortName = "-" + argument.shortName[0].toLowerCase();
                    }
                    if (argument.longName) {
                        argument.longName = "--" + argument.longName;
                    }

                    if (argument.isArgument) {
                        command.arguments(argument.name);
                    } else {
                        command.option([
                            argument.shortName,
                            argument.longName
                        ].filter(val => !!val).join(", "), argument.description);
                    }
                }

                command.action(function () {
                    commandRunning = true;

                    var stage = process.env.STAGE || process.env.NODE_ENV || "dev";

                    if (this.parent.view) {
                        stage = "view";
                    } else if (this.parent.dev) {
                        stage = "dev"
                    }

                    var logLevel = "info";
                    if (this.parent.dev || this.parent.verbose) {
                        logLevel = "debug";
                    }
                    if (this.parent.quiet) {
                        logLevel = "error"
                    }

                    var opts = this.opts();
                    var args = {};

                    try {
                        for (var i = 0; i < requiredArguments.length; i++) {
                            var arg = requiredArguments[i];
                            if (!opts[arg]) {
                                throw new Error("Missing argument " + arg + "!");
                            }
                        }

                        for (var i = 0; i < arguments.length; i++) {
                            if (this._args[i]) {
                                var argName = this._args[i].name;
                                var argValue = arguments[i];

                                args[argName] = argValue;
                            }
                        }

                        Application.configure({
                            // STAGE
                            stage: stage,
                            stages: [
                                "prod",
                                "view",
                                "dev"
                            ],

                            // PATHS
                            root_path: __dirname,
                            modules_path: __dirname + "/modules",
                            config_path: __dirname + "/config",
                            scripts_path: scriptRootPath,
                            application_config_path: __dirname + "/config/application",

                            // LOG LEVELS
                            logLevelConsole: logLevel,
                            logLevelFile: logLevel,
                            logLevelRemote: logLevel,
                            logFormat: "DD.MM.YYYY hh:mm:ss",
                            logDir: __dirname + "/logs",
                            logDisabled: false,
                            quiet: !!this.parent.quiet,
                        });

                        packageData.options = opts;
                        packageData.arguments = args;
                        Application.runScript(packageData);
                    } catch (err) {
                        command.help((helpText) => {
                            var message = err.toString() + "\n";
                            return message + helpText;
                        })
                    }

                    process.on('exit', function () {
                        Application.stop();
                    });
                });

                command._helpInformation = command.helpInformation;
                command.helpInformation = function () {
                    var oldName = this._name;
                    this._name = this.parent.name() + " " + this._name;
                    var ret = this._helpInformation();
                    this._name = oldName;
                    return ret;
                };
                command.optionHelp = function () {
                    var width = Math.max(this.largestOptionLength(), this.parent.largestOptionLength());

                    // Prepend the help information
                    return [].concat(this.options.map(function (option) {
                        return Tools.pad(option.flags, width) + '  ' + option.description;
                    })).concat([
                        "",
                        "Global options:"
                    ]).concat([
                        Tools.pad("-h, --help", width) + "  output usage information"
                    ]).concat(this.parent.options.map(function (option) {
                        return Tools.pad(option.flags, width) + '  ' + option.description;
                    })).join('\n');
                };

                resolve();
            });
        });
    }));
}).then(() => {
    commander.parse(process.argv);

    if (commander.verbose && commander.quiet) {
        throw new Error("Can't use --verbose and --quiet at the same time!");
    }

    if (commander.view && commander.dev) {
        throw new Error("Can't use --view and --dev at the same time!");
    }

    if (!commandRunning) {
        commander.outputHelp();
        process.exit(0);
    }
}).catch((err) => {
    commander.help((helpText) => {
        var message = err.toString() + "\n";
        return message + helpText;
    })
});