function makeIceCream(flavor) {
	if (flavor == "Chocolate" || flavor == "Vanilla") {
		return {
			cone: true,
			flavor: flavor,
			topping: "hotChocolate",
		}
	} else throw ("invalid flavor");

}


module.exports.makeIceCream = makeIceCream;