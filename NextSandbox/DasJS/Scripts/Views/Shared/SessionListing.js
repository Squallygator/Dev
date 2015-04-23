/// <reference path="../jquery-2.1.3.js"/>

var SessionListingOptions = function () {
    return {
        TooltipRetourListing: "Afficher le listing" 
    };
};

var SessionListing = function () {
    "use strict";
    this._entite = null;
    this._searchText = null;
    this._searchType = null;
    this._template = null;
    this.option = null;
    this._keyName = "dasListingMemory";

    this.init = function (option) {
        // todo : supprimer log
        console.log('SessionListing.init');

        if (window.location.pathname.indexOf("Recherche") !== -1 && window.location.pathname.match(/RechercheAuto/) === null) {
            this.deleteData();
            return;
        }

        if (option)
            this.option = option;
        else {
            this.option = new SessionListingOptions();
        }
        if (this.loadDataFromUrl()) {
            this.saveData();
        } else {
            this.loadDataFromStorage();
            this.refreshPanel();
        }
    };

    this.saveData = function () {
        window.sessionStorage.setItem(this._keyName, JSON.stringify(this));
    };

    this.deleteData = function () {
        window.sessionStorage.removeItem(this._keyName);
    };

    this.refreshPanel = function () {
        if ((window.location.pathname.match(/Listing$/) !== null || this._entite === null) || window.location.pathname.match(/RechercheAuto/) !== null) {
            return false;
        }

        var barAction = $("#action-bar");
        if (barAction) {
            var separator = "";
            var innerLeft = $("#action-bar-left");
            if (innerLeft.length === 0) {
                $(barAction).prepend("<div id=\"action-bar-left\"></div>");
                innerLeft = $("#action-bar-left");
            }
            if ($("#action-bar-left > *").length > 0) {
                separator = "<span class=\"action-separateur\"></span>";
            }
            var listingUrl;
            if (this._template === undefined) {
                listingUrl = $("#logo-container a").attr("href") + "/Listing?entite=" + this._entite;
                if (this._searchText) listingUrl += "&filteredSearch=" + this._searchText;
                if (this._searchType) listingUrl += "&dropDownFilterId=" + this._searchType;
            } else {
                listingUrl = $("#logo-container a").attr("href") + "/RechercheAvancee/RechercheAuto?template=" + this._template;
            }
            innerLeft.prepend("<a data-das-tooltip-text=\"" + this.option.TooltipRetourListing + "\" data-das-tooltip-ready=\"true\" class=\"action-button button-retour-listing\" href=\"" + listingUrl + "\" id=\"listing-btn-back\"><span class=\"action-button-icon\">&nbsp;</span></a> " + separator);
        }
    };

    this.loadDataFromStorage = function () {
        var data = JSON.parse(window.sessionStorage.getItem(this._keyName));
        if (data !== null) {
            this._entite = data._entite;
            this._searchText = data._searchText;
            this._searchType = data._searchType;
            this._template = data._template;
        }
    };

    this.loadDataFromUrl = function () {
        if ((window.location.pathname.match(/Listing$/) === null) && (window.location.pathname.match(/RechercheAuto/) === null)) {
            return false;
        }

        var tobeSave = false;
        var entite = this.getURLParameter("entite");
        if (entite === null) {
            this._entite = "";
        } else {
            tobeSave = true;
            this._entite = entite;
        }

        var template = this.getURLParameter("template");
        if (template === null) {
            this._template = "";
        } else {
            tobeSave = true;
            this._template = template;
        }

        var filtreValue = $("#txtFilter").val();
        if (filtreValue === null) {
            this._searchText = "";
        } else {
            tobeSave = true;
            this._searchText = filtreValue;
        }

        var type = $("#dropDownFilter").val();
        if (type === null) {
            this._searchType = "";
        } else {
            tobeSave = true;
            this._searchType = type;
        }
        return tobeSave;
    };

    this.getURLParameter = function (sParam) {
        var sPageURL = window.location.search.substring(1);
        var sURLVariables = sPageURL.split("&");
        for (var i = 0; i < sURLVariables.length; i++) {
            var sParameterName = sURLVariables[i].split("=");
            if (sParameterName[0] === sParam) {
                return sParameterName[1];
            }
        }
    };
};