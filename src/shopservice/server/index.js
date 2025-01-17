import express from 'express';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import responseTime from 'response-time';
import winston from 'winston';
import logger from './lib/logger';
import settings from './lib/settings';
import security from './lib/security';
import dashboardWebSocket from './lib/dashboardWebSocket';
import apiRouter from './apiRouter';
const app = express();

security.applyMiddleware(app);
app.set('trust proxy', 1);
app.use(helmet());
app.all('*', (req, res, next) => {
	// CORS headers
	res.header(
		'Access-Control-Allow-Origin',
		security.getAccessControlAllowOrigin()
	);
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
	res.header('Access-Control-Allow-Credentials', 'true');
	res.header(
		'Access-Control-Allow-Headers',
		'Origin, X-Requested-With, Content-Type, Accept, Key, Authorization, X-Tenant-Id, X-Access-Key'
	);
	next();
});
app.use(responseTime());
app.use(cookieParser(settings.cookieSecretKey));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/api', security.verifyAccessKey);
app.use('/api', apiRouter);
app.use(logger.sendResponse);

const server = app.listen(settings.apiListenPort, () => {
	const serverAddress = server.address();
	winston.info(
		`eShop API server running at http://localhost:${serverAddress.port}`
	);
});

dashboardWebSocket.listen(server);
