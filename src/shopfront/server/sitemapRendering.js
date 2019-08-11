import sm from 'sitemap';
import winston from 'winston';
import api from './api';

const sitemapRendering = (req, res) => {
	const tenantUrlName = req.params.tenantUrlName;
	const locale = req.params.locale;
	const sitemapExcludePath = [
		`/${tenantUrlName}/${locale}/`,
		`/${tenantUrlName}/${locale}/checkout`,
		`/${tenantUrlName}/${locale}/checkout-success`,
		`/${tenantUrlName}/${locale}/login`,
		`/${tenantUrlName}/${locale}/logout`,
		`/${tenantUrlName}/${locale}/register`,
		`/${tenantUrlName}/${locale}/reset-password`,
		`/${tenantUrlName}/${locale}/active-account`,
		`/${tenantUrlName}/${locale}/profile`,
		`/${tenantUrlName}/${locale}/change-password`
	];
	Promise.all([
		api.public.sitemap.list({
			tenantUrlName: tenantUrlName,
			enabled: true,
			locale: locale
		}),
		api.public.settings.retrieve()
	]).then(([sitemapResponse, settingsResponse]) => {
		const sitemapArray = sitemapResponse.json;
		const settings = settingsResponse.json;
		const hostname =
			settings.domain && settings.domain.length > 0
				? settings.domain
				: `${req.protocol}://${req.hostname}`;
		const urls = sitemapArray
			.filter(
				item =>
					item.type !== 'reserved' &&
					item.type !== 'search' &&
					!sitemapExcludePath.includes(item.path)
			)
			.map(item => item.path);
		const sitemap = sm.createSitemap({ hostname, urls });
		sitemap.toXML((err, xml) => {
			if (err) {
				winston.error(err.message ? err.message : err);
				res.status(500).end();
			} else {
				res.header('Content-Type', 'application/xml');
				res.send(xml);
			}
		});
	});
};

export default sitemapRendering;
