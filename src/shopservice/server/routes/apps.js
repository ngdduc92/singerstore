import security from '../lib/security';
import AppSettingsService from '../services/apps/settings';
import scopes from '../lib/scopes';

class AppsRoute {
	constructor(router) {
		this.router = router;
		this.registerRoutes();
	}

	registerRoutes() {
		/**
		 * @api {get} /v1/apps/:key/settings Get Settings
		 * @apiVersion 1.0.0
		 * @apiName getSettings
		 * @apiGroup Apps
		 * @apiPermission authenticated user
		 *
		 * @apiParam (Request param) {String} key The setting key
		 *
		 * @apiExample {js} Example usage:
		 * Request URL: http://localhost:3001/api/v1/apps/google-analytics/settings?
		 *
		 * @apiSuccess (Success 200) {String} status Success code
		 *
		 * @apiSuccessExample {json} Success response:
		 *     HTTPS 200 OK
		 *
		 * @apiUse UnauthorizedError
		 */
		this.router.get(
			'/v1/apps/:key/settings',
			security.checkRoleScope.bind(this, scopes.READ_APP),
			this.getSettings.bind(this)
		);
		/**
		 * @api {put} /v1/apps/:key/settings Update Settings
		 * @apiVersion 1.0.0
		 * @apiName updateSettings
		 * @apiGroup Apps
		 * @apiPermission authenticated user
		 *
		 * @apiParam (Request param) {String} key The setting key
		 *
		 * @apiExample {js} Example request payload:
		 * {"GA_TRACKING_ID":"00000001"}
		 *
		 * @apiSuccess (Success 200) {String} status Success code
		 *
		 * @apiSuccessExample {json} Success response:
		 *     HTTPS 200 OK
		 *     {"_id":"5cff6161d90dd244539a0d6e","key":"google-analytics","GA_TRACKING_ID":"00000001"}
		 *
		 * @apiUse UnauthorizedError
		 */
		this.router.put(
			'/v1/apps/:key/settings',
			security.checkRoleScope.bind(this, scopes.WRITE_APP),
			this.updateSettings.bind(this)
		);
	}

	getSettings(req, res, next) {
		AppSettingsService.getSettings(req.params.key)
			.then(data => {
				res.send(data);
			})
			.catch(next);
	}

	updateSettings(req, res, next) {
		AppSettingsService.updateSettings(req.params.key, req.body)
			.then(data => {
				if (data) {
					res.send(data);
				} else {
					res.status(404).end();
				}
			})
			.catch(next);
	}
}

export default AppsRoute;
