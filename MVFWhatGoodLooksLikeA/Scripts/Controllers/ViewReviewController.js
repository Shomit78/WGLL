myApp.controller('ViewReviewController', ['$scope', 'SharePointJSOMService', '$location', '$routeParams', function ($scope, SharePointJSOMService, $location, $routeParams) {
    SP.SOD.executeOrDelayUntilScriptLoaded(ViewReviewControllerOnLoad, "SP.js");
    function ViewReviewControllerOnLoad() {

        $scope.goTo = function (path) {
            $location.path(path);
        };

        $scope.edit = function () {
        }

    }
}]);