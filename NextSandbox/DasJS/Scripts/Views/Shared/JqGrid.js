var SearchFilter = {
    AlphaNum: /[^a-zA-Z 0-9 *-]/g,
    Alpha: /[^a-zA-Z *-]/g,
    Num: /[^0-9 *]/g
};
function DASJqGrid(grid, pager) {
    var that = this;
    this.Grid = grid;
    this.Pager = pager;

    if (pager) {
        // Si le pager est défini on fait le binding
        var gridInstance = this;
        pager.bindFirst(function () {
            gridInstance.FirstPage();
        });
        pager.bindPrevious(function () {
            gridInstance.PreviousPage();
        });
        pager.bindNext(function () {
            gridInstance.NextPage();
        });
        pager.bindLast(function () {
            gridInstance.LastPage();
        });
        pager.changeItemsPerPage(function (itemsPerPage) {
            gridInstance.ChangeItemsPerPage(itemsPerPage);
        });
    }

    this.Init = function (jqGridInitFunction, extendGrid) {
        if (typeof jqGridInitFunction === "function") jqGridInitFunction();
        this.RefreshPager();
        this.ResizeGrid();
        this.Grid.unbind("contextmenu");
        if (!extendGrid)
            extendGrid = {};
        var gridInstance2 = this;
        extendGrid = $.extend({ altRows: true, postData: { searchString: "value1" } }, extendGrid, {
            gridComplete: function () {
                gridInstance2.RefreshPager();
            }
        });

        this.Grid.setGridParam(extendGrid);
        this.Grid.bind('jqGridAfterInsertRow', function (event, id) {
            $(that.Grid.getGridRowById(id)).find('a[' + Tooltip.Attr.Text + ']:not([' + Tooltip.Attr.Ready + '])').tooltip();
        });
    };

    this.RefreshPager = function () {
        // Refacto  - cette logique serait plus à sa place dans le pager
        if (!this.Pager)
            return;
        var total = this.Grid.jqGrid("getGridParam", "records");
        var rowPerPage = this.Grid.jqGrid("getGridParam", "rowNum");
        var currentPage = this.Grid.jqGrid("getGridParam", "page");
        var from = total > 0 ? rowPerPage * (currentPage - 1) + 1 : 0;
        var to = rowPerPage * currentPage;
        if (to >= total) {
            to = total;
            this.Pager.buttonNext.addClass("action-disabled");
            this.Pager.buttonLast.addClass("action-disabled");
        } else {
            this.Pager.buttonNext.removeClass("action-disabled");
            this.Pager.buttonLast.removeClass("action-disabled");
        }
        if (currentPage < 2) {
            this.Pager.buttonFirst.addClass("action-disabled");
            this.Pager.buttonPrevious.addClass("action-disabled");
        } else {
            this.Pager.buttonFirst.removeClass("action-disabled");
            this.Pager.buttonPrevious.removeClass("action-disabled");
        }
        this.Pager.setTotal(total);
        this.Pager.setFrom(from);
        this.Pager.setTo(to);
    };
    this.FirstPage = function () {
        this.Grid.setGridParam({
            page: 1
        });
        this.Grid.trigger("reloadGrid");
    };
    this.PreviousPage = function () {
        var currentPage = this.Grid.getGridParam("page");
        this.Grid.setGridParam({
            page: currentPage - 1
        });
        this.ReloadGrid();
    };
    this.NextPage = function () {
        var currentPage = this.Grid.getGridParam("page");
        this.Grid.setGridParam({
            page: currentPage + 1
        });
        this.ReloadGrid();
    };
    this.LastPage = function () {
        var lastPage = this.Grid.getGridParam("lastpage");
        this.Grid.setGridParam({
            page: lastPage
        });
        this.ReloadGrid();
    };
    this.ChangeItemsPerPage = function (itemsPerPage) {
        $.cookie("itemsPerPage", itemsPerPage, { expires: 365 * 10, path: '/' });
        this.Grid.setGridParam({
            page: 1,
            rowNum: itemsPerPage
        });
        this.ReloadGrid();
    };
    this.GotoPage = function (pageIndex) {
        this.Grid.setGridParam({
            page: pageIndex
        });
        this.ReloadGrid();
    };
    this.ResizeGrid = function () {
    };
    this.ReloadGrid = function () {
        this.Grid.trigger("reloadGrid");
    };
}

