/// <reference path="../angular.js" />
/// <reference path="../angular-resource.js" />
var refs = refs || {};
refs.EtatsTransport = refs.EtatsTransport || 'EtatsTransport';
var refUrls = refUrls || {};
refUrls.EtatsTransport = refUrls.EtatsTransport || 'http://localhost/AngularSandbox/Api/Ddl/EtatTransport.js';

var refServices = angular.module('refServices', ['ngResource']);
refServices.factory(refs.EtatsTransport, ['$resource',
  function ($resource) {
      return $resource(refUrls.EtatsTransport, {}, {
          query: { method: 'GET', isArray: true }
      });
  }]);

var logistiqueModule = angular.module('logistique', ['refServices']);
logistiqueModule.controller('logistiqueController', ['$scope', refs.EtatsTransport, function ($scope, etatsTransport) {
    $scope.EtatTransportChange = function (vehiculeId) {
        var currentLine;
        for (var i = 0; i < $scope.details.length; i++) {
            if ($scope.details[i].VehiculeId === vehiculeId) {
                currentLine = $scope.details[i];
                break;
            }
        }
        if (currentLine) {
            alert('EtatTransportChange changed for ' + currentLine.VehiculeId);
        }
    };
    $scope.VilleLivraisonChange = function (vehiculeId) {
        var currentLine;
        for (var i = 0; i < $scope.details.length; i++) {
            if ($scope.details[i].VehiculeId === vehiculeId) {
                currentLine = $scope.details[i];
                break;
            }
        }
        if (currentLine) {
            alert('VilleLivraison changed for ' + currentLine.VehiculeId);
        }
    };
    $scope.ddl = {
        EtatTransport: []
    };
    $scope.ddl.EtatTransport = etatsTransport.query();
    $scope.VenteVOId = 1;
    $scope.EntiteId = 123;
    $scope.details = [
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
}]);