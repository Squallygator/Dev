
var RefListingRessources = function () {
    this.MessageOui = 'todo Message_Oui';
    this.MessageNon = 'todo Message_Non';
    this.DejaAjoute = 'todo DejaAjoute';
    this.Fermer = 'todo Fermer';
    this.EnregistrerEtOngletSuivant = 'todo EnregistrerEtOngletSuivant';
    this.Enregistrer = 'todo Enregistrer';
    this.DialogTitre = 'todo DialogTitre';
    this.ConfirmationAjoutSuppression = 'todo ConfirmationAjoutSuppression';
 };

var RefListingUrls = function () {
    this.fieldId = 'id';
    this.RefDetail = 'todo';
    this.CountVehiculesByModeleVersionWithRef = 'todo';
    this.CountVehiculesByRef = 'todo';
    this.CountModeleVersionsByRef = 'todo';
};

var RefListingParametres = function () {
    this.instanceName = 'item';
    this.gridName = 'grid-ListItem';
    this.autoCompleteName = 'ItemToAdd';
    this.arrayName = 'DeltaList';
    this.noDataJSelector = '#amb-int-grid-nodata';
    this.UpdateStatePropertyName = 'UpdateState';
    this.ItemIsUsedPropertyName = 'NbVOModeleVersion';
    this.ItemIsUsedPropertyIndex = 4;
    this.dasAutoComplete = window.autoCompleteNameDasAutoComplete;
    this.editable = true;
    this.ressource = new RefListingRessources();
    this.urls = new RefListingUrls();
    this.isSavePopupsEnabled = true;
    };

var RefListing = function (refListingParametres) {
    this.params = new RefListingParametres();
    $.extend(true, this.params, refListingParametres);
    var that = this;
    var ressource = that.params.ressource;

    var formatGridContent = function () {
        $('.ui-jqgrid-bdiv').css({
            "max-height": "310px",
            "overflow": "",
            "overflow-x": "hidden",
            "overflow-y": "auto"
        });
    };

    var initSaveButtonsPopups = function () {
        if ($('#Save').length > 0) {
            that.popup = new Popup($('#Save'), {
                Id: "msg-confirm-save",
                Title: ressource.DialogTitre,
                Message: ressource.ConfirmationAjoutSuppression,
                TooltipClosure: ressource.Fermer,
                PositionId: "form-bar-container",
                Buttons: [
                    {
                        Label: ressource.MessageOui,
                        Action: function () {
                            $('[name=submitValue]').val(formatToHtml(ressource.Enregistrer));
                            Popup.Validation($('#Save'));
                        }
                    },
                    {
                        Label: ressource.MessageNon,
                        Action: function () { Popup.Cancel("msg-confirm-save"); }
                    }
                ]
            });
        }
        if ($('#SaveAndContinue').length > 0) {

            that.popupSaveAndContinue = new Popup($('#SaveAndContinue'), {
                Id: "msg-confirm-save-and-next",
                Title: ressource.DialogTitre,
                Message: ressource.ConfirmationAjoutSuppression,
                TooltipClosure: ressource.Fermer,
                PositionId: "form-bar-container",
                Buttons: [
                    {
                        Label: ressource.MessageOui,
                        Action: function () {
                            $('input[name=submitValue]').val(formatToHtml(ressource.EnregistrerEtOngletSuivant));
                            Popup.Validation($('#SaveAndContinue'));
                        }
                    },
                    {
                        Label: ressource.MessageNon,
                        Action: function () { Popup.Cancel("msg-confirm-save-and-next"); }
                    }
                ]
            });
        }
    };

    this.FormatSupprimerBouton = function(cellvalue, options, rowObject) {
        return that.Listing.FormatSupprimerBouton(cellvalue, options, rowObject);
    };

    this.FormatLinkWithId = function(cellvalue, options, rowObject) {
        return formatLinkWithId(cellvalue,
            options.rowId,
            that.params.urls.RefDetail);
    };

    this.FormatLinkNbVehiculeDuModeleVersion = function(cellvalue, options, rowObject) {
        return formatLinkWithIdField(cellvalue,
            options.rowId,
            that.params.urls.CountVehiculesByModeleVersionWithRef,
            that.params.urls.fieldId);
    };

    this.FormatLinkTotalVehicule = function(cellvalue, options, rowObject) {
        return formatLinkWithIdField(cellvalue,
            options.rowId,
            that.params.urls.CountVehiculesByRef,
            that.params.urls.fieldId);
    };

    this.FormatLinkNbModeleVersion = function(cellvalue, options, rowObject) {
        return formatLinkWithIdField(cellvalue,
            options.rowId,
            that.params.urls.CountModeleVersionsByRef,
            that.params.urls.fieldId);
    };

    this.InitRefListing = function () {
        var params = this.params;
        var pageOptions = {
            Ressources: {
                DetailListing: {
                    Messages: {
                        DejaAjoute: params.ressource.DejaAjoute
                    },
                },
                SaveButtons: {
                    MessageOui: params.ressource.MessageOui,
                    MessageNon: params.ressource.MessageNon,
                    Fermer: params.ressource.Fermer,
                }
            },
            DataOptions: {
                UpdateStatePropertyName: params.UpdateStatePropertyName,
                ItemIsUsedPropertyIndex: params.ItemIsUsedPropertyIndex,
                ItemIsUsedPropertyName: params.ItemIsUsedPropertyName,
            },
            GetItemToAdd: this.getItemToAdd
        };

        var listingInstanceName = params.instanceName + '.Listing';
        var detailListingInstanceName = listingInstanceName + '.DetailListing';
        var listing = new PageAvecDetailListingAutoCompleteAdd(listingInstanceName, params.gridName, params.autoCompleteName, pageOptions.GetItemToAdd, pageOptions, params.editable);
        listing.DetailListing = new DetailListing(detailListingInstanceName, params.gridName, listing.FormFiller, pageOptions.DataOptions.UpdateStatePropertyName, listing.Ressources.DetailListing);
        listing.DetailListingAutoCompleteAdd = new DetailListingAutoCompleteAdd(listing.AutoCompleteOptions.Name, pageOptions.GetItemToAdd, listing.DetailListing, true, null, params.noDataJSelector);
        listing.DetailListingAutoCompleteAdd.Init();
        this.Listing = listing;
        if(params.isSavePopupsEnabled)
            initSaveButtonsPopups();
        formatGridContent();
    };
};
