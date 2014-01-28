/// <reference path="../jquery-2.1.0.js" />
/// <reference path="../Common/Events.js" />
/// <reference path="../Common/jQuery.Das.Data.js" />

(function ($) {
    $.SimpleSearch = {};
    $.SimpleSearch.Selectors = {
        Selector: '#simpleSearchSelector',
        Content: '#simpleSearchContent',
        Button: '#simpleSearchButton'
    };
    $.SimpleSearch.EnableSearch = function (enable) {
        $($.SimpleSearch.Selectors.Button).prop("disabled", !enable);
    };
    $.SimpleSearch.ClearSearchMethod = function() {
        $($.SimpleSearch.Selectors.Button).unbind(My.Events.Click);
        $.SimpleSearch.EnableSearch(false);
        $($.SimpleSearch.Selectors.Content).empty();
    };
    $.SimpleSearch.Init = function () {
        $.SimpleSearch.ClearSearchMethod();
        $($.SimpleSearch.Selectors.Selector).bind(My.Events.Change, function () {
            debugger;
            var selected = $(this).find('option:selected');
            if (selected.length == 0) return;

            $.SimpleSearch.ClearSearchMethod();

            var clientinitfunction = selected.data('clientinitfunction');
            if (clientinitfunction == null) return;
            var func = eval(clientinitfunction);
            if (func != null && typeof func === 'function')
                func();
            
        });
    };
})(jQuery);
