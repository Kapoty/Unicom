window.document.onload = function() {
	const MDCFoo = mdc.foo.MDCFoo;
	const MDCFooFoundation = mdc.foo.MDCFooFoundation;

	// Instantiation
	const topAppBarElement = document.querySelector('.mdc-top-app-bar');
	const topAppBar = new MDCTopAppBar(topAppBarElement);
}

