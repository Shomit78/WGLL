myApp.controller('DisplayReviewController', ['$scope', 'SharePointJSOMService', '$location', '$routeParams', function ($scope, SharePointJSOMService, $location, $routeParams) {
    SP.SOD.executeOrDelayUntilScriptLoaded(OnLoad, "SP.js");
    function OnLoad() {

        //$routeParam variables from query string
        var reviewId = $routeParams.ReviewId;

        //$scope variables
        $scope.subsets = [];

        //Get the Review from the Reviews list using the reviewId from the query string
        $.when(SharePointJSOMService.getItemByIdFromHostWebWithSelectAndExpand($scope, sharePointConfig.lists.reviews, reviewId))
            .done(function (jsonObject) {
                angular.forEach(jsonObject, function (review) {
                    $scope.id = review.Id;
                    $scope.title = review.Title;
                    $scope.status = review.WGLLStatus;
                    $scope.store = review.WGLLStore;
                    $scope.notes = review.WGLLNotes;
                    $scope.visitType = review.WGLLVisitType;
                    $scope.visitSummary = review.visitSummary;
                });
                var ans = [];
                var subfilter = "(" + sharePointConfig.fields.answers.reviewId + " eq '" + $scope.title + "')";
                //Get the answers related to the Review from the Answers lists
                $.when(SharePointJSOMService.getItemsFromHostWebWithParams($scope, sharePointConfig.lists.answers,
                    sharePointConfig.fields.sharepoint.title + ',' + sharePointConfig.fields.sharepoint.id +
                    ',WGLLCriteriaDetail,WGLLSubset,WGLLResult,WGLLReasonForFailure,WGLLNonNegotiable', '', subfilter, 'WGLLCriteriaOrder'))
                   .done(function (jsonObject) {
                       angular.forEach(jsonObject.d.results, function (answer) {
                           ans.push({
                               title: answer.Title,
                               id: answer.ID,
                               detail: answer.WGLLCriteriaDetail,
                               subset: answer.WGLLSubset,
                               result: answer.WGLLResult,
                               reasonForFailure: answer.WGLLReasonForFailure,
                               nonNegotiable: answer.WGLLNonNegotiable
                           });
                       });
                       console.info(ans.length.toString());
                       var filter = "SubsetActive eq 1";
                       //Get a list of active Subsets from the Subset list to display with Answers
                       $.when(SharePointJSOMService.getItemsFromHostWebWithParams($scope, sharePointConfig.lists.subsets,
                           'Title,ID,SubsetDetail,SubsetOrder', '', filter, 'SubsetOrder'))
                            .done(function (jsonObject) {
                                angular.forEach(jsonObject.d.results, function (subset) {
                                    var subsetAnswers = [];
                                    angular.forEach(ans, function (criteria) {
                                        console.info(criteria.title + "; " + criteria.subset);
                                        if (criteria.subset == subset.Title) {
                                            console.info("match");
                                            subsetAnswers.push({
                                                title: criteria.title,
                                                id: criteria.id,
                                                detail: criteria.detail,
                                                subset: criteria.subset,
                                                result: criteria.result,
                                                reasonForFailure: criteria.reasonForFailure,
                                                nonNegotiable: criteria.nonNegotiable
                                            });
                                        }
                                    });
                                    $scope.subsets.push({
                                        title: subset.Title,
                                        id: subset.ID,
                                        order: subset.SubsetOrder,
                                        detail: subset.SubsetDetail,
                                        answers: subsetAnswers
                                    });
                                });
                                //$scope is not updating so force with this command
                                if (!$scope.$$phase) { $scope.$apply(); }
                            })
                           .fail(function (err) {
                               SP.UI.Notify.addNotification(sharePointConfig.messages.defaultError, false);
                               console.info(JSON.stringify(err));
                           });
                       //$scope is not updating so force with this command
                       if (!$scope.$$phase) { $scope.$apply(); }
                   })
                   .fail(function (err) {
                       SP.UI.Notify.addNotification(sharePointConfig.messages.defaultError, false);
                       console.info(JSON.stringify(err));
                   });
                
                //$scope is not updating so force with this command
                if (!$scope.$$phase) { $scope.$apply(); }
            })
            .fail(function (err) {
                SP.UI.Notify.addNotification(sharePointConfig.messages.defaultError, false);
                console.info(JSON.stringify(err));
            });

        $scope.successGetReview = function () {

        };

        $scope.failureGetReview = function () {

        };

        $scope.goTo = function (path) {
            $location.path(path);
        };

        $scope.moveNext = function (currentDivId, index) {
            $('#' + currentDivId).removeClass("ng-show");
            $('#' + currentDivId).addClass("ng-hide");
            var next = parseInt(index);
            next = next + 1;
            var nextDivId = '#wgllSubsetContainer' + next;
            $(nextDivId).removeClass("ng-hide");
            $(nextDivId).addClass("ng-show");
        };

        $scope.moveBack = function (currentDivId, index) {
            $('#' + currentDivId).removeClass("ng-show");
            $('#' + currentDivId).addClass("ng-hide");
            var next = parseInt(index);
            next = next - 1;
            var nextDivId = '#wgllSubsetContainer' + next;
            $(nextDivId).removeClass("ng-hide");
            $(nextDivId).addClass("ng-show");
        };

        $scope.initCheckbox = function (controlId, result) {
            if (result == "true") {
                $(controlId).attr('checked', '');
                console.info(controlId);
            }
            else {
                $('#' + controlId).removeAttr("checked");
            }
            if (!$scope.$$phase) { $scope.$apply(); }
        };

    }

}]);