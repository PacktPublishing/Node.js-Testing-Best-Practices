
function makeIceCream(flavor) {
	if (flavor == "Chocolate" || flavor == "Vanilla") {
		return {
			cone: true,
			flavor: flavor,
			topping: "hotChocolate",
		}
	} else throw ("invalid flavor");
}


class Wallet {

	constructor(initialBalance) {
		this.balance = initialBalance;
	}

	chargeAccountForCone(conePrice) {
		if (this.balance >= conePrice) {
			this.balance -= conePrice;
			return true;
		} else {
			//not enough cache
			return false;
		}
	}

	chargePrepaidAccount(coneCount, conePrice) {
		for (let i = 0; i < coneCount; ++i) {
			let ok = this.chargeAccountForCone(conePrice);
			if (!ok) {
				return false;
			}
		}
		return true;
	}
}

module.exports.makeIceCream = makeIceCream;
module.exports.Wallet = Wallet;