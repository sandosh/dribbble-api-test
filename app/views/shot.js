var Shot = require('models/shot');

module.exports = Backbone.View.extend({
    model: Shot,
    template: 'shot',
    tagName: 'li',
    render: function renderShot() {
        var self = this;
        dust.render(this.template, this.model.toJSON(), function dustRenderCallback(error, output) {
            if (!error) {
                self.$el.html(output);
            }
        });
    }
});