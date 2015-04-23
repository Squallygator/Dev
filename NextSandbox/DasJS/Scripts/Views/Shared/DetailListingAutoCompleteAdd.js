/// <reference path="~/Scripts/jquery-2.1.3.js" />
/// <reference path="~/Scripts/jquery.jqGrid.js" />
/// <reference path="~/Scripts/mustache.js" />
/// <reference path="_DetailListing.js" />
/// <reference path="TemplateHelper.js" />
/// <reference path="notification.js" />

var DetailListingAutoCompleteAdd = function(champsAutocomplete, getItems, laListJs, estCeQueJaiLeDroitDajouter, ressources, messageId) {
    this.Ressources = {

    };
    $.extend(this.Ressources, ressources);
    var that = this;
    var buttonAdd = '#ListingAddAjaxAutoCompleteFor' + champsAutocomplete + ' div.addAutocompleteContainer a.button-add';
    var champsAutocompleteId = $('#' + champsAutocomplete);
    var champsAutocompleteTxt = $('#' + champsAutocomplete + '-txt');
    var messageExisteDeja = $('#' + champsAutocomplete + '-MessageExisteDeja').text();
    this.listJs = laListJs;
    this.EstCeQueJaiLeDroitDajouter = function() { return true; };
    if (estCeQueJaiLeDroitDajouter !== null && typeof estCeQueJaiLeDroitDajouter === 'function')
        this.EstCeQueJaiLeDroitDajouter = estCeQueJaiLeDroitDajouter;
    this.getItems = getItems;

    this.AddNew = function() {
        // Hack : ie9
        if (document.addEventListener && !window.requestAnimationFrame && $(this).hasClass("action-disabled")) {
            console.log('Hack ie9');
            champsAutocompleteTxt.focus();
            champsAutocompleteTxt.select();
            //champsAutocompleteTxt.setSelectionRange(0, champsAutocompleteTxt.val().length);
            return;
        }
        var id = champsAutocompleteId.val();
        if (id === '') return;
        if (parseInt(id) === 0) return;

        var item = that.getItems();

        // Double Verification
        if (item.Id && item.Code) {
            that.listJs.AddItem(id, 'Id', item);
            champsAutocompleteId.val('');
            champsAutocompleteTxt.val('');
            $(buttonAdd).addClass("action-disabled");
            champsAutocompleteTxt.focus();
            $('#gbox_' + that.listJs.gridName).parent().dkShow();
            $(messageId).dkHide();
        }
    };

    this.ExisteDejaDansLaListe = function(val) {
        var line = that.listJs.GetLine(val);
        return (line !== null && line.length > 0);
    };

    this.OnAutoCompleteChange = function() {
        var val = champsAutocompleteId.val();
        $(buttonAdd).addClass("action-disabled");
        if (val === '') return;
        if (parseInt(val) === 0) return;
        if (that.ExisteDejaDansLaListe(val) || !that.EstCeQueJaiLeDroitDajouter(val)) {
            if (messageExisteDeja !== null && messageExisteDeja !== '') Notification.Create(messageExisteDeja, Notification.Ko);
            champsAutocompleteId.val('');
            champsAutocompleteTxt.focus();
            if (champsAutocompleteTxt[0].setSelectionRange)
                champsAutocompleteTxt[0].setSelectionRange(0, champsAutocompleteTxt.val().length);
            return;
        }
        $(buttonAdd).removeClass("action-disabled");
    };

    this.Init = function() {
        $(buttonAdd).click(this.AddNew);
        $(buttonAdd).addClass("action-disabled");
        champsAutocompleteId.on('autocompleteChange', this.OnAutoCompleteChange);
    };
};

var SaveButtons = function(confirmMessageSelector, saveButtonSelector, saveAndGotoNextOngletButtonSelector, ressources) {
    var that = this;
    var defaultRessources = {
        MessageOui: '§Oui',
        MessageNon: '§Non',
        Fermer: '§Fermer'
    };
    this.Submit = function() {
        this.form.submit();
    };

    this.CloseConfirm = function() {
        that.JConfirmMessage.dialog("close");
    };

    this.ConfirmSave = function() {
        that.JConfirmMessage.dialog({
            resizable: false,
            height: "auto",
            modal: true,
            buttons:
            [
                { text: that.ressource.MessageOui, click: that.HasSaveAndGotoNextOngletButton ? that.SaveAndGotoNextOnglet : that.Save },
                { text: that.ressource.MessageNon, click: that.CloseConfirm }
            ],
            closeText: that.ressource.Fermer
        });
        return false;
    };

    this.Save = function() {
        that.Submit();

    };

    this.SaveAndGotoNextOnglet = function() {
        // todo : a faire
        that.Save();
    };

    this.Init = function() {
        this.ressource = $.extend(defaultRessources, ressources);
        this.JConfirmMessage = $(confirmMessageSelector);
        this.JSaveButton = $(saveButtonSelector);
        this.JSaveAndGotoNextOngletButton = $(saveAndGotoNextOngletButtonSelector);
        this.HasConfirmMessage = this.JConfirmMessage !== null && this.JConfirmMessage.length > 0;
        this.HasSaveAndGotoNextOngletButton = this.JSaveAndGotoNextOngletButton !== null && this.JSaveAndGotoNextOngletButton.length > 0;
        this.form = null;

        if (this.JSaveButton !== null && this.JSaveButton.length > 0) {
            this.form = this.JSaveButton.closest('form');
            var saveAction = this.HasConfirmMessage ? this.ConfirmSave : this.Save;
            this.JSaveButton.click(saveAction);
        }
        if (this.HasSaveAndGotoNextOngletButton) {
            var saveAction2 = this.HasConfirmMessage ? this.ConfirmSave : this.SaveAndGotoNextOnglet;
            this.JSaveAndGotoNextOngletButton.click(saveAction2);
        }
    };

    this.Init();
};

