var ShotView = require('views/shot');
var Collection_Shots = require('collections/shots');
var collections = {};

module.exports = Backbone.View.extend({
	el: 'section',
	initializeCollections: function initializeCollections(available_lists) {
		_.each(available_lists, function(list_type){
			if (list_type == 'popular') {
				collections[list_type] = new Collection_Shots();
			} else {
				var Collection_Shots_Custom = Collection_Shots.extend({
					list_type: list_type
				});
				collections[list_type] = new Collection_Shots_Custom();
			}
			collections[list_type].fetch();
		});
		this.collections = collections;
		this.$container = this.$el.find('ol');
		Backbone.Mediator.subscribe('scroller.bottom', this.loadMore, this);
		this.$el.hide();
	},
	initialize: function initializeGallery(options) {
		this.initializeCollections(options.available_lists);
	},
	showList: function(list_type) {
		if (this.collection) {
			this.collection.off();
		}
		this.collection = collections[list_type];
		this.$el.hide();
		if (this.collection.loading) {
			this.collection.on('reset', this.render, this);
		} else {
			this.render();
		}
		this.collection.on('add', this.renderOne, this);
	},
	render: function() {
		this.$container.html('');
		_.each(this.collection.models, this.renderOne, this);
		this.$el.show();
		Backbone.Mediator.publish('spinner.hide');
	},
	renderOne: function(model) {
		var shot_view = new ShotView({
			model: model
		});
		this.$container.append(shot_view.$el);
		shot_view.render();
	},
	loadMore: function() {
		if (this.collection && !this.collection.loading) {
			var $jqxhr = this.collection.nextPage();
			if ($jqxhr) {
				Backbone.Mediator.publish('spinner.show');
				$jqxhr.complete(function() {
					Backbone.Mediator.publish('spinner.hide');
				});
			}
		}
	}
});