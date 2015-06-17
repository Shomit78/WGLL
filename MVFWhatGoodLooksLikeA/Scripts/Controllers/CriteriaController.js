myApp.controller('CriteriaController', ['$scope', 'SharePointJSOMService', function ($scope, SharePointJSOMService) {
    SP.SOD.executeOrDelayUntilScriptLoaded(OnLoad, "SP.js");
    function OnLoad() {
        $scope.criteria = [];

        $.when(SharePointJSOMService.getItemsFromHostWebWithParams($scope, 'Criteria', 'Title,ID,CriteriaOrder,CriteriaDetail', '', '', 'CriteriaOrder'))
        .done(function (jsonObject) {
            angular.forEach(jsonObject.d.results, function (criteria) {
                $scope.criteria.push({
                    title: criteria.Title,
                    id: criteria.ID,
                    detail: criteria.CriteriaDetail,
                    order: criteria.CriteriaOrder
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
//