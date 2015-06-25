myApp.config(function ($routeProvider) {
    $routeProvider
    .when('/', { templateUrl: 'Reviews/Reviews.html', controller: 'ReviewsController' })
    .when('/NPS', { templateUrl: 'NPS/NPS.html', controller: 'NPSController' })
    .when('/CreateReview', { templateUrl: 'Reviews/CreateReview.html', controller: 'CreateReviewController' })
    .when('/NewReview/:region/:store/:visitType', { templateUrl: 'Reviews/NewReview.html', controller: 'NewReviewController' })
    .when('/ViewReview/:ReviewId', {templateUrl: "Reviews/ViewReview.html", controller: 'ViewReviewController' })
    .otherwise({ redirectTo: '/' });
});