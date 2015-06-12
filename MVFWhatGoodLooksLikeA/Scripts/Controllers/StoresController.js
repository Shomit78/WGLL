myApp.controller('StoresController', ['$scope', 'SharePointJSOMService', function ($scope, SharePointJSOMService) {
    SP.SOD.executeOrDelayUntilScriptLoaded(OnLoad, "SP.js");
    function OnLoad() {
        $scope.stores = [];

        $.when(SharePointJSOMService.getItems($scope, 'Stores'))
        .done(function (jsonObject) {
            angular.forEach(jsonObject.d.results, function (store) {
                $scope.stores.push({
                    title: store.Title,
                    id: store.ID
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