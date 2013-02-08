ko.bindingHandlers.jqmChangePage = {
	'init': function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
		alert(element);
		$(element).on('click', function() {
			var page = valueAccessor();
			$.mobile.changePage(page);
		});
	}
}