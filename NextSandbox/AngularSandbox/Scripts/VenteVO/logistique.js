/// <reference path="../angular.js" />
var logistiqueModule = angular.module('logistique', []);
logistiqueModule.controller('logistiqueController', [ '$http', function ($http) {
	var logistique=this;
    logistique.ListeEtatTransport= [];
    logistique.VenteVOId = 1;
    logistique.EntiteId = 123;
    logistique.details = [
      {
          VehiculeId: 38211,
          VehiculeLink: '/Vehicule/38211',
          EntiteStockageId :456,
          Stockage: 'HN Autotransport nv',
          VilleStockage: 'B3700 TONGEREN',
          EtatTransport: '3',
          EntiteLivraisonId :123,
          VilleLivraison: 1,
          VillesLivraison: [
              { value: 1, text: '32108 - BAD SALZUFLEN' },
              { value: '2', text: '32108 - BAD SALZUFLEN 2' }
          ]
      },
      {
          VehiculeId: 456,
          VehiculeLink: '/Vehicule/456',
          Stockage: 'Stockage',
          VilleStockage: 'VilleStockage',
          EtatTransport: '4',
          VillesLivraison: [{ value: '1', text: '32108 - BAD SALZUFLEN', selected: true }]
      }
    ];
    $http.get('/Api/Ddl/EtatTransport.js').success(function(data){
    	logistique.ListeEtatTransport = data;
    });
    logistique.getDetailByVehiculeId = function(vehiculeId){
	    var detail;
        for (var i = 0; i < logistique.details.length; i++) {
            if (logistique.details[i].VehiculeId === vehiculeId) {
                detail = logistique.details[i];
                break;
            }
        }
        return detail;
    };
    logistique.EtatTransportChange = function (entiteId, vehiculeId) {
    	var detail = logistique.getDetailByVehiculeId(vehiculeId);
        if (detail) {
            alert('EtatTransportChange changed for ' + entiteId + ',' + detail.VehiculeId);
	        switch(detail.EtatTransport)
	        {
	        	case '1':
	        	case '2':
	        	default:
	        		detail.VillesLivraison.length=0;
	        		detail.VilleLivraison = null;
	        		break;
	        	case '3':
	        	case '4':
	        		detail.VilleLivraison = null;
        			debugger;
	        		
	        		var url = '/Api/Entite/'+ entiteId +'/VillesLivraison.js';
	        		$http.get(url).success(function(data){
	        			debugger;
				    	detail.VillesLivraison = data;
				    });
				    break;
	        }
        }
    };
    logistique.VilleLivraisonChange = function (vehiculeId) {
    	var detail = logistique.getDetailByVehiculeId(vehiculeId);
        if (detail) {
            alert('VilleLivraison changed for ' + detail.VehiculeId);
        }
    };
}]);