import security from '../lib/security';
import OrderStatusesService from '../services/orders/orderStatuses';
import scopes from '../lib/scopes';

class OrderStatusesRoute {
	constructor(router) {
		this.router = router;
		this.registerRoutes();
	}

	registerRoutes() {
		/**
		 * @api {get} /v1/order_statuses Get Statuses
		 * @apiVersion 1.0.0
		 * @apiName getStatuses
		 * @apiGroup Order Statuses
		 * @apiPermission authenticated user
		 *
		 * @apiExample {js} Example usage:
		 * Request URL: http://localhost:3001/api/v1/order_statuses?
		 *
		 * @apiSuccess (Success 200) {String} status Success code
		 *
		 * @apiSuccessExample {json} Success response:
		 *     HTTPS 200 OK
		 *     [{"name":"Placed","description":"Order placed","color":"","bgcolor":"","is_public":false,"tenant_id":"5cf6520b5407a83e20be98b9","deleted":false,"id":"5cff7a8f7ceb7a138e5e7135"}]
		 *
		 * @apiUse UnauthorizedError
		 */
		this.router.get(
			'/v1/order_statuses',
			security.checkRoleScope.bind(this, scopes.LIST_ORDER_STATUS),
			this.getStatuses.bind(this)
		);
		/**
		 * @api {post} /v1/order_statuses Add Status
		 * @apiVersion 1.0.0
		 * @apiName addStatus
		 * @apiGroup Order Statuses
		 * @apiPermission authenticated user
		 *
		 * @apiParam (Request body) {String} name The order status name
		 * @apiParam (Request body) {String} description The order status description
		 *
		 * @apiExample {js} Example Request Payload:
		 * {"name":"Placed","description":"Order placed"}
		 *
		 * @apiSuccess (Success 200) {String} status Success code
		 *
		 * @apiSuccessExample {json} Success response:
		 *     HTTPS 200 OK
		 *     {"name":"Placed","description":"Order placed","color":"","bgcolor":"","is_public":false,"tenant_id":"5cf6520b5407a83e20be98b9","deleted":false,"id":"5cff7a8f7ceb7a138e5e7135"}
		 *
		 * @apiUse UnauthorizedError
		 */
		this.router.post(
			'/v1/order_statuses',
			security.checkRoleScope.bind(this, scopes.WRITE_ORDER_STATUS),
			this.addStatus.bind(this)
		);
		/**
		 * @api {get} /v1/order_statuses/:id Get Single Status
		 * @apiVersion 1.0.0
		 * @apiName getSingleStatus
		 * @apiGroup Order Statuses
		 * @apiPermission authenticated user
		 *
		 * @apiParam (Request param) {String} id The order status id
		 *
		 * @apiExample {js} Example usage:
		 * Request URL: http://localhost:3001/api/v1/order_statuses/5cff7a8f7ceb7a138e5e7135
		 *
		 * @apiSuccess (Success 200) {String} status Success code
		 *
		 * @apiSuccessExample {json} Success response:
		 *     HTTPS 200 OK
		 *
		 * @apiUse UnauthorizedError
		 */
		this.router.get(
			'/v1/order_statuses/:id',
			security.checkRoleScope.bind(this, scopes.READ_ORDER_STATUS),
			this.getSingleStatus.bind(this)
		);
		/**
		 * @api {put} /v1/order_statuses/:id Update Status
		 * @apiVersion 1.0.0
		 * @apiName updateStatus
		 * @apiGroup Order Statuses
		 * @apiPermission authenticated user
		 *
		 * @apiParam (Request param) {String} id The order status id
		 * @apiParam (Request body) {String} bgcolor bgcolor
		 * @apiParam (Request body) {String} color color
		 * @apiParam (Request body) {String} deleted deleted?
		 * @apiParam (Request body) {String} description Order status description
		 * @apiParam (Request body) {String} id Order status id
		 * @apiParam (Request body) {String} is_public is_public?
		 * @apiParam (Request body) {String} name Order status name
		 * @apiParam (Request body) {String} tenant_id The tenant id
		 *
		 * @apiExample {js} Example Request Payload:
		 * {"name":"In progress","description":"Order In progress","color":"","bgcolor":"","is_public":false,"tenant_id":"5cf6520b5407a83e20be98b9","deleted":false,"id":"5cff7af07ceb7a138e5e7136"}
		 *
		 * @apiSuccess (Success 200) {String} status Success code
		 *
		 * @apiSuccessExample {json} Success response:
		 *     HTTPS 200 OK
		 *     {"name":"In progress","description":"Order In progress","color":"","bgcolor":"","is_public":false,"tenant_id":"5cf6520b5407a83e20be98b9","deleted":false,"id":"5cff7af07ceb7a138e5e7136"}
		 *
		 * @apiUse UnauthorizedError
		 */
		this.router.put(
			'/v1/order_statuses/:id',
			security.checkRoleScope.bind(this, scopes.WRITE_ORDER_STATUS),
			this.updateStatus.bind(this)
		);
		/**
		 * @api {put} /v1/order_statuses/:id Delete Status
		 * @apiVersion 1.0.0
		 * @apiName deleteStatus
		 * @apiGroup Order Statuses
		 * @apiPermission authenticated user
		 *
		 * @apiParam (Request param) {String} id The order status id
		 *
		 * @apiExample {js} Example usage:
		 * Request URL: http://localhost:3001/api/v1/order_statuses/5cff7bc57ceb7a138e5e7137
		 *
		 * @apiSuccess (Success 200) {String} status Success code
		 *
		 * @apiSuccessExample {json} Success response:
		 *     HTTPS 200 OK
		 *
		 * @apiUse UnauthorizedError
		 */
		this.router.delete(
			'/v1/order_statuses/:id',
			security.checkRoleScope.bind(this, scopes.DELETE_ORDER_STATUS),
			this.deleteStatus.bind(this)
		);
	}

	getStatuses(req, res, next) {
		OrderStatusesService.getStatuses(req.get('x-tenant-id'), req.query)
			.then(data => {
				res.send(data);
			})
			.catch(next);
	}

	getSingleStatus(req, res, next) {
		OrderStatusesService.getSingleStatus(req.get('x-tenant-id'), req.params.id)
			.then(data => {
				if (data) {
					res.send(data);
				} else {
					res.status(404).end();
				}
			})
			.catch(next);
	}

	addStatus(req, res, next) {
		OrderStatusesService.addStatus(req.get('x-tenant-id'), req.body)
			.then(data => {
				res.send(data);
			})
			.catch(next);
	}

	updateStatus(req, res, next) {
		OrderStatusesService.updateStatus(
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

	deleteStatus(req, res, next) {
		OrderStatusesService.deleteStatus(req.params.id)
			.then(data => {
				res.status(data ? 200 : 404).end();
			})
			.catch(next);
	}
}

export default OrderStatusesRoute;
