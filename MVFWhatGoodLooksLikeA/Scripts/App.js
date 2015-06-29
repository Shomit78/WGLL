'use strict';

//Existing code
var context = SP.ClientContext.get_current();
var user = context.get_web().get_currentUser();

//Create an AngularJS application - ng-app reference in /Pages/default.aspx
var myApp = angular.module('myApp', ['ui.bootstrap', 'ngSanitize', 'ngRoute']);

//2 variables to store the SharePoint host web url and the application web url - used for REST/OData queries
//Application Manifest uses the query string to pass these values
var hostweburl;
var appweburl;

//Configuration object for storing all SharePoint list titles, field names, UPS property names, and application messages
var sharePointConfig = {
    lists : {
        regions: "Regions" ,
        stores: "Stores" ,
        visitTypes: "VisitTypes" ,
        subsets: "Subsets" ,
        criteria: "Criteria",
        answers: "Answers",
        reviews: "Reviews",
        nps: "NPS"
        },
    fields: {
        sharepoint: {
            author: "Author",
            id: "ID",
            title: "Title"
        },
        criteria: {
            detail: "CriteriaDetail",
            nonNegotiable: "NonNegotiable",
            order: "CriteriaOrder",
            stores: "Stores",
            subset: "Subset",
            visitType: "VisitType"
        },
        reviews: {
            notes: "WGLLNotes",
            region: "WGLLRegion",
            status: "WGLLStatus",
            store: "WGLLStore",
            submittedDate: "WGLLSubmittedDate",
            summary: "WGLLVisitSummary",
            visitType: "WGLLVisitType"
        },
        stores: {
            region: "WGLLRegion"
        },
        subsets: {
            active: "SubsetActive",
            detail: "SubsetDetail",
            order: "SubsetOrder"
        }
    },
    properties: { 
        region: "Region",
        store: "Office",
        jobTitle: "Title"

    },
    messages: {
        defaultError: "An error has occurred whilst retrieving data. <br />Please ensure you are connected to the network and refresh the page.",
        onReviewSave: "Your Review has been succesfully saved. ",
        onSaveError: "An error has occurred whilst attempting to save the Review. <br />Please ensure you are connected to the network and try again.",
        onSaveAnswerError: "An error has occurred whilst attempting to save the Answers. <br />Please ensure you are connected to the network and try again.",
        onSubmitValidationError: "The Review cannot be submitted. Some failed criteria require reasons for failure. "
    },
    status: {
        saved: "Saved"
    }
};

// This code runs when the DOM is ready and creates a context object which is needed to use the SharePoint object model
$(document).ready(function () {
    //Ensure the sp.js SharePoint script is loaded before calling OnLoad
    SP.SOD.executeOrDelayUntilScriptLoaded(OnLoad, 'SP.js');
    function OnLoad() {
        //Change the default application logo to Mole Valley Farmers logo
        $(".ms-siteicon-img").attr('src', '../images/mvf_logo.gif');
    }
});
