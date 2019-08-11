module.exports = function() {
	this.Given(/^I open "([^"]*)" shop$/, shopName => {
		return helpers.loadPage(`http://localhost:3000/${shopName}`);
	});

	this.When(
		/^I do login with email "([^"]*)" and password "([^"]*)"$/,
		(email, password) => {
			return page.login.performLogin(email, password);
		}
	);

	this.Then(/^I should see login modal disappear$/, () => {
		const loginModalSelector = page.login.elements.loginModal;
		return driver.wait(
			() =>
				driver
					.findElement(loginModalSelector)
					.then(found => false, err => true),
			10000
		);
	});

	this.When(/^I click logout$/, () => {
		return page.home.performLogout();
	});

	this.Then(/^I should see login modal appear$/, () => {
		const loginModalSelector = page.login.elements.loginModal;
		return driver.wait(until.elementsLocated(loginModalSelector), 10000);
	});
};
