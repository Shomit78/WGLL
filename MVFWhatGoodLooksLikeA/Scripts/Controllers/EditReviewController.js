myApp.controller('EditReviewController', ['$scope', 'SharePointJSOMService', '$location', '$routeParams', function ($scope, SharePointJSOMService, $location, $routeParams) {
    SP.SOD.executeOrDelayUntilScriptLoaded(OnLoad, "SP.js");
    function OnLoad() {

        //$scope variables using $routeParams from query string
        $scope.reviewId = $routeParams.ReviewId;

        //$scope variables
        $scope.subsets = [];

        //variables
        var answerSaveFailure = 0;

        //Get the Review from the Reviews list using the reviewId from the query string
        $.when(SharePointJSOMService.getItemByIdFromHostWebWithSelectAndExpand($scope, sharePointConfig.lists.reviews, $scope.reviewId))
            .done(function (jsonObject) {
                angular.forEach(jsonObject, function (review) {
                    $scope.id = review.Id;
                    $scope.title = review.Title;
                    $scope.status = review.WGLLStatus;
                    $scope.store = review.WGLLStore;
                    $scope.notes = review.WGLLNotes;
                    $scope.visitType = review.WGLLVisitType;
                    $scope.visitSummary = review.WGLLVisitSummary;
                });
                var ans = [];
                var subfilter = "(" + sharePointConfig.fields.answers.reviewId + " eq '" + $scope.title + "')";
                //Get the answers related to the Review from the Answers lists
                $.when(SharePointJSOMService.getItemsFromHostWebWithParams($scope, sharePointConfig.lists.answers,
                    sharePointConfig.fields.sharepoint.title + ',' + sharePointConfig.fields.sharepoint.id +
                    ',' + sharePointConfig.fields.answers.detail + ',' + sharePointConfig.fields.answers.subset +
                    ',' + sharePointConfig.fields.answers.result + ',' + sharePointConfig.fields.answers.reasonForFailure +
                    ',' + sharePointConfig.fields.answers.nonNegotiable, '',
                    subfilter, sharePointConfig.fields.answers.order))
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
                       var filter = sharePointConfig.fields.subsets.active + " eq 1";
                       //Get a list of active Subsets from the Subset list to display with Answers
                       $.when(SharePointJSOMService.getItemsFromHostWebWithParams($scope, sharePointConfig.lists.subsets,
                           sharePointConfig.fields.sharepoint.title + ',' + sharePointConfig.fields.sharepoint.id + ',' +
                           sharePointConfig.fields.subsets.detail + ',' + sharePointConfig.fields.subsets.order, '',
                           filter, sharePointConfig.fields.subsets.order))
                            .done(function (jsonObject) {
                                angular.forEach(jsonObject.d.results, function (subset) {
                                    var subsetAnswers = [];
                                    angular.forEach(ans, function (criteria) {
                                        if (criteria.subset == subset.Title) {
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
                       $('.wgll-button-disabled').removeAttr("disabled");
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

        $scope.save = function () {
            $('.wgll-button-disabled').attr("disabled", "");
            var notes = $('textarea#wgllReviewNotesTextarea').val();
            var summary = $('textarea#wgllReviewVisitSummaryTextarea').val();
            SharePointJSOMService.updateListItem(sharePointConfig.lists.reviews, $scope.reviewId, {
                "WGLLNotes": notes,
                "WGLLVisitSummary": summary
            }, $scope.successOnUpdate, $scope.failureOnUpdate);
        };

        $scope.submit = function () {
            var validated = validate();
            if (validated) {
                //on submit needs to save all answers, visit summary, notes and then set status = submitted and set submitted date
                $('.wgll-button-disabled').attr("disabled", "");
                var notes = $('textarea#wgllReviewNotesTextarea').val();
                var summary = $('textarea#wgllReviewVisitSummaryTextarea').val();
                var currentMoment = moment().format('YYYY/MM/DD HH:mm:ss');
                SharePointJSOMService.updateListItem(sharePointConfig.lists.reviews, $scope.reviewId, {
                    "WGLLNotes": notes,
                    "WGLLVisitSummary": summary,
                    "WGLLSubmittedDate": currentMoment,
                    "WGLLStatus": "Submitted"
                }, $scope.successOnSubmit, $scope.failureOnSubmit);
            }
            else {
                SP.UI.Notify.addNotification(sharePointConfig.messages.onSubmitValidationError, false);
            }
        };

        $scope.successOnUpdate = function (jsonObject) {
            $('.wgll-criteria-title-label').each(function () {
                var currentAnswerId = $(this).attr("answerid");
                var currentResult = $(this).parent().find('.wgll-checkbox-result').prop('checked');
                var currentReasonForFailure = $(this).parent().find('.wgll-criteria-reason-for-failure-textarea').val();
                SharePointJSOMService.updateListItem(sharePointConfig.lists.answers, currentAnswerId, {
                    "WGLLResult": currentResult.toString(), "WGLLReasonForFailure": currentReasonForFailure
                }, $scope.successOnAnswerUpdate, $scope.failureOnAnswerUpdate);
            });
            SP.UI.Notify.addNotification(sharePointConfig.messages.onReviewSave, false);
            $('.wgll-button-disabled').removeAttr("disabled");
        };

        $scope.successOnSubmit = function (jsonObject) {
            $('.wgll-criteria-title-label').each(function () {
                var currentAnswerId = $(this).attr("answerid");
                var currentResult = $(this).parent().find('.wgll-checkbox-result').prop('checked');
                var currentReasonForFailure = $(this).parent().find('.wgll-criteria-reason-for-failure-textarea').val();
                SharePointJSOMService.updateListItem(sharePointConfig.lists.answers, currentAnswerId, {
                    "WGLLResult": currentResult.toString(), "WGLLReasonForFailure": currentReasonForFailure
                }, $scope.successOnAnswerUpdate, $scope.failureOnAnswerUpdate);
            });
            SP.UI.Notify.addNotification(sharePointConfig.messages.onReviewSubmit, false);
            if (!$scope.$$phase) {
                $scope.$apply(function () {
                    $location.path('/');
                });
            }
        };

        $scope.successOnAnswerUpdate = function (jsonObject) {
            //empty as does not require logic
        };

        $scope.successOnRevert = function(jsonObject){
            SP.UI.Notify.addNotification(sharePointConfig.messages.onReviewSave, false);
        };

        $scope.failureOnUpdate = function (jsonObject) {
            SP.UI.Notify.addNotification(sharePointConfig.messages.onSaveError, false);
            console.info("$scope.failureOnUpdate: " + JSON.stringify(jsonObject));
        };

        $scope.failureOnSubmit = function (jsonObject) {
            SP.UI.Notify.addNotification(sharePointConfig.messages.onSubmitError, false);
            console.info("$scope.failureOnSubmit: " + JSON.stringify(jsonObject));
        };

        $scope.failureOnAnswerUpdate = function (jsonObject) {
            if (answerSaveFailure == 0) {
                SP.UI.Notify.addNotification(sharePointConfig.messages.onSaveAnswerError, false);
                SharePointJSOMService.updateListItem(sharePointConfig.lists.reviews, $scope.reviewId, {
                    "WGLLSubmittedDate": "",
                    "WGLLStatus": "Saved"
                }, $scope.successOnRevert, $scope.failureOnRevert);
            }
            answerSaveFailure++;
            console.info("$scope.failureOnAnswerUpdate: " + JSON.stringify(jsonObject));
        };

        $scope.failureOnRevert = function (jsonObject) {
            SP.UI.Notify.addNotification(sharePointConfig.messages.onSubmitError, false);
            console.info("$scope.failureOnRevert: " + JSON.stringify(jsonObject));
        };

        //Routing
        $scope.goTo = function (path) {
            $location.path(path);
        };

        //Shows and hides subset sections based on index and Next button click
        $scope.moveNext = function (currentDivId, index) {
            $('#' + currentDivId).removeClass("ng-show");
            $('#' + currentDivId).addClass("ng-hide");
            var next = parseInt(index);
            next = next + 1;
            var nextDivId = '#wgllSubsetContainer' + next;
            $(nextDivId).removeClass("ng-hide");
            $(nextDivId).addClass("ng-show");
        };

        //Shows and hides subset sections based on index and Back button click
        $scope.moveBack = function (currentDivId, index) {
            $('#' + currentDivId).removeClass("ng-show");
            $('#' + currentDivId).addClass("ng-hide");
            var next = parseInt(index);
            next = next - 1;
            var nextDivId = '#wgllSubsetContainer' + next;
            $(nextDivId).removeClass("ng-hide");
            $(nextDivId).addClass("ng-show");
        };

        //Shows and hides the Reason for Failure textarea depending on Pass result
        $scope.showHideTextArea = function (checked, textAreaDivId) {
            if (checked) {
                $('#' + textAreaDivId).attr('ng-required', 'false');
                $('#' + textAreaDivId).removeClass('show');
                $('#' + textAreaDivId).addClass('hidden');
            }
            else {
                $('#' + textAreaDivId).removeClass('hidden');
                $('#' + textAreaDivId).addClass('show');
                $('#' + textAreaDivId).attr('ng-required', 'true');
            }
        };

        function validate() {
            var validated = true;
            $('.wgll-criteria-container').each(function () {
                var result = $(this).find('.wgll-checkbox-result');
                if (!$(result).is(":checked")) {
                    //check if textarea is empty then return false
                    var reason = $(this).find('.wgll-criteria-reason-for-failure-textarea');
                    var currentText = $(reason).text();
                    if ((currentText == "") || (currentText == "Enter a reason for the failure here...")) {
                        validated = false;
                    }
                }
            });
            return validated;
        };

        $scope.showFurtherGuidance = function (furtherGuidanceDivId, store, subset, criteria) {
            if ($('#' + furtherGuidanceDivId).hasClass('show')) {
                $('#' + furtherGuidanceDivId).removeClass('show');
                $('#' + furtherGuidanceDivId).addClass('hidden');
            }
            else {
                $('#' + furtherGuidanceDivId).removeClass('hidden');
                $('#' + furtherGuidanceDivId).addClass('show');
                var guidanceFilter = "(WGLLStore/Title eq '" + store + "') and (WGLLSubset/Title eq '" + 
                    subset + "') and (WGLLCriteria/Title eq '" + criteria + "')";
                $.when(SharePointJSOMService.getItemsFromHostWebWithParams($scope, sharePointConfig.lists.guidance,
                    'WGLLGuidanceNotes', '', guidanceFilter, ''))
                .done(function (jsonObject) {
                    if (jsonObject.d.results.length > 0) {
                        $('#' + furtherGuidanceDivId).html(jsonObject.d.results[0]["WGLLGuidanceNotes"]);
                    }
                    else {
                        $('#' + furtherGuidanceDivId).html(sharePointConfig.messages.noGuidanceNotesAvailable);
                    }
                })
                .fail(function (err) {
                    SP.UI.Notify.addNotification(sharePointConfig.messages.defaultError, false);
                    console.info(JSON.stringify(err));
                });
            }
        };

    }
}]);