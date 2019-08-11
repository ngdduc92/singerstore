export let themeSettings = null;
export let text = null;
export let locale = null;
export let api = null;
export let tenantUrlName = null;

const setVariables = options => {
	if (options.themeSettings) {
		({ themeSettings } = options);
	}

	if (options.text) {
		({ text } = options);
	}

	if (options.locale) {
		({ locale } = options);
	}

	if (options.api) {
		({ api } = options);
	}

	if (options.tenantUrlName) {
		({ tenantUrlName } = options);
	}
};

export const initOnClient = options => {
	setVariables(options);
};

export const initOnServer = options => {
	setVariables(options);
};
