import security from '../lib/security';
import ShippingMethodsService from '../services/orders/shippingMethods';
import scopes from '../lib/scopes';

class ShippingMethodsRoute {
	constructor(router) {
		this.router = router;
		this.registerRoutes();
	}

	registerRoutes() {
		/**
		 * @api {get} /v1/shipping_methods Get Methods
		 * @apiVersion 1.0.0
		 * @apiName getMethods
		 * @apiGroup Shipping Methods
		 * @apiPermission authenticated user
		 *
		 *
		 * @apiExample {js} Example usage:
		 * Request URL: http://localhost:3001/api/v1/shipping_methods?
		 *
		 * @apiSuccess (Success 200) {String} status Success code
		 * @apiSuccess (Success 304) {String} status Success code
		 *
		 * @apiSuccessExample {json} Success response:
		 *     HTTPS 200 OK
		 *     [{"name":"UPS","description":"Ship via UPS","position":0,"enabled":true,"price":10,"conditions":{"countries":["US","UK"],"states":[],"cities":[],"subtotal_min":0,"subtotal_max":0,"weight_total_min":0,"weight_total_max":0},"fields":[{"key":"full_name","label":"","required":true},{"key":"address1","label":"","required":true},{"key":"address2","label":"","required":false},{"key":"postal_code","label":"","required":false},{"key":"phone","label":"","required":false}],"tenant_id":"5cf6520b5407a83e20be98b9","deleted":false,"id":"5d00abbc7ceb7a138e5e713c"}]
		 *
		 * @apiUse UnauthorizedError
		 */
		this.router.get(
			'/v1/shipping_methods',
			security.checkRoleScope.bind(this, scopes.LIST_SHIPPING_METHOD),
			this.getMethods.bind(this)
		);
		/**
		 * @api {post} /v1/shipping_methods Add Method
		 * @apiVersion 1.0.0
		 * @apiName addMethod
		 * @apiGroup Shipping Methods
		 * @apiPermission authenticated user
		 *
		 * @apiParam (Request body) {String} conditions Method conditions
		 * @apiParam (Request body) {String} description Method description
		 * @apiParam (Request body) {String} enabled Method enabled?
		 * @apiParam (Request body) {String} fields Method fields
		 * @apiParam (Request body) {String} name Method name
		 * @apiParam (Request body) {String} price Price
		 *
		 * @apiExample {js} Example Request Payload:
		 * {"enabled":true,"fields":[{"key":"full_name","label":"","required":true},{"key":"address1","label":"","required":true},{"key":"address2","label":"","required":false},{"key":"postal_code","label":"","required":false},{"key":"phone","label":"","required":false}],"name":"UPS","description":"Ship via UPS","conditions":{"countries":["US","UK"]},"price":"10"}
		 *
		 * @apiSuccess (Success 200) {String} status Success code
		 *
		 * @apiSuccessExample {json} Success response:
		 *     HTTPS 200 OK
		 *     {"name":"UPS","description":"Ship via UPS","position":0,"enabled":true,"price":10,"conditions":{"countries":["US","UK"],"states":[],"cities":[],"subtotal_min":0,"subtotal_max":0,"weight_total_min":0,"weight_total_max":0},"fields":[{"key":"full_name","label":"","required":true},{"key":"address1","label":"","required":true},{"key":"address2","label":"","required":false},{"key":"postal_code","label":"","required":false},{"key":"phone","label":"","required":false}],"tenant_id":"5cf6520b5407a83e20be98b9","deleted":false,"id":"5d00abbc7ceb7a138e5e713c"}
		 *
		 * @apiUse UnauthorizedError
		 */
		this.router.post(
			'/v1/shipping_methods',
			security.checkRoleScope.bind(this, scopes.WRITE_SHIPPING_METHOD),
			this.addMethod.bind(this)
		);
		/**
		 * @api {get} /v1/shipping_methods/:id Get Single Method
		 * @apiVersion 1.0.0
		 * @apiName getSingleMethod
		 * @apiGroup Shipping Methods
		 * @apiPermission authenticated user
		 *
		 * @apiParam (Request param) {String} id The Single Method id
		 *
		 * @apiExample {js} Example usage:
		 * Request URL: http://localhost:3001/api/v1/shipping_methods/5d00abbc7ceb7a138e5e713c?
		 *
		 * @apiSuccess (Success 200) {String} status Success code
		 *
		 * @apiSuccessExample {json} Success response:
		 *     HTTPS 200 OK
		 *     {"name":"UPS","description":"Ship via UPS","position":0,"enabled":true,"price":10,"conditions":{"countries":["US","UK"],"states":[],"cities":[],"subtotal_min":0,"subtotal_max":0,"weight_total_min":0,"weight_total_max":0},"fields":[{"key":"full_name","label":"","required":true},{"key":"address1","label":"","required":true},{"key":"address2","label":"","required":false},{"key":"postal_code","label":"","required":false},{"key":"phone","label":"","required":false}],"tenant_id":"5cf6520b5407a83e20be98b9","deleted":false,"id":"5d00abbc7ceb7a138e5e713c"}
		 *
		 * @apiUse UnauthorizedError
		 */
		this.router.get(
			'/v1/shipping_methods/:id',
			security.checkRoleScope.bind(this, scopes.READ_SHIPPING_METHOD),
			this.getSingleMethod.bind(this)
		);
		/**
		 * @api {put} /v1/shipping_methods/:id Update Method
		 * @apiVersion 1.0.0
		 * @apiName updateMethod
		 * @apiGroup Shipping Methods
		 * @apiPermission authenticated user
		 *
		 * @apiParam (Request param) {String} id The Single Method id
		 * @apiParam (Request body) {String} conditions Method conditions
		 * @apiParam (Request body) {String} deleted deleted?
		 * @apiParam (Request body) {String} description Method description
		 * @apiParam (Request body) {String} enabled Method enabled?
		 * @apiParam (Request body) {String} fields Method fields
		 * @apiParam (Request body) {String} name Method name
		 * @apiParam (Request body) {String} price Price
		 * @apiParam (Request body) {String} id The Method id
		 * @apiParam (Request body) {String} position position
		 * @apiParam (Request body) {String} tenant_id The tenant id
		 *
		 * @apiExample {js} Example Request Payload:
		 * {"name":"UPS","description":"Ship via UPS","position":0,"enabled":true,"price":"15","conditions":{"countries":["US","UK"],"states":[],"cities":[],"subtotal_min":0,"subtotal_max":0,"weight_total_min":0,"weight_total_max":0},"fields":[{"key":"full_name","label":"","required":true},{"key":"address1","label":"","required":true},{"key":"address2","label":"","required":false},{"key":"postal_code","label":"","required":false},{"key":"phone","label":"","required":false}],"tenant_id":"5cf6520b5407a83e20be98b9","deleted":false,"id":"5d00abbc7ceb7a138e5e713c"}
		 *
		 * @apiSuccess (Success 200) {String} status Success code
		 *
		 * @apiSuccessExample {json} Success response:
		 *     HTTPS 200 OK
		 *     {"name":"UPS","description":"Ship via UPS","position":0,"enabled":true,"price":15,"conditions":{"countries":["US","UK"],"states":[],"cities":[],"subtotal_min":0,"subtotal_max":0,"weight_total_min":0,"weight_total_max":0},"fields":[{"key":"full_name","label":"","required":true},{"key":"address1","label":"","required":true},{"key":"address2","label":"","required":false},{"key":"postal_code","label":"","required":false},{"key":"phone","label":"","required":false}],"tenant_id":"5cf6520b5407a83e20be98b9","deleted":false,"id":"5d00abbc7ceb7a138e5e713c"}
		 *
		 * @apiUse UnauthorizedError
		 */
		this.router.put(
			'/v1/shipping_methods/:id',
			security.checkRoleScope.bind(this, scopes.WRITE_SHIPPING_METHOD),
			this.updateMethod.bind(this)
		);
		/**
		 * @api {delete} /v1/shipping_methods/:id Delete Method
		 * @apiVersion 1.0.0
		 * @apiName deleteMethod
		 * @apiGroup Shipping Methods
		 * @apiPermission authenticated user
		 *
		 * @apiParam (Request param) {String} id The Single Method id
		 *
		 * @apiExample {js} Example usage:
		 * Request URL: http://localhost:3001/api/v1/shipping_methods/5d00abbc7ceb7a138e5e713c
		 *
		 * @apiSuccess (Success 200) {String} status Success code
		 *
		 * @apiSuccessExample {json} Success response:
		 *     HTTPS 200 OK
		 *
		 * @apiUse UnauthorizedError
		 */
		this.router.delete(
			'/v1/shipping_methods/:id',
			security.checkRoleScope.bind(this, scopes.DELETE_SHIPPING_METHOD),
			this.deleteMethod.bind(this)
		);
	}

	getMethods(req, res, next) {
		ShippingMethodsService.getMethods(req.get('x-tenant-id'), req.query)
			.then(data => {
				res.send(data);
			})
			.catch(next);
	}

	getSingleMethod(req, res, next) {
		ShippingMethodsService.getSingleMethod(
			req.get('x-tenant-id'),
			req.params.id
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

	addMethod(req, res, next) {
		ShippingMethodsService.addMethod(req.get('x-tenant-id'), req.body)
			.then(data => {
				res.send(data);
			})
			.catch(next);
	}

	updateMethod(req, res, next) {
		ShippingMethodsService.updateMethod(
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

	async deleteMethod(req, res, next) {
		const result = await ShippingMethodsService.deleteMethod(req.params.id);
		res.status(result ? 200 : 404).end();
	}
}

export default ShippingMethodsRoute;
