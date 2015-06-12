<%@ Page language="C#" MasterPageFile="~masterurl/default.master" Inherits="Microsoft.SharePoint.WebPartPages.WebPartPage, Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
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
    <script src="../Scripts/Controllers/ReviewsController.js"></script>
</asp:Content>

<asp:Content ContentPlaceHolderId="PlaceHolderMain" runat="server">
    <div class="container-fluid" ng-app="myApp">
        <div class="row" ng-controller="ReviewsController">
            <table class="table">
                <caption>Current Reviews</caption>
                <thead>
                    <tr>
                        <th>Reference</th>
                        <th>Store</th>
                        <th>Visit Type</th>
                        <th>Status</th>
                        <th>Author</th>
                        <th>Created</th>
                    </tr>
                </thead>
                <tbody>
                    <tr ng-repeat="review in reviews">
                        <td>{{ review.title }}</td>
                        <td>{{ review.store }}</td>
                        <td>{{ review.visitType }}</td>
                        <td>{{ review.status }}</td>
                        <td>{{ review.Author }}</td>
                        <td>{{ review.Created }}</td>
                    </tr>
                </tbody>
            </table>
            <hr />
            <div class="col-sm-12">
                <input type="button" value="Create Review" />
            </div>
        </div>
    </div>
    <SharePoint:ScriptLink name="clienttemplates.js" runat="server" LoadAfterUI="true" Localizable="false" />
    <SharePoint:ScriptLink name="clientforms.js" runat="server" LoadAfterUI="true" Localizable="false" />
    <SharePoint:ScriptLink name="clientpeoplepicker.js" runat="server" LoadAfterUI="true" Localizable="false" />
    <SharePoint:ScriptLink name="autofill.js" runat="server" LoadAfterUI="true" Localizable="false" />
    <SharePoint:ScriptLink name="sp.RequestExecutor.js" runat="server" LoadAfterUI="true" Localizable="false" />
    <SharePoint:ScriptLink name="sp.js" runat="server" LoadAfterUI="true" Localizable="false" />
    <SharePoint:ScriptLink name="SP.UserProfiles.js" runat="server" LoadAfterUI="true" Localizable="false" />
    <SharePoint:ScriptLink name="sp.runtime.js" runat="server" LoadAfterUI="true" Localizable="false" />
    <SharePoint:ScriptLink name="sp.core.js" runat="server" LoadAfterUI="true" Localizable="false" />
</asp:Content>
