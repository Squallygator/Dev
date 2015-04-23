/*  
 *  Fonctions diverses et utiles pour le traitement des données
 *
 *	formatToHtml : Renvoi une chaine correctement encodée
*/
function formatToHtml(chaine) {
    var div = document.createElement("div");
    $(div).html(chaine);
    return $(div).html();
}

String.format = function () {
    var s = arguments[0];
    for (var i = 0; i < arguments.length - 1; i++) {
        var reg = new RegExp("\\{" + i + "\\}", "gm");
        s = s.replace(reg, arguments[i + 1]);
    }
    return s;
};

String.prototype.contains = function (it) { return this.indexOf(it) != -1; };

// TODO : Remove this function and use formatLinkWithIdField instead
function formatLinkWithId(cellValue, id, baseLinkUrl) {
    var element = document.createElement('a');
    baseLinkUrl = baseLinkUrl.replace('&amp;', '&');
    if (baseLinkUrl.indexOf("?") > -1)
        element.setAttribute('href', baseLinkUrl + '&id=' + id);
    else
        element.setAttribute('href', baseLinkUrl + '?id=' + id);
    element.appendChild(document.createTextNode(cellValue));
    return element.outerHTML;
}

function formatLinkWithIdField(cellValue, id, baseLinkUrl, idField) {
    if (cellValue === undefined) {
        return '';
    }
    if (cellValue <= 0) {
        return formatText(cellValue);
    }
    var element = document.createElement('a');
    baseLinkUrl = baseLinkUrl.replace('&amp;', '&');
    if (baseLinkUrl.indexOf("?") > -1)
        element.setAttribute('href', baseLinkUrl + '&' + idField + '=' + id);
    else
        element.setAttribute('href', baseLinkUrl + '?' + idField + '=' + id);
    element.appendChild(document.createTextNode(cellValue));
    return element.outerHTML;
}

function formatText(cellValue) {
    var element = document.createElement('span');
    element.appendChild(document.createTextNode(cellValue));
    return element.outerHTML;
}

function extractTextFromLink(htmlText) {
    return htmlText.replace(/<\/?[^>]+(>|$)/g, "");
}

function formatCellWithImage(cellValue) {
    if (cellValue === true) {
        var div = document.createElement("div");
        var span = document.createElement("span");
        div.className = "ui-jqgrid-cell-center";
        span.className = "ui-jqgrid-check";
        div.appendChild(span);

        return div.outerHTML;
    } else {
        return "";
    }
}

function FormatProtocolStateCellWithImage(cellValue, options, rowObject) {
    var div = document.createElement("div");
    var libelle = document.createElement("span");
    var carre = document.createElement("span");

    carre.className = "ui-jqgrid-carre";
    $(libelle).html(cellValue);
    div.appendChild(carre);
    div.appendChild(libelle);

    var testValue = rowObject[9];

    if (testValue === 1) {
        carre.className += " incomplet";
        return div.outerHTML;
    }
    else if (testValue === 0) {
        carre.className += " vide";
        return div.outerHTML;
    }
    else if (testValue === 2) {
        carre.className += " complet";
        return div.outerHTML;
    }
    else {
        return cellValue;
    }
}

function getCssRule(cssSelector) {
    for (var cssFileIndex = 0;
       cssFileIndex < document.styleSheets.length; cssFileIndex++) {
        var styleSheet = document.styleSheets[cssFileIndex];
        if (styleSheet.cssRules !== null) {
            for (var cssRulesIndex = 0; cssRulesIndex < styleSheet.cssRules.length; cssRulesIndex++) {
                var rule = styleSheet.cssRules[cssRulesIndex];
                if (rule.selectorText === cssSelector) {
                    return rule.style;
                }
            }
        }
    }
}

function getCssStylePropertyValue(cssSelector, property) {
    var style = getCssRule(cssSelector);
    if (style)
        return style.getPropertyValue(property);
}

var UpdateState = {
    None: 0,
    Add: 1,
    Delete: 2,
    Suffix: {
        Added: 'Added',
        Deleted: 'Deleted'
    }
};
var ClassUtils = {
    Invisible: "invisible",
    Icons: {
        Expanded: "ui-icon-triangle-1-s",
        Collapsed: "ui-icon-triangle-1-e"
    },
    UpdateState: {
        Added: 'added',
        Deleted: 'deleted'
    }
};

