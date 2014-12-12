/// <reference path="../jquery-1.11.0.js" />

// -------------------------------------------------------------------------------------
// String Prototypes
// -------------------------------------------------------------------------------------
String.prototype.DASContains = function (s) {
    return (this.indexOf(s) !== -1);
};

// -------------------------------------------------------------------------------------
// JQuery Extensions Plugins
// -------------------------------------------------------------------------------------
(function ($) {
    jQuery.fn.DASValue = function (value) {
        var accesseur = $(this).is('input, select, textarea') ? 'val' : 'html';
        if ($(this)[accesseur]() == null || $(this)[accesseur]() == "") return null;
        if (value != null) {
            $(this)[accesseur](value);
            return value;
        }
        else {
            return $(this)[accesseur]();
        }
    };
})(jQuery);

// -------------------------------------------------------------------------------------
// Number Prototypes
// -------------------------------------------------------------------------------------
Number.prototype.DASRound = function (len) {
    var num = this;
    if (len == null || len < 0) len = 0;
    var multiplicateur = Math.pow(10, len);
    return Math.round(num * multiplicateur) / multiplicateur;
};

// -------------------------------------------------------------------------------------
// Basic Functions
// -------------------------------------------------------------------------------------
zeroOrValue = function (value) {
    if (value == null || /^\s*$/.test(value)) {
        return 0;
    } else {
        if (!(value.replace))
            return value;
        else {
            return parseFloat(value.replace(",", "."));
        }
    }
};