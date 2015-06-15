myApp.service('SharePointJSOMService', function ($q, $http) {

    //Get items from a list returning only Title and ID
    this.getItemsFromHostWeb = function ($scope, listName) {
        var deferred = $.Deferred();
        JSRequest.EnsureSetup();
        hostweburl = decodeURIComponent(JSRequest.QueryString["SPHostUrl"]);
        appweburl = decodeURIComponent(JSRequest.QueryString["SPAppWebUrl"]);

        var restQueryUrl = appweburl + "/_api/SP.AppContextSite(@target)/web/lists/getByTitle('" + listName + "')/items?$select=Title,ID&@target='" + hostweburl + "'";

        var executor = new SP.RequestExecutor(appweburl);
        executor.executeAsync({
            url: restQueryUrl,
            method: "GET",
            headers: { "Accept": "application/json; odata=verbose" },
            success: function (data, textStatus, xhr) {
                deferred.resolve(JSON.parse(data.body));
            },
            error: function (xhr, textStatus, errorThrown) {
                deferred.reject(JSON.stringify(xhr));
            }
        });
        return deferred;
    };

    //Get list items from a list with select params
    this.getItemsFromHostWebWithSelect = function ($scope, listName, select) {
        var deferred = $.Deferred();
        JSRequest.EnsureSetup();
        hostweburl = decodeURIComponent(JSRequest.QueryString["SPHostUrl"]);
        appweburl = decodeURIComponent(JSRequest.QueryString["SPAppWebUrl"]);

        var restQueryUrl = appweburl + "/_api/SP.AppContextSite(@target)/web/lists/getByTitle('" + listName + "')/items?$select=" + select + "&$orderby=Title&@target='" + hostweburl + "'";

        var executor = new SP.RequestExecutor(appweburl);
        executor.executeAsync({
            url: restQueryUrl,
            method: "GET",
            headers: { "Accept": "application/json; odata=verbose" },
            success: function (data, textStatus, xhr) {
                deferred.resolve(JSON.parse(data.body));
            },
            error: function (xhr, textStatus, errorThrown) {
                deferred.reject(JSON.stringify(xhr));
            }
        });
        return deferred;
    };

    //Get list items from a list with select params
    this.getItemsFromHostWebWithParams = function ($scope, listName, select, expand, filter, orderby) {
        var deferred = $.Deferred();
        JSRequest.EnsureSetup();
        hostweburl = decodeURIComponent(JSRequest.QueryString["SPHostUrl"]);
        appweburl = decodeURIComponent(JSRequest.QueryString["SPAppWebUrl"]);

        var restQueryUrl = appweburl + "/_api/SP.AppContextSite(@target)/web/lists/getByTitle('" + listName + "')/items?$select=" + select + "&$expand=" + expand + "&$filter=" + filter + "&$orderby=" + orderby + "&@target='" + hostweburl + "'";

        var executor = new SP.RequestExecutor(appweburl);
        executor.executeAsync({
            url: restQueryUrl,
            method: "GET",
            headers: { "Accept": "application/json; odata=verbose" },
            success: function (data, textStatus, xhr) {
                deferred.resolve(JSON.parse(data.body));
            },
            error: function (xhr, textStatus, errorThrown) {
                deferred.reject(JSON.stringify(xhr));
            }
        });
        return deferred;
    };

    this.getItemsFromAppWebWithParams = function ($scope, listName, select, expand, filter, orderby) {
        var deferred = $.Deferred();
        JSRequest.EnsureSetup();
        hostweburl = decodeURIComponent(JSRequest.QueryString["SPHostUrl"]);
        appweburl = decodeURIComponent(JSRequest.QueryString["SPAppWebUrl"]);

        var restQueryUrl = appweburl + "/_api/SP.AppContextSite(@target)/web/lists/getByTitle('" + listName + "')/items?$select=" + select + "&$expand=" + expand + "&$filter=" + filter + "&$orderby=" + orderby + "&@target='" + appweburl + "'";

        var executor = new SP.RequestExecutor(appweburl);
        executor.executeAsync({
            url: restQueryUrl,
            method: "GET",
            headers: { "Accept": "application/json; odata=verbose" },
            success: function (data, textStatus, xhr) {
                deferred.resolve(JSON.parse(data.body));
            },
            error: function (xhr, textStatus, errorThrown) {
                deferred.reject(JSON.stringify(xhr));
            }
        });
        return deferred;
    };

    this.createListItemJSON = function ($scope, listName, metadata) {
        var deferred = $.Deferred();
        JSRequest.EnsureSetup();
        hostweburl = decodeURIComponent(JSRequest.QueryString["SPHostUrl"]);
        appweburl = decodeURIComponent(JSRequest.QueryString["SPAppWebUrl"]);

        var restQueryUrl = appweburl + "/_api/SP.AppContextSite(@target)/web/lists/getByTitle('" + listName + "')/items?@target='" + appweburl + "'";

        var executor = new SP.RequestExecutor(appweburl);
        executor.executeAsync({
            url: restQueryUrl,
            method: "POST",
            headers: {
                "Accept": "application/json; odata=verbose",
                "X-RequestDigest": $("#__REQUESTDIGEST").val(),
                "content-Type": "application/json;odata=verbose"
            },
            data: JSON.stringify(metadata),
            success: function (data, textStatus, xhr) {
                deferred.resolve(JSON.parse(data.body));
            },
            error: function (xhr, textStatus, errorThrown) {
                deferred.reject(JSON.stringify(xhr));
            }
        });
        return deferred;
    };

    this.createListItem = function () {
        var context = new SP.ClientContext.get_current();
        var web = context.get_web();
        var oList = web.get_lists().getByTitle('Reviews');

        var itemCreateInfo = new SP.ListItemCreationInformation();
        var newItem = oList.addItem(itemCreateInfo);
        newItem.set_item('Title', 'WGLL04');
        newItem.update();

        context.load(newItem);
        context.executeQueryAsync(
            Function.createDelegate(this, this.onQuerySucceeded),
            Function.createDelegate(this, this.onQueryFailed)
        );
    }

    function onQuerySucceeded() {
        alert('Item created: ' + oListItem.get_id());
    }

    function onQueryFailed(sender, args) {
        alert('Request failed. ' + args.get_message() +
            '\n' + args.get_stackTrace());
    }

});