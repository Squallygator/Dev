//// jQuery Plugin Toggle
//// version 1.2

//(function ($) {
//    $.dasToggle = function (element, options) {
//        var defaults = {
//            positiveMsg: 'Yes',
//            negativeMsg: 'No',
//            active: false,
//            ressName: 'valid-radio',
//            mainClassName: 'radiobutton-data',
//            classTypeActive: '-active',
//            classTypeInactive: '-inactive',
//            classLibRadio: 'lib-radio',
//            classHighlight: '-highlight'
//        }

//        var plugin = this;
//        plugin.settings = {}
//        var $element = $(element), element = element;

//        //Private methods
//        function init() {
//            if (options === null || options === "undefined") {
//                plugin.settings = defaults;
//                return;
//            }
//            plugin.settings = $.extend({}, defaults, options);
//            $element.addClass(defaults.mainClassName);
//            build(element);
//            autoResize(element);
//            defaultState(element);
//            eventClick(element);
//        }

//        function build(myElement) {
//            var parent = $("#" + myElement.id);

//            createElement('div', parent, defaults.classTypeActive);
//            createElement('input', parent, defaults.classTypeActive);
//            createElement('label', parent, defaults.classTypeActive);

//            createElement('div', parent, defaults.classTypeInactive);
//            createElement('input', parent, defaults.classTypeInactive);
//            createElement('label', parent, defaults.classTypeInactive);
//        }

//        function createElement(myElement, myParentElement, myType) {
//            var item;
//            item = document.createElement(myElement);

//            if ($(item).is('div')) {
//                if (myType === defaults.classTypeActive) {
//                    setAttr('class', defaults.mainClassName + defaults.classTypeActive, item);
//                } else {
//                    setAttr('class', defaults.mainClassName + defaults.classTypeInactive, item);
//                }
//                appendTo(item, myParentElement, false, myType);
//            }

//            if ($(item).is('input')) {
//                setAttr('id', plugin.settings.ressName + myType, item);
//                setAttr('name', plugin.settings.ressName, item);
//                setAttr('type', 'radio', item);
//                appendTo(item, myParentElement, true, myType);
//            }

//            if ($(item).is('label')) {
//                setAttr('for', plugin.settings.ressName + myType, item);
//                setAttr('class', defaults.classLibRadio, item);
//                writeHtml(item, myType);
//                appendTo(item, myParentElement, true, myType);
//            }
//        }

//        function setAttr(myAttr, myValue, myElement) {
//            myElement.setAttribute(myAttr, myValue);
//        }

//        function appendTo(myElement, myParent, isChildren, myType) {
//            if (isChildren === true) {
//                if (myType === defaults.classTypeActive) {
//                    $(myElement).prependTo(myParent.children("." + defaults.mainClassName + defaults.classTypeActive));
//                } else {
//                    $(myElement).prependTo(myParent.children("." + defaults.mainClassName + defaults.classTypeInactive));
//                }
//            } else {
//                $(myElement).prependTo(myParent);
//            }
//        }

//        function writeHtml(myElement, myType) {
//            if (myType === defaults.classTypeActive) {
//                $(myElement).html(plugin.settings.positiveMsg);
//            } else {
//                $(myElement).html(plugin.settings.negativeMsg);
//            }
//        }

//        function autoResize(myElement) {
//            var activeDivWidth = $(myElement).find('div.' + defaults.mainClassName + defaults.classTypeActive);
//            var inactiveDivWidth = $(myElement).find('div.' + defaults.mainClassName + defaults.classTypeInactive);
//            var widthDefault = activeDivWidth.width() > inactiveDivWidth.width() ? activeDivWidth.width() : inactiveDivWidth.width();

//            activeDivWidth.width(Math.round(widthDefault));
//            inactiveDivWidth.width(Math.round(widthDefault));

//            var paddingDivActiveLeft = activeDivWidth.css('padding-left') === undefined ? 0 : Number(activeDivWidth.css('padding-left').replace('px', ''));
//            var paddingDivActiveRight = activeDivWidth.css('padding-right') === undefined ? 0 : Number(activeDivWidth.css('padding-right').replace('px', ''));
//            var paddingDivInactiveLeft = inactiveDivWidth.css('padding-left') === undefined ? 0 : Number(inactiveDivWidth.css('padding-left').replace('px', ''));
//            var paddingDivInactiveRight = inactiveDivWidth.css('padding-right') === undefined ? 0 : Number(inactiveDivWidth.css('padding-right').replace('px', ''));

//            var widthDiv = widthDefault + (paddingDivActiveLeft + paddingDivActiveRight) + widthDefault + (paddingDivInactiveLeft + paddingDivInactiveRight);
//            $(myElement).width(Math.round(widthDiv));
//        }

