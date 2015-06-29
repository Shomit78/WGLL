//AngularJS routing provider used in conjunction with ng-view in /Pages/default.aspx
//Displays the correct HTML template from Pages library depending on the route the user has taken in the application
//And correct AngularJS controller to use for that template.  $routeProvider is a variable from ngRoute passed in as parameter
//in App.js to angular.module instantiation.
//Default route is '/' which routes to /Pages/default.aspx, as set as home page in Application Manifest
myApp.config(function ($routeProvider) {
    $routeProvider
    .when('/', { templateUrl: 'Reviews/Reviews.html', controller: 'ReviewsController' })
    .when('/NPS', { templateUrl: 'NPS/NPS.html', controller: 'NPSController' })
    .when('/CreateReview', { templateUrl: 'Reviews/CreateReview.html', controller: 'CreateReviewController' })
    .when('/NewReview/:region/:store/:visitType', { templateUrl: 'Reviews/NewReview.html', controller: 'NewReviewController' })
    .when('/DisplayReview/:ReviewId', { templateUrl: "Reviews/DisplayReview.html", controller: 'DisplayReviewController' })
    .when('/EditReview/:ReviewId', { templateUrl: "Reviews/EditReview.html", controller: 'EditReviewController' })
    .otherwise({ redirectTo: '/' });
});