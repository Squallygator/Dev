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
          Stockage: 'HN Autotransport nv',
          VilleStockage: 'B3700 TONGEREN',
          EtatTransport: '3',
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
          VilleLivraison: [{ value: '1', text: '32108 - BAD SALZUFLEN', selected: true }]
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
    logistique.EtatTransportChange = function (detail) {
        if (detail) {
            alert('EtatTransportChange changed for ' + detail.VehiculeId);
        }
    };
    logistique.VilleLivraisonChange = function (detail) {
        if (detail) {
            alert('VilleLivraison changed for ' + detail.VehiculeId);
        }
    };
}]);