var DasSearchData = (function () {
    var ctor = function () {
        this._entite = null;
        this._search = null;
        this._mode = null;
        this._template = null;
    };

    ctor.prototype.SetValues = function (data) {
        if (!data) return;
        this._entite = data._entite;
        this._search = data._search;
        this._mode = data._mode;
        this._template = data._template;
    };

    return ctor;
})();
