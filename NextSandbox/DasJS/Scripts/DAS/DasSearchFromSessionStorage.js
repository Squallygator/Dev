var DasSearchFromSessionStorage = (function () {
    var ctor = function (sessionKey) {
        this.sessionKey = sessionKey || 'dasSearchMemory';
    };

    ctor.prototype.Save = function (data) {
        window.sessionStorage.setItem(this.sessionKey, JSON.stringify(data));
    };

    ctor.prototype.TryLoad = function (data) {
        var json = JSON.parse(window.sessionStorage.getItem(this.sessionKey));
        if (!json) return false;
        data._entite = json._entite;
        data._search = json._search;
        data._mode = json._mode;
        data._template = json._template;
        return true;
    };
    return ctor;
})();
