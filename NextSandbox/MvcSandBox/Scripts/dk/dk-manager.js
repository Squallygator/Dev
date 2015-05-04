/// <reference path="dk-utils.js" />
/// <reference path="jquery.dk.js" />

dk = dk || {};
dk.Manager = (function () {
    var dkId = 'dk-id';
    var ctor = function (container) {
        this.container = container;
        this.model = {};
        this.InitModel();
    };
    ctor.prototype.InitModel = function () {
        var that = this;
        $('*[' + dkId + ']', this.container).each(function () {
            var $elt = $(this);
            $elt.dkProperty(that.model, $elt.attr(dkId));
        });
    };
    ctor.prototype.getDTO = function (cols) {
        return dk.utils.convertToDTO(this.model, cols);
    };
    return ctor;
})();

$(document).ready(function () {
    $('*[dk-manager]').each(function () {
        var $elt = $(this);
        window[$elt.attr('dk-manager')] = new dk.Manager($elt);
    });
});
