var DasTableSelectors = (function () {
    function DasTableSelectors() {
    }
    Object.defineProperty(DasTableSelectors, "firstSelector", {
        get: function () {
            return ":first";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DasTableSelectors, "visibleSelector", {
        get: function () {
            return ":visible";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DasTableSelectors, "headersSelector", {
        get: function () {
            return ".das-table thead tr th";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DasTableSelectors, "firstVisibleHeaderSelector", {
        get: function () {
            return DasTableSelectors.headersSelector + DasTableSelectors.visibleSelector + DasTableSelectors.firstSelector;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DasTableSelectors, "bodyLinesSelector", {
        get: function () {
            return ".das-table tbody tr";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DasTableSelectors, "bodyFirstLineSelector", {
        get: function () {
            return DasTableSelectors.bodyLinesSelector + ":first";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DasTableSelectors, "bodySelector", {
        get: function () {
            return ".das-table tbody";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DasTableSelectors, "bodyColumnWithDeleteButton", {
        get: function () {
            return "td[data-" + DasTableProperties.dataColumnRole + "='" + DasTableProperties.columnRoleDelete + "']";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DasTableSelectors, "deleteButtonsEnabled", {
        get: function () {
            return "a." + DasTableStyles.deleteButtonEnabledClass;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DasTableSelectors, "checkbox", {
        get: function () {
            return "input[type='checkbox']";
        },
        enumerable: true,
        configurable: true
    });
    return DasTableSelectors;
})();

var DasTableProperties = (function () {
    function DasTableProperties() {
    }
    Object.defineProperty(DasTableProperties, "dataColumnProperty", {
        get: function () {
            return "das-table-column-property";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DasTableProperties, "dataColumnRedirect", {
        get: function () {
            return "das-table-row-redirect";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DasTableProperties, "dataColumnRole", {
        get: function () {
            return "das-table-column-role";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DasTableProperties, "dataTooltipText", {
        get: function () {
            return "data-das-tooltip-text";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DasTableProperties, "columnRoleDelete", {
        get: function () {
            return "delete";
        },
        enumerable: true,
        configurable: true
    });
    return DasTableProperties;
})();

var DasTableStyles = (function () {
    function DasTableStyles() {
    }
    Object.defineProperty(DasTableStyles, "deleteButtonContainerClass", {
        get: function () {
            return "delete-button-div";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DasTableStyles, "deleteButtonEnabledClass", {
        get: function () {
            return "delete-button";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DasTableStyles, "selectedLineClass", {
        get: function () {
            return "selected";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DasTableStyles, "addedLineClass", {
        get: function () {
            return "added";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DasTableStyles, "deletedLineClass", {
        get: function () {
            return "deleted";
        },
        enumerable: true,
        configurable: true
    });
    return DasTableStyles;
})();

var DasTable = (function () {
    function DasTable(properties, isInCreation, defaultSelected) {
        var _this = this;
        this.properties = properties;
        this.initParameters();

        DasTable.initEvents(this.properties);

        this.columnName = new Array();
        $(DasTableSelectors.headersSelector).each(function (index, elem) {
            _this.columnName.push({
                name: $(elem).data(DasTableProperties.dataColumnProperty),
                role: $(elem).data(DasTableProperties.dataColumnRole),
                visible: $(elem).is(DasTableSelectors.visibleSelector),
                valeur: null
            });
        });
        if (isInCreation) {
            if (defaultSelected != null && defaultSelected != "" && $(DasTableSelectors.bodyLinesSelector + "#" + defaultSelected) && $(DasTableSelectors.bodyLinesSelector + "#" + defaultSelected).length > 0) {
                $(DasTableSelectors.bodyLinesSelector + "#" + defaultSelected).addClass(DasTableStyles.addedLineClass);
                $(DasTableSelectors.bodyLinesSelector + "#" + defaultSelected + " a." + DasTableStyles.deleteButtonEnabledClass).on('click', function(e) {
                    _this.clearAddedRow($(e.currentTarget).closest('tr'));
                });
            } else {
                var firstVisibleColumnName = this.getFirstVisibleColumn();
                for (var i = 0; i < this.columnName.length; i++) {
                    this.columnName[i].valeur = this.columnName[i].name === firstVisibleColumnName ? this.properties.txtCreationRessource : null;
                }

                this.addRow(this.columnName);
            }
        }

        if (defaultSelected !== null && defaultSelected !== "") {
            $(DasTableSelectors.bodyLinesSelector).removeClass(DasTableStyles.selectedLineClass);
            $(DasTableSelectors.bodyLinesSelector + "#" + defaultSelected + ":not(." + DasTableStyles.addedLineClass + ")").addClass(DasTableStyles.selectedLineClass);

            if ($(".das-table")[0].scrollHeight > $(".das-table").height() && $(".das-table .selected").length) {
                var rowSelectedTop = $(".das-table .selected").offset().top;
                var tableTop = $(".das-table").offset().top;
                var pageTop = $("html, body").offset().top;
                $(".das-table").scrollTop(rowSelectedTop - tableTop - pageTop);
            }
        }

        if ($(".das-table").is(":hidden")) {
            $("#" + this.properties.completePartialFormId).hide();
        }
    }
    DasTable.initEvents = function (properties) {
        $(DasTableSelectors.bodyLinesSelector).on("click", function (e) {
            if ($(e.currentTarget).hasClass(DasTableStyles.selectedLineClass) || $(e.target).is(":last-child")) {
                return;
            }

            var link = $(e.currentTarget).data(DasTableProperties.dataColumnRedirect);
            window.location.href = link;
        });

        $(DasTableSelectors.bodyLinesSelector + " " + DasTableSelectors.bodyColumnWithDeleteButton + " " + DasTableSelectors.deleteButtonsEnabled).on("click", function (e) {
            var currentElem = $(e.currentTarget);
            if (currentElem.hasClass(DasTableStyles.deleteButtonEnabledClass)) {
                currentElem.removeClass(DasTableStyles.deleteButtonEnabledClass);
                currentElem.html(properties.txtAnnulerRessource);
                currentElem.tooltip({ text: properties.tooltipAnnulerSuppression });
                currentElem.closest("td").find(DasTableSelectors.checkbox).prop("checked", true);
            } else {
                currentElem.html("&nbsp;");
                currentElem.addClass(DasTableStyles.deleteButtonEnabledClass);
                currentElem.removeAttr(DasTableProperties.dataTooltipText);
                currentElem.tooltip({ text: properties.tooltipSuppressionEnable });
                currentElem.closest("td").find(DasTableSelectors.checkbox).prop("checked", false);
            }

            if (currentElem.closest("tr").hasClass(DasTableStyles.selectedLineClass)) {
                $("#" + properties.formContainerBlockId).toggle();
                $("#" + properties.suppressionMsgBlockId).toggle();
            }

            currentElem.closest("tr").toggleClass(DasTableStyles.deletedLineClass);
        });
    };

    DasTable.prototype.initParameters = function () {
        if (this.properties === null) {
            this.properties = {
                syntheseBlockDivId: "syntheseTableBlock",
                syntheseNoDataBlockDivId: "noDataBlock",
                formContainerBlockId: "formContainer",
                suppressionMsgBlockId: "messageSuppression",
                completePartialFormId: "partialForm",
                txtAnnulerRessource: "??Annuler",
                txtCreationRessource: "??Création en cours",
                tooltipAnnulerCreation: "??Annuler la création",
                tooltipAnnulerSuppression: "??Annuler la suppression",
                tooltipSuppressionEnable: "??Supprimer"
            };
        } else {
            this.properties.syntheseBlockDivId = this.properties.syntheseBlockDivId || "syntheseTableBlock";
            this.properties.syntheseNoDataBlockDivId = this.properties.syntheseNoDataBlockDivId || "noDataBlock";
            this.properties.formContainerBlockId = this.properties.formContainerBlockId || "formContainer";
            this.properties.suppressionMsgBlockId = this.properties.suppressionMsgBlockId || "messageSuppression";
            this.properties.completePartialFormId = this.properties.completePartialFormId || "partialForm";
            this.properties.txtAnnulerRessource = this.properties.txtAnnulerRessource || "??Annuler";
            this.properties.txtCreationRessource = this.properties.txtCreationRessource || "??Création en cours";
            this.properties.tooltipAnnulerCreation = this.properties.tooltipAnnulerCreation || "??Annuler la création";
            this.properties.tooltipAnnulerSuppression = this.properties.tooltipAnnulerSuppression || "??Annuler la suppression";
            this.properties.tooltipSuppressionEnable = this.properties.tooltipSuppressionEnable || "??Supprimer";
        }
    };

    DasTable.prototype.addRow = function (data) {
        var newLigne = $("<tr>");
        newLigne.addClass(DasTableStyles.addedLineClass);
        for (var i = 0; i < this.columnName.length; i++) {
            var cell = $("<td>");
            if (!this.columnName[i].visible) {
                cell.css("display", "none");
            }
            if (this.columnName[i].valeur != null) {
                cell.html(this.properties.txtCreationRessource);
            }
            if (this.columnName[i].role != null) {
                cell = this.createDeleteCell();
            }
            newLigne.append(cell);
        }

        if ($(DasTableSelectors.bodyLinesSelector).length > 0) {
            newLigne.insertBefore(DasTableSelectors.bodyFirstLineSelector);
        } else {
            $(DasTableSelectors.bodySelector).append(newLigne);
        }
    };

    DasTable.prototype.createDeleteCell = function () {
        var _this = this;
        var deleteCell = $("<td>");
        deleteCell.data(DasTableProperties.dataColumnRole, DasTableProperties.columnRoleDelete);
        var deleteDiv = $("<div>").addClass(DasTableStyles.deleteButtonContainerClass);
        var deleteLink = $("<a>").addClass(DasTableStyles.deleteButtonEnabledClass).attr("href", "javascript:void(0)").attr(DasTableProperties.dataTooltipText, this.properties.tooltipAnnulerCreation).html("&nbsp;").click(function (e) {
            _this.clearAddedRow($(e.currentTarget));
        });
        deleteLink.tooltip();
        deleteDiv.append(deleteLink);
        deleteCell.append(deleteDiv);
        return deleteCell;
    };

    DasTable.prototype.getFirstVisibleColumn = function () {
        return $(DasTableSelectors.firstVisibleHeaderSelector).data(DasTableProperties.dataColumnProperty);
    };

    DasTable.prototype.clearAddedRow = function (row) {
        row.closest("tr").remove();

        if ($(DasTableSelectors.bodyLinesSelector).length > 0) {
            var link = $(DasTableSelectors.bodyLinesSelector + ":not(.added)" + DasTableSelectors.firstSelector).data(DasTableProperties.dataColumnRedirect);
            link = link || $("#Identifiant").val();
            window.location.href = link;
        } else {
            $("#" + this.properties.syntheseBlockDivId).hide();
            $("#" + this.properties.syntheseNoDataBlockDivId).show();
            $("#" + this.properties.formContainerBlockId).hide();
        }
    };

    DasTable.prototype.removeRow = function (rowId) {
        $(DasTableSelectors.bodyLinesSelector + "#" + rowId).remove();
    };
    return DasTable;
})();