/// <reference path="../../jquery-1.11.0.js" />
/// <reference path="../../jquery.jqGrid.js" />
/// <reference path="~/Scripts/mustache.js" />
/// <reference path="TemplateHelper.js" />
/// <reference path="tooltip.js" />
/// <reference path="utils.js" />
if (!String.prototype.trim) {
    String.prototype.trim = function() {
        return this.replace(/^\s+|\s+$/g, '');
    };
}

var DefaultUpdateState = { None: 0, Add: 1, Delete: 2 };

var DetailListing = function(instanceName, gridName, formFiller, updateStatePropertyName, options) {
    var that = this;
    options = options || {};
    var detailListingDefaultOptions = {
        State: DefaultUpdateState,
        Class: {
            Add: 'added',
            Delete: 'deleted'
        },
        Messages: {
            BtnAnnule: '§annuler',
            DejaAjoute: "Déjà ajouté"
        }
    };
    this.instanceName = instanceName;
    this.gridName = gridName;
    this.formFiller = formFiller;
    this.elements = [];
    this.grid = null;
    this.options = $.extend(detailListingDefaultOptions, options);
    this.UpdateStatePropertyName = updateStatePropertyName;
};

DetailListing.prototype.GetGrid = function() {
    if (this.grid === null)
        this.grid = $('#' + this.gridName);
    return this.grid;
};

DetailListing.prototype.getElements = function() {
    var results = {
        elements: []
    };
    var i = 0;
    if (!this.elements) return results;
    for (var key in this.elements) {
        var item = this.elements[key];
        results.elements.push($.extend({ index: i }, item));
        i++;
    }
    return results;
};

DetailListing.prototype.GetLine = function(id) {
    var tr = this.GetGrid().getGridRowById(id);
    return $(tr);
};

DetailListing.prototype.HighlightLine = function(id, addOrDelete) {
    var className = addOrDelete ? this.options.Class.Add : this.options.Class.Delete;
    var parentTr = this.GetLine(id);
    if (parentTr === null || parentTr.length === 0) return;
    parentTr.addClass(className);
};

DetailListing.prototype.BuildHtml = function () {
    if (this.formFiller !== null && typeof this.formFiller === 'function')
        this.formFiller(this.getElements());
};

DetailListing.prototype.AddItem = function(id, key, item) {
    var gridData = this.GetGrid().getRowData(id);
    if (gridData != null && gridData[key] != null) {
        alert(this.options.Messages.DejaAjoute);
        return;
    }
    item[this.UpdateStatePropertyName] = this.options.State.Add;
    this.elements[id] = item;
    this.GetGrid().addRowData(id, item, "first");
    this.HighlightLine(id, true);
    this.BuildHtml();
};

DetailListing.prototype.DeleteItem = function(id) {
    var item = this.GetGrid().jqGrid('getRowData', id);
    item[this.UpdateStatePropertyName] = this.options.State.Delete;
    this.elements[id] = item;
    this.GetGrid().setRowData(id, item);
    this.OnLoadComplete();
    this.BuildHtml();
};

DetailListing.prototype.UndoItem = function(id) {
    var current = this.elements[id];
    var etat = current[this.UpdateStatePropertyName];
    var parentTr = this.GetLine(id);
    if (etat === this.options.State.Add) {
        this.GetGrid().delRowData(id);
    }
    if (etat === this.options.State.Delete) {
        current[this.UpdateStatePropertyName] = this.options.State.None;
        this.GetGrid().setRowData(id, current);
        parentTr.removeClass(this.options.Class.Delete);
        this.OnLoadComplete();
    }
    delete this.elements[id];
    this.BuildHtml();
};

DetailListing.prototype.OnLoadComplete = function() {
    $('#' + this.gridName + ' a[' + Tooltip.Attr.Text + ']:not([' + Tooltip.Attr.Ready + '])').tooltip();
    $('#' + this.gridName + ' a[' + Tooltip.Attr.Text + ']').closest('td[role=gridcell][title]').removeAttr('Title');
};