/// <reference path="~/Scripts/Views/Shared/notification.js" />
/// <reference path="~/Scripts/jquery-2.1.3.intellisense.js" />
/// <reference path="~/Scripts/jquery-ui-1.11.3.custom.js" />
var DasTableAjax = (function () {
    'use strict';
    var removeLigneEventName = "removeRow";

    DasTableAjax.onAjaxFailure = function (jqXHR, textStatus, errorThrown) {
        Notification.Create(textStatus, Notification.Ko, { autoClose: false });
    };

    DasTableAjax.onAjaxBegin = function () {
        if ($(this).is("a") && ($(this).hasClass("action-disabled"))) {
            return false;
        }
        return true;
    }
  
    DasTableAjax.onAjaxSuccess = function () {
        eval($("#tableContainer tbody tr:first-child script").html());
        $('#tableContainer tbody tr:first-child .jqPicker').datepicker();

        if ($("#tableContainer").hasClass("invisible"))
            $("#tableContainer, #noDataDiv, #helpDiv").toggleClass("invisible");
    };

    function DasTableAjax() {
        var that = this;
        $(document).ready(function () {
            $("#tableContainer tbody").on("click", ".delete-button-div .delete-button", function () {
                if ($(this).closest("tr").find("input[name$='VisualState']").val() === "Add") {
                    var currentLigne = $(this).closest("tr");
                    var currentErrorLigne = currentLigne.next();
                    currentLigne.remove();
                    if (($(currentErrorLigne).attr("class") && $(currentErrorLigne).attr("class").indexOf("invisible") > -1) || $(currentErrorLigne).find(".error-info").length > 0) {
                        currentErrorLigne.remove();
                    }
                    var rowCount = $("#tableContainer tbody tr:not(.invisible)").length;
                    if (!rowCount) {
                        $("#tableContainer, #noDataDiv, #helpDiv").toggleClass("invisible");
                    }
                    $("#tableContainer").trigger(removeLigneEventName, [rowCount]);
                } else {
                    that.setDeletedRow($(this));
                    that.DisplayCancelLink($(this));
                }
            });

            $("#tableContainer tbody").on("click", ".delete-button-div a:not(.delete-button-disabled):not(.delete-button)", function () {
                that.RemoveDeletedRow($(this));
                that.DisplayRemoveLink($(this));
            });
        });
    }

    DasTableAjax.prototype.setDeletedRow = function(jqDeleteElement) {
        var ligne = jqDeleteElement.closest("tr");
        ligne.addClass("deleted");
        ligne.find("input[name$='VisualState']").val("Delete");
    };

    DasTableAjax.prototype.DisplayCancelLink = function(jqDeleteElement) {
        var cellule = jqDeleteElement.closest('td');
        cellule.find(".delete-button").hide();

        var cancelLink = cellule.find("div.delete-button-div a:not(.delete-button)");
        cancelLink.show();
    };

    DasTableAjax.prototype.RemoveDeletedRow = function(jqDeleteElement) {
        var ligne = jqDeleteElement.closest("tr");
        ligne.removeClass("deleted");
        ligne.find("input[name$='VisualState']").val("None");
    };

    DasTableAjax.prototype.RemoveAddedRow = function (jqDeleteElement) {
        var ligne = jqDeleteElement.closest("tr");
        ligne.removeClass("deleted");
        ligne.find("input[name$='VisualState']").val("None");
    };
    
    DasTableAjax.prototype.DisplayRemoveLink = function(jqDeleteElement) {
        var cellule = jqDeleteElement.closest('td');
        cellule.find(".delete-button").show();

        var cancelLink = cellule.find("div.delete-button-div a:not(.delete-button)");
        cancelLink.hide();
    };

    return DasTableAjax;
})();