/// <reference path="../jquery-2.1.0.js" />
/// <reference path="../Common/jQuery.Das.Data.js" />
/// <reference path="../Jasmine/Jasmine.js" />

describe("Extensions jQuery", function () {
    describe("Common/jQuery.Das.Data.js", function () {
        (function ($) {
            describe("$.fn.executeDataFunc", function () {
                it("Execute la fonction spécifiée dans le data de l'element HTML", function () {
                    // arrange
                    var done = false;
                    document.functotest1 = function () { done = true; }
                    var input = $('<input type="text" data-functotest="document.functotest1"/>');
                    // act
                    input.executeDataFunc('functotest');

                    //assert
                    expect(done).toEqual(true);
                    document.functotest1 = null;
                });
            });
        })(jQuery);
    });
});