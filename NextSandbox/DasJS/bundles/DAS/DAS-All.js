///#source 1 1 /Scripts/DAS/jquery.dasSelectListItem.js

///#source 1 1 /Scripts/DAS/DASCommon.js
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

///#source 1 1 /Scripts/DAS/GenericAjaxModel.js
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
///#source 1 1 /Scripts/DAS/DasAjaxReload.js
/// <reference path="~/Scripts/Views/Shared/notification.js" />
/// <reference path="~/Scripts/jquery-2.1.3.intellisense.js" />
var DasAjaxReloadOptions = function () {
    this.targetSelector = null;
    this.ajaxUrl = null;
    this.ajaxType = 'POST';
    this.ajaxDataType = 'html';
    this.GetDataDelegate = null;
    this.triggerChangeSeletors = null;
    this.delegateBeforeAjax = null;
    this.delegateSuccess = null;
    this.delegateError = null;
    this.execute = false;
    //var that = this;
    //this.GetAjaxUrl = function () {
    //    var ajaxUrl = that.ajaxUrl;
    //    if (!ajaxUrl) return null;
    //    if (typeof ajaxUrl === 'function')
    //        return ajaxUrl();
    //    return ajaxUrl;
    //};
    //this.GetData = function () {
    //    var dataDelegate = that.GetDataDelegate;
    //    if (!dataDelegate || typeof dataDelegate !== 'function')
    //        return $(that.targetSelector).closest('form').serialize();
    //    return dataDelegate();
    //};
    //this.beforeAjax = function (eventThis) {
    //    if (that.delegateBeforeAjax && typeof that.delegateBeforeAjax === 'function')
    //        that.delegateBeforeAjax(eventThis);
    //};
    //this.done = function (html) {
    //    if ($(that.targetSelector))
    //        $(that.targetSelector).html(html);
    //    if (that.delegateSuccess && typeof that.delegateSuccess === 'function')
    //        that.delegateSuccess(html);
    //};
    //this.fail = function (xhr) {
    //    console.log('erreur AJAX DasAjaxReload : ' + JSON.stringify(xhr));
    //    Notification.Create("Erreur AJAX DasAjaxReload", Notification.Ko);
    //    if (that.delegateError && typeof that.delegateError === 'function')
    //        that.delegateError(xhr);
    //};
};
var DasAjaxReload = function ($container, dasAjaxReloadOptions) {
    if (!dasAjaxReloadOptions) return;
    var options = (dasAjaxReloadOptions instanceof DasAjaxReloadOptions) ? dasAjaxReloadOptions : $.extend(true, new DasAjaxReloadOptions(), dasAjaxReloadOptions);

    if (!options.ajaxUrl) return;
    if (!$(options.targetSelector)) return;
    if (!options.triggerChangeSeletors) return;
    var that = this;

    this.GetAjaxUrl = function () {
        var ajaxUrl = options.ajaxUrl;
        if (!ajaxUrl) return null;
        if (typeof ajaxUrl === 'function')
            return ajaxUrl();
        return ajaxUrl;
    };

    this.GetData = function () {
        var dataDelegate = options.GetDataDelegate;
        if (!dataDelegate || typeof dataDelegate !== 'function')
            return $(options.targetSelector).closest('form').serialize();
        return dataDelegate();
    };

    this.beforeAjax = function (eventThis) {
        if (options.delegateBeforeAjax && typeof options.delegateBeforeAjax === 'function')
            options.delegateBeforeAjax(eventThis);
    };

    this.done = function (html) {
        if ($(options.targetSelector)) {
            $(options.targetSelector).empty();
            $(options.targetSelector).html(html);
        }
        if (options.delegateSuccess && typeof options.delegateSuccess === 'function')
            options.delegateSuccess(html);
    };

    this.fail = function (xhr) {
        console.log('erreur AJAX DasAjaxReload : ' + JSON.stringify(xhr));
        Notification.Create("Erreur AJAX DasAjaxReload", Notification.Ko);
        if (options.delegateError && typeof options.delegateError === 'function')
            options.delegateError(xhr);
    };

    this.reload = function () {
        that.beforeAjax(this);
        var url = that.GetAjaxUrl();
        if (!url) return;
        console.log(this.id + ' has triggered a DasAjaxReload for ' + url);
        var data = that.GetData();
        $.ajax(url, {
            type: options.ajaxType,
            dataType: options.ajaxDataType,
            cache: false,
            data: data
            })
        .done(that.done)
        .fail(that.fail);
    };

    if (!options.triggerChangeSeletors && !options.execute) return;
    var triggerChangeSeletors = options.triggerChangeSeletors;
    var length = triggerChangeSeletors.length;
    for (var i = 0; i < length; i++) {
        var selector = triggerChangeSeletors[i];
        var eventName = 'change';
        if ($(selector).data('dasAutocompleteText'))
            eventName = 'autocompleteChange';
        $container.on(eventName, selector, that.reload);
    }
    if (options.execute)
        that.reload();
};
jQuery.fn.extend({
    DasAjaxReload: function (dasAjaxReload) {
        if (!dasAjaxReload) return undefined;
        return new DasAjaxReload($(this), dasAjaxReload);
    }
});
///#source 1 1 /Scripts/DAS/DasSearchFromSessionStorage.js
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

