"use strict";

export default [
    "$resource",
    "$location",
    function ($resource, $location) {
        var rootUrl = "//" + $location.host() + ":" + $location.port();

        return $resource(rootUrl, {}, {
            // AUTH
            login: {
                url: rootUrl + "/auth/login",
                method: "POST",
                isArray: false,
                params: {}
            },
            logout: {
                url: rootUrl + "/auth/logout",
                method: "POST",
                isArray: false,
                params: {}
            },
            resetPassword: {
                url: rootUrl + "/auth/resetPassword",
                method: "POST",
                isArray: false,
                params: {}
            },
            register: {
                url: rootUrl + "/auth/register",
                method: "POST",
                isArray: false,
                params: {}
            },

            // API
            find: {
                url: rootUrl + "/api/:model/find",
                method: "POST",
                isArray: true,
                params: {
                    model: '@model'
                }
            },
            findOne: {
                url: rootUrl + "/api/:model/findOne",
                method: "POST",
                params: {
                    model: '@model'
                }
            },
            versions: {
                url: rootUrl + "/api/:model/versions",
                method: "POST",
                isArray: true,
                params: {
                    model: '@model'
                }
            },
            save: {
                url: rootUrl + "/api/:model/save",
                method: "POST",
                params: {
                    model: '@model'
                }
            },
            remove: {
                url: rootUrl + "/api/:model/remove",
                method: "POST",
                params: {
                    model: '@model'
                }
            },
            count: {
                url: rootUrl + "/api/:model/count",
                method: "POST",
                params: {
                    model: "@model"
                }
            },
            pagination: {
                url: rootUrl + "/api/:model/pagination",
                method: "POST",
                params: {
                    model: "@model"
                }
            }
        });
    }
]
