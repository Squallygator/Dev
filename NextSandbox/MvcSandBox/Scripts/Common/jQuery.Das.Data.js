/// <reference path="../jquery-2.1.0.js" />

(function ($) {
    $.fn.executeDataFunc = function (dataCode) {
        var dataFuncPath = $(this).data(dataCode.toLowerCase());
        if (dataFuncPath == null) return;
        var func = eval(dataFuncPath);
        if (func != null && typeof func === 'function')
            func($(this));
    };
})(jQuery);