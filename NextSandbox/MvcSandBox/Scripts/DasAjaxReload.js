/// <reference path="~/Scripts/Views/Shared/notification.js" />
/// <reference path="~/Scripts/jquery-2.1.1.intellisense.js" />
/// <reference path="~/Scripts/jquery-2.1.0-vsdoc.js" />

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
            data: data,
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