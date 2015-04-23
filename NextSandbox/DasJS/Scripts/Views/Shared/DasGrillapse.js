var DasGrillapseIds = function () {
    this.EmptyMessage = 'EmptyMessage';

    this.Group = {};
    this.Group.Container = 'Container';
    this.Group.ItemPrefix = 'ItemPrefix';
    this.Group.ItemTablePrefix = 'ItemTablePrefix';

    this.Detail = {};
    this.Detail.ItemPrefix = 'ItemPrefix';
};

var DasGrillapseDelegates = function() {
    this.GetGroupFor = function(id, propId, data) {
        //return data
    };
    this.BuildGroupContent = function(groupId, libelleGroup, isWholeGroupInserted) {
        return '<div class="title"><span class="ui-icon"></span>' + libelleGroup + ' <span class="total">(1)</span></div>';
    };
    this.BuildDetailCols = function(id, data) {
        var content = '';
        for (var prop in data) {
            content += '<td>' + data[prop] + '/<td>';
        }
    };
};
var DasGroupedList = function(groupContainerJSelector) {
    var that = this;

    // Events 
    this.events = {};
    this.events.onGroupTitleClick = function() {
        var parent = $(this).parent();
        var icon = $('.title .ui-icon', parent);
        var group = $('table', parent);
        if (icon.dkIsExpanded()) {
            group.dkHide();
            icon.dkIconCollapse();
        } else {
            group.dkShow();
            icon.dkIconExpand();
        }
    };
    this.events.stopPropagation= function(event) {
        event.stopPropagation();
    };


    this.CollapseAll = function() {
        $(groupContainerJSelector + ' table').dkHide();
        $(groupContainerJSelector + ' .title .ui-icon').dkIconCollapse();
    };

    this.ExpandAll = function() {
        $(groupContainerJSelector + ' table').dkShow();
        $(groupContainerJSelector + ' .title .ui-icon').dkIconExpand();
    };

    this.ContextualInitGroupedList = function(contextLi) {
        $('div.title', contextLi).click(that.events.onGroupTitleClick);
        $('div.title a', contextLi).on("click", that.events.stopPropagation);
        $('.modele-Action', contextLi).on("click", that.events.stopPropagation);
    };

    this.InitGroupedList = function() {
        that.ExpandAll();
        that.ContextualInitGroupedList($(groupContainerJSelector + ' li'));
    };
};

var DasGrillapse = function (instanceName, ids, delegates) {

    // Properties
    if (ids instanceof DasGrillapseIds) {
        this.ids = ids;
    }
    else {
        this.ids = new DasGrillapseIds();
        $.extend(true, this.ids, ids);
    }
    DasGroupedList.call(this, '#' + this.ids.Group.Container);
    
    var that = this;

    if (delegates instanceof DasGrillapseDelegates) {
        this.delegates = delegates;
    }
    else {
        this.delegates = new DasGrillapseDelegates();
        $.extend(true, this.delegates, delegates);
    }

    this.TableLists = new DasDictionary();
    
    this.ShowOrHideEmptyMessage = function () {
        if ($('#' + that.ids.Group.Container + ' table tr').length > 0)
            $('#' + that.ids.EmptyMessage).dkHide();
        else
            $('#' + that.ids.EmptyMessage).dkShow();
    };

    // private Methods
    var getOrCreateGroupTableList = function (groupId) {
        var gtl = that.TableLists.Get(groupId);
        if (gtl == null) {
            var dtlParams = new DasTableListParams();
            dtlParams.TableId = that.ids.Group.ItemTablePrefix + '-' + groupId;
            dtlParams.EmptyTable = null;
            dtlParams.TrIdPrefix = that.ids.Detail.ItemPrefix;
            dtlParams.InputName = null;
            var dtlDelegates = new DasTableListDelegates();
            dtlDelegates.BuildCols = that.delegates.BuildDetailCols;
            gtl = new DasTableList(dtlParams, dtlDelegates);
            that.TableLists.Set(groupId, gtl);
        }
        return gtl;
    };

    var getItem = function (id) {
        return $('#' + that.ids.Detail.ItemPrefix + '-' + id);
    };

    var getItemGroupId = function (id) {
        var item = getItem(id);
        var parent = item.closest('table');
        return parseInt($(parent)[0].id.split('-')[1]);
    };

    var getGroup = function (groupId) {
        return $('#' + that.ids.Group.ItemPrefix + '-' + groupId);
    };

    var setGroupCount = function (groupId, count) {
        $('span.total', getGroup(groupId)).html('(' + count + ')');
    };

    var setGroupDeleteUrl = function (groupId, count) {
        $('span#deleteModele', getGroup(groupId)).html('(' + count + ')');
    };

    // public Methods
    this.Add = function (groupId, id, data, className) {
        if (!that.AlreadyExists(id)) {
            var groupTableList = getOrCreateGroupTableList(groupId);
            if (groupTableList != null) {
                groupTableList.Add(id, null, data, className);
                setGroupCount(groupId, groupTableList.Count());
                setGroupDeleteUrl(groupId, groupTableList.Count());
            }
            that.ShowOrHideEmptyMessage();
        }
    };

    this.AddGroup = function (groupId, libelleGroup, isWholeGroupInserted, className) {
        if (className == null) className = ClassUtils.UpdateState.Added;
        if (!that.GroupAlreadyExists(groupId)) {
            $('#' + that.ids.Group.Container).prepend('<li id="' + that.ids.Group.ItemPrefix + '-' + groupId + '" class="' + className + '">');
            var group = getGroup(groupId);
            group.append(that.delegates.BuildGroupContent(groupId, libelleGroup, isWholeGroupInserted));
            $('div span.ui-icon', group).dkIconExpand();
            var gt = getOrCreateGroupTableList(groupId);
            group.append(gt.GetTableHtml());
            that.ContextualInitGroupedList(group);
        }
        getGroup(groupId).dkShow();
    };

    this.Remove = function (id) {
        if (that.AlreadyExists(id)) {
            var groupId = getItemGroupId(id);
            var groupTableList = getOrCreateGroupTableList(groupId);
            if (groupTableList !== null) {
                groupTableList.Remove(id);
                var length = groupTableList.Count();
                if (length === 0)
                    that.RemoveParentGroup(groupId);
                else
                    setGroupCount(groupId, length);
            }
            that.ShowOrHideEmptyMessage();
        }
    };

    this.RemoveGroup = function (groupId, data) {
        var groupTableList = getOrCreateGroupTableList(groupId);
        if (groupTableList !== null) {
            groupTableList.Remove(groupId);
        }
    };

    this.RemoveParentGroup = function (groupId) {
        that.TableLists.Delete(groupId);
        getGroup(groupId).remove();
        that.ShowOrHideEmptyMessage();
    };

    this.AlreadyExists = function (id) {
        return getItem(id).length > 0;
    };

    this.GroupAlreadyExists = function (groupId) {
        return getGroup(groupId).length > 0;
    };


    this.Init = function () {
        that.ShowOrHideEmptyMessage();
        that.InitGroupedList();
    };

    this.InitData = function(initialData, groupIdProp, groupLibProp, itemIdProd) {
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
                //jsonData['UpdateState'] = UpdateState.None;
                that.AddGroup(jsonData[groupIdProp], jsonData[groupLibProp], false, '');
                that.Add(jsonData[groupIdProp], jsonData[itemIdProd], jsonData, className);
            }
        }
    };
};