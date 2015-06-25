<%-- The following 4 lines are ASP.NET directives needed when using SharePoint components --%>

<%@ Page Inherits="Microsoft.SharePoint.WebPartPages.WebPartPage, Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" MasterPageFile="~masterurl/default.master" Language="C#" %>

<%@ Register TagPrefix="Utilities" Namespace="Microsoft.SharePoint.Utilities" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register TagPrefix="WebPartPages" Namespace="Microsoft.SharePoint.WebPartPages" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register TagPrefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>

<%-- The markup and script in the following Content element will be placed in the <head> of the page --%>
<asp:Content ContentPlaceHolderID="PlaceHolderAdditionalPageHead" runat="server">
    <script type="text/javascript" src="../Scripts/jquery-1.9.1.min.js"></script>
    <script type="text/javascript" src="../Scripts/angular.js"></script>
    <script type="text/javascript" src="../Scripts/angular-route.js"></script>
    <script type="text/javascript" src="../Scripts/angular-ui/ui-bootstrap.js"></script>
    <script type="text/javascript" src="../Scripts/angular-sanitize.js"></script>
    <script type="text/javascript" src="../Scripts/bootstrap.min.js"></script>
    <script type="text/javascript" src="../Scripts/moment.js"></script>
    <meta name="WebPartPageExpansion" content="full" />

    <!-- Add your CSS styles to the following file -->
    <link rel="Stylesheet" type="text/css" href="../Content/App.css" />
    <link type="text/css" href="../Content/bootstrap.css" rel="stylesheet" />

    <!-- Add your JavaScript to the following file -->
    <script type="text/javascript" src="../Scripts/App.js"></script>
    <script type="text/javascript" src="../Scripts/App.Route.js"></script>
    <script type="text/javascript" src="../Scripts/Services/sharepoint.jsom.service.js"></script>
    <script type="text/javascript" src="../Scripts/Controllers/RegionsController.js"></script>
    <script type="text/javascript" src="../Scripts/Controllers/StoresController.js"></script>
    <script type="text/javascript" src="../Scripts/Controllers/VisitTypesController.js"></script>
    <script type="text/javascript" src="../Scripts/Controllers/SubsetsController.js"></script>
    <script type="text/javascript" src="../Scripts/Controllers/CriteriaController.js"></script>
    <script type="text/javascript" src="../Scripts/Controllers/ReviewsController.js"></script>
    <script type="text/javascript" src="../Scripts/Controllers/CreateReviewController.js"></script>
    <script type="text/javascript" src="../Scripts/Controllers/NewReviewController.js"></script>
    <script type="text/javascript" src="../Scripts/Controllers/ViewReviewController.js"></script>
    <script type="text/javascript" src="../Scripts/Controllers/NPSController.js"></script>
</asp:Content>

<%-- The markup in the following Content element will be placed in the TitleArea of the page --%>
<asp:Content ContentPlaceHolderID="PlaceHolderPageTitleInTitleArea" runat="server">
</asp:Content>

<%-- The markup and script in the following Content element will be placed in the <body> of the page --%>
<asp:Content ContentPlaceHolderID="PlaceHolderMain" runat="server">
    <SharePoint:ScriptLink name="clienttemplates.js" runat="server" LoadAfterUI="true" Localizable="false" />
    <SharePoint:ScriptLink name="clientforms.js" runat="server" LoadAfterUI="true" Localizable="false" />
    <SharePoint:ScriptLink name="clientpeoplepicker.js" runat="server" LoadAfterUI="true" Localizable="false" />
    <SharePoint:ScriptLink name="autofill.js" runat="server" LoadAfterUI="true" Localizable="false" />
    <SharePoint:ScriptLink name="sp.RequestExecutor.js" runat="server" LoadAfterUI="true" Localizable="false" />
    <SharePoint:ScriptLink name="sp.js" runat="server" LoadAfterUI="true" Localizable="false" />
    <SharePoint:ScriptLink name="SP.UserProfiles.js" runat="server" LoadAfterUI="true" Localizable="false" />
    <SharePoint:ScriptLink name="sp.runtime.js" runat="server" LoadAfterUI="true" Localizable="false" />
    <SharePoint:ScriptLink name="sp.core.js" runat="server" LoadAfterUI="true" Localizable="false" />
   
    <div id="wgllAppContainer">
        <div class="container-fluid" ng-app="myApp">
            <div class="container-fluid" ng-view></div>
        </div>
    </div>

</asp:Content>
