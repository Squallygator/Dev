$.fn.extend({
    dkGetValue: function () {
        var $elt = $(this);
        if ($elt.is("input, select, textarea")) {
            return $elt.val();
        } else {
            return $elt.html();
        }
    },
    dkSetValue: function (value) {
        var $elt = $(this);
        if ($elt.is("input, select, textarea")) {
            $elt.val(value);
        } else {
            $elt.html(value);
        }
    },
    dkProperty: function (model, propertyName) {
        var $elt = $(this);
        Object.defineProperty(model, propertyName, {
            get: function () { return $elt.dkGetValue(); },
            set: function (value) { return $elt.dkSetValue(value); }
        });
    }
});