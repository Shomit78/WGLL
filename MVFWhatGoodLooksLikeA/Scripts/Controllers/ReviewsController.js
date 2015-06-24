﻿myApp.controller('ReviewsController', ['$scope', 'SharePointJSOMService', '$location', function ($scope, SharePointJSOMService, $location) {
    SP.SOD.executeOrDelayUntilScriptLoaded(ReviewsControllerOnLoad, "SP.js");
    function ReviewsControllerOnLoad() {
        $scope.reviews = [];

        $.when(SharePointJSOMService.getItemsFromHostWebWithParams($scope, 'Reviews', 'Title,ID,WGLLRegion,WGLLStatus,WGLLStore,WGLLVisitType,Author/Title,Created', 'Author/Title', '', 'Created'))
        .done(function (jsonObject) {
            angular.forEach(jsonObject.d.results, function (review) {
                $scope.reviews.push({
                    title: review.Title,
                    id: review.ID,
                    region: review.WGLLRegion,
                    status: review.WGLLStatus,
                    store: review.WGLLStore,
                    visitType: review.WGLLVisitType,
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

    }
    $scope.goTo = function (path) {
        $location.path(path);
    };
}]);