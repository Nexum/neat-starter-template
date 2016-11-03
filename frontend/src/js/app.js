"use strict";

import jQuery from 'expose?jQuery!jquery'
window.$ = jQuery;
import bootstrap from "bootstrap";
import ng from 'angular'
import ngResource from 'angular-resource'
import ngCookies from 'angular-cookies'
import angularMoment from 'angular-moment'
import ngTouch from 'angular-touch'

const MODULE_NAME = 'neat-starter-template';

function toTitleCase(str) {
    return str.replace(/\w\S*/g, function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}

export default class Application {

    constructor() {
        throw "Cannot construct singleton";
    }

    static run() {
        // for browsers without console...
        if (typeof console === "undefined") {
            window.console = {
                log: function () {
                },
                group: function () {
                },
                groupEnd: function () {
                }
            };
        }

        var app = ng.module(MODULE_NAME, [
            "ngCookies",
            "ngTouch",
            "ngResource",
            "angularMoment"
        ]);

        var directiveContext = require.context("./directives", true, /^.*\.js$/);
        directiveContext.keys().forEach(function (directivePath) {
            var parts = directivePath.split("/");
            parts.shift();
            var firstPart = parts.shift();
            firstPart = firstPart.replace(/^\./ig, "").toLowerCase();
            var directiveName = firstPart + toTitleCase(parts.join(" ")).split(" ").join("");
            directiveName = directiveName.replace(/\.js$/i, "");
            directivePath = directivePath.replace(/^\.\//i, "");
            app.directive(directiveName, require("./directives/" + directivePath).default);
        });

        var serviceContext = require.context("./services", true, /^.*\.js$/);
        serviceContext.keys().forEach(function (servicePath) {
            var parts = servicePath.split("/");
            parts.shift();
            var firstPart = parts.shift();
            firstPart = firstPart.replace(/^\./ig, "").toLowerCase();
            var serviceName = firstPart + toTitleCase(parts.join(" ")).split(" ").join("");
            serviceName = serviceName.replace(/\.js$/i, "");
            servicePath = servicePath.replace(/^\.\//i, "");
            app.service(serviceName, require("./services/" + servicePath).default);
        });

        var filterContext = require.context("./filters", true, /^.*\.js$/);
        filterContext.keys().forEach(function (filterPath) {
            var parts = filterPath.split("/");
            parts.shift();
            var firstPart = parts.shift();
            firstPart = firstPart.replace(/^\./ig, "").toLowerCase();
            var filterName = firstPart + toTitleCase(parts.join(" ")).split(" ").join("");
            filterName = filterName.replace(/\.js$/i, "");
            filterPath = filterPath.replace(/^\.\//i, "");
            app.filter(filterName, require("./filters/" + filterPath).default);
        });

        var controllerContext = require.context("./controllers", true, /^.*\.js$/);
        controllerContext.keys().forEach(function (filterPath) {
            var parts = filterPath.split("/");
            parts.shift();
            var firstPart = parts.shift();
            firstPart = firstPart.replace(/^\./ig, "").toLowerCase();
            var filterName = firstPart + toTitleCase(parts.join(" ")).split(" ").join("");
            filterName = filterName.replace(/\.js$/i, "");
            filterPath = filterPath.replace(/^\.\//i, "");
            app.controller(filterName, require("./controllers/" + filterPath).default);
        });

        ng.element(document).ready(function () {
            ng.bootstrap(document, [MODULE_NAME]);
        });
    }
}
