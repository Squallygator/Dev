/// <reference path="popup.js" />
var DAS = DAS || {};
DAS.ConfirmParams = DAS.ConfirmParams || (function () {
    var toFirstUpperCase = function (k) {
        var t = k.split('');
        t[0] = t[0].toUpperCase();
        return t.join('');
    };
    var dasConfirmParams = function (data) {
        var item = {
            yes: 'Oui',
            no: 'Non',
            close: 'Fermer',
            title: 'Confirmation de la suppression',
            message: ''
        };

        if (data == null) return item;
        for (var key in item) {
            var prop = data[key] || data['dasConfirm' + toFirstUpperCase(key)];
            if (prop) {
                item[key] = prop;
            }
        }
        return item;

    };
    return dasConfirmParams;
})();

var ActionYes = function ($elt) {
    open($elt.attr('href'), "_self");
};

DAS.Confirm = DAS.Confirm || (function ($) {
    'use strict';
    var dasConfirm = function () {
        if (arguments.length === 0) return;
        var $elt;
        var params;
        var i = 0;
        if (arguments.length > i && $(arguments[i]).is("a")) {
            $elt = $(arguments[i]);
            i++;
        }
        var action = ActionYes;
        if (arguments.length === 2 && arguments[1] !== undefined) {
            action = arguments[1];
        }

        $(arguments[0]).each(function (index, target) {
            if ($(target).data("dasConfirmInit") === true) return;

            if (params == null && $(target) != null) {
                var eltData = $(target).data();
                params = new DAS.ConfirmParams(eltData);
            }
            if (params == null || $(target) == null) return;
            var confMessageId = "msg-confirm-" + $(target).attr("id");
            $(target).data("dasConfirmInit",true);
            this.Popup = new Popup($(target), {
                Id: confMessageId,
                Title: params.title,
                Message: params.message,
                TooltipClosure: params.close,
                PositionId: "content",
                Buttons: [
                    {
                        Label: params.yes,
                        Action: function () {
                            action($(target));
                            Popup.CloseAll();
                        }
                    },
                    {
                        Label: params.no,
                        Action: function () { Popup.CloseAll(); }
                    }
                ]
            });
        });
       
    };
    return dasConfirm;
})(jQuery, Popup);

$.fn.extend({
    DasConfirm: function (callback) {
        window.$DasConfirm = window.$DasConfirm || {};
        window.$DasConfirm[$(this).selector] = new DAS.Confirm($(this).selector, callback);
    }
});