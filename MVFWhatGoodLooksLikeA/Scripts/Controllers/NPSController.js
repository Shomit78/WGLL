myApp.controller('NPSController', ['$scope', 'SharePointJSOMService', '$location', function ($scope, SharePointJSOMService, $location) {
    SP.SOD.executeOrDelayUntilScriptLoaded(OnLoad, "SP.js");
    function OnLoad() {

        //$scope variables
        $scope.storeName = "";
        $scope.stores = [];
        $scope.ratings = [
            { id: "10", title: "10 - Extremely likely" },
            { id: "9", title: "9" },
            { id: "8", title: "8" },
            { id: "7", title: "7" },
            { id: "6", title: "6" },
            { id: "5", title: "5" },
            { id: "4", title: "4" },
            { id: "3", title: "3" },
            { id: "3", title: "2" },
            { id: "3", title: "1 - Not likely" },
        ];

        //Get the user profile properties to set default store for Net Promoter Score
        $.when(SharePointJSOMService.getUserProfileItemsFromHostWebAll($scope))
        .done(function (jsonObject) {
            angular.forEach(jsonObject, function (user) {
                angular.forEach(user.UserProfileProperties.results, function (prop, key) {
                    if (prop.Key == sharePointConfig.properties.store) {
                        $scope.storeName = prop.Value;
                    }
                });
                if ($scope.storeName == "") {
                    SP.UI.Notify.addNotification(sharePointConfig.messages.onGetStoreError, false);
                }
                else {
                    //Check whether the store is NPS enabled
                    var filter = sharePointConfig.fields.sharepoint.title + " eq '" + $scope.storeName + "'";
                    $.when(SharePointJSOMService.getItemsFromHostWebWithParams($scope, sharePointConfig.lists.stores,
                        sharePointConfig.fields.sharepoint.title + ',' + sharePointConfig.fields.sharepoint.id +
                        ',' + sharePointConfig.fields.stores.npsEnabled, '', filter, sharePointConfig.fields.sharepoint.title))
                   .done(function (jsonObject) {
                       angular.forEach(jsonObject.d.results, function (store, key) {
                           if (store.Title == $scope.storeName) {
                               $scope.stores.push({
                                   id: store.Id,
                                   title: store.Title,
                                   nps: store.WGLLNPSEnabled
                               });
                           }
                           //$scope is not updating so force with this command
                           if (!$scope.$$phase) { $scope.$apply(); }
                       });
                       if ($scope.stores.length > 0) {
                           if ($scope.stores[0].nps) {
                               $('#npsSubmit').removeAttr("disabled");
                           }
                           else {
                               SP.UI.Notify.addNotification(sharePointConfig.messages.onNPSEnabledError, false);
                               if (!$scope.$$phase) {
                                   $scope.$apply(function () {
                                       $location.path('/');
                                   });
                               }
                               else {
                                   $location.path('/');
                               }
                           }
                       }
                       else {
                           SP.UI.Notify.addNotification(sharePointConfig.messages.onNPSEnabledError, false);
                           if (!$scope.$$phase) {
                               $scope.$apply(function () {
                                   $location.path('/');
                               });
                           }
                           else {
                               $location.path('/');
                           }
                       }
                   })
                   .fail(function (err) {
                       SP.UI.Notify.addNotification(sharePointConfig.messages.defaultError, false);
                       console.info(JSON.stringify(err));
                   });
                }
            });
            if (!$scope.$$phase) { $scope.$apply(); }
        })
        .fail(function (err) {
            SP.UI.Notify.addNotification(sharePointConfig.messages.defaultError, false);
            console.info(JSON.stringify(err));
        })


        $scope.submit = function () {
            $('#npsSubmit').attr("disabled", "");
            SharePointJSOMService.addListItem(sharePointConfig.lists.nps, {
                "Title": $scope.storeName,
                "NPSRating": $scope.selectedRating.id,
                "NPSComments": $scope.comments
            }, $scope.successOnSave, $scope.failureOnSave);
        };

        $scope.successOnSave = function (jsonObject) {
            SP.UI.Notify.addNotification(sharePointConfig.messages.onNPSSave, false);
            if (!$scope.$$phase) {
                $scope.$apply(function () {
                    $location.path('/');
                });
            }
            else {
                $location.path('/');
            }
        };

        $scope.successOnFailure = function (jsonObject) {
            SP.UI.Notify.addNotification(sharePointConfig.messages.onNPSError, false);
            if (!$scope.$$phase) {
                $scope.$apply(function () {
                    $location.path('/');
                });
            }
            else {
                $location.path('/');
            }
        };

        $scope.goTo = function (path) {
            $location.path(path);
        };
    }
}]);