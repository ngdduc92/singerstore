import security from '../lib/security';
import CustomerGroupsService from '../services/customers/customerGroups';
import scopes from '../lib/scopes';

class CustomerGroupsRoute {
	constructor(router) {
		this.router = router;
		this.registerRoutes();
	}

	registerRoutes() {
		/**
		 * @api {get} /v1/customer_groups Get Groups
		 * @apiVersion 1.0.0
		 * @apiName getGroups
		 * @apiGroup Customer Groups
		 * @apiPermission authenticated user
		 *
		 * @apiExample {js} Example usage:
		 * Request URL: http://localhost:3001/api/v1/customer_groups?
		 *
		 * @apiSuccess (Success 200) {String} status Success code
		 *
		 * @apiSuccessExample {json} Success response:
		 *     HTTPS 200 OK
		 *     [{"date_created":"2019-06-11T08:10:58.397Z","name":"VIP","description":"VIP customers","tenant_id":"5cf6520b5407a83e20be98b9","deleted":false,"id":"5cff62127ceb7a138e5e712c"}]
		 *
		 * @apiUse UnauthorizedError
		 */
		this.router.get(
			'/v1/customer_groups',
			security.checkRoleScope.bind(this, scopes.LIST_CUSTOMER_GROUP),
			this.getGroups.bind(this)
		);
		/**
		 * @api {post} /v1/customer_groups Add Group
		 * @apiVersion 1.0.0
		 * @apiName addGroup
		 * @apiGroup Customer Groups
		 * @apiPermission authenticated user
		 *
		 * @apiParam (Request body) {String} name The customer group name
		 * @apiParam (Request body) {String} description The customer group description
		 *
		 * @apiExample {js} Example Request Payload:
		 * {"name":"VIP","description":"VIP customers"}
		 *
		 * @apiSuccess (Success 200) {String} status Success code
		 *
		 * @apiSuccessExample {json} Success response:
		 *     HTTPS 200 OK
		 *     {"date_created":"2019-06-11T08:10:58.397Z","name":"VIP","description":"VIP customers","tenant_id":"5cf6520b5407a83e20be98b9","deleted":false,"id":"5cff62127ceb7a138e5e712c"}
		 *
		 * @apiUse UnauthorizedError
		 */
		this.router.post(
			'/v1/customer_groups',
			security.checkRoleScope.bind(this, scopes.WRITE_CUSTOMER_GROUP),
			this.addGroup.bind(this)
		);
		/**
		 * @api {get} /v1/customer_groups/:id Get Single Group
		 * @apiVersion 1.0.0
		 * @apiName getSingleGroup
		 * @apiGroup Customer Groups
		 * @apiPermission authenticated user
		 *
		 * @apiParam (Request param) {String} id The customer group id
		 * @apiParam (Request param) {String} limit limit
		 * @apiParam (Request param) {String} offset offset
		 *
		 * @apiExample {js} Example usage:
		 * Request URL: http://localhost:3001/api/v1/customers?group_id=5cff62127ceb7a138e5e712c&limit=50&offset=0
		 *
		 *
		 * @apiSuccess (Success 200) {String} status Success code
		 * @apiSuccess (Success 304) {String} status Success code
		 *
		 * @apiSuccessExample {json} Success response:
		 *     HTTPS 304 Not Modified
		 *     {"total_count":0,"has_more":false,"data":[]}
		 *
		 * @apiUse UnauthorizedError
		 */
		this.router.get(
			'/v1/customer_groups/:id',
			security.checkRoleScope.bind(this, scopes.READ_CUSTOMER_GROUP),
			this.getSingleGroup.bind(this)
		);
		/**
		 * @api {put} /v1/customer_groups/:id Update Group
		 * @apiVersion 1.0.0
		 * @apiName updateGroup
		 * @apiGroup Customer Groups
		 * @apiPermission authenticated user
		 *
		 * @apiParam (Request param) {String} id The customer group id
		 * @apiParam (Request body) {String} date_created Date created
		 * @apiParam (Request body) {String} deleted deleted?
		 * @apiParam (Request body) {String} description Group description
		 * @apiParam (Request body) {String} id id
		 * @apiParam (Request body) {String} name Group name
		 * @apiParam (Request body) {String} tenant_id The tenantid
		 *
		 * @apiExample {js} Example Request Payload:
		 * {"date_created":"2019-06-11T08:10:58.397Z","name":"VIP","description":"All VIP customers","tenant_id":"5cf6520b5407a83e20be98b9","deleted":false,"id":"5cff62127ceb7a138e5e712c"}
		 *
		 * @apiSuccess (Success 200) {String} status Success code
		 *
		 * @apiSuccessExample {json} Success response:
		 *     HTTPS 200 OK
		 *     {"date_created":"2019-06-11T08:10:58.397Z","name":"VIP","description":"All VIP customers","tenant_id":"5cf6520b5407a83e20be98b9","deleted":false,"date_updated":"2019-06-11T08:18:18.759Z","id":"5cff62127ceb7a138e5e712c"}
		 *
		 * @apiUse UnauthorizedError
		 */
		this.router.put(
			'/v1/customer_groups/:id',
			security.checkRoleScope.bind(this, scopes.WRITE_CUSTOMER_GROUP),
			this.updateGroup.bind(this)
		);
		/**
		 * @api {delete} /v1/customer_groups/:id Delete Group
		 * @apiVersion 1.0.0
		 * @apiName deleteGroup
		 * @apiGroup Customer Groups
		 * @apiPermission authenticated user
		 *
		 * @apiParam (Request param) {String} id The customer Group id
		 *
		 * @apiExample {js} Example usage:
		 * Request URL: http://localhost:3001/api/v1/customer_groups/5cff62127ceb7a138e5e712c
		 *
		 * @apiSuccess (Success 200) {String} status Success code
		 *
		 * @apiSuccessExample {json} Success response:
		 *     HTTPS 200 OK
		 *
		 * @apiUse UnauthorizedError
		 */
		this.router.delete(
			'/v1/customer_groups/:id',
			security.checkRoleScope.bind(this, scopes.DELETE_CUSTOMER_GROUP),
			this.deleteGroup.bind(this)
		);
	}

	getGroups(req, res, next) {
		CustomerGroupsService.getGroups(req.get('x-tenant-id'), req.query)
			.then(data => {
				res.send(data);
			})
			.catch(next);
	}

	getSingleGroup(req, res, next) {
		CustomerGroupsService.getSingleGroup(req.params.id)
			.then(data => {
				if (data) {
					res.send(data);
				} else {
					res.status(404).end();
				}
			})
			.catch(next);
	}

	addGroup(req, res, next) {
		CustomerGroupsService.addGroup(req.get('x-tenant-id'), req.body)
			.then(data => {
				res.send(data);
			})
			.catch(next);
	}

	updateGroup(req, res, next) {
		CustomerGroupsService.updateGroup(req.params.id, req.body)
			.then(data => {
				if (data) {
					res.send(data);
				} else {
					res.status(404).end();
				}
			})
			.catch(next);
	}

	deleteGroup(req, res, next) {
		CustomerGroupsService.deleteGroup(req.params.id)
			.then(data => {
				res.status(data ? 200 : 404).end();
			})
			.catch(next);
	}
}

export default CustomerGroupsRoute;
