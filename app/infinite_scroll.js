$(function() {
	var startLoadingAtPx = 20;
	var $document = $(document);
	var $window = $(window);

	var checkIfReachingEnd = function checkIfReachingEnd() {
		var scrollTop = $window.scrollTop();
		return scrollTop + 40 >= $document.height() - $window.height();
	};

	$window.on('smartscroll', function smartscrollCallback() {
		if (checkIfReachingEnd()) {
			Backbone.Mediator.publish('scroller.bottom');
		}
	});
});