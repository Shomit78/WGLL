myApp.controller('RegionsController', ['$scope', 'SharePointJSOMService', function ($scope, SharePointJSOMService) {
    SP.SOD.executeOrDelayUntilScriptLoaded(OnLoad, "SP.js");
    function OnLoad() {
        $scope.regions = [];

        $.when(SharePointJSOMService.getItems($scope, 'Regions'))
        .done(function (jsonObject) {
            angular.forEach(jsonObject.d.results, function (region) {
                $scope.regions.push({
                    title: region.Title,
                    id: region.ID
                });
                //$scope is not updating so force with this command
                if (!$scope.$$phase) { $scope.$apply(); }
            });
        })
        .fail(function (err) {
            console.info(JSON.stringify(err));
        });

    }
}]);