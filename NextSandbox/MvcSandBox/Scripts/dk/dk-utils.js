var dk = {};
dk.utils = dk.utils || {};
dk.utils.convertToDTO = function(source, cols) {
    var names = Object.getOwnPropertyNames(source);
    var filter = null;
    if (cols) {
        filter = '|' + cols.join('|') + '|';
    }
    var dtoObject = {};
    for (var i = 0; i < names.length; i++) {
        var prop = names[i];
        if (!source.hasOwnProperty(prop)) continue;
        if (typeof (source[prop]) === "function") continue;
        if (filter && filter.indexOf('|' + prop + '|') === -1) continue;
        if (prop === 'toDTO') continue;
        if (prop === 'propertiesDefinition') continue;
        dtoObject[prop] = source[prop];
    }
    return dtoObject;
};