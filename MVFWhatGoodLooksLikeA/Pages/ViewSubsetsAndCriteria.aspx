﻿<%@ Page language="C#" MasterPageFile="~masterurl/default.master" Inherits="Microsoft.SharePoint.WebPartPages.WebPartPage, Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register Tagprefix="Utilities" Namespace="Microsoft.SharePoint.Utilities" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register Tagprefix="WebPartPages" Namespace="Microsoft.SharePoint.WebPartPages" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register Tagprefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>

<asp:Content ContentPlaceHolderId="PlaceHolderAdditionalPageHead" runat="server">
        <script type="text/javascript" src="../Scripts/jquery-1.9.1.min.js"></script>
    <script src="../Scripts/angular.js"></script>
    <script src="../Scripts/angular-route.js"></script>
    <script src="../Scripts/angular-ui/ui-bootstrap.js"></script>
    <script src="../Scripts/angular-sanitize.js"></script>
    <script src="../Scripts/bootstrap.min.js"></script>
    <meta name="WebPartPageExpansion" content="full" />

    <!-- Add your CSS styles to the following file -->
    <link rel="Stylesheet" type="text/css" href="../Content/App.css" />
    <link href="../Content/bootstrap.css" rel="stylesheet" />

    <!-- Add your JavaScript to the following file -->
    <script src="../Scripts/App.js"></script>
    <script src="../Scripts/Services/sharepoint.jsom.service.js"></script>
    <script src="../Scripts/Controllers/RegionsController.js"></script>
    <script src="../Scripts/Controllers/StoresController.js"></script>
    <script src="../Scripts/Controllers/VisitTypesController.js"></script>
    <script src="../Scripts/Controllers/SubsetsController.js"></script>
    <script src="../Scripts/Controllers/CriteriaController.js"></script>
</asp:Content>

<%-- The markup in the following Content element will be placed in the TitleArea of the page --%>
<asp:Content ContentPlaceHolderID="PlaceHolderPageTitleInTitleArea" runat="server">
    
    What Good Looks Like Home
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
   
    <div ng-app="myApp">
        <div ng-controller="SubsetsController">
            <div class="row">
                <div class="col-md-12" ng-repeat="subset in subsets">
                    {{ $index + 1}}). {{ subset.title }}
                    <br />
                    <div ng-repeat="criteria in subset.criteria" />
                    {{ $index + 1}}. {{ criteria.title }}
                    <br />
                    {{ crit.detail }}&nbsp;<select><option></option><option>Pass</option><option>Fail</option></select>
                </div> 
            </div>
        </div>
    </div>
</asp:Content>