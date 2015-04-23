var JqGridViewDetailComponent = function (gridName, defaultValue, newDataText, noDataTextBlock, gridContainerBlock, selectedId) {
    var that = this;
    this.gridName = gridName;
    this.defaulValue = defaultValue;
    this.newDataText = newDataText;
    this.grid = $("#" + this.gridName);
    this.noDataTextBlock = $("#" + noDataTextBlock);
    this.gridContainerBlock = $("#" + gridContainerBlock);
    this.gridContainerBlock.hide();
    this.selectedId = selectedId;

    this.grid.on("jqGridAfterGridComplete", function () {
        var ids = that.grid.getDataIDs();
        if (ids.length > 0) {
            that.showData(true);
            if (that.selectedId === undefined || that.selectedId === null || ids.length === 1 || $.inArray(that.selectedId.toString(), ids) === -1)
                that.selectedId = ids[0];
            that.setGridSelection();
        } else {
            that.showData(false);
        }
    });

    this.grid.on("jqGridSelectRow", function (e, id) {
        that.selectedId = id;
    });

    this.OnReload = function(callback) {
        that.grid.on("jqGridAfterGridComplete", callback);
    };

    this.AddRow = function () {
        that.selectedId = that.defaulValue;
        that.showData(true);
        var rowids = this.grid.getDataIDs();
        var index = $.inArray(this.defaulValue, rowids);
        if (index < 0) {
            var dataItem = {};
            that.setTextInFirstColumnNotHidden(dataItem);
            that.grid.addRowData(this.defaulValue, dataItem, "last");
        }
        that.setGridSelection();
    };

    this.Refresh = function() {
        that.grid.setGridParam({ datatype: "json" }).trigger('reloadGrid');
    };

    this.RowCount = function() {
        return that.grid.jqGrid("getGridParam", "records");
    };

    this.setGridSelection = function() {
        that.grid.setSelection(that.selectedId);
    };
    
    this.setTextInFirstColumnNotHidden = function (dataItem) {
        var columns = this.grid.getGridParam().colModel;
        for (var index = 0; index < columns.length; index++) {
            if (columns[index].hidden === false)
                break;
        }
        dataItem[columns[index].name] = this.newDataText;
    };

    this.showData = function (showData) {
        that.gridContainerBlock.toggle(showData);
        that.noDataTextBlock.toggle(!showData);
    };
};