///#source 1 1 /Scripts/DAS/DasSearchFromUrl.js
var DasSearchFromUrl = (function () {
    var urlParams = {
        entite: 'entite',
        template: 'template',
        search: 'search'
    };
    var propertyMapping = {
        _entite: { urlParam: 'entite' },
        _template: { urlParam: 'template' },
        _search: { urlParam: 'search' },
        _mode : { selector: '#mode', defaultValue: 'Simple' }
    };
    var ctor = function (options) {
        this.tobeSave = false;
        var that = this;
        for (var propertyName in propertyMapping) {
            Object.defineProperty(that, propertyName, {
                get: function() {
                    var prop = propertyMapping[propertyName];
                    var defaultValue = prop.hasOwnProperty('defaultValue') ? prop.defaultValue : '';
                    var getFunc = getFuncFromSettingsOrDefault(prop, 'getValue', function(elt) { return elt; });
                    var param = null;
                    if (prop.hasOwnProperty('urlParam')) {
                        param = UrlUtils.getURLParameter(prop.urlParam);
                    } else if (prop.hasOwnProperty('selector')) {
                        param = $(prop.selector).DASValue();
                        if (prop.hasOwnProperty('container'))
                            param = $(prop.container).find(prop.selector).DASValue();
                    }
                    if (param) {
                        that.tobeSave = true;
                        return getFunc(param);
                    } else {
                        return getFunc(defaultValue);
                    }
                }
            });
        }
    $.extend(urlParams, options);
};

ctor.prototype.TryLoad = function (data) {
    if (window.location.pathname.indexOf('Recherche') === -1) {
        return false;
    }

    var tobeSave = false;
    var entite = UrlUtils.getURLParameter(urlParams.entite);
    if (entite === null) {
        data._entite = '';
    } else {
        tobeSave = true;
        data._entite = entite;
    }

    var template = UrlUtils.getURLParameter(urlParams.template);
    if (template === null) {
        data._template = '';
    } else {
        tobeSave = true;
        data._template = template;
    }

    var search = UrlUtils.getURLParameter(urlParams.search);
    if (search === null || search === undefined) {
        data._search = '';
    } else {
        tobeSave = true;
        data._search = decodeURIComponent(search);
    }
    data._mode = $('#mode').val();
    if (data._mode === null) {
        data._mode = 'Simple';
    }
    return tobeSave;
};

return ctor;
})();
///#source 1 1 /Scripts/DAS/DasSessionData.js
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

///#source 1 1 /Scripts/DAS/DasSessionSearch.js
/// <reference path="../jquery-2.1.3.js"/>
/// <reference path="~/Scripts/Views/Shared/_Layout.js" />
/// <reference path="~/Scripts/DAS/DasSessionData.js" />
/// <reference path="~/Scripts/DAS/DasSearchFromUrl.js" />
/// <reference path="~/Scripts/DAS/DasSearchFromSessionStorage.js" />

var DasSessionSearch = (function () {
    var ctor = function (refreshPanelCallback) {
        // todo : supprimer log
        console.log('new DasSessionSearch');
        this._data = new DasSearchData();
        this._searchFromUrl = new DasSearchFromUrl();
        this._searchFormSessionStorage = new DasSearchFromSessionStorage();
        if (this._searchFromUrl.TryLoad(this._data)) {
            this._searchFormSessionStorage.Save(this._data);
            } else {
            this._searchFormSessionStorage.TryLoad(this._data);
        }
        if (refreshPanelCallback) {
            refreshPanelCallback(this._data);
        }
    };

    return ctor;
})();
///#source 1 1 /Scripts/DAS/DasTrackingModification.js
/// <reference path="../jquery-2.1.3.js" />
/// <reference path="../jquery-ui-1.11.3.js"/>

