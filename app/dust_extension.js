dust.onLoad = function dustOnLoad(template_name, callback) {
    var template_source = require('views/templates/' + template_name);
    if (template_source) {
        callback.call(dust, null, template_source);
    } else {
        callback.call(dust, 'Template Not Found');
    }
};

dust.compile = function(source, name) {
    return source;
};