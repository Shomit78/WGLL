myApp.controller('CreateReviewController', ['$scope', 'SharePointJSOMService', '$location', function ($scope, SharePointJSOMService, $location) {
    SP.SOD.executeOrDelayUntilScriptLoaded(OnLoad, "SP.js");
    function OnLoad() {
        $scope.regions = [];
        $scope.stores = [];
        $scope.visitTypes = [];
        var myJobTitle;
        var myOffice;
        var myDepartment;

        $.when(SharePointJSOMService.getUserProfileItemsFromHostWebAll($scope))
        .done(function (jsonObject) {
            angular.forEach(jsonObject, function (user) {
                angular.forEach(user.UserProfileProperties.results, function (prop, key) {
                    if (prop.Key == "Department") {
                        myDepartment = prop.Value;
                    }
                    else {
                        if (prop.Key == "Office") {
                            myOffice = prop.Value;
                        }
                        else {
                            if (prop.Key == "Title") {
                                myJobTitle = prop.Value;
                            }
                        }
                    }
                });
                console.info(myDepartment + ";" + myOffice + ";" + myJobTitle);
            });
        })
        .fail(function (err) {
            console.info(JSON.stringify(err));
        });

        $.when(SharePointJSOMService.getItemsFromHostWebWithSelect($scope, 'Regions', 'Title,ID'))
        .done(function (jsonObject) {
            angular.forEach(jsonObject.d.results, function (region) {
                $scope.regions.push({
                    title: region.Title,
                    id: region.ID
                });
                //$scope is not updating so force with this command
                $('#wgllSelectRegion').val(myDepartment);
                if (!$scope.$$phase) { $scope.$apply(); }
            });
            $('#wgllSelectRegion').removeAttr("disabled");
        })
        .fail(function (err) {
            console.info(JSON.stringify(err));
        });

        $.when(SharePointJSOMService.getItemsFromHostWebWithSelect($scope, 'Stores', 'Title,ID'))
        .done(function (jsonObject) {
            angular.forEach(jsonObject.d.results, function (store) {
                $scope.stores.push({
                    title: store.Title,
                    id: store.ID
                });
                //$scope is not updating so force with this command
                if (!$scope.$$phase) { $scope.$apply(); }
            });
            $('#wgllSelectStore').removeAttr("disabled");
        })
        .fail(function (err) {
            console.info(JSON.stringify(err));
        });

        $.when(SharePointJSOMService.getItemsFromHostWebWithSelect($scope, 'VisitTypes', 'Title,ID'))
        .done(function (jsonObject) {
            angular.forEach(jsonObject.d.results, function (visitType) {
                $scope.visitTypes.push({
                    title: visitType.Title,
                    id: visitType.ID
                });
                //$scope is not updating so force with this command
                if (!$scope.$$phase) { $scope.$apply(); }
            });
            $('#wgllSelectVisitType').removeAttr("disabled");
        })
        .fail(function (err) {
            console.info(JSON.stringify(err));
        });

        $('#wgllButtonCreateReview').removeAttr("disabled");
        
    }

    $scope.goTo = function (path) {
        $location.path(path);
    };

}]);