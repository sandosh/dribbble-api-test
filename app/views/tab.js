module.exports = Backbone.View.extend({
	el: 'nav',
	initialize: function initialize() {
		this.available_lists = _.map(this.$el.find('a'), function(el){
			return $(el).attr('data-list-type');
		});
	},
	events: {
		'click a': 'tabClicked'
	},
	tabClicked: function(event) {
		event.preventDefault();

		$active_tab = $(event.target);
		this.switchTab($active_tab);

		var list_type = $active_tab.attr('data-list-type');
		Backbone.Mediator.pub('App:show', list_type);
	},
	switchTab: function($tab) {
		this.$el.find('li.active').removeClass('active');
		$tab.parent('li').addClass('active');
	},
	switchTabFor: function(list_type) {
		this.switchTab(this.$el.find('[data-list-type="' + list_type + '"]'));
	}
});