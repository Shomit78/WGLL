'use strict';

//Existing code
var context = SP.ClientContext.get_current();
var user = context.get_web().get_currentUser();

var myApp = angular.module('myApp', ['ui.bootstrap', 'ngSanitize', 'ngRoute']);

var hostweburl;
var appweburl;

// This code runs when the DOM is ready and creates a context object which is needed to use the SharePoint object model
$(document).ready(function () {
    //getUserName();
    SP.SOD.executeOrDelayUntilScriptLoaded(OnLoad, 'SP.js');
    function OnLoad() {
        $(".ms-siteicon-img").attr('src', '../images/mvf_logo.gif');
    }
});
