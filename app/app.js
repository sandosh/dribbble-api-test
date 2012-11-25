var App = {
	initialize: function initialize() {
		var TabView = require('views/tab');
		var Gallery = require('views/gallery');
		var Router = require('router');
		require('dust_extension');
		require('infinite_scroll');
		require('spinner');

		this.tab_view = new TabView();
		this.gallery_view = new Gallery({
			available_lists: this.tab_view.available_lists
		});
		this.router = new Router();

		if (typeof Object.freeze === 'function') Object.freeze(this);
	}
};

Backbone.Mediator.subscribe('App:show', function subcribeCallback(list_type){
	App.tab_view.switchTabFor(list_type)
	App.gallery_view.showList(list_type);
	App.router.navigate(list_type, {
		trigger: false
	});
});


module.exports = App;