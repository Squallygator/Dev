/// <reference path="~/Scripts/jquery-2.1.3.intellisense.js" />
/// <reference path="tooltip.js" />
/// <reference path="~/Scripts/Views/Shared/Tabs.js" />
/// <reference path="~/Scripts/jquery.ba-resize.js" />
/// <reference path="~/Scripts/jquery-ui-1.11.3.custom.js" />
/// <reference path="~/Scripts/globalize/globalize.js" />
/// <reference path="~/Scripts/jquery.validate-vsdoc.js" />
var _Layout = {
    Loading: false,
    Open: true,
    konami: "38,38,40,40,37,39,37,39,66,65",
    keys: [],
    Message: null,
	Init: function (culture) {
		_Layout.LoadingEvent();
		$(window).resize(_Layout.ResizeUI).trigger("resize");
		_Layout.Tooltip();
		_Layout.Toggle();
		_Layout.AjaxStop();
		_Layout.HackTextAreaMaxLength();
		Tab.Init();

		$('.jqPicker').datepicker();
		_Layout.InitValidationForms();
		$.culture = Globalize.culture(culture);
		$.validator.methods.date = function (value, element) { return this.optional(element) || Globalize.parseDate(value) !== null; };
		
		var headerHeight = $("#header").innerHeight();
		var contratHeight = $("#contrat-container").innerHeight();
		var tdbHeight = $("#menu-tdb").innerHeight();
		var menuSearchHeight = $("#no-search:visible") ? $("#no-search").innerHeight() : $("#menu-resultat-recherche").innerHeight();
		var elementsHeight = headerHeight + contratHeight + tdbHeight + menuSearchHeight;

		if ($("ul.menu li.menu-selected").length > 0 && !_Layout.isScrolledIntoView($("ul.menu li.menu-selected"))) {
		    $(".menu")[0].scrollTop = $("ul.menu li.menu-selected").offset().top - elementsHeight;
		}

	    $(function() {
	        $(document).on("keydown", function (key) {
                if (key.keyCode === 13) {
                    if (_Layout.keys.toString().indexOf(_Layout.konami) >= 0) {
                        Notification.Create("|<0|\\|4/\\/\\1 (0D3 15 933|< !", Notification.Ok, { autoClose: false });
                    }
                } else {
                    _Layout.keys.push(key.keyCode);
                }
	        });
	    });

	    _Layout.EntetePersistanteFixe();
	    _Layout.MenuControl();
	},
	EntetePersistanteFixe: function () {
	    if ($("#EntetePersistanteFixe").length > 0) {

            if ($("#button-entete").length == 0) _Layout.CreateButtonShowEntete();

	        $(window).on("scroll", function () {
	            if ($(this).scrollTop() >= $("#EntetePersistanteFixe").height()) {
	                $("#button-entete").removeClass("invisible");
	            } else {
	                $("#EntetePersistanteFixeClone").addClass("invisible");
	                $("#button-entete").addClass("invisible");
	                $("#button-entete").removeClass("open");
	            }
	        });
	    }
	},
	CreateButtonShowEntete: function(){
	    var div = document.createElement("div");
	    div.className = "invisible";
	    div.id = "button-entete";
	    $(div).attr("data-das-tooltip-text", _Layout.Message.TooltipEnteteFixe);
	    $(div).tooltip();
        $("#content").append(div);

	    var enteteClone = $('#EntetePersistanteFixe').clone();
        $(enteteClone)[0].id = "EntetePersistanteFixeClone";
        $(enteteClone).addClass("fixed").addClass("invisible");
        $(enteteClone).width($("#super-content").width() - 65);
        $("#content").append(enteteClone);

	    $(div).on("click", function () {
	        if ($("#EntetePersistanteFixeClone").hasClass("invisible")) {
                $("#EntetePersistanteFixeClone").removeClass("invisible");
                $(this).addClass("open");
	        } else {
                $("#EntetePersistanteFixeClone").addClass("invisible");
                $(this).removeClass("open");
            }
	    });

	    $(document).on("menu-visible", function (event, visible) {
	        $(enteteClone).width($("#super-content").width() - 125);
	    })
	},
	isScrolledIntoView: function(elem) {
        var docViewTop = $(window).scrollTop();
        var docViewBottom = docViewTop + $(window).height();

        var elemTop = $(elem).offset().top;
        var elemBottom = elemTop + $(elem).innerHeight() * 2;

        return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
    },
	MenuControl: function () {
	    $("#menu-control").on("click", function () {
	        if ($("#menu-container").hasClass("hide")) {
	            _Layout.ShowMenu();
	        } else {
	            _Layout.HideMenu();
	        }
	    });

	    $("#super-content")[0].addEventListener("transitionend", function() {
	        $(document).trigger("menu-visible", !$("#menu-container").hasClass("hide"));
	    }, false);
	},
	ShowMenu: function(){
	    $("#menu-container").removeClass("hide");
	    $("#super-content").removeClass("without-menu");
	    $.cookie("MenuVisible", 1, { path: "/" });
	    $("#menu-control").tooltip({ "text": _Layout.Message.MasquerMenu });
	},
	HideMenu: function () {
	    $("#menu-container").addClass("hide");
	    $("#super-content").addClass("without-menu");
	    $.cookie("MenuVisible", 0, { path: "/" });
	    $("#menu-control").tooltip({ "text": _Layout.Message.AfficherMenu });
	},
	ResizeUI: function () {
		$("#menu-container ul.menu").height($("#menu-container").height() - 190);
	},
	Toggle: function() {
		$('*[data-das-toggle-id]').each(function () {
			$(this).dasToggle(eval('(' + $(this).data('dasToggleOptions') + ')'));
		});
	},
	Tooltip: function () {
		$("*[data-das-tooltip-text]").tooltip();
	},
	AjaxStop: function(){
		$(document).ajaxStop(function () {
			_Layout.Tooltip();
			_Layout.Toggle();
		});
	},
	LoadingEvent: function () {

	    if (/MSIE (\d+\.\d+);/.test(navigator.userAgent)) {
	        var ieversion = new Number(RegExp.$1);
	        if (ieversion > 10) {
	            _Layout.LoadingChangePage();
	        } 
	    } else {
	        _Layout.LoadingChangePage();
	    }

		$(document)
			.ajaxStart(function () {
				_Layout.Loading = true;
				_Layout.LoadingStart();
			})
			.ajaxStop(function () {
				_Layout.Loading = false;
				_Layout.LoadingStop();
			});
	},
	LoadingChangePage: function () {
	    window.onbeforeunload = function () {
	        _Layout.Loading = true;
	        _Layout.LoadingStart();
	    };
	},
	LoadingStart: function () {
		if (_Layout.Loading) {
			$("#loading")
				.fadeIn("fast")
				.css({
					"left": $("#loading").width() * -1,
					opacity: 1
				})
				.animate({
					left: $(document).width()
				}, ($(document).width() * 2000) / 753, "linear", _Layout.LoadingStart);
		}
	},
	LoadingStop: function () {
		$("#loading")
		.clearQueue()
		.animate({
			opacity: 0
		}, 300, "linear", function () {
			$(this).stop();
		});
	},
	HackTextAreaMaxLength: function () {
		var txts = document.getElementsByTagName('TEXTAREA');
		for (var i = 0, l = txts.length; i < l; i++) {

			if (/^[0-9]+$/.test(txts[i].getAttribute("maxlength"))) {
			    var func = function() {
			        var len = parseInt(this.getAttribute("maxlength"), 10);

			        if (this.value.length > len) {
			            this.value = this.value.substr(0, len);
			            return false;
			        }
			    };
				txts[i].onkeyup = func;
				txts[i].onkeydown = func;
				txts[i].onblur = func;
			}
		}
	},
	InitValidationForms: function () {
		$('input').each(function () {
			var m = $(this).closest("form");
			if (m !== undefined && !m.hasClass("jqNotValidEnterKey") && !m.hasClass("jqValidEnterKey")) {
				m.addClass("jqNotValidEnterKey");
				m.keypress(function (e) {
				    if (e.target.localName === "textarea") {
				        return true;
				    }
					var el = $(this);
					if (el.hasClass("jqValidEnterKey")) {
						el.closest("form").submit();
						return true;
					} else if (el.hasClass("jqNotValidEnterKey")) {
						var code = e.keyCode || e.which;
						if (code === 13) {
							e.preventDefault();
							return false;
						}
					}
					return true;
				});
			}
		});
	},
};