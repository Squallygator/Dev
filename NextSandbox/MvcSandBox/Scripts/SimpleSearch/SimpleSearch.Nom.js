/// <reference path="../jquery-2.1.0.js" />
/// <reference path="../Common/Events.js" />
/// <reference path="../Common/jQuery.Das.Data.js" />
/// <reference path="SimpleSearch.js" />

(function ($) {
    $.SimpleSearch.Nom = {};
    $.SimpleSearch.Selectors.Nom = '#Nom';
    $.SimpleSearch.Nom.onChange = function () {
        var _this = $(this);
        var val = _this.val();
        $.SimpleSearch.EnableSearch(val != null && val.length > 0);
    };
    $.SimpleSearch.Nom.doSearch = function () {
        alert("Recherche Nom : " + $($.SimpleSearch.Selectors.Nom).val());
    };
    $.SimpleSearch.Nom.Init = function () {
        var nom = $.SimpleSearch.Selectors.Nom.replace('#', '');
        $($.SimpleSearch.Selectors.Content).html('');
        $($.SimpleSearch.Selectors.Content).append("<input type='text' id='" + nom + "'/>");
        $($.SimpleSearch.Selectors.Nom).bind(My.Events.Change, $.SimpleSearch.Nom.onChange);
        $($.SimpleSearch.Selectors.Button).unbind(My.Events.Click);
        $($.SimpleSearch.Selectors.Button).bind(My.Events.Click, $.SimpleSearch.Nom.doSearch);
    };
})(jQuery);
