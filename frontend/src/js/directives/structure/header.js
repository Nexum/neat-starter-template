"use strict";


export default function () {
    return {
        transclude: true,
        template: "<ng-transclude></ng-transclude>",
        controller: [
            "$scope",
            function ($scope) {
                $scope.message = "This is Hello from Angular!";
            }
        ]
    }
}