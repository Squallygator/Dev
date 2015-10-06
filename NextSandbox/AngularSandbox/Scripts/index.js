/// <reference path="angular.js" />
var indexModule = angular.module('indexApp', []);
indexModule.controller('indexController',  function () {
	var index=this;
	index.Titre="Test Angular";
	index.Liens = [{
		text: 'VenteVO/Logistique',
		url: 'VenteVO/Logistique.html'
	}]
});