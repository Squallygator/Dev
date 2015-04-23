/// <reference path="~/Scripts/jquery-2.1.3.js" />
/// <reference path="~/Scripts/jquery-ui-1.11.3.custom.js" />
var DasAutoCompleteOptions = {
    DataKey: "dasAutoCompleteData",
    ChangeEvent: 'autocompleteChange',
    AutoInit: true,
    AjaxDataType: 'json',
    AjaxType: 'GET',
    MinLength: 1
};
var DasTextAutoComplete = function (inputTextSelector, urlDuService, optionOverrides) {
    var myself = this;
    this.inputTextSelector = inputTextSelector;
    this.urlDuService = urlDuService;
    this.autoInit = DasAutoCompleteOptions.AutoInit;
    this.selectedObject = new Object();
    if (optionOverrides) {
        var autoInit = optionOverrides['AutoInit'];
        if (autoInit && typeof autoInit === 'boolean') this.autoInit = autoInit;
    }
    this.optionOverrides = optionOverrides;
    this.Init = function() {
        var that = this;
        var options = $.extend(true, {}, DasAutoCompleteOptions, this.optionOverrides);
        var inputText = $(this.inputTextSelector);
        var setText = function(ui) {
            inputText.val(ui.item.label);
        };

        inputText.autocomplete({
            minLength: options.MinLength,
            source: function(request, response) {
                var searchParam = request.term;
                $.ajax({
                    url: that.urlDuService,
                    data: { searchText: searchParam },
                    dataType: options.AjaxDataType,
                    type: options.AjaxType,
                    success: function(data) {
                        // pas de données
                        if (data === undefined || data.length === 0) {
                            return;
                        }
                        response($.map(data, function(item) {
                            return { value: item.code, label: item.label, data: item.data };
                        }));
                    },
                    error: function(a, b, c) {
                    }
                });
            },
            focus: function(event, ui) {
                return false;
            },
            select: function(event, ui) {
                setText(ui);
                myself.selectedObject = ui.item.data;
                return false;
            },
        });
    };
    if (this.autoInit) {
        $(document).ready(function () {
            myself.Init();
        });
    }
};