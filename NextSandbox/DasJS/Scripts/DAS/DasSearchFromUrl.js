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