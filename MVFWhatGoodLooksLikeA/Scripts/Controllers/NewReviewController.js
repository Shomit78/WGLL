﻿myApp.controller('NewReviewController', ['$scope', 'SharePointJSOMService', '$location', '$routeParams', '$window', function ($scope, SharePointJSOMService, $location, $routeParams, $window) {
    SP.SOD.executeOrDelayUntilScriptLoaded(NewReviewControllerOnLoad, "SP.js");
    function NewReviewControllerOnLoad() {

        //$routeParams variables from query string
        var currentStore = $routeParams.store;
        var currentVisitType = $routeParams.visitType;
        var currentRegion = $routeParams.region;

        //custom variables
        var saved, submit = false;
        var answerSaveFailure = 0;
        var reviewId, reviewListItemId;
        var subsetFilter = sharePointConfig.fields.subsets.active + " eq 1";

        //$scope variables
        $scope.subsets = [];
        $scope.answers = [];
        $scope.currentUsersStore = $routeParams.store;
        
        //Get all active subsets from subset list including detail ordered by subset order
        $.when(SharePointJSOMService.getItemsFromHostWebWithParams($scope, sharePointConfig.lists.subsets,
            sharePointConfig.fields.sharepoint.title + ',' + sharePointConfig.fields.sharepoint.id + ',' +
            sharePointConfig.fields.subsets.detail + ',' + sharePointConfig.fields.subsets.order,
            '', subsetFilter, sharePointConfig.fields.subsets.order))
        .done(function (jsonObject) {
            angular.forEach(jsonObject.d.results, function (subset) {
                var crit = [];
                var filter = "(" + sharePointConfig.fields.criteria.subset + "/" +
                    sharePointConfig.fields.sharepoint.id + " eq " + subset.ID + ")";
                //Whilst iterating active subsets get the related criteria from the Criteria list ordered by criteria order
                $.when(SharePointJSOMService.getItemsFromHostWebWithParams($scope, sharePointConfig.lists.criteria,
                    sharePointConfig.fields.sharepoint.title + ',' + sharePointConfig.fields.sharepoint.id + ',' +
                    sharePointConfig.fields.criteria.detail + ',' + sharePointConfig.fields.criteria.nonNegotiable + ',' +
                    sharePointConfig.fields.criteria.order + ',' + sharePointConfig.fields.criteria.subset + '/' +
                    sharePointConfig.fields.sharepoint.id + ',' + sharePointConfig.fields.criteria.stores + '/' +
                    sharePointConfig.fields.sharepoint.title + ',' + sharePointConfig.fields.criteria.visitType + '/' +
                    sharePointConfig.fields.sharepoint.title,
                    sharePointConfig.fields.criteria.subset + '/' + sharePointConfig.fields.sharepoint.id + ',' +
                    sharePointConfig.fields.criteria.stores + '/' + sharePointConfig.fields.sharepoint.id + ',' +
                    sharePointConfig.fields.criteria.visitType + '/' + sharePointConfig.fields.sharepoint.id + '',
                    filter, sharePointConfig.fields.criteria.order))
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
                                            nonNegotiable: criteria.NonNegotiable,
                                            order: criteria.CriteriaOrder
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
                    SP.UI.Notify.addNotification(sharePointConfig.messages.defaultError, false);
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
            SP.UI.Notify.addNotification(sharePointConfig.messages.defaultError, false);
            console.info(JSON.stringify(err));
        });

        $scope.save = function () {
            $('.wgll-button-disabled').attr("disabled", "");
            if (!saved) {
                var notes = $('textarea#wgllReviewNotesTextarea').val();
                var summary = $('textarea#wgllReviewVisitSummaryTextarea').val();
                SharePointJSOMService.addListItem(sharePointConfig.lists.reviews, {
                    "WGLLRegion": currentRegion,
                    "WGLLStore": currentStore,
                    "WGLLVisitType": currentVisitType,
                    "WGLLStatus": "Saved",
                    "WGLLNotes": notes,
                    "WGLLVisitSummary": summary
                }, $scope.successOnSave, $scope.failureOnSave);
                SP.UI.Notify.addNotification(sharePointConfig.messages.onReviewSave, false);
            }
            else {
                $('.wgll-criteria-title-label').each(function () {
                    var currentAnswerId = $(this).attr("answerid");
                    var currentResult = "Null";
                    var criteriaPassControl = $(this).parent().find('.wgll-checkbox-result-pass');
                    if ($(criteriaPassControl).is(':checked')) {
                        currentResult = "Pass";
                    }
                    else {
                        var criteriaFailControl = $(this).parent().find('.wgll-checkbox-result-fail');
                        if ($(criteriaFailControl).is(':checked')) {
                            currentResult = "Fail";
                        }
                    }
                    var currentReasonForFailure = $(this).parent().find('.wgll-criteria-reason-for-failure-textarea').val();
                    SharePointJSOMService.updateListItem(sharePointConfig.lists.answers, currentAnswerId, {
                        "WGLLResult": currentResult, "WGLLReasonForFailure": currentReasonForFailure
                    }, $scope.successOnAnswerUpdate, $scope.failureOnAnswerUpdate);
                });
                SP.UI.Notify.addNotification(sharePointConfig.messages.onReviewSave, false);
                $('.wgll-button-disabled').removeAttr("disabled");
            }
        };

        $scope.submit = function () {
            var validated = validate();
            if (validated) {
                submit = true;
                $('.wgll-button-disabled').attr('disabled', '');
                var currentMoment = moment().format('YYYY/MM/DD HH:mm:ss');
                if (!saved) {
                    var notes = $('textarea#wgllReviewNotesTextarea').val();
                    var summary = $('textarea#wgllReviewVisitSummaryTextarea').val();
                    SharePointJSOMService.addListItem(sharePointConfig.lists.reviews, {
                        "WGLLRegion": currentRegion,
                        "WGLLStore": currentStore,
                        "WGLLVisitType": currentVisitType,
                        "WGLLStatus": "Submitted",
                        "WGLLNotes": notes,
                        "WGLLVisitSummary": summary,
                        "WGLLSubmittedDate": currentMoment
                    }, $scope.successOnSave, $scope.failureOnSave);
                }
                else {
                    var notes = $('textarea#wgllReviewNotesTextarea').val();
                    var summary = $('textarea#wgllReviewVisitSummaryTextarea').val();
                    $('.wgll-criteria-title-label').each(function () {
                        var currentAnswerId = $(this).attr("answerid");
                        var currentResult = "Null";
                        var criteriaPassControl = $(this).parent().find('.wgll-checkbox-result-pass');
                        if ($(criteriaPassControl).is(':checked')) {
                            currentResult = "Pass";
                        }
                        else {
                            var criteriaFailControl = $(this).parent().find('.wgll-checkbox-result-fail');
                            if ($(criteriaFailControl).is(':checked')) {
                                currentResult = "Fail";
                            }
                        }
                        var currentReasonForFailure = $(this).parent().find('.wgll-criteria-reason-for-failure-textarea').val();
                        SharePointJSOMService.updateListItem(sharePointConfig.lists.answers, currentAnswerId, {
                            "WGLLResult": currentResult, "WGLLReasonForFailure": currentReasonForFailure
                        }, $scope.successOnAnswerUpdate, $scope.failureOnAnswerUpdate);
                    });
                    SharePointJSOMService.updateListItem(sharePointConfig.lists.reviews, reviewListItemId, {
                        "WGLLStatus": "Submitted",
                        "WGLLNotes": notes,
                        "WGLLVisitSummary": summary,
                        "WGLLSubmittedDate": currentMoment
                    }, $scope.successOnReviewUpdate, $scope.failureOnReviewUpdate);
                }
            }
            else {
                SP.UI.Notify.addNotification(sharePointConfig.messages.onSubmitValidationError, false);
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
                SharePointJSOMService.updateListItem(sharePointConfig.lists.reviews, review.ID, {
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
                        var criteriaOrder = $(this).find('.wgll-criteria-title-label').attr('order');
                        var criteriaDetail = $(this).find('.wgll-criteria-detail-container').text();
                        //Need to do a check on both checkboxes to get result
                        var currentResult = "Null";
                        var criteriaPassControl = $(this).find('.wgll-checkbox-result-pass');
                        if ($(criteriaPassControl).is(':checked')) {
                            currentResult = "Pass";
                        }
                        else {
                            var criteriaFailControl = $(this).parent().find('.wgll-checkbox-result-fail');
                            if ($(criteriaFailControl).is(':checked')) {
                                currentResult = "Fail";
                            }
                        }
                        var criteriaReasonForFailure = $(this).find('.wgll-criteria-reason-for-failure-textarea').val()
                        SharePointJSOMService.addAnswer(sharePointConfig.lists.answers, {
                            "Title": criteriaTitle,
                            "WGLLNonNegotiable": criteriaNonNegotiable.toString(),
                            "WGLLResult": currentResult,
                            "WGLLCriteriaDetail": criteriaDetail,
                            "WGLLReviewID": reviewId,
                            "WGLLSubset": subsetTitle,
                            "WGLLReasonForFailure": criteriaReasonForFailure,
                            "WGLLCriteriaOrder": criteriaOrder
                        },
                            $scope.successOnSaveAnswers, $scope.failureOnSaveAnswers);
                    });
                    $('.wgll-button-disabled').removeAttr('disabled');
                }
            });
            if (submit) {
                SP.UI.Notify.addNotification(sharePointConfig.messages.onReviewSubmit, false);
                if (!$scope.$$phase) {
                    $scope.$apply(function () {
                        $location.path('/');
                    });
                }
            }
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
            if (submit) {
                SP.UI.Notify.addNotification("Your review has been sucessfully submitted.", false);
                if (!$scope.$$phase) {
                    $scope.$apply(function () {
                        $location.path('/');
                    });
                }
            }
        };

        $scope.failureOnUpdate = function (jsonObject) {
            SP.UI.Notify.addNotification(sharePointConfig.messages.onSaveError, false);
            console.info("$scope.failureOnUpdate: " + JSON.stringify(jsonObject));
        };

        $scope.failureOnSave = function (jsonObject) {
            SP.UI.Notify.addNotification(sharePointConfig.messages.onSaveError, false);
            console.info("$scope.failureOnSave: " + JSON.stringify(jsonObject));
        };

        $scope.failureOnReviewUpdate = function (jsonObject) {
            SP.UI.Notify.addNotification(sharePointConfig.messages.onSaveError, false);
            console.info("$scope.failureOnReviewUpdate: " + JSON.stringify(jsonObject));
        };

        $scope.failureOnSaveAnswers = function (jsonObject) {
            if (answerSaveFailure == 0) {
                SP.UI.Notify.addNotification(sharePointConfig.messages.onSaveAnswerError, false);
            }
            answerSaveFailure++;
            console.info("$scope.failureOnSaveAnswers: " + JSON.stringify(jsonObject));
        };

        $scope.failureOnAnswerUpdate = function (jsonObject) {
            if (answerSaveFailure == 0) {
                SP.UI.Notify.addNotification(sharePointConfig.messages.onSaveAnswerError, false);
            }
            answerSaveFailure++;
            console.info("$scope.failureOnAnswerUpdate: " + JSON.stringify(jsonObject));
        };

        $scope.toggleFail = function (failCheckboxId, passed, textAreaDivId) {
            if (passed) {
                //Hide the Reason for Failure textarea as not required
                $('#' + textAreaDivId).attr('ng-required', 'false');
                $('#' + textAreaDivId).removeClass('show');
                $('#' + textAreaDivId).addClass('hidden');
                var checked = $('input[id=' + failCheckboxId + ']').is(':checked');
                if (checked) {
                    //Remove check from fail checkbox
                    $('input[id=' + failCheckboxId + ']').attr("checked", false);
                }
            }
        };

        $scope.togglePass = function (passCheckboxId, failed, textAreaDivId) {
            if (failed) {
                //Show the Reason for Failure textarea as is required
                $('#' + textAreaDivId).removeClass('hidden');
                $('#' + textAreaDivId).addClass('show');
                $('#' + textAreaDivId).attr('ng-required', 'true');
                var checked = $('input[id=' + passCheckboxId + ']').is(':checked');
                if (checked) {
                    //Remove check from pass checkbox
                    $('input[id=' + passCheckboxId + ']').attr("checked", false);
                }
            }
            else {
                //Hide the Reason for Failure textarea as not required
                $('#' + textAreaDivId).attr('ng-required', 'false');
                $('#' + textAreaDivId).removeClass('show');
                $('#' + textAreaDivId).addClass('hidden');
            }
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

        function validate() {
            var validated = true;
            $('.wgll-criteria-container').each(function () {
                var passControl = $(this).find('.wgll-checkbox-result-pass');
                var failControl = $(this).find('.wgll-checkbox-result-fail');
                if (!$(passControl).is(":checked")) {
                    //Pass has not been checked - check if fail has been checked
                    if ($(failControl).is(":checked")) {
                        //Fail has been checked so see if textarea has been filled out
                        var reason = $(this).find('.wgll-criteria-reason-for-failure-textarea');
                        var currentText = $(reason).text();
                        if ((currentText == "") || (currentText == "Enter a reason for the failure here...")) {
                            validated = false;
                        }
                    }
                    else {
                        //Fail has not been checked in some cases so return false;
                        validated = false;
                    }
                }
            });
            return validated;
        };

        $scope.uploadImage = function(btnId, imageDisplayName, imageFile) {
            if (!window.FileReader) {
                SP.UI.Notify.addNotification(sharePointConfig.messages.fileReaderError, false);
            }
            else {
                if (saved) {
                    var answerId =
                        $('#' + btnId).closest('.wgll-criteria-container').find('.wgll-criteria-title-label').attr('answerid');
                    console.log("Attempting image uploaded for " + reviewId + " answer " + answerId);
                    var fileInput = $('#' + imageFile);
                    var newName = $('#' + imageDisplayName).val();
                    $.when(SharePointJSOMService.getFileBuffer(fileInput))
                        .done(function(arrayBuffer) {
                            $.when(SharePointJSOMService.addFileToFolder(arrayBuffer, currentStore,
                                fileInput, $scope.successOnFileAdd, $scope.failureOnFileAdd))
                            .done(function (jsonObject) {
                            })
                            .fail(function (err) {
                                console.error(JSON.stringify(err));
                            });
                        })
                        .fail(function(err) {
                            console.error(JSON.stringify(err));
                        });
                }
                else {
                    alert(sharePointConfig.messages.onFileUploadNotSavedError);
                }
            }
        };

        $scope.successOnFileAdd = function (jsonObject) {
            angular.forEach(jsonObject, function (file) {
                $.when(SharePointJSOMService.getFile(file.ServerRelativeUrl, $scope.successOnGetFile, $scope.failureOnGetFile))
                .done(function (jsonObject) {
                    //Now need to update the list item with reviewId and answerId.
                })
                .fail(function (err) {
                    console.error(JSON.stringify(err));
                });
            });
        };
        
        $scope.successOnGetFile = function (jsonObject) {
            angular.forEach(jsonObject, function (file) {
                console.log(file.ID);
            });
        };

        $scope.failureOnFileAdd = function (jsonObject) {
            console.info("$scope.failureOnFileAdd: " + JSON.stringify(jsonObject));
        };

        $scope.failureOnGetFile = function (jsonObject) {
            console.info("$scope.failureOnGetFile: " + JSON.stringify(jsonObject));
        };

        // Display error messages. 
        function onError(error) {
            console.error(error.responseText);
        }

        $scope.displayImageLinks = function (imageDivId) {
            //Fetch the latest uploaded images for the images div closest to the upload button clicked or after deleteImage called.
        };

        $scope.deleteImage = function (imageId) {
            //Use the image id and delete the image from the images library
        };

        $scope.showUploadImage = function (imageUploadDivId) {
            if ($('#' + imageUploadDivId).hasClass('show')) {
                $('#' + imageUploadDivId).removeClass('show');
                $('#' + imageUploadDivId).addClass('hidden');
            }
            else {
                $('#' + imageUploadDivId).removeClass('hidden');
                $('#' + imageUploadDivId).addClass('show');
            }
        };

        $scope.showFurtherGuidance = function (furtherGuidanceDivId, criteriaId) {
            if ($('#' + furtherGuidanceDivId).hasClass('show')) {
                $('#' + furtherGuidanceDivId).removeClass('show');
                $('#' + furtherGuidanceDivId).addClass('hidden');
            }
            else {
                $('#' + furtherGuidanceDivId).removeClass('hidden');
                $('#' + furtherGuidanceDivId).addClass('show');
                var guidanceFilter = "(WGLLStore/Title eq '" + currentStore + "') and (WGLLCriteria/Id eq '" + criteriaId + "')";
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