/// <reference path="~/Scripts/Views/Shared/utils.js" />
/// <reference path="~/Scripts/jquery-2.1.3.js" />
/// <reference path="~/Scripts/jquery-ui-1.11.3.custom.js" />
/*
 *  Affecte une popup sur l'élément passé en paramètre
 *
 *	Usage : Popup.Creation(element, properties);
 *
    --> element : élément sur lequel affecté la popup (obligatoire)
    --> properties :  propriétés de la popup créee dynamiquement (facultatif)
        --> Type :                  Type de popup (div, span, ...)
        --> Id :                    Id de popup
        --> Class :                 Classe CSS de la popup
        --> Title :                 Titre de la popup
        --> Message :               Message de la popup
        --> Resizable :             Redimension de la popup
        --> Height :                Hauteur de la popup
        --> Modal :                 Modalité de la popup
        --> TooltipClosure :        Infobulle sur la croix de la popup
        --> PositionId :            Id sous lequel la popup doit être créer
        --> Buttons :               Liste des boutons d'actions de la popup
            --> BoutonA :
                --> Label :         Libelle du bouton A
                --> Action :        Action du bouton A
            --> BoutonB :
                --> Label :         Libelle du bouton B
                --> Action :        Action du bouton B
        --> AjaxMessageUrl :        Url fournissant le message a afficher
        --> AjaxMethod :            type de méthode utilisé pour l'appel ajax post
        --> AjaxData :              données à envoyées
        --> AjaxForm :              Formulaire 

    Vous pouvez spécifier le nombre de propriétés que vous souhaitez

*/
"use strict";
var PopupRessources = function () {
    this.Title = "todo";
    this.Message = "todo";
    this.ButtonYes = "todo";
    this.ButtonNo = "todo";
};
var Popup = (function () {
    Popup.DefaultProperties = {
        Type: "div",
        Id: "msg-confirm",
        Class: "invisible",
        Title: "Confirm",
        Message: "",
        Resizable: false,
        Height: "auto",
        Width: "300px",
        Modal: true,
        TooltipClosure: "Close",
        PositionId: "content",
        Buttons: [
            {
                Label: "Yes",
                Action: null,
            },
            {
                Label: "No",
                Action: function () { Popup.Cancel(this.id); }
            }
        ],
        AjaxMessageUrl: "",
        AjaxMethod: "post",
        AjaxData: ""
    };

    Popup.Validation = function (element) {
        element.closest("form").submit();
    };

    Popup.Cancel = function (elementId) {
        $("#" + elementId).dialog("close");
    };

    Popup.CloseAll = function () {
        $("div.ui-dialog").remove();

    };

    function Popup(element, properties) {
        this.element = element;
        this.properties = properties;
        this.Initialize();
        var that = this;
        if (this.element) {
            this.element.click(function () {
                return that.Show();
            });
        } else {
            that.Show();
        }
    }

    Popup.prototype = {
        Initialize: function () {
            this.InitProperties();
            if (this.properties.AjaxMessageUrl) {
                $("#" + this.properties.Id).remove();
            }
            var element = document.createElement(this.properties.Type);
            element.className = this.properties.Class;
            element.title = formatToHtml(this.properties.Title);
            element.id = this.properties.Id;
            $(element).html(this.properties.Message);
            $("#" + this.properties.PositionId).append($(element));
        },
        InitProperties: function () {
            this.properties = this.properties || {};
            this.properties.Type = this.properties.Type || Popup.DefaultProperties.Type;
            this.properties.Id = this.properties.Id || Popup.DefaultProperties.Id;
            this.properties.Class = this.properties.Class || Popup.DefaultProperties.Class;
            this.properties.Title = this.properties.Title || Popup.DefaultProperties.Title;
            this.properties.Message = this.properties.Message || Popup.DefaultProperties.Message;
            this.properties.Resizable = this.properties.Resizable || Popup.DefaultProperties.Resizable;
            this.properties.Height = this.properties.Height || Popup.DefaultProperties.Height;
            this.properties.Modal = this.properties.Modal || Popup.DefaultProperties.Modal;
            this.properties.TooltipClosure = this.properties.TooltipClosure || Popup.DefaultProperties.TooltipClosure;
            this.properties.PositionId = this.properties.PositionId || Popup.DefaultProperties.PositionId;
            this.properties.Buttons = this.properties.Buttons || Popup.DefaultProperties.Buttons;
            this.properties.Width = this.properties.Width || Popup.DefaultProperties.Width;
            this.properties.Open = this.properties.Open || Popup.DefaultProperties.Open;
            this.properties.AjaxMethod = this.properties.AjaxMethod || Popup.DefaultProperties.AjaxMethod;
        },
        Show: function () {
            var buttons = [];
            var that = this;
            for (var i = 0; i < this.properties.Buttons.length; i++) {
                buttons[i] = {
                    text: this.properties.Buttons[i].Label,
                    click: this.properties.Buttons[i].Action || function () { that.Validation(that.element); }
                };
            }

            $("#" + this.properties.Id).dialog({
                resizable: this.properties.Resizable,
                height: this.properties.Height,
                modal: this.properties.Modal,
                closeText: this.properties.TooltipClosure,
                buttons: buttons,
                width: this.properties.Width,
                open: this.properties.Open
            });

            if (this.properties.AjaxMessageUrl) {
                $("#" + this.properties.Id).next().addClass("invisible");
                $("#" + this.properties.Id).html("<span class='spinner-loading'>&nbsp;</span>");

                $.ajax(
                {
                    url: this.properties.AjaxMessageUrl,
                    type: this.properties.AjaxMethod,
                    data: (this.properties.AjaxForm) ? this.properties.AjaxForm.serialize() : this.properties.AjaxData,
                    success: function (data) {
                        $("#" + that.properties.Id).next().removeClass("invisible");
                        $("#" + that.properties.Id).html(data);
                    },
                    error: function (jqXHR) {
                        Popup.CloseAll();
                        Notification.Create("Ajax Failure", "", Notification.Ko);
                    }
                }
                );
            }

            $("button[type=button]").blur();

            return false;
        },
        Validation: function (element) {
            element.closest("form").submit();
        },
    };

    return Popup;
})();