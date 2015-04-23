/// <reference path="../jquery-2.1.3.js" />
/// <reference path="../jquery-ui-1.11.3.js"/>

var DasTrackingModificationOptions = function () {
    return {
        enable: true, /** Actif ou non **/
        cssClassTracking: "", /** Css classe des formulaire tracké : dasTrack**/
        cssClassNoTracking: "dasNoTrack", /** Css classe des formulaire à ne pas tracker **/
        cssClassChanged: "control-changed", /** Css classe pour les input modifier **/
        message_Oui: "Rester sur cette page",
        message_Non: "Quitter sur cette page",
        message_Titre: "Title",
        message_Contenu: "",
        forceShowMessage: false
    }
};

var DasTrackingModification = (function () {
    "use strict";
    this.modified = false;
    this.option = null;
    this.beforeUnloadCallBack = null;

    this.Init = function (option, beforeUnloadCallBack) {
        this.option = option;
        this.beforeUnloadCallBack = beforeUnloadCallBack;
        DasTrackingModification.SaveDefaultValue(this);
    }

    this.CheckModification = function (event) {
        if (!this.option.enable) {
            return false;
        }
        if ($(event.currentTarget).not(".pager-btn-next, .pager-btn-previous, .pager-btn-first, .pager-btn-last .delete-button, .delete-button-disabled, .action-disabled, .button-supprimer, .button-compare, .dasNoTrack").length === 0)
            return false;
        if ($(event.currentTarget).hasClass(this.option.cssClassNoTracking))
            return false;

        var link;
        switch (event.type) {
            case "beforeunload":
                break;
            case "click":
                if ((event.originalEvent !== null && event.originalEvent.button !== 0)
                    || (event.originalEvent !== null && event.originalEvent.button === 0 && event.originalEvent.ctrlKey)
                    || (event.currentTarget !== null && event.currentTarget.href.indexOf("javascript") === 0)
                    || (event.currentTarget !== null && $(event.currentTarget).attr("data-ajax"))) {
                    return false;
                }
                link = event.currentTarget;
                event.preventDefault();
                break;
        }

        this.modified = false;
        DasTrackingModification.CheckInputs(this);
        DasTrackingModification.CheckDataTable(this);

        if (link) {
            if (this.modified || this.option.forceShowMessage) {
                DasTrackingModification.Show(link, this);
            } else {
                DasTrackingModification.ApplyLink(link);
            }
        }
        return this.modified | this.option.forceShowMessage;
    }

    DasTrackingModification.SaveDefaultValue = function (tracker) {
        var that = tracker;
        var selectorSelect;

        if (that.option.cssClassTracking) {
            selectorSelect = "form." + that.option.cssClassTracking + " select[class!=" + that.option.cssClassNoTracking + "]";
        } else {
            selectorSelect = "form select[class!=" + that.option.cssClassNoTracking + "]";
        }
        $(selectorSelect).each(function (index, target) {
            $(target).prop("defaultOption", $(target).val());
        });
    }

    DasTrackingModification.UpdateChangedControl = function (input, tracker) {
        switch (input.type) {
            case "checkbox":
                $(input).parents("div.checkbox-container").addClass(tracker.option.cssClassChanged);
                break;
            default:
                $(input).addClass(tracker.option.cssClassChanged);
                break;
        }
    }

    DasTrackingModification.UpdateUnChangedControl = function (input, tracker) {
        switch (input.type) {
            case "checkbox":
                $(input).parents("div.checkbox-container").removeClass(tracker.option.cssClassChanged);
                break;
            default:
                $(input).removeClass(tracker.option.cssClassChanged);
                break;
        }
    }

    DasTrackingModification.ApplyLink = function (link) {
        $(window).unbind("beforeunload", this.beforeUnloadCallBack);
        var href = $(link).attr("href");
        if (!href) return;
        window.location = href; return;
    }

    DasTrackingModification.PrepareDialogDiv = function (tracker) {
        $("#dialog-modificationUnderway").remove();
        var element = document.createElement("div");
        element.title = formatToHtml(tracker.option.message_Titre);
        element.id = "dialog-modificationUnderway";
        $(element).html(tracker.option.message_Contenu);
        $("body").append($(element));
    }

    DasTrackingModification.Show = function (link, tracker) {
        var buttons = [];
        buttons[1] = {
            text: tracker.option.message_Non,
            click: function () {
                $(this).dialog("close");
                DasTrackingModification.ApplyLink(link, tracker);
            }
        };
        buttons[0] = {
            text: tracker.option.message_Oui,
            click: function () { $(this).dialog("close"); }
        };

        DasTrackingModification.PrepareDialogDiv(tracker);

        $("#dialog-modificationUnderway").dialog({
            resizable: false,
            height: "auto",
            width: "auto",
            modal: true,
            title: tracker.option.message_Titre,
            buttons: buttons
        });
    }

    DasTrackingModification.CheckDataTable = function (tracker) {
        var that = tracker;
        if ($("form[dasNoTrack!=true] .deleted").length > 0 || $("form[dasNoTrack!=true] .added").length > 0) {
            that.modified = true;
        }
    }

    DasTrackingModification.CheckInputs = function (tracker) {
        var that = tracker;

        var selectorInput;
        var selectorSelect;
        var selectorTextArea;
        if (that.option.cssClassTracking) {
            selectorInput = "form." + that.option.cssClassTracking + " input[class!=" + that.option.cssClassNoTracking + "]";
            selectorSelect = "form." + that.option.cssClassTracking + " select[class!=" + that.option.cssClassNoTracking + "]";
            selectorTextArea = "form." + that.option.cssClassTracking + " textarea[class!=" + that.option.cssClassNoTracking + "]";
        } else {
            selectorInput = "form[dasNoTrack!=true] input[class!=" + that.option.cssClassNoTracking + "]";
            selectorSelect = "form[dasNoTrack!=true] select[class!=" + that.option.cssClassNoTracking + "]";
            selectorTextArea = "form[dasNoTrack!=true] textarea[class!=" + that.option.cssClassNoTracking + "]";
        }

        $(selectorInput + ", " + selectorTextArea).each(function (index, target) {
            if ($(target).is(":visible")) {
                switch ($(target).prop("type")) {
                case "hidden":
                    //do nothing
                    break;
                case "radio":
                case "checkbox":
                    if ($(target).prop("defaultChecked") !== $(target).prop("checked")) {
                        that.modified = true;
                        console.log($(target));
                        DasTrackingModification.UpdateChangedControl(target, that);
                    } else {
                        DasTrackingModification.UpdateUnChangedControl(target, tracker);

                    }
                    break;
                default:
                    if ($(target).prop("defaultValue") !== $(target).val()) {
                        that.modified = true;
                        console.log($(target));
                        DasTrackingModification.UpdateChangedControl(target, that);
                    } else {
                        DasTrackingModification.UpdateUnChangedControl(target, tracker);
                    }
                    break;
                }
            }
        });

        $(selectorSelect).each(function (index, target) {
            if ($(target).is(":visible")) {
                if ($(target).prop("defaultOption") !== $(target).val()) {
                    that.modified = true;
                    console.log($(target));
                    DasTrackingModification.UpdateChangedControl(target, that);
                } else {
                    DasTrackingModification.UpdateUnChangedControl(target, tracker);
                }
            }
        });
    }
});