var TemplateHelper = {};

TemplateHelper.Fill = function(item, templateId, targetId) {
    var rendered = TemplateHelper.Transform(item, templateId);
    $(targetId).html(rendered);
};

TemplateHelper.Transform = function(item, templateId) {
    var template = $(templateId).html();
    return TemplateHelper.TransformTemplate(item, template);
};

TemplateHelper.TransformTemplate = function(item, template) {
    Mustache.parse(template); // optional, speeds up future uses
    var rendered = Mustache.render(template, item);
    return rendered.trim();
};