/// <reference path="../../jquery-1.11.0.js" />
/// <reference path="../../mustache.js" />
/// <reference path="TemplateHelper.js" />
/// <reference path="notification.js" />
/// <reference path="DasAutoCompleteForCollection.js" />
/// <reference path="tooltip.js" />
/// <reference path="utils.js" />

var DasTableListParams = function () {
    this.Ressources = {
        CancelTooltip: '',
        Cancel: ''
    };
    this.TableId = 'TableId';
    this.TrIdPrefix = 'Prefix';
    this.InputName = 'InputName';
    this.EmptyTableId = 'EmptyTableId';
};

var DasTableListDelegates = function () {
    this.BuildCols = function (id, data) {
        var content = '';
        if (!data) return;
        for (var prop in data) {
            content += '<td>' + data[prop] + '/<td>';
        }
    };
};

var DasTableList = function (parametres, delegates) {
    var that = this;

    // Properties
    var params;
    if (parametres instanceof DasTableListParams) {
        params = parametres;
    }
    else {
        params = new DasTableListParams();
        $.extend(true, params, parametres);
    }
    if (delegates instanceof DasTableListDelegates) {
        this.delegates = delegates;
    }
    else {
        this.delegates = new DasTableListDelegates();
        $.extend(true, this.delegates, delegates);
    }

    this.Data = new DasDictionary();

    this.Ressources = {
        CancelTooltip: '',
        Cancel: ''
    };

    // Events 
    // private Methods
    var showHideEmptyMessage = function () {
        if (that.Count() === 0)
            $('#' + params.EmptyTableId).dkShow();
        else
            $('#' + params.EmptyTableId).dkHide();
    };

    var getLine = this.GetLine = function(id) {
        return $('#' + params.TrIdPrefix + '-' + id);
    };

    var setupTooltips = function () {
        $('#' + params.TableId + ' a[' + Tooltip.Attr.Text + ']:not([' + Tooltip.Attr.Ready + '])').tooltip();
    };


    // public Methods

    this.GetTableHtml = function () {
        return '<table id="' + params.TableId + '" class="das-table with-alternate-row"><tbody></tbody></table>';
    };
    this.GetLine = getLine;
    this.Add = function (id, propId, data, className) {
        if (className == null) className = ClassUtils.UpdateState.Added;
        var tabClientBody = $('table#' + params.TableId + ' tbody');
        tabClientBody.prepend('<tr class="' + className + '" id="' + params.TrIdPrefix + '-' + id + '"></tr>');
        that.Data.Set(id, data);
        getLine(id).append(that.delegates.BuildCols(id, data));
        setupTooltips();
        showHideEmptyMessage();
    };

    this.Remove = function (id) {
        var data = this.Data.Get(id);
        var line = getLine(id);
        switch (data['UpdateState']) {
            case UpdateState.Add:
                that.Data.Delete(id);
                line.remove();
                showHideEmptyMessage();
                break;
            case UpdateState.Delete:
                data.UpdateState = UpdateState.None;
                line.empty();
                line.removeClass(ClassUtils.UpdateState.Deleted);
                line.append(that.delegates.BuildCols(id, data));
                setupTooltips();
                break;
            case UpdateState.None:
            default:
                data.UpdateState = UpdateState.Delete;
                line.empty();
                line.addClass(ClassUtils.UpdateState.Deleted);
                line.append(that.delegates.BuildCols(id, data));
                setupTooltips();
                break;
        }
    };

    this.RemoveAll = function () {
        var trs = $('table#' + params.TableId + ' tbody tr').remove();
        this.Data.DeleteAll();
        showHideEmptyMessage();
    };

    this.AlreadyExists = function (id) {
        return getLine(id).length > 0;
    };

    this.Count = function () {
        return $('table#' + params.TableId + ' tbody tr').length;
    };

    this.initData = function(initialData, propIdName) {
        if (initialData !== null && initialData.length > 0) {
            for (var i = initialData.length - 1; i >= 0; i--) {
                var jsonData = initialData[i];
                var className = '';
                switch (jsonData['UpdateState']) {
                case UpdateState.Add:
                    className = ClassUtils.UpdateState.Added;
                    break;
                case UpdateState.Delete:
                    className = ClassUtils.UpdateState.Deleted;
                    break;
                default:
                    className = '';
                }
                that.Add(jsonData[propIdName], null, jsonData, className);
            }
        }
    };

    // Init
    showHideEmptyMessage();
};
