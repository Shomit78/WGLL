myApp.controller('CreateReviewController', ['$scope', 'SharePointJSOMService', '$location', function ($scope, SharePointJSOMService, $location) {
    SP.SOD.executeOrDelayUntilScriptLoaded(OnLoad, "SP.js");
    function OnLoad() {
        $scope.regions = [];
        $scope.stores = [];
        $scope.visitTypes = [];

        $.when(SharePointJSOMService.getItemsFromHostWebWithSelect($scope, 'Regions', 'Title,ID'))
        .done(function (jsonObject) {
            angular.forEach(jsonObject.d.results, function (region) {
                $scope.regions.push({
                    title: region.Title,
                    id: region.ID
                });
                //$scope is not updating so force with this command
                if (!$scope.$$phase) { $scope.$apply(); }
            });
            $('#wgllSelectRegion').removeAttr("disabled");
        })
        .fail(function (err) {
            console.info(JSON.stringify(err));
        });

        $.when(SharePointJSOMService.getItemsFromHostWebWithSelect($scope, 'Stores', 'Title,ID'))
        .done(function (jsonObject) {
            angular.forEach(jsonObject.d.results, function (store) {
                $scope.stores.push({
                    title: store.Title,
                    id: store.ID
                });
                //$scope is not updating so force with this command
                if (!$scope.$$phase) { $scope.$apply(); }
            });
            $('#wgllSelectStore').removeAttr("disabled");
        })
        .fail(function (err) {
            console.info(JSON.stringify(err));
        });

        $.when(SharePointJSOMService.getItemsFromHostWebWithSelect($scope, 'VisitTypes', 'Title,ID'))
        .done(function (jsonObject) {
            angular.forEach(jsonObject.d.results, function (visitType) {
                $scope.visitTypes.push({
                    title: visitType.Title,
                    id: visitType.ID
                });
                //$scope is not updating so force with this command
                if (!$scope.$$phase) { $scope.$apply(); }
            });
            $('#wgllSelectVisitType').removeAttr("disabled");
        })
        .fail(function (err) {
            console.info(JSON.stringify(err));
        });

        $('#wgllButtonCreateReview').removeAttr("disabled");
        
    }

    $scope.goTo = function (path) {
        $location.path(path);
    };

}]);