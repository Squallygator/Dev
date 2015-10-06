angular.module('logistique', [])
  .controller('logistiqueController', function () {
      var logistique = this;
      logistique.ddl = {
          EtatTransport: [
              { value: '', text: '' },
              { value: '1', text: 'Mise à dispo. gratuite' },
              { value: '2', text: 'Mise à dispo. payante' },
              { value: '3', text: 'Transport gratuit' },
              { value: '4', text: 'Transport payant' }
          ]
      };
      logistique.EtatTransportChange = function (vehiculeId) {
          var currentLine;
          for (var i = 0; i < logistique.details.length; i++) {
              if (logistique.details[i].VehiculeId === vehiculeId) {
                  currentLine = logistique.details[i];
                  break;
              }
          }
          if (currentLine) {
              alert('EtatTransportChange changed for ' + currentLine.VehiculeId);
          }
      };
      logistique.VilleLivraisonChange = function (vehiculeId) {
          var currentLine;
          for (var i = 0; i < logistique.details.length; i++) {
              if (logistique.details[i].VehiculeId === vehiculeId) {
                  currentLine = logistique.details[i];
                  break;
              }
          }
          if (currentLine) {
              alert('VilleLivraison changed for ' + currentLine.VehiculeId);
          }
      };
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
});