/// <reference path="../../jquery-2.1.3.min.js" />
/// <reference path="../../DAS/DasSessionSearch.js" />

$(document).ready(function () {
    function updatePanel(data) {
        // todo : supprimer log
        console.log('StarFleetSessionSeach.updatePanel');
        if ((data._entite || data._template) && (data._search)) {
            var currentHref = $('#goto-search').attr('href');
            
            if (currentHref) {                
                var ressources = currentHref.split('?');
                var hrefArray = currentHref.split('/');
                
                var re = /\/[A-Z]{2}_[A-Z]{3}\//;
                if (!re.test($('#goto-search').attr('href'))) {
                    hrefArray[hrefArray.length - 1] = "RechercheContrat";
                    ressources[0] = hrefArray.join('/');
                }

                $('#goto-search').attr('href', ressources[0] + '?mode=' + data._mode + '+&search=' + data._search + '&entite=' + data._entite);
                
                $('#goto-search').show();
                $('#no-search').hide();
            }
        }
        else {

                $('#goto-search').hide();
                $('#no-search').show();
        }

        if (data._search) $('#txt-search').val(data._search);
        if (data._entite) $('#cbbSearch option[value=' + data._entite + ']').prop('selected', true);
        if (data._mode) $('#mode').val(data._mode);
    }
    // todo : supprimer log
    var sessionSearch = new DasSessionSearch(updatePanel);
});
