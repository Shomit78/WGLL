myApp.config(function ($routeProvider) {
    $routeProvider
    .when('/', { templateUrl: 'Reviews/Reviews.html', controller: 'ReviewsController' })
    .when('/CreateReview', { templateUrl: 'Reviews/CreateReview.html', controller: 'CreateReviewController' })
    .when('/NewReview/:store/:visitType', { templateUrl: 'Reviews/NewReview.html', controller: 'NewReviewController' })
    .when('/ViewReview/:reviewId', {templateUrl: "Reviews/ViewReview.html", controller: 'ViewReviewController' })
    .otherwise({ redirectTo: '/' });
});