import security from '../lib/security';
import PaymentGatewaysService from '../services/settings/paymentGateways';
import scopes from '../lib/scopes';

class PaymentGatewaysRoute {
	constructor(router) {
		this.router = router;
		this.registerRoutes();
	}

	registerRoutes() {
		/**
		 * @api {get} /v1/payment_gateways/:name Get Gateway
		 * @apiVersion 1.0.0
		 * @apiName getGateway
		 * @apiGroup Payment Gateways
		 * @apiPermission authenticated user
		 *
		 * @apiParam (Request param) {String} name The payment gateway name
		 *
		 * @apiExample {js} Example usage:
		 * Request URL: http://localhost:3001/api/v1/payment_gateways/paypal-checkout?
		 *
		 * @apiSuccess (Success 200) {String} status Success code
		 *
		 * @apiSuccessExample {json} Success response:
		 *     HTTPS 200 OK
		 *	   {"client":"0000001","color":"blue","env":"sandbox","notify_url":"","shape":"pill","size":"medium"}
		 *
		 * @apiUse UnauthorizedError
		 */
		this.router.get(
			'/v1/payment_gateways/:name',
			security.checkRoleScope.bind(this, scopes.READ_PAYMENT_GATEWAY),
			this.getGateway.bind(this)
		);
		/**
		 * @api {put} /v1/payment_gateways/:name Update Gateway
		 * @apiVersion 1.0.0
		 * @apiName updateGateway
		 * @apiGroup Payment Gateways
		 * @apiPermission authenticated user
		 *
		 * @apiParam (Request param) {String} name The payment gateway name
		 * @apiParam (Request body) {String} client The payment gateway client id
		 * @apiParam (Request body) {String} color The payment gateway color
		 * @apiParam (Request body) {String} env env
		 * @apiParam (Request body) {String} notify_url Notify Url
		 * @apiParam (Request body) {String} shape Shape
		 * @apiParam (Request body) {String} size Button size
		 *
		 * @apiExample {js} Example Request Payload:
		 * {"env":"sandbox","client":"0000001","size":"medium","shape":"pill","color":"blue","notify_url":""}
		 *
		 * @apiSuccess (Success 200) {String} status Success code
		 *
		 * @apiSuccessExample {json} Success response:
		 *     HTTPS 200 OK
		 *	   {"client":"0000001","color":"blue","env":"sandbox","notify_url":"","shape":"pill","size":"medium"}
		 *
		 * @apiUse UnauthorizedError
		 */
		this.router.put(
			'/v1/payment_gateways/:name',
			security.checkRoleScope.bind(this, scopes.WRITE_PAYMENT_GATEWAY),
			this.updateGateway.bind(this)
		);
	}

	getGateway(req, res, next) {
		PaymentGatewaysService.getGateway(req.get('x-tenant-id'), req.params.name)
			.then(data => {
				res.send(data);
			})
			.catch(next);
	}

	updateGateway(req, res, next) {
		PaymentGatewaysService.updateGateway(
			req.get('x-tenant-id'),
			req.params.name,
			req.body
		)
			.then(data => {
				res.send(data);
			})
			.catch(next);
	}
}

export default PaymentGatewaysRoute;
