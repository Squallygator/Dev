/// <reference path="../../jquery-1.11.0.js" />
/// <reference path="../../jquery.tooltip.js" />
/// <reference path="tooltip.js" />
/// <reference path="~/Scripts/jquery-2.1.3.intellisense.js" />
/// <reference path="~/Scripts/Views/Shared/_Layout.js" />

var DdlSimpleSearch = (function () {
    var ctor = function (containerSelector) {
        // todo : supprimer log
        console.log('new DdlSimpleSearch');
        containerSelector = containerSelector || '#search-container';
        this.$searchContainer = $(containerSelector);
        this.$entite = $('[role=select]', this.$searchContainer);
        this.$text = $('[role=textbox]', this.$searchContainer);
        this.$link = $('[role=search]', this.$searchContainer);

        var that = this;
        this.$entite.on('change', function () {
            that.RefreshAll();
            that.$text.select();
        });

        this.$text.on('keyup', function () {
            var data = that.GetDdlData();
            that.RefreshLink(data);
        });
        
        that.RefreshAll();
    };
    ctor.prototype.GetDdlData = function() {
        return $('option:selected', this.$entite).data();
    };

    ctor.prototype.GetTextValue = function () {
        return encodeURIComponent(this.$text.val());
    };

    ctor.prototype.RefreshDeco = function (data) {
        this.$text.attr("placeholder", data.watermarktext);
        this.$text.tooltip({ text: data.helptext });
    };

    ctor.prototype.RefreshAll = function() {
        var data = this.GetDdlData();
        this.RefreshDeco(data);
        this.RefreshLink(data);
    };
    ctor.prototype.RefreshLink = function (data) {
        var paramName = this.$text.attr('name') || "search";
        this.$link.attr('href', UrlUtils.addOrUpdateParameter(data.href, paramName, this.GetTextValue()));
    };
    ctor.prototype.SetValues = function(element, search) {
        $('option[value=' + element + ']', this.$entite).prop('selected', true);
        this.$text.val(search);
        this.RefreshAll();
    };
    return ctor;
})();

$(document).ready(function() {
    window.DdlSimpleSearch = new DdlSimpleSearch('#search-container');
});