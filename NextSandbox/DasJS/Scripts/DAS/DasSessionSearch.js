/// <reference path="../jquery-2.1.3.js"/>
/// <reference path="~/Scripts/Views/Shared/_Layout.js" />
/// <reference path="~/Scripts/DAS/DasSessionData.js" />
/// <reference path="~/Scripts/DAS/DasSearchFromUrl.js" />
/// <reference path="~/Scripts/DAS/DasSearchFromSessionStorage.js" />

var DasSessionSearch = (function () {
    var ctor = function (refreshPanelCallback) {
        // todo : supprimer log
        console.log('new DasSessionSearch');
        this._data = new DasSearchData();
        this._searchFromUrl = new DasSearchFromUrl();
        this._searchFormSessionStorage = new DasSearchFromSessionStorage();
        if (this._searchFromUrl.TryLoad(this._data)) {
            this._searchFormSessionStorage.Save(this._data);
            } else {
            this._searchFormSessionStorage.TryLoad(this._data);
        }
        if (refreshPanelCallback) {
            refreshPanelCallback(this._data);
        }
    };

    return ctor;
})();