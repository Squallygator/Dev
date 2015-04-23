/**/
var toggleAllOrDetails = function (radioButtonsName, container, checkBoxsName) {
    var valTest = $("#" + radioButtonsName).prop("checked");
    if (valTest) {
        $(container).dkHide();
        $("input:checkbox[name=" + checkBoxsName + "]").attr('checked', false);
    } else {
        $(container).dkShow();
    }
};
var toUpperValueFieldWithValidation = function () {
    $(this).val($(this).val().toUpperCase());
    $(this).valid();
};
var AllOrDetailsParametre = function (allItemName, detailsContainerSelector, details) {
    this.AllItemName = allItemName;
    this.DetailsContainerSelector = detailsContainerSelector;
    this.DetailsListItemName = details;
    var that = this;

    var toggleAllDelegate = function () {
        toggleAllOrDetails(that.AllItemName, that.DetailsContainerSelector, that.DetailsListItemName);
    };
    toggleAllOrDetails(that.AllItemName, that.DetailsContainerSelector, that.DetailsListItemName);
    $('#' + this.AllItemName).click(toggleAllDelegate);
};
var DeletableRessources = function () {
    this.MessageOui = 'Message_Oui';
    this.MessageNon = 'Message_Non';
    this.Fermer = 'Fermer';
    this.DialogTitre = 'SuppressionDialogTitre';
    this.MessageConfirmationSuppression = 'MessageConfirmSuppressionDocument';
};
var DeletableParametre = function () {
    this.ActionSuppression = null;
    this.Ressource = new DeletableRessources();
    this.DeleteButtonSelector = '#todo';
};
var Deletable = function(deletableParams) {
    var params = new DeletableParametre();
    $.extend(true, params, deletableParams);
    var ressource = params.Ressource;
    if ($(params.DeleteButtonSelector).length > 0) {
        if (params.ActionSuppression === null) params.ActionSuppression = $(params.DeleteButtonSelector).attr('href');
        this.popupSupprimerDocument = new Popup($(params.DeleteButtonSelector), {
            Id: "msg-confirm-save",
            Title: ressource.DialogTitre,
            Message: ressource.MessageConfirmationSuppression,
            TooltipClosure: ressource.Fermer,
            PositionId: "form-bar-container",
            Buttons: [
                {
                    Label: ressource.MessageOui,
                    Action: function() {
                        open(params.ActionSuppression, "_self");
                    }
                },
                {
                    Label: ressource.MessageNon,
                    Action: function() { Popup.Cancel("msg-confirm-save"); }
                }
            ]
        });
    }
};