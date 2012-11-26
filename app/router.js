module.exports = Backbone.Router.extend({
    routes: {
        "": "showPopular",
        ":list_type": "showList"
    },
    showList: function showList(list_type) {
        Backbone.Mediator.publish('App:show', list_type);
    },
    showPopular: function showPopular() {
        this.showList('popular');
    }
});