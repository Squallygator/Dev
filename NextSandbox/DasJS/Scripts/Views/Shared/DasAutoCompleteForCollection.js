/// <reference path="~/Scripts/jquery-2.1.3.js" />
/// <reference path="~/Scripts/mustache.js" />
/// <reference path="TemplateHelper.js" />
/// <reference path="notification.js" />
/// <reference path="~/Scripts/Views/Shared/utils.js" />
/// <reference path="~/Scripts/Views/Shared/_Layout.js" />
function delegateOrReturnValue(delegateFunc, value) {
    if (delegateFunc !== null && typeof delegateFunc === 'function')
        return delegateFunc;
    else
        return function () { return value; };
}
function delegateOrDefault(delegateFunc, defaultFunc) {
    if (delegateFunc !== null && typeof delegateFunc === 'function')
        return delegateFunc;
    else
        return defaultFunc;
}

function isInt(value) {
    return !isNaN(value) &&
           parseInt(Number(value)) == value && //ne pas corriger la syntaxe jshint.
           !isNaN(parseInt(value, 10));
}

var DasAutoCompleteForCollectionParameters = function (champsAutocomplete, ids, delegates, settings) {
    var thatParams = this;
    this.champsAutocomplete = champsAutocomplete;

    this.ids = {};
    this.ids.autocompleteContainer = '#ListingAddAjaxAutoCompleteFor' + this.champsAutocomplete + ' div.addAutocompleteContainer';
    this.ids.addLinkContainer = '#ListingAddAjaxAutoCompleteFor' + this.champsAutocomplete + ' div.addLinkContainer';
    this.ids.addButton = '#ListingAddAjaxAutoCompleteFor' + this.champsAutocomplete + ' div.addAutocompleteContainer a.button-add';
    this.ids.helpLinkId = null;
    $.extend(this.ids, ids);
    this.delegates = {
        getItems: function() {
            return {
                Id: thatParams.AutocompleteId.val(),
                Code: thatParams.AutocompleteId.val(),
                Libelle: thatParams.AutocompleteTxt.val(),
                Data: thatParams.delegates.getAutocompleteData(),
            };
        },
        getAutocompleteData: function() {
            return $('#' + thatParams.champsAutocomplete).data('dasAutoCompleteData');
        },
        existeDejaDansLaListe: function() { return false; },
        addItemToCollection: function() {
            return false;
        },
        checkDataAvailability: function() {
            return true;
        },
    };
    $.extend(this.delegates, delegates);
    this.settings = {
        HideAddLinkAfterClick: true,
        ManageAddLinkBehavior: true
    };
    $.extend(this.settings, settings);

    Object.defineProperty(this, "AutocompleteId", {
        get: function () {
            return $('#' + thatParams.champsAutocomplete);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(this, "AutocompleteTxt", {
        get: function () {
            return $('#' + thatParams.champsAutocomplete + '-txt');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(this, "MessageExisteDeja", {
        get: function () {
            return $('#' + thatParams.champsAutocomplete + '-MessageExisteDeja');
        },
        enumerable: true,
        configurable: true
    });
};

var DasAutoCompleteForCollection = function (parameters) {
    var that = this;
    var params = $.extend(new DasAutoCompleteForCollectionParameters(parameters.champsAutocomplete), parameters);
    this.AutocompleteId = params.AutocompleteId;
    this.AutocompleteTxt = params.AutocompleteTxt;
    this.MessageExisteDeja = params.MessageExisteDeja;
    this.ButtonPreviousId = null;
    this.ids = params.ids;
    this.settings = params.settings;
    this.delegates = {
        beforeShowAutoComplete: null,
        GetItemData: params.delegates.getItems,
        CheckAlreadyExistInCollection: delegateOrReturnValue(params.delegates.existeDejaDansLaListe, false),
        CheckDataAvailability: delegateOrReturnValue(params.delegates.checkDataAvailability, true),
        AddToCollection: params.delegates.addItemToCollection,
        GetAutocompleteData: params.delegates.getAutocompleteData,
    };

    this.HideAddLinkContainer = function() {
        if (that.settings.HideAddLinkAfterClick) $(that.ids.addLinkContainer).dkHide();
    };

    this.ShowAutoComplete = function() {
        $(that.ids.autocompleteContainer).dkShow();
    };
    this.HideAutoComplete = function() {
        $(that.ids.autocompleteContainer).dkHide();
    };

    this.ShowHelpLink = function() {
        if (that.ids.helpLinkId)
            $('#' + that.ids.helpLinkId).dkShow();
    };

    this.IsButtonDisabled = function(e) {
        // Hack : ie9
        if ($(e).hasClass("action-disabled")) {
            console.log('Hack ie9');
            var autocompleteTxt = that.AutocompleteTxt;
            autocompleteTxt.focus();
            autocompleteTxt.selector();
            //autocompleteTxt.setSelectionRange(0, autocompleteTxt.val().length);
            return true;
        }
        return false;
    };

    this.GetDataToAdd = function () {
        var id = that.AutocompleteId.val();
        if (id === '') return null;
        if (!isInt(id)) return null;

        var item = that.delegates.GetItemData(id);
        if (item.Id && item.Code) {
            item.UpdateState = UpdateState.Add;
            return item;
        }
        else
            return null;
    };

    this.ResetAutoComplete = function (videChamp) {
        that.AutocompleteId.val('');
        if (videChamp === true) that.AutocompleteTxt.val('');
        that.DisableAddButton();
        that.AutocompleteTxt.focus();
    };

    this.DisableAddButton = function () {
        $(that.ids.addButton).addClass("action-disabled");
    };

    this.EnableAddButton = function () {
        $(that.ids.addButton).removeClass("action-disabled");
    };
    this.EnableAddButtonAndFocus = function() {
        _Layout.LoadingStart();
        setTimeout(function() {
            that.EnableAddButton();
            $(that.ids.addButton).focus();
            _Layout.LoadingStop();
        }, 10);
    };

    this.events = {};

    this.events.OnAddLinkClick = function () {
        that.ShowAutoComplete();
        that.AutocompleteTxt.focus();
        that.HideAddLinkContainer();
        that.ShowHelpLink();
    };

    this.events.OnAddToCollectionClick = function () {
        if (that.IsButtonDisabled(this)) return;
        var data = that.GetDataToAdd();
        if (data !== null) {
            that.delegates.AddToCollection(data.Id, 'Id', data);
            that.ResetAutoComplete(true);
            that.ButtonPreviousId = null;
        }
    };

    this.events.OnAutoCompleteChange = function () {
        var val = that.AutocompleteId.val();
        if (val === that.ButtonPreviousId) return;
        that.ButtonPreviousId = val;

        that.DisableAddButton();
        if (val === '') return;
        if (!isInt(val)) return;
        if (that.delegates.CheckAlreadyExistInCollection(val)) {
            var existeDeja = that.MessageExisteDeja.text();
            if (existeDeja !== null && existeDeja !== '') Notification.Create(existeDeja, Notification.Ko);
            that.ResetAutoComplete(false);
            that.ButtonPreviousId = null;
            var autocompleteTxt = that.AutocompleteTxt;
            if (autocompleteTxt[0].setSelectionRange)
                autocompleteTxt[0].setSelectionRange(0, autocompleteTxt.val().length);
            return;
        }
        if (that.delegates.CheckDataAvailability(val)) {
            that.EnableAddButtonAndFocus();
        }
    };

    this.Init = function () {
        $(that.ids.addButton).click(this.events.OnAddToCollectionClick);
        if (that.settings.ManageAddLinkBehavior) $(that.ids.addLinkContainer).click(this.events.OnAddLinkClick);
        that.AutocompleteId.on('autocompleteChange', this.events.OnAutoCompleteChange);
        that.DisableAddButton();
    };
};



