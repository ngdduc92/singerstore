module.exports = {
	elements: {
		loginModal: by.className('login-modal'),
		emailInput: by.name('login-email'),
		passwordInput: by.name('login-password')
	},

	performLogin: (email, password) => {
		const loginModalSelector = page.login.elements.loginModal;
		const emailSelector = page.login.elements.emailInput;
		const passwordSelector = page.login.elements.passwordInput;

		driver.wait(until.elementsLocated(loginModalSelector), 10000);
		driver.findElement(emailSelector).sendKeys(email);
		return driver
			.findElement(passwordSelector)
			.sendKeys(password, selenium.Key.ENTER);
	}
};