var DasTrackingModificationOptions = function () {
    return {
        enable: true, /** Actif ou non **/
        cssClassTracking: "", /** Css classe des formulaire tracké : dasTrack**/
        cssClassNoTracking: "dasNoTrack", /** Css classe des formulaire à ne pas tracker **/
        cssClassChanged: "control-changed", /** Css classe pour les input modifier **/
        message_Oui: "Rester sur cette page",
        message_Non: "Quitter sur cette page",
        message_Titre: "Title",
        message_Contenu: "",
        forceShowMessage: false
    }
};

var DasTrackingModification = (function () {
    "use strict";
    this.modified = false;
    this.option = null;
    this.beforeUnloadCallBack = null;

    this.Init = function (option, beforeUnloadCallBack) {
        this.option = option;
        this.beforeUnloadCallBack = beforeUnloadCallBack;
        DasTrackingModification.SaveDefaultValue(this);
    }

    this.CheckModification = function (event) {
        if (!this.option.enable) {
            return false;
        }
        if ($(event.currentTarget).not(".pager-btn-next, .pager-btn-previous, .pager-btn-first, .pager-btn-last .delete-button, .delete-button-disabled, .action-disabled, .button-supprimer, .button-compare, .dasNoTrack").length === 0)
            return false;
        if ($(event.currentTarget).hasClass(this.option.cssClassNoTracking))
            return false;

        var link;
        switch (event.type) {
            case "beforeunload":
                break;
            case "click":
                if ((event.originalEvent !== null && event.originalEvent.button !== 0)
                    || (event.originalEvent !== null && event.originalEvent.button === 0 && event.originalEvent.ctrlKey)
                    || (event.currentTarget !== null && event.currentTarget.href.indexOf("javascript") === 0)
                    || (event.currentTarget !== null && $(event.currentTarget).attr("data-ajax"))) {
                    return false;
                }
                link = event.currentTarget;
                event.preventDefault();
                break;
        }

        this.modified = false;
        DasTrackingModification.CheckInputs(this);
        DasTrackingModification.CheckDataTable(this);

        if (link) {
            if (this.modified || this.option.forceShowMessage) {
                DasTrackingModification.Show(link, this);
            } else {
                DasTrackingModification.ApplyLink(link);
            }
        }
        return this.modified | this.option.forceShowMessage;
    }

    DasTrackingModification.SaveDefaultValue = function (tracker) {
        var that = tracker;
        var selectorSelect;

        if (that.option.cssClassTracking) {
            selectorSelect = "form." + that.option.cssClassTracking + " select[class!=" + that.option.cssClassNoTracking + "]";
        } else {
            selectorSelect = "form select[class!=" + that.option.cssClassNoTracking + "]";
        }
        $(selectorSelect).each(function (index, target) {
            $(target).prop("defaultOption", $(target).val());
        });
    }

    DasTrackingModification.UpdateChangedControl = function (input, tracker) {
        switch (input.type) {
            case "checkbox":
                $(input).parents("div.checkbox-container").addClass(tracker.option.cssClassChanged);
                break;
            default:
                $(input).addClass(tracker.option.cssClassChanged);
                break;
        }
    }

    DasTrackingModification.UpdateUnChangedControl = function (input, tracker) {
        switch (input.type) {
            case "checkbox":
                $(input).parents("div.checkbox-container").removeClass(tracker.option.cssClassChanged);
                break;
            default:
                $(input).removeClass(tracker.option.cssClassChanged);
                break;
        }
    }

    DasTrackingModification.ApplyLink = function (link) {
        $(window).unbind("beforeunload", this.beforeUnloadCallBack);
        var href = $(link).attr("href");
        if (!href) return;
        window.location = href; return;
    }

    DasTrackingModification.PrepareDialogDiv = function (tracker) {
        $("#dialog-modificationUnderway").remove();
        var element = document.createElement("div");
        element.title = formatToHtml(tracker.option.message_Titre);
        element.id = "dialog-modificationUnderway";
        $(element).html(tracker.option.message_Contenu);
        $("body").append($(element));
    }

    DasTrackingModification.Show = function (link, tracker) {
        var buttons = [];
        buttons[1] = {
            text: tracker.option.message_Non,
            click: function () {
                $(this).dialog("close");
                DasTrackingModification.ApplyLink(link, tracker);
            }
        };
        buttons[0] = {
            text: tracker.option.message_Oui,
            click: function () { $(this).dialog("close"); }
        };

        DasTrackingModification.PrepareDialogDiv(tracker);

        $("#dialog-modificationUnderway").dialog({
            resizable: false,
            height: "auto",
            width: "auto",
            modal: true,
            title: tracker.option.message_Titre,
            buttons: buttons
        });
    }

    DasTrackingModification.CheckDataTable = function (tracker) {
        var that = tracker;
        if ($("form[dasNoTrack!=true] .deleted").length > 0 || $("form[dasNoTrack!=true] .added").length > 0) {
            that.modified = true;
        }
    }

    DasTrackingModification.CheckInputs = function (tracker) {
        var that = tracker;

        var selectorInput;
        var selectorSelect;
        var selectorTextArea;
        if (that.option.cssClassTracking) {
            selectorInput = "form." + that.option.cssClassTracking + " input[class!=" + that.option.cssClassNoTracking + "]";
            selectorSelect = "form." + that.option.cssClassTracking + " select[class!=" + that.option.cssClassNoTracking + "]";
            selectorTextArea = "form." + that.option.cssClassTracking + " textarea[class!=" + that.option.cssClassNoTracking + "]";
        } else {
            selectorInput = "form[dasNoTrack!=true] input[class!=" + that.option.cssClassNoTracking + "]";
            selectorSelect = "form[dasNoTrack!=true] select[class!=" + that.option.cssClassNoTracking + "]";
            selectorTextArea = "form[dasNoTrack!=true] textarea[class!=" + that.option.cssClassNoTracking + "]";
        }

        $(selectorInput + ", " + selectorTextArea).each(function (index, target) {
            if ($(target).is(":visible")) {
                switch ($(target).prop("type")) {
                case "hidden":
                    //do nothing
                    break;
                case "radio":
                case "checkbox":
                    if ($(target).prop("defaultChecked") !== $(target).prop("checked")) {
                        that.modified = true;
                        console.log($(target));
                        DasTrackingModification.UpdateChangedControl(target, that);
                    } else {
                        DasTrackingModification.UpdateUnChangedControl(target, tracker);

                    }
                    break;
                default:
                    if ($(target).prop("defaultValue") !== $(target).val()) {
                        that.modified = true;
                        console.log($(target));
                        DasTrackingModification.UpdateChangedControl(target, that);
                    } else {
                        DasTrackingModification.UpdateUnChangedControl(target, tracker);
                    }
                    break;
                }
            }
        });

        $(selectorSelect).each(function (index, target) {
            if ($(target).is(":visible")) {
                if ($(target).prop("defaultOption") !== $(target).val()) {
                    that.modified = true;
                    console.log($(target));
                    DasTrackingModification.UpdateChangedControl(target, that);
                } else {
                    DasTrackingModification.UpdateUnChangedControl(target, tracker);
                }
            }
        });
    }
});
///#source 1 1 /Scripts/DAS/UrlUtils.js
var UrlUtils = {
    addOrUpdateParameter: function (uriToUse, paramName, paramValue) {
        if (uriToUse.indexOf(paramName + "=") >= 0) {
            var prefix = uriToUse.substring(0, uriToUse.indexOf(paramName));
            var suffix = uriToUse.substring(uriToUse.indexOf(paramName));
            suffix = suffix.substring(suffix.indexOf("=") + 1);
            suffix = (suffix.indexOf("&") >= 0) ? suffix.substring(suffix.indexOf("&")) : "";
            uriToUse = prefix + paramName + "=" + paramValue + suffix;
        } else {
            if (uriToUse.indexOf("?") < 0)
                uriToUse += "?" + paramName + "=" + paramValue;
            else
                uriToUse += "&" + paramName + "=" + paramValue;
        }
        return uriToUse;
    },
    getURLParameter: function (sUrl, sParam) {
        if (!sParam) {
            sParam = sUrl;
            sUrl = window.location.href;
        };
        var search = sUrl.indexOf('?') > -1 ? sUrl.split('?')[1] : null;
        if (!search) return null;
        var urlVariables = search.split('&');
        for (var i = 0; i < urlVariables.length; i++) {
            var sParameterName = urlVariables[i].split('=');
            if (sParameterName[0] === sParam) {
                return sParameterName[1];
            }
        }
        return null;
    }
};
