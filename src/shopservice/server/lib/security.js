import jwt from 'jsonwebtoken';
import expressJwt from 'express-jwt';
import settings from './settings';
import SecurityKeysService from '../services/security/securityKeys';
import winston from 'winston';
import rolesScopes from './rolesScopes';

const PATHS_WITH_OPEN_ACCESS = [
	/\/api\/v1\/p\//i,
	/\/api\/v1\/notifications\//i
];

const checkRoleScope = (requiredScope, req, res, next) => {
	if (req.user && req.user.role) {
		let scopes = [];
		rolesScopes.map(item => item.role === req.user.role ? scopes = item.scopes : null);
		if (scopes.includes(requiredScope)) {
			next();
		} else {
			res.status(403).send({ error: true, message: 'Forbidden' });
		}
	} else {
		res.status(403).send({ error: true, message: 'Forbidden' });
	}
};

const verifyToken = token => {
	return new Promise((resolve, reject) => {
		jwt.verify(token, settings.jwtSecretKey, (err, decoded) => {
			if (err) {
				reject(err);
			} else {
				// check on blacklist
				resolve(decoded);
			}
		});
	});
};

const verifyAccessKey = (req, res, next) => {
	if (req.method === "OPTIONS") {
		next();
		return;
	}

	const accessKey = req.headers['x-access-key']
	
	if (accessKey) {
		jwt.verify(accessKey, settings.jwtSecretKey, (err, decoded) => {
			if (err) {
				winston.error(`Failed to verify apiKey: ${err.message}`);
				return res.status(401).json({
					status: 401,
					message: 'Unauthorized'
				})
			} 
			else {
				res.locals.app_id = decoded.app_id;
				SecurityKeysService.getKeysBlacklist()
					.then(blacklist => {
						const keyIsRevoked = blacklist && blacklist.includes(decoded.jti);
						if (keyIsRevoked) {
							winston.info(`This apiKey ${accessKey} has been revoked!`);
							return res.status(403).json({
								status: 403,
								message: 'Forbidden'
							})
						}
						else {
							next();
						}
					})
					.catch(next);
			}
		});
	} 
	else {
		winston.error('No apiKey is included!');
		return res.status(403).json({
			status: 403,
			message: 'Forbidden'
		})
	}
};

const applyMiddleware = app => {
	app.use(
		expressJwt({
			secret: settings.jwtSecretKey,
			isRevoked: false
		}).unless({ path: PATHS_WITH_OPEN_ACCESS })
	);
};

const getAccessControlAllowOrigin = () => {
	return settings.shopBaseUrl || '*';
};

export default {
	checkRoleScope: checkRoleScope,
	verifyToken: verifyToken,
	verifyAccessKey: verifyAccessKey,
	applyMiddleware: applyMiddleware,
	getAccessControlAllowOrigin: getAccessControlAllowOrigin
};