$.fn.extend({
    dkShow: function () {
        $(this).dkVisible(true);
    },
    dkHide: function () {
        $(this).dkVisible(false);
    },
    dkVisible: function (isVisible) {
        $(this).toggleClass(ClassUtils.Invisible, !isVisible);
    },
    dkIconCollapse: function () {
        $(this).removeClass(ClassUtils.Icons.Expanded).addClass(ClassUtils.Icons.Collapsed);
    },
    dkIconExpand: function () {
        $(this).removeClass(ClassUtils.Icons.Collapsed).addClass(ClassUtils.Icons.Expanded);
    },
    dkIsExpanded: function () {
        return $(this).hasClass(ClassUtils.Icons.Expanded);
    },
});

var DasDictionary = function (params) {
    var _this = this;
    var index = params;
    if (!params)
        index = {};

    this.Get = function (id) {
        return index[id];
    };

    this.Set = function (id, instance) {
        index[id] = instance;
    };

    this.Delete = function (id) {
        if (index['length'] !== undefined)
            index.splice(id);
        else
            delete index[id];
        delete index[id];
    };

    this.DeleteAll = function () {
        for (var key in index)
            _this.Delete(key);
    };

    this.Count = function () {
        var i = 0;
        if (!index) return i;
        for (var key in index)
            i++;
        return i;
    };
};

// CF : http://blog.xebia.fr/2013/06/10/javascript-retour-aux-bases-constructeur-prototype-et-heritage/
// definiting the base constructor for all classes, which will execute the final class prototype's initialize method if exists
var DasClass = function () {
    this.initialize && this.initialize.apply(this, arguments);
};
DasClass.extend = function (childPrototype) { // defining a static method 'extend'
    var parent = this;
    var child = function () { // the child constructor is a call to its parent's
        return parent.apply(this, arguments);
    };
    child.extend = parent.extend; // adding the extend method to the child class
    var Surrogate = function () { }; // surrogate "trick" as seen previously
    Surrogate.prototype = parent.prototype;
    child.prototype = new Surrogate;
    for (var key in childPrototype) {
        child.prototype[key] = childPrototype[key];
    }
    return child; // returning the child class
};

$.fn.extend({
    DasTableLink: function (rowRedirectDataKey) {
        var $elt = $(this);
        if (!$elt) return;
        rowRedirectDataKey = rowRedirectDataKey || "row-redirect";
        $elt.on('mousedown', 'tbody tr', function (e) {
            if (e.which === 2 && e.target.localName !== 'a') {
                e.preventDefault();
            }
        });

        $elt.on('mouseup', 'tbody tr', function (e) {
            if (e.button === 2) return false;
            if (e.currentTarget.className.indexOf('added') >= 0) return false;
            var link = $(this).data(rowRedirectDataKey);
            if (link === undefined) return false;
            switch (e.target.localName) {
                case 'a':
                case 'input':
                case 'select':
                    return false;
                case 'td':
                    if ($(e.target).hasClass('checkbox')) return false;
                    if ($(e.target).hasClass('no-cursor')) return false;
                    if ($(e.target).hasClass('custom-cell')) return false;
                    if ($(e.target).find('input').length) return false;
                    break;
            }
            if (e.ctrlKey || e.button === 1) {
                window.open(link, Math.random().toString().replace('.', ''));
            } else {
                document.location.href = link;
            }
            return true;
        });
        var onCheckBoxTdOrThClic = function (e) {
            var checkbox = $(':checkbox', e.target);
            checkbox.prop('checked', !checkbox.is(':checked'));
            checkbox.trigger('change');
        };
        $elt.on('click', 'tbody tr td.checkbox, thead tr th.checkbox', onCheckBoxTdOrThClic);
    },

    DasCheckAll: function (checkBox$Selector) {
        var $this = $(this);
        if (!$this.is(':checkbox')) return;
        $this.on('change', function (e) {
            var checked = $(e.target).is(':checked');
            $(checkBox$Selector).prop('checked', checked);
            $(checkBox$Selector).trigger('change');
        });
    }
});