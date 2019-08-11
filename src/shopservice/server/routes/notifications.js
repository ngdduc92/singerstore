import PaymentGateways from '../paymentGateways';
import scopes from '../lib/scopes';

class NotificationsRoute {
	constructor(router) {
		this.router = router;
		this.registerRoutes();
	}

	registerRoutes() {
		/**
		 * @api {post} /v1/notifications/:gateway Payment Notification
		 * @apiVersion 1.0.0
		 * @apiName paymentNotification
		 * @apiGroup Notifications
		 * @apiPermission authenticated user
		 *
		 * @apiParam (Request param) {String} gateway The gateway
		 *
		 * @apiExample {js} Example usage:
		 * Request URL: http://localhost:3001/api/v1/notifications/gateway
		 *
		 * @apiSuccess (Success 200) {String} status Success code
		 *
		 * @apiSuccessExample {json} Success response:
		 *     HTTPS 200 OK
		 *
		 * @apiUse UnauthorizedError
		 */
		this.router.post(
			'/v1/notifications/:gateway',
			this.paymentNotification.bind(this)
		);
	}

	paymentNotification(req, res, next) {
		PaymentGateways.paymentNotification(req, res, req.params.gateway);
	}
}

export default NotificationsRoute;
