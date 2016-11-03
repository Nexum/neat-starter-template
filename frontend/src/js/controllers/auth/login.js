"use strict";


export default [
    "$scope",
    "$location",
    "api",
    function ($scope, $location, api) {
        $scope.data = {
            username: "",
            password: "",
            remember: false
        };

        $scope.error = "";

        $scope.login = function () {
            api.login($scope.data).$promise.then(() => {
                if ($location.$$search.return) {
                    window.location = $location.$$search.return;
                } else {
                    window.location = "/";
                }
            }, function (err) {
                $scope.error = err.data.message;
            });
        }
    }
]