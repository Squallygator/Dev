var Tab = {
    TabContainer: null,
    TabNavContainer: null,
    ButtonPreviousId: "tab-nav-prev",
    ButtonNextId: "tab-nav-next",
    TabNavDisabledClass: "tab-nav-button-disabled",
    Pas: 120,
    Init: function () {
        Tab.TabContainer = $("#tab-container.horizontal");
        Tab.TabNavContainer = $("#tab-container.horizontal div");
        Tab.ResizeTab();
        $(window).on("resize", Tab.ResizeTab);
    },
    ResizeTab: function () {
        if (Tab.TabContainer.length > 0 && Tab.TabNavContainer.length > 0) {
            if (Tab.TabNavContainer[0].scrollWidth > Tab.TabNavContainer[0].clientWidth) {
                Tab.ShowNavTab();
            } else {
                Tab.HideNavTab();
            }
        }
    },
    ShowNavTab: function () {
        if ($("#" + Tab.ButtonPreviousId).length === 0) {
            Tab.CreateNavTab();
        }

        Tab.TabNavContainer.width(Tab.TabContainer.width() - 70);

        $("#" + Tab.ButtonPreviousId).show();
        $("#" + Tab.ButtonNextId).show();

        Tab.TabContainer.find(".tab.tab-active").focus().blur();
        Tab.EnabledDisabledNavTab();

    },
    HideNavTab: function () {
        $("#" + Tab.ButtonPreviousId).hide();
        $("#" + Tab.ButtonNextId).hide();

        Tab.TabNavContainer.removeAttr("style");
    },
    CreateNavTab: function () {
        var prevTab = Tab.GetNavButton();
        var nextTab = Tab.GetNavButton();

        $(prevTab).find(".ui-icon")[0].className += " ui-icon-triangle-1-w";
        $(nextTab).find(".ui-icon")[0].className += " ui-icon-triangle-1-e";

        prevTab.id = Tab.ButtonPreviousId;
        nextTab.id = Tab.ButtonNextId;

        Tab.TabContainer.prepend(prevTab);
        Tab.TabContainer.append(nextTab);

        $(prevTab).on("click", function () {
            Tab.TabNavContainer.animate({
                scrollLeft: "-=" + Tab.Pas
            }, Tab.EnabledDisabledNavTab);

            return false;
        });

        $(nextTab).on("click", function () {
            Tab.TabNavContainer.animate({
                scrollLeft: "+=" + Tab.Pas
            }, Tab.EnabledDisabledNavTab);

            return false;
        });
    },
    EnabledDisabledNavTab: function () {
        if (Tab.TabNavContainer[0].scrollLeft === 0) {
            $("#" + Tab.ButtonPreviousId).addClass(Tab.TabNavDisabledClass);
        } else {
            $("#" + Tab.ButtonPreviousId).removeClass(Tab.TabNavDisabledClass);
        }

        var maxScrollLeft = Tab.TabNavContainer[0].scrollWidth - Tab.TabNavContainer[0].clientWidth;

        if (Tab.TabNavContainer[0].scrollLeft === maxScrollLeft) {
            $("#" + Tab.ButtonNextId).addClass(Tab.TabNavDisabledClass);
        } else {
            $("#" + Tab.ButtonNextId).removeClass(Tab.TabNavDisabledClass);
        }
    },
    GetNavButton: function () {
        var navButton = document.createElement("a");
        navButton.className = "tab tab-nav-button";
        navButton.href = "javascript: void(0);";

        var span = document.createElement("span");
        span.className = "ui-icon";
        $(navButton).append(span);

        return navButton;
    }
};