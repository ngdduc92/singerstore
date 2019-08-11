import security from '../lib/security';
import WebhooksService from '../services/webhooks';
import scopes from '../lib/scopes';

class WebhooksRoute {
	constructor(router) {
		this.router = router;
		this.registerRoutes();
	}

	registerRoutes() {
		/**
		 * @api {get} /v1/webhooks Get Webhooks
		 * @apiVersion 1.0.0
		 * @apiName getWebhooks
		 * @apiGroup Webhooks
		 * @apiPermission authenticated user
		 *
		 *
		 * @apiExample {js} Example usage:
		 * Request URL: http://localhost:3001/api/v1/webhooks?
		 *
		 * @apiSuccess (Success 200) {String} status Success code
		 * @apiSuccess (Success 304) {String} status Success code
		 *
		 * @apiSuccessExample {json} Success response:
		 *     HTTPS 304 Not Modified
		 *     [{"date_created":"2019-06-12T08:05:00.425Z","description":"Webhook1","url":"wh","secret":"whwh","enabled":true,"events":["order.created"],"id":"5d00b22c7ceb7a138e5e7149"}]
		 *
		 * @apiUse UnauthorizedError
		 */
		this.router.get(
			'/v1/webhooks',
			security.checkRoleScope.bind(this, scopes.LIST_WEBHOOK),
			this.getWebhooks.bind(this)
		);
		/**
		 * @api {post} /v1/webhooks Add Webhook
		 * @apiVersion 1.0.0
		 * @apiName addWebhook
		 * @apiGroup Webhooks
		 * @apiPermission authenticated user
		 *
		 * @apiParam (Request body) {String} description description
		 * @apiParam (Request body) {String} enabled enabled?
		 * @apiParam (Request body) {String} events events
		 * @apiParam (Request body) {String} secret secret
		 * @apiParam (Request body) {String} url Url
		 *
		 * @apiExample {js} Example Request Payload:
		 * {"enabled":true,"description":"Webhook1","url":"wh","secret":"whwh","events":["order.created"]}
		 *
		 * @apiSuccess (Success 200) {String} status Success code
		 *
		 * @apiSuccessExample {json} Success response:
		 *     HTTPS 200 OK
		 *     {"date_created":"2019-06-12T08:05:00.425Z","description":"Webhook1","url":"wh","secret":"whwh","enabled":true,"events":["order.created"],"id":"5d00b22c7ceb7a138e5e7149"}
		 *
		 * @apiUse UnauthorizedError
		 */
		this.router.post(
			'/v1/webhooks',
			security.checkRoleScope.bind(this, scopes.WRITE_WEBHOOK),
			this.addWebhook.bind(this)
		);
		/**
		 * @api {get} /v1/webhooks/:id Get Single Webhook
		 * @apiVersion 1.0.0
		 * @apiName getSingleWebhook
		 * @apiGroup Webhooks
		 * @apiPermission authenticated user
		 *
		 * @apiParam (Request param) {String} id The Webhook id
		 *
		 * @apiExample {js} Example usage:
		 * Request URL: http://localhost:3001/api/v1/webhooks/5d00b22c7ceb7a138e5e7149?
		 *
		 * @apiSuccess (Success 200) {String} status Success code
		 *
		 * @apiSuccessExample {json} Success response:
		 *     HTTPS 200 OK
		 *     {"date_created":"2019-06-12T08:05:00.425Z","description":"Webhook1","url":"wh","secret":"whwh","enabled":true,"events":["order.created"],"id":"5d00b22c7ceb7a138e5e7149"}
		 *
		 * @apiUse UnauthorizedError
		 */
		this.router.get(
			'/v1/webhooks/:id',
			security.checkRoleScope.bind(this, scopes.READ_WEBHOOK),
			this.getSingleWebhook.bind(this)
		);
		/**
		 * @api {put} /v1/webhooks/:id Update Webhook
		 * @apiVersion 1.0.0
		 * @apiName updateWebhook
		 * @apiGroup Webhooks
		 * @apiPermission authenticated user
		 *
		 * @apiParam (Request param) {String} id The Webhook id
		 * @apiParam (Request body) {String} date_created Date created
		 * @apiParam (Request body) {String} description description
		 * @apiParam (Request body) {String} enabled enabled?
		 * @apiParam (Request body) {String} events events
		 * @apiParam (Request body) {String} id The Webhook id
		 * @apiParam (Request body) {String} secret secret
		 * @apiParam (Request body) {String} url Url
		 *
		 * @apiExample {js} Example Request Payload:
		 * {"date_created":"2019-06-12T08:05:00.425Z","description":"Webhook1","url":"wh1","secret":"whwh","enabled":true,"events":["order.created"],"id":"5d00b22c7ceb7a138e5e7149"}
		 *
		 * @apiSuccess (Success 200) {String} status Success code
		 *
		 * @apiSuccessExample {json} Success response:
		 *     HTTPS 200 OK
		 *     {"date_created":"2019-06-12T08:05:00.425Z","description":"Webhook1","url":"wh1","secret":"whwh","enabled":true,"events":["order.created"],"date_updated":"2019-06-12T08:07:28.159Z","id":"5d00b22c7ceb7a138e5e7149"}
		 *
		 * @apiUse UnauthorizedError
		 */
		this.router.put(
			'/v1/webhooks/:id',
			security.checkRoleScope.bind(this, scopes.WRITE_WEBHOOK),
			this.updateWebhook.bind(this)
		);
		/**
		 * @api {delete} /v1/webhooks/:id Delete Webhook
		 * @apiVersion 1.0.0
		 * @apiName deleteWebhook
		 * @apiGroup Webhooks
		 * @apiPermission authenticated user
		 *
		 * @apiParam (Request param) {String} id The Webhook id
		 *
		 * @apiExample {js} Example usage:
		 * Request URL: http://localhost:3001/api/v1/webhooks/5d00b22c7ceb7a138e5e7149
		 *
		 * @apiSuccess (Success 200) {String} status Success code
		 *
		 * @apiSuccessExample {json} Success response:
		 *     HTTPS 200 OK
		 *
		 * @apiUse UnauthorizedError
		 */
		this.router.delete(
			'/v1/webhooks/:id',
			security.checkRoleScope.bind(this, scopes.DELETE_WEBHOOK),
			this.deleteWebhook.bind(this)
		);
	}

	getWebhooks(req, res, next) {
		WebhooksService.getWebhooks(req.query)
			.then(data => {
				res.send(data);
			})
			.catch(next);
	}

	getSingleWebhook(req, res, next) {
		WebhooksService.getSingleWebhook(req.params.id)
			.then(data => {
				if (data) {
					res.send(data);
				} else {
					res.status(404).end();
				}
			})
			.catch(next);
	}

	addWebhook(req, res, next) {
		WebhooksService.addWebhook(req.body)
			.then(data => {
				res.send(data);
			})
			.catch(next);
	}

	updateWebhook(req, res, next) {
		WebhooksService.updateWebhook(req.params.id, req.body)
			.then(data => {
				if (data) {
					res.send(data);
				} else {
					res.status(404).end();
				}
			})
			.catch(next);
	}

	deleteWebhook(req, res, next) {
		WebhooksService.deleteWebhook(req.params.id)
			.then(data => {
				res.status(data ? 200 : 404).end();
			})
			.catch(next);
	}
}

export default WebhooksRoute;
