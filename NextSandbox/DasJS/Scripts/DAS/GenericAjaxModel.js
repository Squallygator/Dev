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