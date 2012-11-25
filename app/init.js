var app = require('app');

$(function DOMReady(argument) {
	app.initialize();
	Backbone.history.start();

	window.app = app;
});