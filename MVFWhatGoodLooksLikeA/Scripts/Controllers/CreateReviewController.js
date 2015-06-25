myApp.controller('CreateReviewController', ['$scope', 'SharePointJSOMService', '$location', function ($scope, SharePointJSOMService, $location) {
    SP.SOD.executeOrDelayUntilScriptLoaded(OnLoad, "SP.js");
    function OnLoad() {
        $scope.regions = [];
        $scope.stores = [];
        $scope.visitTypes = [];
        var myJobTitle;
        var myOffice;
        var myRegion;

        $.when(SharePointJSOMService.getUserProfileItemsFromHostWebAll($scope))
        .done(function (jsonObject) {
            angular.forEach(jsonObject, function (user) {
                angular.forEach(user.UserProfileProperties.results, function (prop, key) {
                    if (prop.Key == "Region") {
                        myRegion = prop.Value;
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
                console.info(myRegion + ";" + myOffice + ";" + myJobTitle);
            });
            $.when(SharePointJSOMService.getItemsFromHostWebWithSelect($scope, 'Regions', 'Title,ID'))
            .done(function (jsonObject) {
                angular.forEach(jsonObject.d.results, function (region, key) {
                    $scope.regions.push({
                        title: region.Title,
                        id: region.ID
                    });
                    if (region.Title == myRegion) {
                        console.info($scope.regions[key].title);
                        $scope.selectedRegion = $scope.regions[key];
                    }
                    //$scope is not updating so force with this command
                    if (!$scope.$$phase) { $scope.$apply(); }
                    $('#wgllSelectRegion').removeAttr("disabled");
                });
                $.when(SharePointJSOMService.getItemsFromHostWebWithParams($scope, 'Stores', 'Title,ID,WGLLRegion/ID,WGLLRegion/Title', 'WGLLRegion/ID,WGLLRegion/Title', '', 'Title'))
                    .done(function (jsonObject) {
                        angular.forEach(jsonObject.d.results, function (store, key) {
                            $scope.stores.push({
                                title: store.Title,
                                id: store.ID,
                                region: store.WGLLRegion.Title
                            });
                            if (store.Title == myOffice) {
                                console.info($scope.stores[key].title);
                                $scope.selectedStore = $scope.stores[key];
                            }
                            //$scope is not updating so force with this command
                            if (!$scope.$$phase) { $scope.$apply(); }
                        });
                        $('#wgllSelectStore').removeAttr("disabled");
                        //Check what level the user is at and disable the drop downs
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

        $.when(SharePointJSOMService.getItemsFromHostWebWithSelect($scope, 'VisitTypes', 'Title,ID'))
        .done(function (jsonObject) {
            angular.forEach(jsonObject.d.results, function (visitType, key) {
                $scope.visitTypes.push({
                    title: visitType.Title,
                    id: visitType.ID
                });
                if (visitType.Title == "Daily") {
                    $scope.selectedVisitType = $scope.visitTypes[key];
                }
                //$scope is not updating so force with this command
                if (!$scope.$$phase) { $scope.$apply(); }
            });
            //Set default to Daily visit type
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