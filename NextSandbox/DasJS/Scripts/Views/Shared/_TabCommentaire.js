/// <reference path="~/Scripts/jquery-2.1.3.js" />
/// <reference path="~/Scripts/Views/Shared/DasTable.js" />
/// <reference path="~/Scripts/Views/Shared/DasTableRessources.js" />

var TabCommentaireParametres = function() {
    this.DasTableRessources = new DasTableRessources();
    this.IsInCreation = null;
    this.commentaireId = null;
};

var TabCommentaire = function (parametres) {
    var params = new TabCommentaireParametres();
    $.extend(params, parametres);
    this.table = new DasTable(params.DasTableRessources, params.IsInCreation, params.commentaireId);
};