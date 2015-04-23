
var SearchHelper = function (selector, filter, delegate) {
    var that = this;
    this.Selector = selector;
    this.Filter = filter;
    this.Delegate = delegate;
    this.Value = function (value) {
        // TODO : REDONDANT AVEC DASVALUE
        var elt = $(this.Selector);
        var accesseur = elt.is('input, select, textarea') ? 'val' : 'html';
        if (elt[accesseur]() === null || elt[accesseur]() === "") return null;
        if (value !== null) {
            elt[accesseur](value);
            return value;
        }
        else {
            return elt[accesseur]();
        }
    };
    $(selector).on("keypress", function (event) {
        var keycode = (event.keyCode ? event.keyCode : event.which);
        if (keycode === "13" && typeof delegate === 'function') {
            if (that.Value().indexOf('*', 0) > 0)
                event.preventDefault();
            delegate(that.Value());
        }
    }).on("paste", function (e) {
        setTimeout(function () {
            var keycode = (event.keyCode ? event.keyCode : event.which);
            var exceptionKeyCodes = ["16", "17", "35", "36", "37", "38", "39", "46"];
            for (i = 0; i < exceptionKeyCodes.length; i++)
                if (keycode === exceptionKeyCodes[i]) return false;
            var val = that.Value();
            var lines = val.split('\n');
            var resultLines = [];
            for (var i = 0; i < lines.length; i++) {
                var avant = lines[i];
                if (avant.length > 0) {
                    var apres = avant.replace(that.Filter, '');
                    if (apres.length > 15)
                        apres = apres.substr(0, 15);
                    if (apres !== '' || apres !== null) resultLines.push(apres);
                }
                var newval = resultLines.join('\n');
                if (val !== newval) that.Value(newval);
            }
            if (e.keyCode === 13 && typeof delegate === 'function') {
                delegate(that.Value());
            }
        }, 100);
    });
};
