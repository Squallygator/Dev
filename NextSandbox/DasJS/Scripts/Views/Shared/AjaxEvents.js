/// <reference path="../Shared/notification.js"/> 

$(function () {
    function notifiedError(event, jqXhr, ajaxSettings, thrownError) {
        if (thrownError === "canceled") return;
        var message = "";
        if (jqXhr.status === 302) {
            message = "Vous êtes déconnecté de l’application. </br>Veuillez-vous reconnecter en cliquant sur le lien ci-dessous : </br> <a class=\"dasNoTrack\" href=\"" + document.location.href + "\">Reconnexion</a>";
        }
        else if (jqXhr.status === 403) {
            message = "Vous êtes déconnecté de l’application. </br>Veuillez-vous reconnecter en cliquant sur le lien ci-dessous : </br> <a class=\"dasNoTrack\" href=\"" + document.location.href + "\">Reconnexion</a>";
        }
        else if (jqXhr.status === 404) {
            message = "La ressource demandée n'existe pas";
        }
        else if (jqXhr.status === 500) {
            message = "Erreur serveur";
        }
        else if (thrownError === "parsererror") {
            message = "Requested JSON parse failed.";
        }
        else if (thrownError === "timeout") {
            message = "Time out error.";
        }
        if (message !== "") {
            Notification.Create(message, Notification.Ko, { autoClose: false });
        }
    }
    $.ajaxSetup({
        cache: false
    });
    $(document).ajaxError(function (event, jqXhr, ajaxSettings, thrownError) {
        console.log("ajaxError");
        console.log("ajaxError.event", event);
        console.log("ajaxError.jqXHR", jqXhr);
        console.log("ajaxError.ajaxSettings", ajaxSettings);
        console.log("ajaxError.thrownError", thrownError);
        notifiedError(event, jqXhr, ajaxSettings, thrownError);
    });
});