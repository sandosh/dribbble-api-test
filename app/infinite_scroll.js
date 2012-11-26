$(function() {
	var startLoadingAtPx = 40;
	var $document = $(document);
	var $window = $(window);

	var checkIfReachingEnd = function checkIfReachingEnd() {
		var scrollTop = $window.scrollTop();
		return scrollTop + 40 >= $document.height() - $window.height();
	};

	$window.on('scroll', function smartscrollCallback() {
		if (checkIfReachingEnd()) {
			Backbone.Mediator.publish('scroller.bottom');
		}
	});
});