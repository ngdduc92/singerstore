import security from '../lib/security';
import PaymentMethodsService from '../services/orders/paymentMethods';
import scopes from '../lib/scopes';

class PaymentMethodsRoute {
	constructor(router) {
		this.router = router;
		this.registerRoutes();
	}

	registerRoutes() {
		/**
		 * @api {get} /v1/payment_methods Get Methods
		 * @apiVersion 1.0.0
		 * @apiName getMethods
		 * @apiGroup Payment Methods
		 * @apiPermission authenticated user
		 *
		 * @apiExample {js} Example usage:
		 * Request URL: http://localhost:3001/api/v1/payment_methods?
		 *
		 * @apiSuccess (Success 200) {String} status Success code
		 *
		 * @apiSuccessExample {json} Success response:
		 *     HTTPS 200 OK
		 *     [{"name":"Paypal","description":"Paypal","position":0,"enabled":true,"conditions":{"countries":["US"],"shipping_method_ids":[],"subtotal_min":0,"subtotal_max":0},"gateway":"paypal-checkout","tenant_id":"5cf6520b5407a83e20be98b9","deleted":false,"id":"5d006e3d7ceb7a138e5e713a"}]
		 *
		 * @apiUse UnauthorizedError
		 */
		this.router.get(
			'/v1/payment_methods',
			security.checkRoleScope.bind(this, scopes.LIST_PAYMENT_METHOD),
			this.getMethods.bind(this)
		);
		/**
		 * @api {post} /v1/payment_methods Add Method
		 * @apiVersion 1.0.0
		 * @apiName addMethod
		 * @apiGroup Payment Methods
		 * @apiPermission authenticated user
		 *
		 * @apiParam (Request body) {String} conditions Conditions
		 * @apiParam (Request body) {String} description Description
		 * @apiParam (Request body) {String} enabled  enabled?
		 * @apiParam (Request body) {String} gateway gateway
		 * @apiParam (Request body) {String} name Name
		 *
		 * @apiExample {js} Example Request Payload:
		 * {"enabled":true,"gateway":"paypal-checkout","name":"Paypal","description":"Paypal","conditions":{"countries":["US"]}}
		 *
		 * @apiSuccess (Success 200) {String} status Success code
		 *
		 * @apiSuccessExample {json} Success response:
		 *     HTTPS 200 OK
		 *     {"name":"Paypal","description":"Paypal","position":0,"enabled":true,"conditions":{"countries":["US"],"shipping_method_ids":[],"subtotal_min":0,"subtotal_max":0},"gateway":"paypal-checkout","tenant_id":"5cf6520b5407a83e20be98b9","deleted":false,"id":"5d006e3d7ceb7a138e5e713a"}
		 *
		 * @apiUse UnauthorizedError
		 */
		this.router.post(
			'/v1/payment_methods',
			security.checkRoleScope.bind(this, scopes.WRITE_PAYMENT_METHOD),
			this.addMethod.bind(this)
		);
		/**
		 * @api {get} /v1/payment_methods/:id Get Single Method
		 * @apiVersion 1.0.0
		 * @apiName getSingleMethod
		 * @apiGroup Payment Methods
		 * @apiPermission authenticated user
		 *
		 * @apiParam (Request param) {String} id The payment method id
		 *
		 * @apiExample {js} Example usage:
		 * Request URL: http://localhost:3001/api/v1/payment_methods/5d006e3d7ceb7a138e5e713a?
		 *
		 * @apiSuccess (Success 200) {String} status Success code
		 *
		 * @apiSuccessExample {json} Success response:
		 *     HTTPS 200 OK
		 *     {"name":"Paypal","description":"Paypal","position":0,"enabled":true,"conditions":{"countries":["US"],"shipping_method_ids":[],"subtotal_min":0,"subtotal_max":0},"gateway":"paypal-checkout","tenant_id":"5cf6520b5407a83e20be98b9","deleted":false,"id":"5d006e3d7ceb7a138e5e713a"}
		 *
		 * @apiUse UnauthorizedError
		 */
		this.router.get(
			'/v1/payment_methods/:id',
			security.checkRoleScope.bind(this, scopes.READ_PAYMENT_METHOD),
			this.getSingleMethod.bind(this)
		);
		/**
		 * @api {put} /v1/payment_methods/:id Update Method
		 * @apiVersion 1.0.0
		 * @apiName updateMethod
		 * @apiGroup Payment Methods
		 * @apiPermission authenticated user
		 *
		 * @apiParam (Request param) {String} id The payment method id
		 * @apiParam (Request body) {String} conditions Conditions
		 * @apiParam (Request body) {String} deleted deleted?
		 * @apiParam (Request body) {String} description description
		 * @apiParam (Request body) {String} enabled enabled?
		 * @apiParam (Request body) {String} gateway gateway
		 * @apiParam (Request body) {String} id The payment method id
		 * @apiParam (Request body) {String} name The payment method name
		 * @apiParam (Request body) {String} position position
		 * @apiParam (Request body) {String} tenant_id The tenant id
		 *
		 * @apiExample {js} Example Request Payload:
		 * {"name":"Paypal","description":"Paypal","position":0,"enabled":true,"conditions":{"countries":["US","UK"],"shipping_method_ids":[],"subtotal_min":0,"subtotal_max":0},"gateway":"paypal-checkout","tenant_id":"5cf6520b5407a83e20be98b9","deleted":false,"id":"5d006e3d7ceb7a138e5e713a"}
		 *
		 * @apiSuccess (Success 200) {String} status Success code
		 * @apiSuccess (Success 201) {String} id The campaign id
		 *
		 * @apiSuccessExample {json} Success response:
		 *     HTTPS 200 OK
		 *     {"name":"Paypal","description":"Paypal","position":0,"enabled":true,"conditions":{"countries":["US","UK"],"shipping_method_ids":[],"subtotal_min":0,"subtotal_max":0},"gateway":"paypal-checkout","tenant_id":"5cf6520b5407a83e20be98b9","deleted":false,"id":"5d006e3d7ceb7a138e5e713a"}
		 *
		 * @apiUse UnauthorizedError
		 */
		this.router.put(
			'/v1/payment_methods/:id',
			security.checkRoleScope.bind(this, scopes.WRITE_PAYMENT_METHOD),
			this.updateMethod.bind(this)
		);
		/**
		 * @api {delete} /v1/payment_methods/:id Delete Method
		 * @apiVersion 1.0.0
		 * @apiName deleteMethod
		 * @apiGroup Payment Methods
		 * @apiPermission authenticated user
		 *
		 * @apiParam (Request param) {String} id The payment method id
		 *
		 * @apiExample {js} Example usage:
		 * Request URL: http://localhost:3001/api/v1/payment_methods/5d006e3d7ceb7a138e5e713a
		 *
		 * @apiSuccess (Success 200) {String} status Success code
		 *
		 * @apiSuccessExample {json} Success response:
		 *     HTTPS 200 OK
		 *
		 * @apiUse UnauthorizedError
		 */
		this.router.delete(
			'/v1/payment_methods/:id',
			security.checkRoleScope.bind(this, scopes.DELETE_PAYMENT_METHOD),
			this.deleteMethod.bind(this)
		);
	}

	getMethods(req, res, next) {
		PaymentMethodsService.getMethods(req.get('x-tenant-id'), req.query)
			.then(data => {
				res.send(data);
			})
			.catch(next);
	}

	getSingleMethod(req, res, next) {
		PaymentMethodsService.getSingleMethod(req.get('x-tenant-id'), req.params.id)
			.then(data => {
				if (data) {
					res.send(data);
				} else {
					res.status(404).end();
				}
			})
			.catch(next);
	}

	addMethod(req, res, next) {
		PaymentMethodsService.addMethod(req.get('x-tenant-id'), req.body)
			.then(data => {
				res.send(data);
			})
			.catch(next);
	}

	updateMethod(req, res, next) {
		PaymentMethodsService.updateMethod(
			req.get('x-tenant-id'),
			req.params.id,
			req.body
		)
			.then(data => {
				if (data) {
					res.send(data);
				} else {
					res.status(404).end();
				}
			})
			.catch(next);
	}

	deleteMethod(req, res, next) {
		PaymentMethodsService.deleteMethod(req.params.id)
			.then(data => {
				res.status(data ? 200 : 404).end();
			})
			.catch(next);
	}
}

export default PaymentMethodsRoute;
