"use strict";

// @IMPORTS
var Application = require("neat-base").Application;
var Promise = require("bluebird");
var speakingurl = require("speakingurl");
var mongoose = require('mongoose');

var schema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        index: true
    },
    text: {
        type: String,
        required: true,
        index: true
    }
}, {
    permissions: {
        find: true,
        findOne: true,
        count: true,
        save: false,
        remove: false
    },
    toJSON: {
        virtuals: true
    },
    toObject: {
        virtuals: true
    }
});

schema.methods.getRoutingUrl = function () {
    return new Promise((resolve, reject) => {
        resolve();
    })
}

module.exports = schema;
