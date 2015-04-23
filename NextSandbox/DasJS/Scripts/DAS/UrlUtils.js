var UrlUtils = {
    addOrUpdateParameter: function (uriToUse, paramName, paramValue) {
        if (uriToUse.indexOf(paramName + "=") >= 0) {
            var prefix = uriToUse.substring(0, uriToUse.indexOf(paramName));
            var suffix = uriToUse.substring(uriToUse.indexOf(paramName));
            suffix = suffix.substring(suffix.indexOf("=") + 1);
            suffix = (suffix.indexOf("&") >= 0) ? suffix.substring(suffix.indexOf("&")) : "";
            uriToUse = prefix + paramName + "=" + paramValue + suffix;
        } else {
            if (uriToUse.indexOf("?") < 0)
                uriToUse += "?" + paramName + "=" + paramValue;
            else
                uriToUse += "&" + paramName + "=" + paramValue;
        }
        return uriToUse;
    },
    getURLParameter: function (sUrl, sParam) {
        if (!sParam) {
            sParam = sUrl;
            sUrl = window.location.href;
        };
        var search = sUrl.indexOf('?') > -1 ? sUrl.split('?')[1] : null;
        if (!search) return null;
        var urlVariables = search.split('&');
        for (var i = 0; i < urlVariables.length; i++) {
            var sParameterName = urlVariables[i].split('=');
            if (sParameterName[0] === sParam) {
                return sParameterName[1];
            }
        }
        return null;
    }
};