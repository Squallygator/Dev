/// <reference path="~/Scripts/jquery-2.1.3.js" />
/// <reference path="~/Scripts/jquery-ui-1.11.3.custom.js" />
/// <reference path="~/Scripts/jquery-2.1.3.intellisense.js" />
// -------------------------------------------------------------------------------------
// String Prototypes
// -------------------------------------------------------------------------------------
// ReSharper disable once NativeTypePrototypeExtending
String.prototype.DASContains = function (s) {
    return (this.indexOf(s) !== -1);
};

// -------------------------------------------------------------------------------------
// JQuery Extensions Plugins
// -------------------------------------------------------------------------------------
(function ($) {
    $.fn.extend({
        DASValue: function () {
            var $elt = $(this);
            if ($elt.is("input, select, textarea")) {
                if (arguments.length > 0) {
                    var value = arguments[0];
                    $elt.val(value);
                    return value;
                } else {
                    return $elt.val();
                }
            } else {
                if (arguments.length > 0) {
                    var valueHtml = arguments[0];
                    $elt.html(valueHtml);
                    return valueHtml;
                } else {
                    return $elt.html();
                }
            }
        },
        DisableDatePicker: function () {
            var $elt = $(this);
            $elt.datepicker('destroy');
            $elt.attr("readonly", "readonly");
        },
        EnableDatePicker: function () {
            var $elt = $(this);
            $elt.attr("autocomplete", "off");
            $elt.removeAttr("readonly");
            $elt.datepicker();
        },
        // CF : http://jsfiddle.net/squallygator/6kxsupr9/6/
        GetJsonList: function () {
            var $list = $(this);
            if (!$list || $list.length === 0 || !$list.is("select")) return null;
            var $options = $list.find('option');
            var result = $.map($options, function (option) {
                var $option = $(option);
                return {
                    Value: $option.attr('value'),
                    Text: $option.text(),
                    Selected: $option.prop('selected'),
                    Disabled: $option.prop('disabled')
                };
            });
            return result;
        },
        FillJsonList: function (values) {
            var $list = $(this);
            if (!$list || $list.length === 0 || !$list.is("select")) return;
            $list.empty();
            for (var key in values) {
                var item = values[key];
                var $option = $('<option>');
                if (item.hasOwnProperty('Value')) $option.val(item.Value);
                if (item.hasOwnProperty('Selected')) $option.prop('selected', item.Selected);
                if (item.hasOwnProperty('Disabled')) $option.prop('disabled', item.Disabled);
                if (item.hasOwnProperty('Text')) {
                    $option.text(item.Text);
                    $list.append($option);
                }
            }
        }
    });
})(jQuery);


// -------------------------------------------------------------------------------------
// Number Prototypes
// -------------------------------------------------------------------------------------
// ReSharper disable once NativeTypePrototypeExtending
Number.prototype.DASRound = function (len) {
    var num = this;
    if (len === null || len < 0) len = 0;
    var multiplicateur = Math.pow(10, len);
    return Math.round(num * multiplicateur) / multiplicateur;
};

// -------------------------------------------------------------------------------------
// Basic Functions
// -------------------------------------------------------------------------------------
var zeroOrValue = function (value) {
    if (value === null || /^\s*$/.test(value)) {
        return 0;
    } else {
        if (!(value.replace))
            return value;
        else {
            return parseFloat(value.replace(",", "."));
        }
    }
};

var parseLocalFloat = function (num) {
    // todo : internationalisation !
    // todo : attention ceci est une vilaine rustime !!!
    return num ? parseFloat(num.split(' ').join('').replace(",", ".")) : null;
};

var parseLocalInt = function(num) {
    // todo : internationalisation !
    // todo : attention ceci est une vilaine rustime !!!
    return num ? parseInt(num.split(' ').join('').replace(",", ".")) : null;
};

var parseBool = function (str) {
    if (typeof str === 'boolean') return str;
    if (typeof str === 'string') return str.toUpperCase() === "TRUE";
    if (typeof str === 'number') return str ? true : false;
    return false;
};

var parseLocalDate = function(str) {
    // todo : internationalisation !
    // todo : attention ceci est une vilaine rustime !!!
    return str;
};

var getFuncFromSettingsOrDefault = function (settings, funcName, defaultFunc) {
    if (!settings) return defaultFunc;
    if (!funcName) return defaultFunc;
    if (settings.hasOwnProperty(funcName) && typeof (settings[funcName]) === 'function') {
        return settings[funcName];
    }
    return defaultFunc;
};
