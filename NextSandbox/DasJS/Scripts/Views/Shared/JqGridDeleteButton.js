var DeleteInListing = {
    eventHandler: $('<input type="text" />'),

    Delete: function (sender) {
        var jqGridCell = $(sender).parents("td:first");
        var jqGridRow = $(sender).parents("tr:first");
        var checkBox = jqGridRow.find("input[name='supprimeIds']");
        checkBox.prop('checked', true);
        var lineId = checkBox.val();

        jqGridCell.html(DeleteInListing.Template.CancelDeleteTemplate(lineId));
        DeleteInListing.InitTooltip(jqGridCell);
        jqGridRow.addClass("deleted");
        DeleteInListing.notifyChange();
    },
    Cancel: function (sender) {
        var jqGridCell = $(sender).parents("td:first");
        var jqGridRow = $(sender).parents("tr:first");
        var checkBox = jqGridRow.find("input[name='supprimeIds']");
        checkBox.prop('checked', false);
        var lineId = checkBox.val();

        jqGridCell.html(DeleteInListing.Template.DeleteButtonTemplate(lineId, true));
        DeleteInListing.InitTooltip(jqGridCell);
        jqGridRow.removeClass("deleted");
        DeleteInListing.notifyChange();
    },
    InitTooltip: function ($cell) {
        $cell.find('a[' + Tooltip.Attr.Text + ']:not([' + Tooltip.Attr.Ready + '])').tooltip();
    },
    Template: {
        deleteButton: "#DeleteButtonTemplate",
        deleteInput: "#DeleteInputTemplate",
        cancelLink: "#CancelDeleteButtonTemplate",
        DeleteButtonTemplateFromLoading: function (cellvalue, gridOptions, rowObject) {
            // Celle-ci est appelée automatiquement depuis ce qui est renseigné dans le modèle MVC
            DeleteInListing.GridBinding.BindGrid(gridOptions.gid);
            return DeleteInListing.Template.DeleteButtonTemplate(gridOptions.rowId, cellvalue);
        },
        FormatSupprimerInputFromLoading: function (cellvalue, gridOptions, rowObject) {
            // Celle-ci est appelée automatiquement depuis ce qui est renseigné dans le modèle MVC
            var templateDatas = { id: gridOptions.rowId };
            return TemplateHelper.Transform(templateDatas, $(DeleteInListing.Template.deleteInput));
        },
        CancelDeleteTemplate: function (id) {
            var templateDatas = { id: id };
            return TemplateHelper.Transform(templateDatas, $(DeleteInListing.Template.cancelLink));
        },
        DeleteButtonTemplate: function (id, estSupprimable) {
            var templateDatas = { id: id, estSupprimable: estSupprimable };
            return TemplateHelper.Transform(templateDatas, $(DeleteInListing.Template.deleteButton));
        }
    },
    notifyChange: function () {  //  <= Ajouter la fonction de notification
        var contactToDelete = $("input[name='supprimeIds']:checked").length > 0;
        DeleteInListing.eventHandler.trigger("change", contactToDelete);
    },

    Init: function () {
        DeleteInListing.Delete();
    },
    GridBinding: {
        // pour éviter de gérer du script à la main le binding de la suppression est réalisé ici automatiquement
        bindedGrids: [],
        BindGrid: function (gridId) {
            if ($.inArray(gridId, DeleteInListing.GridBinding.bindedGrids) > -1) {
                // la grille est déjà gérée
                return;
            }

            // bind des clicks de la grille pour la fonctionnalité suppression
            var grid = $("#" + gridId);
            grid.on("click", "a[data-role='delete']", function () { DeleteInListing.Delete(this);
            });
            grid.on("click", "a[data-role='cancel']", function () { DeleteInListing.Cancel(this); });

            // ajout de la grille à la liste d'abonnés pour ne pas la binder une autre fois
            DeleteInListing.GridBinding.bindedGrids.push(gridId);
        },
    }
};