//        function defaultState(myElement) {
//            var activeDiv = $(myElement).find("." + defaults.mainClassName + defaults.classTypeActive);
//            var inactiveDiv = $(myElement).find("." + defaults.mainClassName + defaults.classTypeInactive);
//            if (plugin.settings.active) {
//                inactiveDiv.css("color", "transparent");
//                activeDiv.removeClass(defaults.mainClassName + defaults.classTypeActive).addClass(defaults.mainClassName + defaults.classTypeActive + defaults.classHighlight);
//                activeDiv.children("#" + plugin.settings.ressName + defaults.classTypeActive).prop("checked", true);
//                activeDiv.children("#" + plugin.settings.ressName + defaults.classTypeActive).prop("defaultChecked", true);
//            } else {
//                activeDiv.css("color", "transparent");
//                inactiveDiv.removeClass(defaults.mainClassName + defaults.classTypeInactive).addClass(defaults.mainClassName + defaults.classTypeInactive + defaults.classHighlight);
//                inactiveDiv.children("#" + plugin.settings.ressName + defaults.classTypeInactive).prop("checked", true);
//                inactiveDiv.children("#" + plugin.settings.ressName + defaults.classTypeInactive).prop("defaultChecked", true);
//            }

//            activeDiv.children("#" + plugin.settings.ressName + defaults.classTypeActive).attr('value', 'True');
//            inactiveDiv.children("#" + plugin.settings.ressName + defaults.classTypeInactive).attr('value', 'False');
//        }

//        function eventClick(myElement) {
//            if (plugin.settings.active) {
//                var activeDiv = $(myElement).find("." + defaults.mainClassName + defaults.classTypeActive + defaults.classHighlight);
//                var inactiveDiv = $(myElement).find("." + defaults.mainClassName + defaults.classTypeInactive);
//            }
//            else {
//                var activeDiv = $(myElement).find("." + defaults.mainClassName + defaults.classTypeActive);
//                var inactiveDiv = $(myElement).find("." + defaults.mainClassName + defaults.classTypeInactive + defaults.classHighlight);
//            }

//            activeDiv.on("click", function (e) {
//                e.preventDefault();
//                $("#" + myElement.id).focus();
//                toggleMyElement(activeDiv, inactiveDiv);
//            });
//            inactiveDiv.on("click", function (e) {
//                e.preventDefault();
//                $("#" + myElement.id).focus();
//                toggleMyElement(activeDiv, inactiveDiv);
//            });

//            $("#" + myElement.id).on("keydown", function (e) {
//                if (e.keyCode === 32) {
//                    // appui sur espace
//                    toggleMyElement(activeDiv, inactiveDiv);
//                }
//            });

//        }

//        function toggleMyElement(activeDiv, inactiveDiv) {
//            if (inactiveDiv.children("#" + plugin.settings.ressName + defaults.classTypeInactive).prop("checked")) {
//                activeToggle(activeDiv, inactiveDiv);
//            } else {
//                inactiveToggle(activeDiv, inactiveDiv);
//            }
//        }

//        function activeToggle(activeDiv, inactiveDiv) {
//            activeDiv.removeClass(defaults.mainClassName + defaults.classTypeActive).addClass(defaults.mainClassName + defaults.classTypeActive + defaults.classHighlight);
//            inactiveDiv.removeClass(defaults.mainClassName + defaults.classTypeInactive + defaults.classHighlight).addClass(defaults.mainClassName + defaults.classTypeInactive);
//            activeDiv.css("color", "");
//            inactiveDiv.css("color", "transparent");
//            activeDiv.children("#" + plugin.settings.ressName + defaults.classTypeActive).prop("checked", true);
//            inactiveDiv.children("#" + plugin.settings.ressName + defaults.classTypeInactive).prop("checked", false);
//        }

//        function inactiveToggle(activeDiv, inactiveDiv) {
//            inactiveDiv.removeClass(defaults.mainClassName + defaults.classTypeInactive).addClass(defaults.mainClassName + defaults.classTypeInactive + defaults.classHighlight);
//            activeDiv.removeClass(defaults.mainClassName + defaults.classTypeActive + defaults.classHighlight).addClass(defaults.mainClassName + defaults.classTypeActive);
//            inactiveDiv.css("color", "");
//            activeDiv.css("color", "transparent");
//            activeDiv.children("#" + plugin.settings.ressName + defaults.classTypeActive).prop("checked", false);
//            inactiveDiv.children("#" + plugin.settings.ressName + defaults.classTypeInactive).prop("checked", true);
//        }

//        this.toggle = function () {
//            var activeDiv;
//            var inactiveDiv;
//            var selectorActiveDiv = "." + defaults.mainClassName + defaults.classTypeActive;
//            var selectorInactiveDiv = "." + defaults.mainClassName + defaults.classTypeInactive;

//            if (this.isActive()) {
//                activeDiv = $(element).find(selectorActiveDiv + defaults.classHighlight);
//                inactiveDiv = $(element).find(selectorInactiveDiv);
//                inactiveToggle(activeDiv, inactiveDiv);
//            } else {
//                activeDiv = $(element).find(selectorActiveDiv);
//                inactiveDiv = $(element).find(selectorInactiveDiv + defaults.classHighlight);
//                activeToggle(activeDiv, inactiveDiv); 
//            }
//        }

//        this.isActive = function () {
//            return $(element).find("#" + this.settings.ressName + "-active").prop("checked");
//        }

//        this.isInactive = function () {
//            return $(element).find("#" + this.settings.ressName + "-inactive").prop("checked");
//        }

//        init();
//    }

//    //Add the plugin to the jQuery.fn object
//    $.fn.dasToggle = function (options) {
//        return this.each(function () {
//            if (undefined === $(this).data('dasToggle')) {
//                var plugin = new $.dasToggle(this, options);
//                $(this).data('dasToggle', plugin);
//            }
//        });
//    }

//})(jQuery);