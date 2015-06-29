myApp.controller('ReviewsController', ['$scope', 'SharePointJSOMService', '$location', function ($scope, SharePointJSOMService, $location) {
    SP.SOD.executeOrDelayUntilScriptLoaded(ReviewsControllerOnLoad, "SP.js");
    function ReviewsControllerOnLoad() {

        //$scope variables
        $scope.reviews = [];

        //Get list of saved reviews created by current user
        $.when(SharePointJSOMService.getUserProfileItemsFromHostWebAll($scope))
        .done(function (jsonObject) {
            angular.forEach(jsonObject, function (user) {
                var filter = sharePointConfig.fields.sharepoint.author + "/" + sharePointConfig.fields.sharepoint.title + " eq '" + user.DisplayName + "'";
                $.when(SharePointJSOMService.getItemsFromHostWebWithParams($scope, sharePointConfig.lists.reviews,
                    sharePointConfig.fields.sharepoint.title + ',' + sharePointConfig.fields.sharepoint.id + ',' +
                    sharePointConfig.fields.reviews.region + ',' + sharePointConfig.fields.reviews.status + ',' +
                    sharePointConfig.fields.reviews.store + ',' + sharePointConfig.fields.reviews.visitType + ',' +
                    sharePointConfig.fields.sharepoint.author + '/' + sharePointConfig.fields.sharepoint.title +
                    ',' + sharePointConfig.fields.reviews.submittedDate,
                    sharePointConfig.fields.sharepoint.author + '/' + sharePointConfig.fields.sharepoint.title, filter, sharePointConfig.fields.sharepoint.id + ' desc'))
                .done(function (jsonObject) {
                    angular.forEach(jsonObject.d.results, function (review) {
                        if (review.WGLLStatus == "Saved") {
                            $scope.reviews.push({
                                title: review.Title,
                                id: review.ID,
                                region: review.WGLLRegion,
                                status: review.WGLLStatus,
                                store: review.WGLLStore,
                                visitType: review.WGLLVisitType,
                                author: review.Author.Title,
                                submittedDate: review.WGLLSubmittedDate
                            });
                        }
                        //$scope is not updating so force with this command
                        if (!$scope.$$phase) { $scope.$apply(); }
                    });
                })
                .fail(function (err) {
                    SP.UI.Notify.addNotification(sharePointConfig.messages.defaultError, false);
                    console.info(JSON.stringify(err));
                });
            });
        })
        .fail(function (err) {
            SP.UI.Notify.addNotification(sharePointConfig.messages.defaultError, false);
            console.info(JSON.stringify(err));
        });

    }

    //Routing
    $scope.goTo = function (path) {
        $location.path(path);
    };

}]);