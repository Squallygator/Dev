/// <reference path="~/Scripts/jquery-2.1.3.js" />
/// <reference path="~/Scripts/jquery-ui-1.11.3.custom.js" />
/// <reference path="~/Scripts/jquery-2.1.3.intellisense.js" />
/// <reference path="DASCommon.js" />

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