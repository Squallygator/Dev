/// <reference path="../Shared/DasTable.js" />
/// <reference path="../Shared/DasTableRessources.js" />
/// <reference path="../Shared/popup.js" />

var DasTableWithOnUpdateErrorPopupParameters = function () {
    this.Identifiant = null;
    this.IsInCreation = null;
    this.IsOnUpdateError = false;
    this.DasTableRessources = new DasTableRessources();
    this.PopupRessources = new PopupRessources();
    this.PopupId = "msg-confirm-autre-element-principal";
    this.UpdateOtherJSelector = "#updateOther";
    this.FormJSelector = "#InfoComptableForm";
    this.SaveButtonsSelectors = '#Save,#SaveAndContinue';
};

var DasTableWithOnUpdateErrorPopup = function (informationComptableEntiteParams) {
    var params = new DasTableWithOnUpdateErrorPopupParameters();
    $.extend(true, params, informationComptableEntiteParams);

    this.table = new DasTable(params.DasTableRessources, params.IsInCreation, params.Identifiant);
    this.onUpdateErrorPopup = null;

    if (params.IsOnUpdateError && params.Identifiant) {
        this.onUpdateErrorPopup = new Popup(undefined, {
            Type: "div",
            Id: params.PopupId,
            Class: "invisible",
            Title: params.PopupRessources.Title,
            Message: params.PopupRessources.Message,
            Resizable: false,
            Height: "auto",
            Modal: true,
            TooltipClosure: "Close",
            PositionId: "content",
            Buttons: [
                {
                    Label: params.PopupRessources.ButtonYes,
                    Action: function () {
                        $(params.UpdateOtherJSelector).val(true);
                        $(params.FormJSelector).submit();
                        Popup.Cancel(this.id);
                    },
                },
                {
                    Label: params.PopupRessources.ButtonNo,
                    Action: function () {
                        $(params.SaveButtonsSelectors).removeAttr('disabled');
                        Popup.Cancel(this.id);
                    }
                }
            ]
        });
    }
};