myApp.controller('SubsetsController', ['$scope', 'SharePointJSOMService', function ($scope, SharePointJSOMService) {
    SP.SOD.executeOrDelayUntilScriptLoaded(OnLoad, "SP.js");
    function OnLoad() {
        $scope.subsets = [];
        var subsetFilter = "SubsetActive eq 1";

        $.when(SharePointJSOMService.getItemsWithParams($scope, 'Subsets', 'Title,ID,SubsetDetail,SubsetOrder', '', subsetFilter, 'SubsetOrder'))
        .done(function (jsonObject) {
            angular.forEach(jsonObject.d.results, function (subset) {
                var crit = [];
                var filter = "Subset/ID eq " + subset.ID;
                $.when(SharePointJSOMService.getItemsWithParams($scope, 'Criteria', 'Title,ID,CriteriaDetail,Subset/ID', 'Subset/ID', filter, 'CriteriaOrder'))
                .done(function (jsonObject) {
                    angular.forEach(jsonObject.d.results, function (criteria) {
                        crit.push({
                            title: criteria.Title,
                            id: criteria.ID,
                            detail: criteria.CriteriaDetail
                        });
                        //$scope is not updating so force with this command
                        if (!$scope.$$phase) { $scope.$apply(); }
                    });
                })
                .fail(function (err) {
                    console.info(JSON.stringify(err));
                });
                $scope.subsets.push({
                    title: subset.Title,
                    id: subset.ID,
                    order: subset.SubsetOrder,
                    detail: subset.SubsetDetail,
                    criteria: crit
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