myApp.controller('ReviewsController', ['$scope', 'SharePointJSOMService', function ($scope, SharePointJSOMService) {
    SP.SOD.executeOrDelayUntilScriptLoaded(OnLoad, "SP.js");
    function OnLoad() {
        $scope.reviews = [];
        $scope.regions = [];

        $.when(SharePointJSOMService.getItemsFromAppWebWithParams($scope, 'Reviews', 'Title,ID,Status,Store,VisitType,Author/Title,Created', 'Author', '', 'Created'))
        .done(function (jsonObject) {
            angular.forEach(jsonObject.d.results, function (review) {
                $scope.reviews.push({
                    title: review.Title,
                    id: review.ID,
                    status: review.Status,
                    store: review.Store,
                    visitType: review.VisitType,
                    author: review.Author.Title,
                    created: review.Created
                });
                //$scope is not updating so force with this command
                if (!$scope.$$phase) { $scope.$apply(); }
            });
        })
        .fail(function (err) {
            console.info(JSON.stringify(err));
        });

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
        })
        .fail(function (err) {
            console.info(JSON.stringify(err));
        });

    }
}]);