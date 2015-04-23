/*
 *	Affiche une tooltip d'aide pour un ensemble d'élément.
 *		
 *	Les éléments doivent contenir les attributs suivants :
 *		data-das-tooltip-url : url du texte d'aide
 *		data-das-tooltip-for : élément sur lequel l'aide doit s'afficher
 *
 *	Usage :
 *
 *	HTML :
 *	<span data-das-tooltip-for="unId" data-das-tooltip-url="uneUrl" class="help-icon"></span>
 *	ou
 *	<span data-das-tooltip-for="unId" data-das-tooltip-text="un texte" class="help-icon"></span>
 *  ou 
 *  <span data-das-tooltip-text="un texte" class="help-icon"></span>
 *  Sans "data-das-tooltip-for", le tooltip apprait sur l'élément appelant
 *
 *	Js :
 *	$(".icon-help").tooltip();
*/

var Tooltip = {
    Attr: {
        For: "data-das-tooltip-for",
        Text: "data-das-tooltip-text",
        Url: "data-das-tooltip-url",
        Id: "data-das-tooltip-id",
        Ready: "data-das-tooltip-ready",
        ElementTootipedId: "element-tooltiped-id"
    },
    Elements: [],
    Delay: null,
    TooltipId: 0,
    Init: function (elements, opts) {
        $.each(elements, function () {
            if ($.inArray(this.id, Tooltip.Elements) > -1) return;
            if (this.id === "") this.id = Tooltip.Attr.ElementTootipedId + $("*[id*='" + Tooltip.Attr.ElementTootipedId + "']").length;

            if ($(this).attr(Tooltip.Attr.Url) !== undefined || $(this).attr(Tooltip.Attr.Text) !== undefined) {
                Tooltip.Elements.push(this.id);

                $(this)
					.on("mouseover", function () {
					    var _this = this;
					    Tooltip.Delay = setTimeout(function() {
					        if ($(_this).attr(Tooltip.Attr.Id) === undefined) {
					            Tooltip.Create(_this);
					        } else {
					            Tooltip.Show(_this);
					        }
					    }, 500);
					})
					.on("click mouseout keypress", function () {
					    clearTimeout(Tooltip.Delay);
					    Tooltip.Hide(this);
					});
            }
        });
    },
    Create: function (element) {
        var tooltip, arrow;

        tooltip = document.createElement("div");
        tooltip.className = "tooltip transition-top";

        $(element).attr(Tooltip.Attr.Id, Tooltip.TooltipId);
        tooltip.id = Tooltip.Attr.Id + Tooltip.TooltipId;
        Tooltip.TooltipId++;

        var content = document.createElement("div");
        content.className = "tooltip-content";
        $(tooltip).append(content);

        arrow = document.createElement("div");
        arrow.className = "tooltip-arrow-dialog arrow-top transition-top";
        $(tooltip).append(arrow);

        $(tooltip).hide();
        $("body").append(tooltip);

        if ($(element).attr(Tooltip.Attr.Text) === undefined) {
            Tooltip.LoadContent(element);
        } else {
            $(content).html($(element).attr(Tooltip.Attr.Text));
            Tooltip.Show(element);
        }
    },
    Show: function (element) {
        var tooltip = Tooltip.GetTooltip(element);
        tooltip
			.css(Tooltip.GetTooltipPosition(element))
			.fadeIn("fast");

        tooltip.css({ top: "+=10px" });
    },
    Hide: function (element) {
        Tooltip.GetTooltip(element).fadeOut("fast");
    },
    Refresh: function (elements, text) {
        $.each(elements, function () {
            $(this).attr(Tooltip.Attr.Text, text);

            var tooltip = Tooltip.GetTooltip(this);
            tooltip.find(".tooltip-content").html($(this).attr(Tooltip.Attr.Text));
        });
    },
    LoadContent: function (element) {
        var url = $(element).attr(Tooltip.Attr.Url);
        var tooltipContent = Tooltip.GetTooltip(element).find(".tooltip-content");

        $.ajax({
            contentType: "application/html; charset=utf-8",
            url: url,
            dataType: "html",
            success: function (html) {
                tooltipContent.html(html);
            },
            error: function (response, status, error) {
                tooltipContent.html(error);
            },
            complete: function () {
                Tooltip.Show(element);
            }
        });
    },
    GetTooltip: function (element) {
        var id = $(element).attr(Tooltip.Attr.Id);
        return $("#" + Tooltip.Attr.Id + id);
    },
    GetTooltipPosition: function (element) {
        var controle;

        if ($(element).attr(Tooltip.Attr.For) === undefined || $(element).attr(Tooltip.Attr.For) === "") {
            controle = $(element);
        } else {
            controle = $("#" + $(element).attr(Tooltip.Attr.For));
        }

        var position = controle.offset();
        var tooltip = Tooltip.GetTooltip(element);

        var left = position.left + (controle.innerWidth() / 2) - (tooltip.innerWidth() / 2);
        var top = position.top + controle.innerHeight();

        if (left < 12) left = 12;

        return {
            left: left,
            top: top
        };
    }
};
(function ($) {
    $.fn.tooltip = function (opts) {
        var elements = $(this);
        var options;

        options = $.extend(options, opts);

        if (options.text === undefined) {
            Tooltip.Init(elements, opts);
        } else {
            Tooltip.Refresh(elements, options.text);
        }
        return elements;
    };
})(jQuery);