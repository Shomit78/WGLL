myApp.controller('EditReviewController', ['$scope', 'SharePointJSOMService', '$location', '$routeParams', function ($scope, SharePointJSOMService, $location, $routeParams) {
    SP.SOD.executeOrDelayUntilScriptLoaded(OnLoad, "SP.js");
    function OnLoad() {

        //$scope variables using $routeParams from query string
        $scope.reviewId = $routeParams.ReviewId;

        //$scope variables
        $scope.subsets = [];

        //variables
        var answerSaveFailure = 0;
        var p_btnId, p_imageFile, p_imageDiv, p_imageId, p_imageAnswerId;

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
                var images = [];
                $.when(SharePointJSOMService.getImagesFromHostWebFolder($scope,
                         "/mvf/wgll/" + sharePointConfig.lists.images + "/" + $scope.store + "/" + $scope.title))
                    .done(function (jsonObject) {
                        angular.forEach(jsonObject.d.results, function (image) {
                            images.push({
                                name: image.Name,
                                serverRelativeUrl: image.ServerRelativeUrl,
                                answerId: image.ListItemAllFields.WGLLAnswerId
                            });
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
                                                var answerImages = [];
                                                angular.forEach(images, function (img) {
                                                    if (img.answerId == criteria.id) {
                                                        answerImages.push({
                                                            name: img.name,
                                                            serverRelativeUrl: img.serverRelativeUrl,
                                                            answerId: img.answerId
                                                        });
                                                    }
                                                });
                                                if (criteria.subset == subset.Title) {
                                                    subsetAnswers.push({
                                                        title: criteria.title,
                                                        id: criteria.id,
                                                        detail: criteria.detail,
                                                        subset: criteria.subset,
                                                        result: criteria.result,
                                                        reasonForFailure: criteria.reasonForFailure,
                                                        nonNegotiable: criteria.nonNegotiable,
                                                        images: answerImages
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
                                        $('.wgll-criteria-container').each(function () {
                                            var failControl = $(this).find('.wgll-checkbox-result-fail');
                                            if ($(failControl).is(':checked')) {
                                                //Show the textarea
                                                $(this).find('.wgll-reason-for-failure-container').removeClass('hidden');
                                                $(this).find('.wgll-reason-for-failure-container').addClass('show');
                                                $(this).find('.wgll-reason-for-failure-container').attr('ng-required', 'true');
                                            }
                                            else {
                                                $(this).find('.wgll-reason-for-failure-container').attr('ng-required', 'false');
                                                $(this).find('.wgll-reason-for-failure-container').removeClass('show');
                                                $(this).find('.wgll-reason-for-failure-container').addClass('hidden');
                                            }
                                        });
                                    })
                                   .fail(function (err) {
                                       SP.UI.Notify.addNotification(sharePointConfig.messages.defaultError, false);
                                       console.error(JSON.stringify(err));
                                   });
                               //$scope is not updating so force with this command
                               if (!$scope.$$phase) { $scope.$apply(); }
                               $('.wgll-button-disabled').removeAttr("disabled");
                           })
                           .fail(function (err) {
                               SP.UI.Notify.addNotification(sharePointConfig.messages.defaultError, false);
                               console.error(JSON.stringify(err));
                           });
                        //$scope is not updating so force with this command
                        if (!$scope.$$phase) { $scope.$apply(); }
                            })
                .fail(function (err) {
                    SP.UI.Notify.addNotification(sharePointConfig.messages.defaultError, false);
                    console.error(JSON.stringify(err));
                });
            })
            .fail(function (err) {
                SP.UI.Notify.addNotification(sharePointConfig.messages.defaultError, false);
                console.error(JSON.stringify(err));
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

        $scope.deleteImage = function(serverRelativeUrl) {
            var r = confirm("Do you want to delete this image?");
            if (r == true) {
                SharePointJSOMService.deleteFile(serverRelativeUrl,
                    function (jsonObject) {
                    },
                    function (err) {
                        SP.UI.Notify.addNotification(sharePointConfig.messages.deleteImageError, false);
                        console.error(JSON.stringify(err));
                    });
                $scope.refresh();
            }
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
                    "WGLLResult": currentResult.toString(), "WGLLReasonForFailure": currentReasonForFailure
                }, $scope.successOnAnswerUpdate, $scope.failureOnAnswerUpdate);
            });
            SP.UI.Notify.addNotification(sharePointConfig.messages.onReviewSave, false);
            $('.wgll-button-disabled').removeAttr("disabled");
        };

        $scope.successOnSubmit = function (jsonObject) {
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
            console.error("$scope.failureOnUpdate: " + JSON.stringify(jsonObject));
        };

        $scope.failureOnSubmit = function (jsonObject) {
            SP.UI.Notify.addNotification(sharePointConfig.messages.onSubmitError, false);
            console.error("$scope.failureOnSubmit: " + JSON.stringify(jsonObject));
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
            console.error("$scope.failureOnAnswerUpdate: " + JSON.stringify(jsonObject));
        };

        $scope.failureOnRevert = function (jsonObject) {
            SP.UI.Notify.addNotification(sharePointConfig.messages.onSubmitError, false);
            console.error("$scope.failureOnRevert: " + JSON.stringify(jsonObject));
        };

        //Routing
        $scope.goTo = function (path) {
            $location.path(path);
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

                $scope.scrollTop = function () {
            $('#s4-workspace').scrollTop(0);
        }

        //Shows and hides subset sections based on index and Next button click
        $scope.moveNext = function (currentDivId, index) {
            $('#' + currentDivId).removeClass("ng-show");
            $('#' + currentDivId).addClass("ng-hide");
            var next = parseInt(index);
            next = next + 1;
            var nextDivId = '#wgllSubsetContainer' + next;
            $(nextDivId).removeClass("ng-hide");
            $(nextDivId).addClass("ng-show");
            $scope.scrollTop
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
            $scope.scrollTop
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
                    console.error(JSON.stringify(err));
                });
            }
        };

        $scope.uploadImage = function (btnId, imageFile, imageDiv) {
            if (!window.FileReader) {
                SP.UI.Notify.addNotification(sharePointConfig.messages.fileReaderError, false);
            }
            else {
                p_btnId = btnId;
                p_imageFile = imageFile;
                p_imageDiv = imageDiv;
                p_imageAnswerId =
                    $('#' + btnId).closest('.wgll-criteria-container').find('.wgll-criteria-title-label').attr('answerid');
                $scope.imageFolderUrl = "/mvf/wgll/" + sharePointConfig.lists.images + "/" + $scope.store + "/" + $scope.title;
                var fileInput = $('#' + imageFile);
                $.when(SharePointJSOMService.getFileBuffer(fileInput))
                    .done(function (arrayBuffer) {
                        $.when(SharePointJSOMService.addFileToFolder(arrayBuffer, $scope.imageFolderUrl,
                            fileInput, $scope.successOnFileAdd, $scope.failureOnFileAdd))
                        .done(function (jsonObject) {
                        })
                        .fail(function (err) {
                            console.error(JSON.stringify(err));
                        });
                    })
                    .fail(function (err) {
                        console.error(JSON.stringify(err));
                    });
            }
        };

        $scope.successOnFileAdd = function (jsonObject) {
            $scope.showImageUploadSuccess(p_imageDiv);
            p_imageId = jsonObject.d.ListItemAllFields.ID;
            SharePointJSOMService.updateFileMetadata(sharePointConfig.lists.images, p_imageId.toString(), {
                "WGLLReviewId": $scope.title, "WGLLAnswerId": p_imageAnswerId.toString()
            }, $scope.successOnImageUpdate, $scope.failureOnImageUpdate);

        };

        $scope.failureOnFileAdd = function (jsonObject) {
            console.error("$scope.failureOnFileAdd: " + JSON.stringify(jsonObject));
            //Create folder using store first
            var storeFolderUrl = "/mvf/wgll/" + sharePointConfig.lists.images + "/" + $scope.store;
            SharePointJSOMService.createFolder(sharePointConfig.lists.images, { "ServerRelativeUrl": storeFolderUrl },
                $scope.successOnCreateStoreFolder, $scope.failureOnCreateStoreFolder);
        };

        $scope.successOnCreateStoreFolder = function (jsonObject) {
            SharePointJSOMService.createFolder(sharePointConfig.lists.images, { "ServerRelativeUrl": $scope.imageFolderUrl },
                $scope.successOnCreateReviewIdFolder, $scope.failureOnCreateReviewIdFolder);
        };

        $scope.failureOnCreateStoreFolder = function (jsonObject) {
            SharePointJSOMService.createFolder(sharePointConfig.lists.images, { "ServerRelativeUrl": $scope.imageFolderUrl },
                $scope.successOnCreateReviewIdFolder, $scope.failureOnCreateReviewIdFolder);
        };

        $scope.successOnImageUpdate = function (jsonObject) {
            $scope.refresh();
        };

        $scope.failureOnImageUpdate = function (jsonObject) {
            console.error("$scope.failureOnFileAdd: " + JSON.stringify(jsonObject));
        };

        $scope.successOnCreateReviewIdFolder = function (jsonObject) {
            var answerId =
                $('#' + p_btnId).closest('.wgll-criteria-container').find('.wgll-criteria-title-label').attr('answerid');
            var fileInput = $('#' + p_imageFile);
            $.when(SharePointJSOMService.getFileBuffer(fileInput))
                .done(function (arrayBuffer) {
                    $.when(SharePointJSOMService.addFileToFolder(arrayBuffer, $scope.imageFolderUrl,
                        fileInput, $scope.successOnFileAdd, $scope.failureOnFileAdd))
                    .done(function (jsonObject) {
                    })
                    .fail(function (err) {
                        console.error(JSON.stringify(err));
                    });
                })
                .fail(function (err) {
                    console.error(JSON.stringify(err));
                });
        };

        $scope.failureOnCreateReviewIdFolder = function (jsonObject) {
            var answerId =
                $('#' + p_btnId).closest('.wgll-criteria-container').find('.wgll-criteria-title-label').attr('answerid');
            var fileInput = $('#' + p_imageFile);
            $.when(SharePointJSOMService.getFileBuffer(fileInput))
                .done(function (arrayBuffer) {
                    $.when(SharePointJSOMService.addFileToFolder(arrayBuffer, $scope.imageFolderUrl,
                        fileInput, $scope.successOnFileAdd, $scope.failureOnFileAdd))
                    .done(function (jsonObject) {
                    })
                    .fail(function (err) {
                        console.error(JSON.stringify(err));
                    });
                })
                .fail(function (err) {
                    console.error(JSON.stringify(err));
                });
        };

        $scope.showImageUploadSuccess = function(imageUploadDiv) {
            if ($('#' + imageUploadDiv).hasClass('show')) {
                $('#' + imageUploadDiv).removeClass('show');
                $('#' + imageUploadDiv).addClass('hidden');
            }
            else {
                $('#' + imageUploadDiv).removeClass('hidden');
                $('#' + imageUploadDiv).addClass('show');
            }
            SP.UI.Notify.addNotification(sharePointConfig.messages.onImageUploaded, false);
            $scope.scrollTop();
        }

        $scope.refresh = function () {
            //Get the Review from the Reviews list using the reviewId from the query string
            $.when(SharePointJSOMService.getImagesFromHostWebFolder($scope,
                     "/mvf/wgll/" + sharePointConfig.lists.images + "/" + $scope.store + "/" + $scope.title))
                .done(function (jsonObject) {
                    angular.forEach($scope.subsets, function (subset) {
                        angular.forEach(subset.answers, function (answer) {
                            var answerImages = [];
                            angular.forEach(jsonObject.d.results, function (image) {
                                if (answer.id == image.ListItemAllFields.WGLLAnswerId) {
                                    answerImages.push({
                                        name: image.Name,
                                        serverRelativeUrl: image.ServerRelativeUrl,
                                        answerId: image.ListItemAllFields.WGLLAnswerId
                                    })
                                }
                            });
                            answer.images = answerImages;
                        });
                    });
                    if (!$scope.$$phase) { $scope.$apply(); }
                })
            .fail(function (err) {
                SP.UI.Notify.addNotification(sharePointConfig.messages.defaultError, false);
                console.error(JSON.stringify(err));
            });
        };

    }
}]);