var PageAvecDetailListingAutoCompleteAddDefaultOptions = {
    DataOptions: {
        DeltaArrayName: "DeltaList",
        IdPropertyName: 'Id',
        UpdateStatePropertyName: 'UpdateState',

        ItemIsUsedPropertyIndex: 4,
        ItemIsUsedPropertyName: 'NbVOModeleVersion',

        TemplateId: '#DeltaListTemplate',
        Target: '#DeltaListTarget',
    },
    SaveButtonsOptions: {
        ConfirmMess: '#msg-confirm',
        SaveBtn: '#save',
        SaveAndContinueBtn: '#SaveAndContinue',
    },
    Ressources: {
        DetailListing: {
            Messages: {
                DejaAjoute: "@(ressource.DejaAjoute)"
            },
        },
        SaveButtons: {
            MessageOui: '@(ressource.MessageOui)',
            MessageNon: '@(ressource.MessageNon)',
            Fermer: '@(ressource.Fermer)',
        }
    },
    Templates: {
        UndoButtonTemplate: "#UndoButtonTemplate",
        UndoAddButtonTemplate: "#UndoAddButtonTemplate",
        DeleteButtonTemplate: "#DeleteButtonTemplate",
        Transform: TemplateHelper.Transform,
        Fill: TemplateHelper.Fill
    },
    TriggerInitOnDocumentReady: true
};

var PageAvecDetailListingAutoCompleteAdd = function (instanceName, gridName, autoCompleteName, getItemToAdd, options, editable) {
    // Options par Defaut
    $.extend(this, PageAvecDetailListingAutoCompleteAddDefaultOptions);

    var that = this;

    this.SaveButtons = null;
    this.DetailListingAutoCompleteAdd = null;
    this.editable = typeof editable !== "undefined" ? editable : true;

    // Prise en comptes des parametres
    this.InstanceName = instanceName;
    this.ListingOptions = {
        Name: gridName,
        DetailListingInstanceName: instanceName + '.DetailListing'
    };

    this.AutoCompleteOptions = {
        Name: autoCompleteName,
    };

    this.DataOptions.GetItemToAdd = getItemToAdd;

    this.FormFiller = function (item) {
        that.Templates.Fill(item, that.DataOptions.TemplateId, that.DataOptions.Target);
    };

    this.FormatSupprimerBouton = function (cellvalue, gridOptions, rowObject) {
        var id;
        var estUtilise;
        var isUsedStatIndex = that.DataOptions.ItemIsUsedPropertyIndex;
        var isUsedStatKeyName = that.DataOptions.ItemIsUsedPropertyName;
        if (Object.prototype.toString.call(rowObject) === '[object Array]') {
            estUtilise = (cellvalue !== DefaultUpdateState.Add && (parseInt(rowObject[isUsedStatIndex]) > 0));
        } else {
            estUtilise = (cellvalue !== DefaultUpdateState.Add && parseInt(rowObject[isUsedStatKeyName]) > 0);
        }
        id = gridOptions.rowId;
        var data = {
            id: id,
            estUtilise: estUtilise,
            EstAjout: cellvalue === DefaultUpdateState.Add,
            EstDelete: cellvalue === DefaultUpdateState.Delete,
            EstNone: cellvalue === DefaultUpdateState.None,
            JsClass: that.ListingOptions.DetailListingInstanceName
        };
        var templates = that.Templates;

        cellvalue = that.editable ? cellvalue : '';

        switch (cellvalue) {
        case DefaultUpdateState.Delete:
            that.DetailListing.HighlightLine(id, false);
            return templates.Transform(data, templates.UndoButtonTemplate);
        case DefaultUpdateState.Add:
            that.DetailListing.HighlightLine(id, true);
            return templates.Transform(data, templates.UndoAddButtonTemplate);
        case DefaultUpdateState.None:
            return templates.Transform(data, templates.DeleteButtonTemplate);
        default:
            return cellvalue;
        }
    };

    if (options !== null) {
        $.extend(this.ListingOptions, options['ListingOptions']);
        $.extend(this.AutoCompleteOptions, options['AutoCompleteOptions']);
        $.extend(this.FormOptions, options['FormOptions']);
        $.extend(this.DataOptions, options['DataOptions']);
        $.extend(this.SaveButtonsOptions, options['SaveButtonsOptions']);
        if (options['Ressources'] !== null) {
            $.extend(this.Ressources.DetailListing, options.Ressources['DetailListing']);
            $.extend(this.Ressources.SaveButtons, options.Ressources['SaveButtons']);
        }
    }
    // this.DetailListing = new DetailListing(this.DetailListingInstanceName, this.ListingOptions.Name, this.FormFiller, this.DataOptions.UpdateStatePropertyName, this.Ressources.DetailListing);


    //this.Init = function () {
    //    //that.DetailListingAutoCompleteAdd = new DetailListingAutoCompleteAdd(that.AutoCompleteOptions.Name, that.DataOptions.GetItemToAdd, that.DetailListing);
    //    //that.DetailListingAutoCompleteAdd.Init();
    //    // that.SaveButtons = new SaveButtons(that.SaveButtonsOptions.ConfirmMess, that.SaveButtonsOptions.SaveBtn, that.SaveButtonsOptions.SaveAndContinueBtn, that.Ressources.SaveButtons);
    //};

    //if (this.TriggerInitOnDocumentReady) {
    //    $(document).ready(function () {
    //        that.Init();
    //    });
    //}
};