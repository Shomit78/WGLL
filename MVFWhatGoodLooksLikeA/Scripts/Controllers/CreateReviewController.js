myApp.controller('CreateReviewController', ['$scope', 'SharePointJSOMService', '$location', function ($scope, SharePointJSOMService, $location) {
    SP.SOD.executeOrDelayUntilScriptLoaded(OnLoad, "SP.js");
    function OnLoad() {

        //$scope variables
        $scope.regions = [];
        $scope.stores = [];
        $scope.visitTypes = [];

        //Custom variables
        var myJobTitle;
        var myOffice;
        var myRegion;

        //Get current user properties to set defaults on Region and Store.
        $.when(SharePointJSOMService.getUserProfileItemsFromHostWebAll($scope))
        .done(function (jsonObject) {
            angular.forEach(jsonObject, function (user) {
                angular.forEach(user.UserProfileProperties.results, function (prop, key) {
                    if (prop.Key == sharePointConfig.properties.region) {
                        myRegion = prop.Value;
                    }
                    else {
                        if (prop.Key == sharePointConfig.properties.store) {
                            myOffice = prop.Value;
                        }
                        else {
                            if (prop.Key == sharePointConfig.properties.jobTitle) {
                                myJobTitle = prop.Value;
                            }
                        }
                    }
                });
            });
            //Get the list of Regions from the Regions list and set the default value to the user's current Region.
            $.when(SharePointJSOMService.getItemsFromHostWebWithSelect($scope, sharePointConfig.lists.regions,
                sharePointConfig.fields.sharepoint.title + ',' + sharePointConfig.fields.sharepoint.id))
            .done(function (jsonObject) {
                angular.forEach(jsonObject.d.results, function (region, key) {
                    $scope.regions.push({
                        title: region.Title,
                        id: region.ID
                    });
                    if (region.Title == myRegion) {
                        $scope.selectedRegion = $scope.regions[key];
                    }
                    //$scope is not updating so force with this command
                    if (!$scope.$$phase) { $scope.$apply(); }
                    $('#wgllSelectRegion').removeAttr("disabled");
                });
                //Get the list of Stores from the Stores list and set the user's default value to their current Store.
                $.when(SharePointJSOMService.getItemsFromHostWebWithParams($scope,
                    sharePointConfig.lists.stores,
                    sharePointConfig.fields.sharepoint.title + ',' + sharePointConfig.fields.sharepoint.id + ',' + sharePointConfig.fields.stores.region + '/' + sharePointConfig.fields.sharepoint.id + ',' + sharePointConfig.fields.stores.region + '/' + sharePointConfig.fields.sharepoint.title,
                    'WGLLRegion/ID,WGLLRegion/Title', '', sharePointConfig.fields.sharepoint.title))
                    .done(function (jsonObject) {
                        angular.forEach(jsonObject.d.results, function (store, key) {
                            $scope.stores.push({
                                title: store.Title,
                                id: store.ID,
                                region: store.WGLLRegion.Title
                            });
                            if (store.Title == myOffice) {
                                $scope.selectedStore = $scope.stores[key];
                            }
                            //$scope is not updating so force with this command
                            if (!$scope.$$phase) { $scope.$apply(); }
                        });
                        $('#wgllSelectStore').removeAttr("disabled");
                    })
                    .fail(function (err) {
                        SP.UI.Notify.addNotification(sharePointConfig.messages.defaultError, false);
                        console.info(JSON.stringify(err));
                    });
            })
            .fail(function (err) {
                SP.UI.Notify.addNotification(sharePointConfig.messages.defaultError, false);
                console.info(JSON.stringify(err));
            });
        })
        .fail(function (err) {
            SP.UI.Notify.addNotification(sharePointConfig.messages.defaultError, false);
            console.info(JSON.stringify(err));
        });

        //Get the list of Visit Types from the VisitTypes list and display in a drop down.
        $.when(SharePointJSOMService.getItemsFromHostWebWithSelect($scope, sharePointConfig.lists.visitTypes,
            sharePointConfig.fields.sharepoint.title + ',' + sharePointConfig.fields.sharepoint.id))
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
            SP.UI.Notify.addNotification(sharePointConfig.messages.defaultError, false);
            console.info(JSON.stringify(err));
        });

        $('#wgllButtonCreateReview').removeAttr("disabled");
        
    }

    //Routing
    $scope.goTo = function (path) {
        $location.path(path);
    };

}]);