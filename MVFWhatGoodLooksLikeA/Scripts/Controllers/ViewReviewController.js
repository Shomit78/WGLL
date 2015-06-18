myApp.controller('ViewReviewController', ['$scope', 'SharePointJSOMService', '$location', '$routeParams', function ($scope, SharePointJSOMService, $location, $routeParams) {
    SP.SOD.executeOrDelayUntilScriptLoaded(ViewReviewControllerOnLoad, "SP.js");
    function ViewReviewControllerOnLoad() {

        var currentReviewId = $routeParams.ReviewId;
        var filterByReviewId = "Title eq '" + currentReviewId + "'";
        $scope.reviews = [];

        $.when(SharePointJSOMService.getItemsFromHostWebWithParams($scope, 'Reviews', 'Title,ID,WGLLStatus,WGLLStore,WGLLVisitType,WGLLVisitSummary,WGLLNotes', '', filterByReviewId, ''))
        .done(function (jsonObject) {
            angular.forEach(jsonObject.d.results, function (review) {
                $scope.reviews.push({
                    id: review.ID,
                    title: review.Title,
                    status: review.WGLLStatus,
                    store: review.WGLLStore,
                    visitType: review.WGLLVisitType,
                    visitSummary: review.WGLLVisitSummary,
                    notes: review.WGLLNotes
                });
                console.log(review.ID + ";" + review.Title);
                if (!$scope.$$phase) { $scope.$apply(); }
            });
        })
        .fail(function (err) {
            console.info(JSON.stringify(err));
        });

        $scope.goTo = function (path) {
            $location.path(path);
        };

        $scope.edit = function () {
        }

    }
}]);