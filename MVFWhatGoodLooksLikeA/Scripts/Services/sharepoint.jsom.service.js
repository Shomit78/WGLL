myApp.service('SharePointJSOMService', function ($q, $http) {

    var newItem;

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

    this.getUserProfileItemsFromHostWebAll = function ($scope) {
        var deferred = $.Deferred();
        JSRequest.EnsureSetup();
        hostweburl = decodeURIComponent(JSRequest.QueryString["SPHostUrl"]);
        appweburl = decodeURIComponent(JSRequest.QueryString["SPAppWebUrl"]);

        var restQueryUrl = appweburl + "/_api/SP.UserProfiles.PeopleManager/GetMyProperties";

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

    this.getItemByIdFromHostWebWithSelectAndExpand = function ($scope, listName, id) {
        var deferred = $.Deferred();
        JSRequest.EnsureSetup();
        hostweburl = decodeURIComponent(JSRequest.QueryString["SPHostUrl"]);
        appweburl = decodeURIComponent(JSRequest.QueryString["SPAppWebUrl"]);

        var restQueryUrl = appweburl + "/_api/SP.AppContextSite(@target)/web/lists/getByTitle('" + listName + "')/items(" + id + ")?@target='" + hostweburl + "'";

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

    this.getListItemType = function (name) {
        return "SP.Data." + name[0].toUpperCase() + name.substring(1) + "ListItem";
    };

    this.addListItem = function (listName, metadata, success, failure) {

        JSRequest.EnsureSetup();
        hostweburl = decodeURIComponent(JSRequest.QueryString["SPHostUrl"]);
        appweburl = decodeURIComponent(JSRequest.QueryString["SPAppWebUrl"]);
        var restQueryUrl = appweburl + "/_api/SP.AppContextSite(@target)/web/lists/getByTitle('" + listName + "')/items?@target='" + hostweburl + "'";

        var item = $.extend({
            "__metadata": { "type": this.getListItemType(listName) }
        }, metadata);

        $.ajax({
            url: restQueryUrl,
            type: "POST",
            contentType: "application/json;odata=verbose",
            data: JSON.stringify(item),
            headers: {
                "Accept": "application/json;odata=verbose",
                "X-RequestDigest": $("#__REQUESTDIGEST").val()
            },
            success: function (data) {
                success(data);
            },
            error: function (data) {
                failure(data);
            }
        });

    }

    this.addAnswer = function (listName, metadata, success, failure) {

        JSRequest.EnsureSetup();
        hostweburl = decodeURIComponent(JSRequest.QueryString["SPHostUrl"]);
        appweburl = decodeURIComponent(JSRequest.QueryString["SPAppWebUrl"]);
        var restQueryUrl = appweburl + "/_api/SP.AppContextSite(@target)/web/lists/getByTitle('" + listName + "')/items?@target='" + hostweburl + "'";

        var item = $.extend({
            "__metadata": { "type": this.getListItemType(listName) }
        }, metadata);

        $.ajax({
            url: restQueryUrl,
            type: "POST",
            contentType: "application/json;odata=verbose",
            data: JSON.stringify(item),
            headers: {
                "Accept": "application/json;odata=verbose",
                "X-RequestDigest": $("#__REQUESTDIGEST").val()
            },
            success: function (data) {
                success(data, metadata);
            },
            error: function (data) {
                failure(data);
            }
        });

    }

    this.getListItem = function (url, listname, complete, failure) {
        $.ajax({
            url: url,
            method: "GET",
            headers: { "Accept": "application/json; odata=verbose" },
            success: function (data) {
                complete(data);
            },
            error: function (data) {
                failure(data);
            }
        });
    };

    this.getFile = function (serverRelativeUrl, complete, failure) {
        var restQueryUrl = appweburl + "/_api/SP.AppContextSite(@target)/web/getFileByServerRelativeUrl('" + serverRelativeUrl + "')?@select=ID,FileLeafRef&@target='" + hostweburl + "'";

        $.ajax({
            url: restQueryUrl,
            method: "GET",
            headers: { "Accept": "application/json; odata=verbose" },
            success: function (data) {
                complete(data);
            },
            error: function (data) {
                failure(data);
            }
        });
    };
    
    this.updateListItem = function (listName, id, metadata, success, failure) {

        JSRequest.EnsureSetup();
        hostweburl = decodeURIComponent(JSRequest.QueryString["SPHostUrl"]);
        appweburl = decodeURIComponent(JSRequest.QueryString["SPAppWebUrl"]);

        var restQueryUrl = appweburl + "/_api/SP.AppContextSite(@target)/web/lists/getByTitle('" + listName + "')/items("+id+")?@target='" + hostweburl + "'";
        var item = $.extend({
            "__metadata": { "type": this.getListItemType(listName) }
        }, metadata);

        this.getListItem(restQueryUrl, listName, function (data) {
            $.ajax({
                url: restQueryUrl,
                type: "POST",
                contentType: "application/json;odata=verbose",
                data: JSON.stringify(item),
                headers: {
                    "Accept": "application/json;odata=verbose",
                    "X-RequestDigest": $("#__REQUESTDIGEST").val(),
                    "X-HTTP-Method": "MERGE",
                    "If-Match": data.d.__metadata.etag
                },
                success: function (data) {
                    success(data);
                },
                error: function (data) {
                    failure(data);
                }
            });

        }, function (data) {
            failure(data);
        });

    };

    this.updateFileMetadata = function (listName, id, metadata, success, failure) {

        JSRequest.EnsureSetup();
        hostweburl = decodeURIComponent(JSRequest.QueryString["SPHostUrl"]);
        appweburl = decodeURIComponent(JSRequest.QueryString["SPAppWebUrl"]);

        var restQueryUrl = appweburl + "/_api/SP.AppContextSite(@target)/web/lists/getByTitle('" + listName + "')/items(" + id + ")?@target='" + hostweburl + "'";
        var item = $.extend({
            "__metadata": { "type": "SP.ListItem" }
        }, metadata);

        this.getListItem(restQueryUrl, listName, function (data) {
            $.ajax({
                url: restQueryUrl,
                type: "POST",
                contentType: "application/json;odata=verbose",
                data: JSON.stringify(item),
                headers: {
                    "Accept": "application/json;odata=verbose",
                    "X-RequestDigest": $("#__REQUESTDIGEST").val(),
                    "X-HTTP-Method": "MERGE",
                    "If-Match": data.d.__metadata.etag
                },
                success: function (data) {
                    success(data);
                },
                error: function (data) {
                    failure(data);
                }
            });

        }, function (data) {
            failure(data);
        });

    };

    this.getListItemWithId = function (url, id, listName, success, failure) {

        JSRequest.EnsureSetup();
        hostweburl = decodeURIComponent(JSRequest.QueryString["SPHostUrl"]);
        appweburl = decodeURIComponent(JSRequest.QueryString["SPAppWebUrl"]);

        var restQueryUrl = appweburl + "/_api/SP.AppContextSite(@target)/web/lists/getByTitle('" + listName + "')/items(" + id + ")?@target='" + hostweburl + "'";
        $.ajax({
            url: restQueryUrl,
            method: "GET",
            headers: { "Accept": "application/json; odata=verbose" },
            success: function (data) {
                if (data.d.results.length == 1) {
                    success(data.d.results[0]);
                }
                else {
                    failure("Multiple results obtained for the specified Id value");
                }
            },
            error: function (data) {
                failure(data);
            }
        });
    };

    this.deleteListItem = function (itemId, listName, siteUrl, success, failure) {

        JSRequest.EnsureSetup();
        hostweburl = decodeURIComponent(JSRequest.QueryString["SPHostUrl"]);
        appweburl = decodeURIComponent(JSRequest.QueryString["SPAppWebUrl"]);

        var restQueryUrl = appweburl + "/_api/SP.AppContextSite(@target)/web/lists/getByTitle('" + listName + "')/items(" + id + ")?@target='" + hostweburl + "'";

        getListItemWithId(restQueryUrl, itemId, listName, function (data) {
            $.ajax({
                url: restQueryUrl,
                type: "POST",
                headers: {
                    "Accept": "application/json;odata=verbose",
                    "X-Http-Method": "DELETE",
                    "X-RequestDigest": $("#__REQUESTDIGEST").val(),
                    "If-Match": data.__metadata.etag
                },
                success: function (data) {
                    success(data);
                },
                error: function (data) {
                    failure(data);
                }
            });
        },
        function (data) {
            failure(data);
        });
    };

    this.addFileToFolder = function addFileToFolder(arrayBuffer, folderUrl, fileInput, success, failure) {
        var parts = fileInput[0].value.split('\\');
        var fileName = parts[parts.length - 1];
        var urlArray = hostweburl.split('/');
        urlArray.splice(0, 3);
        var url = ""
        for (i = 0; i < urlArray.length; i++) {
            url += "/" + urlArray[i];
        }
        //var folderUrl = url + "/" + sharePointConfig.lists.images + "/" + store;

        var fileCollectionEndpoint = appweburl + "/_api/SP.AppContextSite(@target)/web/getfolderbyserverrelativeurl('" + folderUrl + "')/files" +
            "/add(overwrite=true, url='" + fileName + "')?$expand=ListItemAllFields&@target='" + hostweburl + "'";

        $.ajax({
            url: fileCollectionEndpoint,
            type: "POST",
            data: arrayBuffer,
            processData: false,
            headers: {
                "accept": "application/json;odata=verbose",
                "X-RequestDigest": jQuery("#__REQUESTDIGEST").val(),
                "content-length": arrayBuffer.byteLength
            },
            success: function(data) {
                success(data);
            },
            error: function (data) {
                failure(data);
            }
        });
    };

    this.deleteFile = function (fileRelativeUrl, success, failure) {

        JSRequest.EnsureSetup();
        hostweburl = decodeURIComponent(JSRequest.QueryString["SPHostUrl"]);
        appweburl = decodeURIComponent(JSRequest.QueryString["SPAppWebUrl"]);

        var restQueryUrl = appweburl + "/_api/SP.AppContextSite(@target)/web/GetFileByServerRelativeUrl('" + fileRelativeUrl + "')?@target='" + hostweburl + "'";
        
        $.ajax({
            url: restQueryUrl,
            type: "POST",
            headers: {
                "Accept": "application/json;odata=verbose",
                "X-Http-Method": "DELETE",
                "X-RequestDigest": $("#__REQUESTDIGEST").val(),
                "If-Match": "*"
            },
            success: function (data) {
                success(data);
            },
            error: function (data) {
                failure(data);
            }
        });
    };


    this.createFolder = function (listName, metadata, success, failure) {

        JSRequest.EnsureSetup();
        hostweburl = decodeURIComponent(JSRequest.QueryString["SPHostUrl"]);
        appweburl = decodeURIComponent(JSRequest.QueryString["SPAppWebUrl"]);
        var restQueryUrl = appweburl + "/_api/SP.AppContextSite(@target)/web/folders?@target='" + hostweburl + "'";

        var item = $.extend({
            "__metadata": { "type": "SP.Folder" }
        }, metadata);

        $.ajax({
            url: restQueryUrl,
            type: "POST",
            contentType: "application/json;odata=verbose",
            data: JSON.stringify(item),
            headers: {
                "Accept": "application/json;odata=verbose",
                "X-RequestDigest": $("#__REQUESTDIGEST").val()
            },
            success: function (data) {
                success(data);
            },
            error: function (data) {
                failure(data);
            }
        });

    }

    this.getFileBuffer = function (fileInput) {
        var deferred = jQuery.Deferred();
        var reader = new FileReader();
        reader.onloadend = function (e) {
            deferred.resolve(e.target.result);
        }
        reader.onerror = function (e) {
            deferred.reject(e.target.error);
        }
        reader.readAsArrayBuffer(fileInput[0].files[0]);
        return deferred.promise();
    };

    //Get items from a list returning only Title and ID
    this.getImagesFromHostWebFolder = function ($scope, folderUrl) {
        var deferred = $.Deferred();
        JSRequest.EnsureSetup();
        hostweburl = decodeURIComponent(JSRequest.QueryString["SPHostUrl"]);
        appweburl = decodeURIComponent(JSRequest.QueryString["SPAppWebUrl"]);

        var restQueryUrl = appweburl + "/_api/SP.AppContextSite(@target)/web/GetFolderByServerRelativeUrl('" + folderUrl + "')/files?$expand=ListItemAllFields&@target='" + hostweburl + "'";

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

});