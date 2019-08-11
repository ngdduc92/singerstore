import express from 'express';
import helmet from 'helmet';
import responseTime from 'response-time';
import path from 'path';
import cookieParser from 'cookie-parser';
import winston from 'winston';
import settings from '../../../config/server';
import robotsRendering from './robotsRendering';
import sitemapRendering from './sitemapRendering';
import redirects from './redirects';
import pageRendering from './pageRendering';
import cookiesMiddleware from 'universal-cookie-express';
import beforeRendering from './beforeRendering';

const app = express();

const ADMIN_INDEX_PATH = path.resolve('public/admin/index.html');
const STATIC_OPTIONS = {
	maxAge: 31536000000 // One year
};

app.set('trust proxy', 1);
app.use(helmet());
app.get('/:tenantId/images/:entity/:id/:size/:filename', (req, res, next) => {
	// A stub of image resizing (can be done with Nginx)
	req.url = `/${req.params.tenantId}/images/${req.params.entity}/${req.params.id}/${req.params.filename}`;
	next();
});
app.use(express.static('public/content', STATIC_OPTIONS));
app.use('/assets', express.static('theme/assets', STATIC_OPTIONS));
app.use('/admin-assets', express.static('public/admin-assets', STATIC_OPTIONS));
app.use('/sw.js', express.static('theme/assets/sw.js'));
app.use(cookiesMiddleware());
app.use('/:tenantUrlName/:locale/admin', (req, res) => {
	res.sendFile(ADMIN_INDEX_PATH);
});
app.use(`/${settings.dftDashboardUrlname}/`, (req, res) => {
	res.redirect(
		`/${settings.dftDashboardUrlname}/${settings.dftLanguageAndRegion}/admin`
	);
});
app.get(
	/^.+\.(jpg|jpeg|gif|png|bmp|ico|webp|svg|css|js|zip|rar|flv|swf|xls)$/,
	(req, res) => {
		res.status(404).end();
	}
);
app.get('/:tenantUrlName/*', beforeRendering);
app.get('/:tenantUrlName/:locale/*', redirects);
app.get('/:tenantUrlName/robots.txt', robotsRendering);
app.get('/:tenantUrlName/sitemap.xml', sitemapRendering);
app.use(responseTime());
app.use(cookieParser(settings.cookieSecretKey));
app.get('/:tenantUrlName/:locale/*', pageRendering);
app.get('/:tenantUrlName', (req, res) => {
	// do the trick for a workaround only
	res.redirect(`/${req.params.tenantUrlName}/us/`);
});
app.get('/:tenantUrlName/:locale', (req, res) => {
	res.redirect(`/${req.params.tenantUrlName}/${req.params.locale}/`);
});
app.get('/', (req, res) => {
	// redirect to the default shopfront
	res.redirect(
		`/${settings.dftShopfrontUrlname}/${settings.dftLanguageAndRegion}/`
	);
});

const server = app.listen(settings.shopListenPort, () => {
	const serverAddress = server.address();
	winston.info(
		`eShop UI server running at http://localhost:${serverAddress.port}`
	);
});
