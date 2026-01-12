document.getElementById("filter-status").style.display = "none";

// On the rentals page we want to show only cars with status "Rental".
// `filterCondition`, `carList`, `productList` and `Render` are defined in app.js.
if (typeof filterCondition !== 'undefined') {
	filterCondition.status = "Rental";
}
if (typeof Render === 'function') {
	Render(carList, productList, filterCondition);
}
