/// <reference path="~/Scripts/jquery-2.1.0.js" />
var DasAjaxReloadOptions = function () {
    this.targetSelector = null;
    this.ajaxUrl = null;
    this.GetDataDelegate = null;
    this.triggerChangeSeletors = null;
    this.delegateBeforeAjax = null;
    this.delegateSuccess = null;
    this.delegateError = null;
    var that = this;
    this.GetAjaxUrl = function () {
        var ajaxUrl = that.ajaxUrl;
        if (!ajaxUrl) return null;
        if (typeof ajaxUrl === 'function')
            return ajaxUrl();
        return ajaxUrl;
    };
    this.GetData = function () {
        var dataDelegate = that.GetDataDelegate;
        if (!dataDelegate || typeof dataDelegate !== 'function')
            return $(that.targetSelector).closest('form').serialize();
        return dataDelegate();
    };
    this.beforeAjax = function (eventThis) {
        console.log('DasAjaxReloadObject.beforeAjax data : ' + JSON.stringify(data));
        if (that.delegateBeforeAjax && typeof that.delegateBeforeAjax === 'function')
            that.delegateBeforeAjax(eventThis);
    };
    this.done = function (html) {
        if ($(options.targetSelector))
            $(options.targetSelector).html(html);
        if (that.delegateSuccess && typeof that.delegateSuccess === 'function')
            that.delegateSuccess(html);
    };
    this.fail = function (xhr) {
        console.log('erreur AJAX DasAjaxReload : ' + JSON.stringify(xhr));
        if (that.delegateError && typeof that.delegateError === 'function')
            that.delegateError(xhr);
    };
};
jQuery.fn.extend({
    //    DasAjaxReload: function (targetSelector, ajaxUrl, triggerChangeSeletors, delegateSuccess) {
    //        if (!$(targetSelector)) return;
    //        if (!ajaxUrl) return;
    //        if (!triggerChangeSeletors) return;
    //        var options = new DasAjaxReloadOptions();
    //        options.targetSelector = targetSelector;
    //        options.ajaxUrl = ajaxUrl;
    //        options.triggerChangeSeletors = triggerChangeSeletors;
    //        options.delegateSuccess = delegateSuccess;
    //        $(this).DasAjaxReloadObject(options);
    //},
    DasAjaxReload: function (dasAjaxReload) {
        if (!dasAjaxReload) return;
        var options = (dasAjaxReload instanceof DasAjaxReloadOptions) ? dasAjaxReload : $.extend(true, new DasAjaxReloadOptions(), dasAjaxReload);
        if (!options.ajaxUrl) return;
        if (!$(options.targetSelector)) return;
        if (!options.triggerChangeSeletors) return;
        var reload = function () {
            options.beforeAjax(this);
            var url = options.GetAjaxUrl();
            var data = options.GetData();
            $.ajax(url, {
                type: 'POST',
                dataType: 'html',
                data: data,
            })
            .done(options.done)
            .fail(options.fail);
        };
        var $this = $(this);
        if (!options.triggerChangeSeletors) return;
        var triggerChangeSeletors = options.triggerChangeSeletors;
        var length = triggerChangeSeletors.length;
        for (var i = 0; i < length; i++) {
            var selector = triggerChangeSeletors[i];
            var eventName = 'change';
            if ($(selector).data('dasAutocompleteText'))
                eventName = 'autocompleteChange';
            $this.on(eventName, selector, reload);
        }
    }
});