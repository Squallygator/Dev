/// <reference path="~/Scripts/jquery-2.1.3.js" />
/// <reference path="~/Scripts/jquery-ui-1.11.3.custom.js" />
var DasAutoCompleteOptions = {
    DataKey: "dasAutoCompleteData",
    ChangeEvent: 'autocompleteChange',
    AutoInit: true,
    AjaxDataType: 'json',
    AjaxType: 'GET'
};
var DasAutoComplete = function (inputIdSelector, inputTextSelector, urlDuService, optionOverrides) {
    var myself = this;
    this.inputIdSelector = inputIdSelector;
    this.inputTextSelector = inputTextSelector;
    this.urlDuService = urlDuService;
    this.autoInit = DasAutoCompleteOptions.AutoInit;
    this.selectedObject = new Object();
    if (optionOverrides != null) {
        var autoInit = optionOverrides['AutoInit'];
        if (autoInit != null && typeof autoInit === 'boolean') this.autoInit = autoInit;
    }
    this.optionOverrides = optionOverrides;
    this.Init = function() {
        var that = this;
        var hackFocusError = "";
        var options = $.extend({}, DasAutoCompleteOptions, this.optionOverrides);
        var inputText = $(this.inputIdSelector);
        var inputId = $(this.inputTextSelector);
        if (inputText.hasClass("input-validation-error") && inputId.val().length > 0)
            hackFocusError = inputText.val();
        var resetId = function(response) {
            setId({ item: { value: '', data: null } });
            if (response !== null && typeof response === "function")
                response(null);
        };
        var resetText = function() {
            inputText.val('');
        };
        var setText = function(ui) {
            inputText.val(ui.item.label);
        };
        var setId = function(ui) {
            var oldVal = inputId.val();
            inputId.val(ui.item.value);
            inputId.data(options.DataKey, ui.item.data);
            if (oldVal != ui.item.value) //On ne test que le contenu
                inputId.trigger(options.ChangeEvent);
        };
        inputText.autocomplete({
            minLength: 1,
            source: function(request, response) {
                var searchParam = request.term;
                inputId.val('');
                $.ajax({
                    url: that.urlDuService,
                    data: { searchText: searchParam },
                    dataType: options.AjaxDataType,
                    type: options.AjaxType,
                    success: function(data) {
                        // pas de données
                        if (data === undefined || data.length === 0) {
                            resetId(response);
                            return;
                        }
                        response($.map(data, function(item) {
                            return { value: item.code, label: item.label, data: item.data };
                        }));
                    },
                    error: function(a, b, c) {
                        resetId(response);
                    }
                });
            },
            focus: function(event, ui) {
                return false;
            },
            select: function(event, ui) {
                setText(ui);
                setId(ui);
                myself.selectedObject = ui.item.data;
                return false;
            },
            change: function(event, ui) {
                if (ui.item === null && $(inputIdSelector).val() === hackFocusError) {
                    // DaL - Ici code pour gérer le moment où on prend le focus sur l'autocomplete si il est en erreur
                    // A la sortie de l'autocomplete on perd la saisie et la valeur sans ce bout de code
                    hackFocusError = "";
                    resetId();
                    return;
                } else if (ui.item === null) {
                    resetText();
                    resetId();
                } else {
                    setId(ui);
                }
            }
        });
    };
    if (this.autoInit) {
        $(document).ready(function () {
            myself.Init();
        });
    }
};