$(function() {
	var $footer = $('footer');
	new Spinner({
			color: '#999',
			lines: 13,
			radius: 5,
			length: 5,
			width: 2
		}).spin($('.spinner').get()[0]);

	Backbone.Mediator.subscribe('spinner.show', function() {
		$footer.show();
	});
	Backbone.Mediator.subscribe('spinner.hide', function() {
		$footer.hide();
	});
});