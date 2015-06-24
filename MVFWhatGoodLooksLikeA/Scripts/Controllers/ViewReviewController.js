myApp.controller('ViewReviewController', ['$scope', 'SharePointJSOMService', '$location', '$routeParams', function ($scope, SharePointJSOMService, $location, $routeParams) {
    SP.SOD.executeOrDelayUntilScriptLoaded(ViewReviewControllerOnLoad, "SP.js");
    function ViewReviewControllerOnLoad() {

        var currentReviewId = $routeParams.ReviewId;
        var filterByReviewId = "Title eq '" + currentReviewId + "'";
        var filterAnswersByReviewId = "WGLLReviewID eq '" + currentReviewId + "'";
        $scope.reviews = [];
        $scope.answers = [];
        $scope.subsets = [];
        $scope.tempSubsets = [];

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
            $.when(SharePointJSOMService.getItemsFromHostWebWithParams($scope, 'Answers', 'Title,ID,WGLLCriteriaDetail,WGLLResult,WGLLSubset,WGLLNonNegotiable,WGLLReasonForFailure', '', filterAnswersByReviewId, ''))
                .done(function (jsonObject) {
                    angular.forEach(jsonObject.d.results, function (answer) {
                        $scope.answers.push({
                            id: answer.ID,
                            title: answer.Title,
                            subset: answer.WGLLSubset,
                            criteriaDetail: answer.WGLLCriteriaDetail,
                            reasonForFailure: answer.WGLLReasonForFailure,
                            result: answer.WGLLResult
                        });
                    });
                    if (!$scope.$$phase) { $scope.$apply(); }
                    $.when(SharePointJSOMService.getItemsFromHostWebWithParams($scope, 'Subsets', 'Title,ID,SubsetDetail,SubsetOrder', '', '', 'SubsetOrder'))
                     .done(function (jsonObject) {
                         angular.forEach(jsonObject.d.results, function (subset) {
                             $scope.tempSubsets.push({
                                 title: subset.Title,
                                 id: subset.ID,
                                 order: subset.SubsetOrder,
                                 detail: subset.SubsetDetail
                             });
                         });
                         //$scope is not updating so force with this command
                         if (!$scope.$$phase) { $scope.$apply(); }
                         iterateSubsets();
         })
         .fail(function (err) {
             console.info(JSON.stringify(err));
         });
                })
                .fail(function (err) {
                    console.info(JSON.stringify(err));
                });
        })
        .fail(function (err) {
            console.info(JSON.stringify(err));
        });

        

        $scope.goTo = function (path) {
            $location.path(path);
        };

        $scope.edit = function () {
        };

        $scope.showHideTextArea = function (checked, textAreaDivId) {
            console.log(textAreaDivId);
            if (checked) {
                $('#' + textAreaDivId).removeClass('show');
                $('#' + textAreaDivId).addClass('hidden');
            }
            else {
                $('#' + textAreaDivId).removeClass('hidden');
                $('#' + textAreaDivId).addClass('show');
            }
        };

        function iterateSubsets() {
            angular.forEach($scope.tempSubsets, function (tempSubset) {
                var ans = [];
                angular.forEach($scope.answers, function (answer) {
                    if (answer.subset == tempSubset.title) {
                        ans.push({
                            id: answer.id,
                            title: answer.title,
                            detail: answer.criteriaDetail,
                            result: answer.result,
                            nonnegotiable: answer.nonNegotiable
                        });
                    };
                });
                if (ans.length > 0) {
                    $scope.subsets.push({
                        title: tempSubset.title,
                        id: tempSubset.id,
                        order: tempSubset.order,
                        detail: tempSubset.detail,
                        answers: ans
                    });
                }
            });
            //$scope is not updating so force with this command
            if (!$scope.$$phase) { $scope.$apply(); }
        };

        $scope.checkResult = function (result) {
            console.log("the result is: " + result.toString());
            if (result) {
                return true;
            }
            else {
                return false;
            }
        };

    }

}]);