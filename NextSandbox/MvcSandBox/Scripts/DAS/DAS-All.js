///#source 1 1 /Scripts/DAS/jquery.dasSelectListItem.js

///#source 1 1 /Scripts/DAS/DASCommon.js
/// <reference path="~/Scripts/jquery-2.1.3.js" />
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

// CF : http://jsfiddle.net/squallygator/6kxsupr9/6/
(function($) {
    $.fn.extend({
        GetJsonList: function() {
            var $list = $(this);
            if (!$list || $list.length === 0 || !$list.is("select")) return null;
            var $options = $list.find('option');
            var result = $.map($options, function(option) {
                var $option = $(option);
                return {
                    Value: $option.attr('value'),
                    Text: $option.text(),
                    Selected: $option.prop('selected'),
                    Disabled: $option.prop('disabled'),
                };
            });
            return result;
        },
        FillJsonList: function(values) {
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

var getFuncFromSettingsOrDefault = function (settings, funcName, defaultFunc) {
    if (!settings) return defaultFunc;
    if (!funcName) return defaultFunc;
    if (settings.hasOwnProperty(funcName) && typeof (settings[funcName]) === 'function') {
        return settings[funcName];
    }
    return defaultFunc;
};

///#source 1 1 /Scripts/DAS/GenericAjaxModel.js
var GenericAjaxModel = (function () {
    var ctor = function () {
        return {};
    };
    var defaultFunc = {
        getFunc: function (elt) { return elt; },
        getValue: function (elt) { return (elt) ? $(elt).DASValue() : null; },
        setValue: function (elt, value) { $(elt).DASValue(value); },
        onChangeFunc: function (elt) { return elt; }
    };
    ctor.prototype.CreateProperty = function (propertyName, settings) {
        var that = this;
        if (!settings) return;
        if (!settings.hasOwnProperty('selector') && !settings.hasOwnProperty('getValue')) {
            console.log('Erreur GenericAjaxModel.CreateProperty : ni selector, ni getValue declare pour ' + propertyName);
            return;
        }

        var getElement = function () { return $(settings.selector); };
        if (settings.hasOwnProperty('container')) {
            getElement = function () { return $(settings.container).find(settings.selector); };
        }

        var getFunc = getFuncFromSettingsOrDefault(settings, 'getFunc', defaultFunc.getFunc);
        var getValue = getFuncFromSettingsOrDefault(settings, 'getValue', defaultFunc.getValue);
        var setValue = getFuncFromSettingsOrDefault(settings, 'setValue', defaultFunc.setValue);
        var onChangeFunc = getFuncFromSettingsOrDefault(settings, 'onChangeFunc', defaultFunc.onChangeFunc);

        Object.defineProperty(that, propertyName, {
            get: function () {
                var elt = getElement();
                var returnValue = getValue(elt);
                return getFunc(returnValue);
            },
            set: function (value) {
                var elt = getElement();
                setValue(elt, value);
                onChangeFunc(value);
            }
        });
    };

    ctor.prototype.CreateProperties = function (propertiesDefinition) {
        this.propertiesDefinition = propertiesDefinition;
        var that = this;
        for (var key in propertiesDefinition) {
            if (propertiesDefinition.hasOwnProperty(key)) {
                that.CreateProperty(key, propertiesDefinition[key]);
            }
        }
    };

    // Obsolete Use CreateProperty
    ctor.prototype.defineDASProp = function (obj, propertyName, getEltFunc, getFunc, extraSetFunc) {
        Object.defineProperty(obj, propertyName, {
            get: function () {
                var returnValue = null;
                if (getEltFunc && typeof (getEltFunc) === "function") {
                    var elt = getEltFunc();
                    returnValue = (elt) ? $(elt).DASValue() : null;
                }
                return getFunc && typeof (getFunc) === 'function' ? getFunc(returnValue) : returnValue;
            },
            set: function (value) {
                if (getEltFunc && typeof (getEltFunc) === "function") {
                    var elt = getEltFunc();
                    if (!elt) return;
                    $(elt).DASValue(value);
                }

                if (extraSetFunc && typeof (extraSetFunc) === 'function') extraSetFunc(value);
            }
        });
    };

    // Obsolete Use CreateProperty
    ctor.prototype.defineDASSelectListItems = function (obj, propertyName, getListFunc, getFunc, extraSetFunc) {
        var get$List = function (getFunc) {
            var list = getFunc();
            var $list = $(list);
            if (!list || list.length === 0 || !$list.is("select")) return null;
            return $list;
        }
        Object.defineProperty(obj, propertyName, {
            get: function () {
                var $list = get$List(getListFunc);
                if (!$list) return null;
                var $options = $list.find('option');
                var result = $.map($options, function (option) {
                    return {
                        Value: option.value,
                        Text: option.text,
                        Selected: option.prop('selected')
                    };
                });
                return getFunc && typeof (getFunc) === 'function' ? getFunc(result) : result;
            },
            set: function (values) {
                debugger;
                var actualValues = obj[propertyName];
                var equals = actualValues.length === values.length;
                if (equals) {
                    for (var i = 0; i < actualValues.length; i++) {
                        var isPresent = false;
                        for (var j = 0; j < values.length; j++) {
                            if (actualValues[i]['Value'] === values[j]['Value'] && actualValues[i]['Selected'] === values[j]['Selected']) {
                                isPresent = true;
                                break;
                            }
                        }
                        if (!isPresent) {
                            equals = false;
                            break;
                        }
                    }
                    if (equals) return;
                }
                var $list = get$List(getListFunc);
                if (!$list) return;
                $list.empty();
                for (var key in values) {
                    if (values.hasOwnProperty(key)) {
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
                if (extraSetFunc && typeof (extraSetFunc) === 'function') extraSetFunc(values);
            }
        });
    };

    ctor.prototype.toDTO = function (cols) {
        var names = Object.getOwnPropertyNames(this);
        var filter = null;
        if (cols) {
            filter = '|' + cols.join('|') + '|';
        }
        var obj = {};
        for (var i = 0; i < names.length; i++) {
            var prop = names[i];
            if (!this.hasOwnProperty(prop)) continue;
            if (typeof (this[prop]) === "function") continue;
            if (filter && filter.indexOf('|' + prop + '|') === -1) continue;
            if (prop === 'toDTO') continue;
            if (prop === 'propertiesDefinition') continue;
            obj[prop] = this[prop];
        }
        return obj;
    };

    ctor.prototype.FillFromAjax = function (url, ajaxType, cols) {
        ajaxType = ajaxType || "GET";
        var that = this;
        if (!url) return null;
        return $.ajax({
            url: url,
            type: ajaxType,
            data: that.toDTO(cols)
        }).done(function (data) {
            $.map(data, function (value, key) {
                that[key] = value;
            });
        });
    };

    return ctor;
})();
///#source 1 1 /Scripts/DAS/DasOnChange.js
$(document).ready(function () {
    $('*[data-das-onchange-id]').each(function (idx, elt) {
        var $destination = $(elt);
        var params = $destination.data();
        if (!params.hasOwnProperty("dasOnchangeId")) return;
        if (!params.hasOwnProperty("dasOnchangeUrl")) return;
        if (!params.hasOwnProperty("dasOnchangeName")) return;
        var $relativeElt = $('#' + params.dasOnchangeId);
        $relativeElt.on('change', function () {
            var value = $relativeElt.val();
            var url = params.dasOnchangeUrl.addUrlParam(params.dasOnchangeName, value);
            $destination.load(url);
        });
        //$(params.dasOnchangeId).trigger('change');
    });
});
