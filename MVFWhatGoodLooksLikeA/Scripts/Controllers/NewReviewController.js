myApp.controller('NewReviewController', ['$scope', 'SharePointJSOMService', '$location', '$routeParams', function ($scope, SharePointJSOMService, $location, $routeParams) {
    SP.SOD.executeOrDelayUntilScriptLoaded(NewReviewControllerOnLoad, "SP.js");
    function NewReviewControllerOnLoad() {
        var store = $routeParams.store;
        var visitType = $routeParams.visitType;
        var saved = false;

        $scope.subsets = [];
        var subsetFilter = "SubsetActive eq 1";

        $.when(SharePointJSOMService.getItemsFromHostWebWithParams($scope, 'Subsets', 'Title,ID,SubsetDetail,SubsetOrder', '', subsetFilter, 'SubsetOrder'))
        .done(function (jsonObject) {
            angular.forEach(jsonObject.d.results, function (subset) {
                var crit = [];
                var filter = "Subset/ID eq " + subset.ID;
                $.when(SharePointJSOMService.getItemsFromHostWebWithParams($scope, 'Criteria', 'Title,ID,CriteriaDetail,Subset/ID', 'Subset/ID', filter, 'CriteriaOrder'))
                .done(function (jsonObject) {
                    angular.forEach(jsonObject.d.results, function (criteria) {
                        crit.push({
                            title: criteria.Title,
                            id: criteria.ID,
                            detail: criteria.CriteriaDetail
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
            //Save review, but don't set title.  In success function update list item with title
            if (!saved) {
                SharePointJSOMService.addListItem("Reviews", { "WGLLStore": store, "WGLLVisitType": visitType, "WGLLStatus": "Saved" }, $scope.successOnSave, $scope.failureOnSave);
            }
            else {
                //save only the answers
            }
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
                SharePointJSOMService.updateListItem("Reviews", review.ID, { "Title": title }, $scope.successOnUpdate, $scope.failureOnUpdate);
            });
        };

        $scope.successOnUpdate = function (jsonObject) {
            //save answers to answers list
            $scope.$apply(function () {
                $location.path('/');
            });
        };

        $scope.failureOnUpdate = function (jsonObject) {
            console.info(JSON.stringify(jsonObject));
        };

        $scope.failureOnSave = function (jsonObject) {
            console.info(JSON.stringify(jsonObject));
        };

        $scope.submit = function () {
            //Submit review, but don't set title.  In success function update list item with title
            $('.wgll-button-disabled').attr('disabled', '');
            if (!saved) {
                SharePointJSOMService.addListItem("Reviews", { "WGLLStore": store, "WGLLVisitType": visitType, "WGLLStatus": "Submitted" }, $scope.successOnSave, $scope.failureOnSave);
            }
            else {
                //save only the answers
            }
        };

        $scope.goTo = function (path) {
            $location.path(path);
        };

        $scope.runTests = function () {
            console.log("Running tests on WGLL application");
            $('.wgll-subset-container').each(function () {
                console.log($(this).attr('id'));
            });
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
    }


}]);