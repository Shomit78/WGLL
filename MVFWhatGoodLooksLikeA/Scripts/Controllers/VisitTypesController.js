myApp.controller('VisitTypesController', ['$scope', 'SharePointJSOMService', function ($scope, SharePointJSOMService) {
    SP.SOD.executeOrDelayUntilScriptLoaded(OnLoad, "SP.js");
    function OnLoad() {
        $scope.visitTypes = [];

        $.when(SharePointJSOMService.getItemsFromHostWeb($scope, 'VisitTypes'))
        .done(function (jsonObject) {
            angular.forEach(jsonObject.d.results, function (visitType) {
                $scope.visitTypes.push({
                    title: visitType.Title,
                    id: visitType.ID
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