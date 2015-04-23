/*
 *	Affiche une notification sur la page.
 *	Usage :
 *	Notification.Create("Ceci est un message simple", Notification.Ok);
 *  Notification.Create("Ceci est un message simple", Notification.Ko, {timer:8000});
 *  Notification.Create("Ceci est un message simple", Notification.Ko, {autoClose:false});
 *  Notification.Create("Ceci est un message simple", Notification.Ko, {autoClose:false, width: 400});
*/

var Notification = {
    Ko: "ko",
    Ok: "ok",
    Options: {
        autoClose: true,
        timer: 5000,
        width: 270
    },
    OptionsApply: {},
    Create: function (message, type, options){
        Notification.ApplyOption(options);

        var notification = document.createElement("div");
        notification.className = "notification " + type;

        $(notification).width(Notification.OptionsApply.width).css({ "margin-left": -Notification.OptionsApply.width });

        $(notification).html(message);

        if (!Notification.OptionsApply.autoClose) {
            var close = document.createElement("a");
            close.href = "javascript:void(0);";
            close.className = "ui-icon ui-icon-close close";
            $(notification).append(close);
            $(close).on("click", function (){
                Notification.Close(notification);
            });
        }

        $("body").append(notification);

        var notificationsList = $(".notification");
        var nbNotifications = notificationsList.length;
        if (nbNotifications > 1) {
            var height = Number($(notification).outerHeight(true) + 10);

            for(var cptNotifs = 0; cptNotifs < nbNotifications - 1; cptNotifs++) {
                $(notificationsList[cptNotifs]).animate({
                    top: "+=" + height + "px"
                }, 500);
            }
        }

        $(notification).animate({
            "margin-left": -Notification.OptionsApply.width - 30,
            opacity: 1
        });

        if (Notification.OptionsApply.autoClose) {
            setTimeout(function (){
                Notification.Close(notification);
            }, Notification.OptionsApply.timer);
        }

        if (!$('.input-validation-error:first').hasClass("hasDatepicker")) {
            $('.input-validation-error:first').focus();
        }

        return $(notification);
    },
    Close: function (notification){
        $(notification).animate({
            "margin-left": -Notification.OptionsApply.width,
            opacity: 0
        }, function () {
            $(notification).remove();
        });
    },
    ApplyOption: function (options) {
        Notification.OptionsApply = {};

        if (options === undefined) {
            Notification.OptionsApply = Notification.Options;
        } else {
            Notification.OptionsApply.autoClose = options.autoClose === undefined ? Notification.Options.autoClose : options.autoClose;
            Notification.OptionsApply.timer = options.timer === undefined ? Notification.Options.timer : options.timer;
            Notification.OptionsApply.width = options.width === undefined ? Notification.Options.width : options.width;
        }
    }
};