var DASJqGridPager = function (buttonFirst, buttonPrevious, buttonNext, buttonLast, totalElementsDisplay, fromIndexDisplay, toIndexDisplay, itemsPerPage) {
    this.buttonFirst = buttonFirst;
    this.buttonPrevious = buttonPrevious;
    this.buttonNext = buttonNext;
    this.buttonLast = buttonLast;
    this.totalElementsDisplay = totalElementsDisplay;
    this.fromIndexDisplay = fromIndexDisplay;
    this.toIndexDisplay = toIndexDisplay;
    this.itemsPerPage = itemsPerPage;

    this.bindFirst = function (delegate) {
        this.buttonFirst.on("click", function () {
            if (!$(this).hasClass("action-disabled"))
                delegate();
        });
    };
    this.bindPrevious = function (delegate) {
        this.buttonPrevious.on("click", function () {
            if (!$(this).hasClass("action-disabled"))
                delegate();
        });
    };
    this.bindNext = function (delegate) {
        this.buttonNext.on("click", function () {
            if (!$(this).hasClass("action-disabled"))
                delegate();
        });
    };
    this.bindLast = function (delegate) {
        this.buttonLast.on("click", function () {
            if (!$(this).hasClass("action-disabled"))
                delegate();
        });
    };
    this.changeItemsPerPage = function (delegate) {
        this.itemsPerPage.on("change", function () {
            if (!$(this).hasClass("action-disabled"))
                delegate(this.value);
        });
    };

    this.setCurrentPage = function (value) {
        this.currentPageDisplay.html(value);
    };
    this.setTotal = function (value) {
        this.totalElementsDisplay.html(value);
    };
    this.setFrom = function (value) {
        this.fromIndexDisplay.html(value);
    };
    this.setTo = function (value) {
        this.toIndexDisplay.html(value);
    };
};

var DASJqGridHelper = {};
DASJqGridHelper.Build = function (zeclass, buildGrid, postData, onSelectRow, hasSearchHelper, pagerId, gridOptions) {
    var that = zeclass;
    var pagerSelector;
    var pager = null;
    if (typeof pagerId === 'string' && $.trim(pagerId)) {
        pagerSelector = $("#" + pagerId);
        if (pagerSelector !== undefined && pagerSelector.length > 0) {
            // ReSharper disable once InconsistentNaming
            pager = new DASJqGridPager(pagerSelector.find(".pager-btn-first"), pagerSelector.find(".pager-btn-previous"), pagerSelector.find(".pager-btn-next"), pagerSelector.find(".pager-btn-last"),
                pagerSelector.find(".pager-total"), pagerSelector.find(".pager-from"), pagerSelector.find(".pager-to"), pagerSelector.find("#lstItemPerPage"));
        }
    }
    // ReSharper disable once InconsistentNaming
    that.Grid = new DASJqGrid($("#" + that.GridName), pager);
    var jqGridParameters = (typeof gridOptions === "undefined") ? {} : gridOptions;
    jqGridParameters.postData = that.PostData;
    jqGridParameters.onSelectRow = onSelectRow;

    that.Grid.Init(buildGrid, jqGridParameters);

    if (hasSearchHelper) {
        that.SearchHelper = new SearchHelper(that.PatternInput, SearchFilter.AlphaNum, function() {
            that.RefreshPattern();
            console.log('that.PostData.pattern ' + that.PostData.pattern);
            that.Grid.GotoPage(1);
        });
        that.RefreshPattern();
        $(that.SearchButton).on("click", function() {
            that.RefreshPattern();
            that.Grid.GotoPage(1);
        });
    } else {
        that.Grid.GotoPage(1);
    }

    this.FixGrid(that);
};

DASJqGridHelper.FixGrid = function(zeclass) {
    $("#" + zeclass.GridName).unbind("contextmenu");
};