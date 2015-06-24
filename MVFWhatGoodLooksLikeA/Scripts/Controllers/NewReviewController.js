myApp.controller('NewReviewController', ['$scope', 'SharePointJSOMService', '$location', '$routeParams', function ($scope, SharePointJSOMService, $location, $routeParams) {
    SP.SOD.executeOrDelayUntilScriptLoaded(NewReviewControllerOnLoad, "SP.js");
    function NewReviewControllerOnLoad() {
        var currentStore = $routeParams.store;
        var currentVisitType = $routeParams.visitType;
        var saved = false;
        var reviewId;
        var reviewListItemId;

        $scope.subsets = [];
        $scope.answers = [];
        var subsetFilter = "SubsetActive eq 1";

        $.when(SharePointJSOMService.getItemsFromHostWebWithParams($scope, 'Subsets', 'Title,ID,SubsetDetail,SubsetOrder', '', subsetFilter, 'SubsetOrder'))
        .done(function (jsonObject) {
            angular.forEach(jsonObject.d.results, function (subset) {
                var crit = [];
                var filter = "(Subset/ID eq " + subset.ID + ")";
                $.when(SharePointJSOMService.getItemsFromHostWebWithParams($scope, 'Criteria', 'Title,ID,CriteriaDetail,NonNegotiable,Subset/ID,Stores/Title,VisitType/Title',
                    'Subset/ID,Stores/ID,VisitType/ID', filter, 'CriteriaOrder'))
                .done(function (jsonObject) {
                    angular.forEach(jsonObject.d.results, function (criteria) {
                        angular.forEach(criteria.Stores.results, function (store) {
                            if (store.Title == currentStore) {
                                angular.forEach(criteria.VisitType.results, function (visitType) {
                                    if (visitType.Title == currentVisitType) {
                                        crit.push({
                                            title: criteria.Title,
                                            id: criteria.ID,
                                            detail: criteria.CriteriaDetail,
                                            nonNegotiable: criteria.NonNegotiable
                                        });
                                    }
                                });
                            }
                        });
                        //$scope is not updating so force with this command
                        if (!$scope.$$phase) { $scope.$apply(); }
                    });
                    $('.wgll-button-disabled').removeAttr("disabled");
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

        $scope.save = function () {
            $('.wgll-button-disabled').attr("disabled");
            if (!saved) {
                var notes = $('textarea#wgllReviewNotesTextarea').val();
                var summary = $('textarea#wgllReviewVisitSummaryTextarea').val();
                SharePointJSOMService.addListItem("Reviews", {
                    "WGLLStore": currentStore,
                    "WGLLVisitType": currentVisitType,
                    "WGLLStatus": "Saved",
                    "WGLLNotes": notes,
                    "WGLLVisitSummary": summary
                }, $scope.successOnSave, $scope.failureOnSave);
                SP.UI.Notify.addNotification("Your review has been sucessfully saved.", false);
            }
            else {
                $('.wgll-criteria-title-label').each(function () {
                    var currentAnswerId = $(this).attr("answerid");
                    var currentResult = $(this).parent().find('.wgll-checkbox-result').prop('checked');
                    var currentReasonForFailure = $(this).parent().find('.wgll-criteria-reason-for-failure-textarea').val();
                    SharePointJSOMService.updateListItem("Answers", currentAnswerId, {
                        "WGLLResult": currentResult.toString(), "WGLLReasonForFailure": currentReasonForFailure
                    }, $scope.successOnAnswerUpdate, $scope.failureOnAnswerUpdate);
                });
                SP.UI.Notify.addNotification("Your review has been sucessfully submitted.", false);
            }
        };

        $scope.submit = function () {
            $('.wgll-button-disabled').attr('disabled', '');
            if (!saved) {
                var notes = $('textarea#wgllReviewNotesTextarea').val();
                var summary = $('textarea#wgllReviewVisitSummaryTextarea').val();
                SharePointJSOMService.addListItem("Reviews", {
                    "WGLLStore": currentStore,
                    "WGLLVisitType": currentVisitType,
                    "WGLLStatus": "Submitted",
                    "WGLLNotes": notes,
                    "WGLLVisitSummary": summary
                }, $scope.successOnSave, $scope.failureOnSave);
            }
            else {
                var notes = $('textarea#wgllReviewNotesTextarea').val();
                var summary = $('textarea#wgllReviewVisitSummaryTextarea').val();
                $('.wgll-criteria-title-label').each(function () {
                    var currentAnswerId = $(this).attr("answerid");
                    var currentResult = $(this).parent().find('.wgll-checkbox-result').prop('checked');
                    var currentReasonForFailure = $(this).parent().find('.wgll-criteria-reason-for-failure-textarea').val();
                    SharePointJSOMService.updateListItem("Answers", currentAnswerId, {
                        "WGLLResult": currentResult.toString(), "WGLLReasonForFailure": currentReasonForFailure
                    }, $scope.successOnAnswerUpdate, $scope.failureOnAnswerUpdate);
                });
                SharePointJSOMService.updateListItem("Reviews", reviewListItemId, {
                    "WGLLStatus": "Submitted",
                    "WGLLNotes": notes,
                    "WGLLVisitSummary": summary
                }, $scope.successOnReviewUpdate, $scope.failureOnReviewUpdate);
            }
        };

        $scope.goTo = function (path) {
            $location.path(path);
        };

        $scope.successOnSave = function (jsonObject) {
            saved = true;
            angular.forEach(jsonObject, function (review) {

                var store = review.WGLLStore;
                store = store.toString().replace(' ', '');
                store = store.toUpperCase();

                var visitType = review.WGLLVisitType;
                visitType = visitType.toString().toUpperCase();

                var currentDate = new Date();
                var dateString = currentDate.getFullYear().toString() + (currentDate.getMonth() + 1).toString() + currentDate.getDate().toString();

                var title = "WGLL-" + store + "-" + visitType + "-" + dateString + "-" + review.ID;
                reviewId = title;
                reviewListItemId = review.ID;
                SharePointJSOMService.updateListItem("Reviews", review.ID, {
                    "Title": title
                }, $scope.successOnUpdate, $scope.failureOnUpdate);
            });
        };

        $scope.successOnUpdate = function (jsonObject) {
            $('.wgll-subset-container').each(function () {
                var subset = $(this).find('.wgll-subset-title-span');
                var subsetTitle = $(subset).text();
                var criteria = $(this).find('.wgll-criteria-container');
                if (criteria != null) {
                    $(criteria).each(function () {
                        var criteriaTitle = $(this).find('.wgll-criteria-title-label').text();
                        var criteriaNonNegotiable = $(this).find('.wgll-criteria-title-label').attr('nonnegotiable');
                        var criteriaDetail = $(this).find('.wgll-criteria-detail-container').text();
                        var criteriaResult = $(this).find('.wgll-checkbox-result').prop('checked');
                        var criteriaReasonForFailure = $(this).find('.wgll-criteria-reason-for-failure-textarea').val()
                        SharePointJSOMService.addAnswer("Answers", {
                            "Title": criteriaTitle,
                            "WGLLNonNegotiable": criteriaNonNegotiable.toString(),
                            "WGLLResult": criteriaResult.toString(),
                            "WGLLCriteriaDetail": criteriaDetail,
                            "WGLLReviewID": reviewId,
                            "WGLLSubset": subsetTitle,
                            "WGLLReasonForFailure": criteriaReasonForFailure
                        },
                            $scope.successOnSaveAnswers, $scope.failureOnSaveAnswers);
                    });
                }
            });
        };

        $scope.successOnSaveAnswers = function (jsonObject, metadata) {
            angular.forEach(jsonObject, function (answer) {
                $('.wgll-criteria-container').each(function () {
                    if ($(this).attr('title') == metadata.WGLLSubset) {
                        if ($(this).attr('subtitle') == metadata.Title) {
                            $(this).find('.wgll-criteria-title-label').attr("answerid", answer.ID);
                        }
                    }
                });
            });
        };

        $scope.successOnAnswerUpdate = function (jsonObject) {
        };

        $scope.successOnReviewUpdate = function (jsonObject) {
            SP.UI.Notify.addNotification("Your review has been sucessfully submitted.", false);
            if (!$scope.$$phase) {
                $scope.$apply(function () {
                    $location.path('/');
                });
            }
        };

        $scope.failureOnUpdate = function (jsonObject) {
            console.info("$scope.failureOnUpdate: " + JSON.stringify(jsonObject));
        };

        $scope.failureOnSave = function (jsonObject) {
            console.info("$scope.failureOnSave: " + JSON.stringify(jsonObject));
        };

        $scope.failureOnReviewUpdate = function (jsonObject) {
            console.info("$scope.failureOnReviewUpdate: " + JSON.stringify(jsonObject));
        };

        $scope.failureOnSaveAnswers = function (jsonObject) {
            console.info("$scope.failureOnSaveAnswers: " + JSON.stringify(jsonObject));
        };

        $scope.failureOnAnswerUpdate = function (jsonObject) {
            console.info("$scope.failureOnAnswerUpdate: " + JSON.stringify(jsonObject));
        };

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

        $scope.sectionHide = function (index) {
            if (index == 0) {
                return false;
            }
            else {
                return true;
            }
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
    }


}]);