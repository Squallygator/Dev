angular.module('logistique', [])
  .controller('logistiqueController', ['$scope', '$http', function ($scope, $http) {
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
      $scope.Ville
      $scope.ddl = {
          EtatTransport: [
              { value: '', text: '' },
              { value: '1', text: 'Mise à dispo. gratuite' },
              { value: '2', text: 'Mise à dispo. payante' },
              { value: '3', text: 'Transport gratuit' },
              { value: '4', text: 'Transport payant' }
          ]
      };
      $http({method: 'GET', url: "http://localhost/AngularSandbox/Api/Ddl/EtatTransport.js", responseType: "json"}).
        then(function (response) {
          debugger;
            $scope.ddl.EtatTransport = response;
        }, function (response) {
            debugger;
            alert("Request failed");
        });
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