$(document).ready(function () {
    $('*[data-das-onchange-id]').each(function (idx, elt) {
        var $destination = $(elt);
        var params = $destination.data();
        if (!params.hasOwnProperty("dasOnchangeId")) return;
        if (!params.hasOwnProperty("dasOnchangeUrl")) return;
        if (!params.hasOwnProperty("dasOnchangeName")) return;
        var $relativeElt = $('#' + params.dasOnchangeId);
        $relativeElt.on('change', function () {
            var value = $relativeElt.val();
            var url = params.dasOnchangeUrl.addUrlParam(params.dasOnchangeName, value);
            $destination.load(url);
        });
        //$(params.dasOnchangeId).trigger('change');
    });
});