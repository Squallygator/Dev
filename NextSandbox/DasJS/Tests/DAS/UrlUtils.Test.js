/// <reference path="~/Scripts/jquery-2.1.3.js" />
/// <reference path="~/Scripts/DAS/UrlUtils.js" />

// Url to test : ~/Tests/DAS/UrlUtils.html
describe("UrlUtils", function () {
    var dataToAdd = {};
    dataToAdd['Url sans Query'] = { givenUrl: 'monUrl', paramName: 'param', paramValue: 'value', expectedUrl: 'monUrl?param=value' };
    dataToAdd['Url avec Query mais sans le parametre'] = { givenUrl: "monUrl?un=deux", paramName: 'param', paramValue: 'value', expectedUrl: 'monUrl?un=deux&param=value' };
    dataToAdd['Url avec Query avec le parametre d\'une valeur differente'] = { givenUrl: "monUrl?param=vide&un=deux", paramName: 'param', paramValue: 'value', expectedUrl: 'monUrl?param=value&un=deux' };

    describe("addOrUpdateParameter", function () {
        for (var key in dataToAdd) {
            if (dataToAdd.hasOwnProperty(key)) {
                var setup = dataToAdd[key];
                it(key, function() {
                    // Arrange 
                    var givenUrl = setup.givenUrl;
                    var paramName = setup.paramName;
                    var paramValue = setup.paramValue;
                    var expectedUrl = setup.expectedUrl;

                    // Act 
                    var res = UrlUtils.addOrUpdateParameter(givenUrl, paramName, paramValue);

                    // Assert
                    expect(res).toEqual(expectedUrl);
                });
            }
        };
    });
    describe("getURLParameter", function () {
        var dataToGet = {};
        dataToGet['Url sans Query'] = { givenUrl: 'monUrl', paramName: 'param', paramValue: null };
        dataToGet['Url avec Query mais sans le parametre'] = { givenUrl: 'monUrl?un=deux', paramName: 'param', paramValue: null};
        dataToGet["Url avec Query avec le parametre d\'une valeur differente"] = { givenUrl: 'monUrl?param=value&un=deux', paramName: 'param', paramValue: 'value' };

        for (var key in dataToGet) {
            if (dataToGet.hasOwnProperty(key)) {
                var setup = dataToGet[key];
                it(key, function () {
                    // Arrange 
                    // Act 
                    var res = UrlUtils.getURLParameter(setup.givenUrl, setup.paramName);

                    // Assert
                    expect(res).toEqual(setup.paramValue);
                });
            }
        };
    });
});