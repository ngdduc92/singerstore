import api from './api';

const LANGUAGES = [`us`, `vn`];

const getRedirect = req => {
	const absoluteUrl = `${req.protocol}://${req.hostname}${req.url}`;
	const relativeUrl = req.url;
	const relativePath = req.path;
	return api.public.redirects.list().then(({ status, json }) => {
		const items = json;
		if (items && items.length > 0) {
			const redirect = items.find(
				item =>
					item.from === absoluteUrl ||
					item.from === relativeUrl ||
					item.from === relativePath
			);
			return redirect;
		}
		return null;
	});
};

const redirectUrlIsValid = url => {
	return (
		url &&
		url.length > 0 &&
		(url.startsWith('/') ||
			url.startsWith('https://') ||
			url.startsWith('http://'))
	);
};

const redirects = (req, res, next) => {
	const tenantUrlName = req.params.tenantUrlName;
	const locale = LANGUAGES.includes(req.params.locale)
		? req.params.locale
		: 'us';
	const IGNORE_PATH = ['/'];
	if (IGNORE_PATH.includes(req.url)) {
		next();
	} else {
		getRedirect(req, tenantUrlName)
			.then(redirect => {
				if (redirect && redirectUrlIsValid(redirect.to)) {
					res.redirect(redirect.status, redirect.to);
				} else {
					if (req.params.locale !== locale) {
						res.redirect(`/${tenantUrlName}/${locale}/${req.params['0']}`);
					} else {
						next();
					}
				}
			})
			.catch(() => {
				next();
			});
	}
};

export default redirects;
