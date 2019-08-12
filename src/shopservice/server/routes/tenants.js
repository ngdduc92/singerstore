import security from '../lib/security';
import TenantsService from '../services/tenants/tenants';
import scopes from '../lib/scopes';

class TenantsRoute {
	constructor(router) {
		this.router = router;
		this.registerRoutes();
	}

	registerRoutes() {
		/**
		 * @api {get} /v1/tenants Get Tenants
		 * @apiVersion 1.0.0
		 * @apiName getTenants
		 * @apiGroup Tenants
		 * @apiPermission authenticated user
		 *
		 *
		 * @apiExample {js} Example usage:
		 * Request URL: http://localhost:3001/api/v1/tenants?
		 *
		 * @apiSuccess (Success 200) {String} status Success code
		 * @apiSuccess (Success 304) {String} status Success code
		 *
		 * @apiSuccessExample {json} Success response:
		 *     HTTPS 304 Not Modified
		 *     {"data":[{"deleted":false,"is_revoked":false,"date_created":"2019-06-04T10:56:33.392Z","date_updated":"2019-06-04T10:56:33.392Z","name":"Owner Organization","url_name":"dashboard","email":"superuser@eshop.com","id":"5cf64e61d6a06f3d3debbe82"},{"date_created":"2019-06-04T11:12:11.462Z","date_updated":"2019-06-04T11:12:21.398Z","deleted":false,"address":"123 DN","email":"tuan.le@evizi.com","name":"blueshop","tel":"0909090909","url_name":"blueshop","id":"5cf6520b5407a83e20be98b9"}]}
		 *
		 * @apiUse UnauthorizedError
		 */
		this.router.get(
			'/v1/tenants',
			security.checkRoleScope.bind(this, scopes.LIST_TENANT),
			this.getTenants.bind(this)
		);
		/**
		 * @api {post} /v1/tenants Add Tenant
		 * @apiVersion 1.0.0
		 * @apiName addTenant
		 * @apiGroup Tenants
		 * @apiPermission authenticated user
		 *
		 *
		 * @apiExample {js} Example usage:
		 * Request URL: http://localhost:3001/api/v1/tenants
		 * Request Payload :{}
		 *
		 * @apiSuccess (Success 200) {String} status Success code
		 *
		 * @apiSuccessExample {json} Success response:
		 *     HTTPS 200 OK
		 *     {"date_created":"2019-06-12T07:48:22.876Z","date_updated":null,"deleted":false,"id":"5d00ae467ceb7a138e5e713f"}
		 *
		 * @apiUse UnauthorizedError
		 */
		this.router.post(
			'/v1/tenants',
			security.checkRoleScope.bind(this, scopes.WRITE_TENANT),
			this.addTenant.bind(this)
		);
		/**
		 * @api {get} /v1/tenants/:id Get Single Tenant
		 * @apiVersion 1.0.0
		 * @apiName getSingleTenant
		 * @apiGroup Tenants
		 * @apiPermission authenticated user
		 *
		 * @apiParam (Request param) {String} id The Tenant id
		 *
		 * @apiExample {js} Example usage:
		 * Request URL: http://localhost:3001/api/v1/tenants/5d00ae467ceb7a138e5e713f?
		 *
		 * @apiSuccess (Success 200) {String} status Success code
		 *
		 * @apiSuccessExample {json} Success response:
		 *     HTTPS 200 OK
		 *	  {"date_created":"2019-06-12T07:48:22.876Z","date_updated":"2019-06-12T07:51:18.767Z","deleted":false,"address":"123 DN","email":"tuan.le@evizi.com","name":"greenshop","tel":"0909090909","url_name":"greenshop","id":"5d00ae467ceb7a138e5e713f"}
		 *
		 * @apiUse UnauthorizedError
		 */
		this.router.get(
			'/v1/tenants/:id',
			security.checkRoleScope.bind(this, scopes.READ_TENANT),
			this.getSingleTenant.bind(this)
		);
		/**
		 * @api {put} /v1/tenants/:id Update Single Tenant
		 * @apiVersion 1.0.0
		 * @apiName updateTenant
		 * @apiGroup Tenants
		 * @apiPermission authenticated user
		 *
		 * @apiParam (Request param) {String} id The Tenant id
		 * @apiParam (Request body) {String} address The Tenant address
		 * @apiParam (Request body) {String} email The Tenant email
		 * @apiParam (Request body) {String} id The Tenant id
		 * @apiParam (Request body) {String} name The Tenant name
		 * @apiParam (Request body) {String} tel The Tenant telephone
		 * @apiParam (Request body) {String} url_name url_name
		 *
		 * @apiExample {js} Example usage:
		 * {"id":"5d00ae467ceb7a138e5e713f","name":"greenshop","email":"tuan.le@evizi.com","url_name":"greenshop","address":"123 DN","tel":"0909090909"}
		 *
		 * @apiSuccess (Success 200) {String} status Success code
		 *
		 * @apiSuccessExample {json} Success response:
		 *     HTTPS 200 OK
		 *     {"date_created":"2019-06-12T07:48:22.876Z","date_updated":"2019-06-12T07:51:18.767Z","deleted":false,"address":"123 DN","email":"tuan.le@evizi.com","name":"greenshop","tel":"0909090909","url_name":"greenshop","id":"5d00ae467ceb7a138e5e713f"}
		 *
		 * @apiUse UnauthorizedError
		 */
		this.router.put(
			'/v1/tenants/:id',
			security.checkRoleScope.bind(this, scopes.WRITE_TENANT),
			this.updateTenant.bind(this)
		);
		/**
		 * @api {delete} /v1/tenants/:id Delete Tenant
		 * @apiVersion 1.0.0
		 * @apiName deleteTenant
		 * @apiGroup Tenants
		 * @apiPermission authenticated user
		 *
		 * @apiParam (Request body) {String} id The pages id
		 *
		 * @apiExample {js} Example usage:
		 * Request URL: http://localhost:3001/api/v1/tenants/5d00ae467ceb7a138e5e713f?
		 *
		 * @apiSuccess (Success 200) {String} status Success code
		 *
		 * @apiSuccessExample {json} Success response:
		 *     HTTPS 200 OK
		 *
		 * @apiUse UnauthorizedError
		 */
		this.router.delete(
			'/v1/tenants/:id',
			security.checkRoleScope.bind(this, scopes.DELETE_TENANT),
			this.deleteTenant.bind(this)
		);
	}

	getTenants(req, res, next) {
		TenantsService.getTenants()
			.then(data => {
				res.send(data);
			})
			.catch(next);
	}

	getSingleTenant(req, res, next) {
		TenantsService.getSingleTenant(req.params.id)
			.then(data => {
				if (data) {
					res.send(data);
				} else {
					res.status(404).end();
				}
			})
			.catch(next);
	}

	addTenant(req, res, next) {
		TenantsService.addTenant(req.get('x-tenant-id'), req.body)
			.then(data => {
				res.send(data);
			})
			.catch(next);
	}

	updateTenant(req, res, next) {
		TenantsService.updateTenant(req.params.id, req.body)
			.then(data => {
				if (data) {
					res.send(data);
				} else {
					res.status(404).end();
				}
			})
			.catch(next);
	}

	deleteTenant(req, res, next) {
		TenantsService.deleteTenant(req.params.id)
			.then(data => {
				res.status(data ? 200 : 404).end();
			})
			.catch(next);
	}
}

export default TenantsRoute;
