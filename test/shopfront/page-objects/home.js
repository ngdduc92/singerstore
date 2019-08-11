module.exports = {
	elements: {
		accountLabel: by.className('header-account-label'),
		logoutLink: by.id('logout-link')
	},

	performLogout: () => {
		const accountSelector = page.home.elements.accountLabel;
		const logoutLinkSelector = page.home.elements.logoutLink;

		driver.findElement(accountSelector).click();
		driver.wait(until.elementsLocated(logoutLinkSelector), 10000);
		return driver.findElement(logoutLinkSelector).click();
	}
};
