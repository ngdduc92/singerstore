import security from '../lib/security';
import RedirectsService from '../services/redirects';
import scopes from '../lib/scopes';

class RedirectsRoute {
	constructor(router) {
		this.router = router;
		this.registerRoutes();
	}

	registerRoutes() {
		/**
		 * @api {get} /v1/redirects Get Redirects
		 * @apiVersion 1.0.0
		 * @apiName getRedirects
		 * @apiGroup Redirects
		 * @apiPermission authenticated user
		 *
		 *
		 * @apiExample {js} Example usage:
		 * Request URL: http://localhost:3001/api/v1/redirects
		 *
		 * @apiSuccess (Success 200) {String} status Success code
		 *
		 * @apiSuccessExample {json} Success response:
		 *     HTTPS 200 OK
		 *     [{"from":"","to":"","status":301,"id":"5d021b7974ad7e0c97b20122"},{"from":"100","to":"199","status":301,"id":"5d021bc274ad7e0c97b20123"},{"from":"100","to":"180","status":301,"id":"5d021c1574ad7e0c97b20124"}]
		 *
		 * @apiUse UnauthorizedError
		 */
		this.router.get(
			'/v1/redirects',
			security.checkRoleScope.bind(this, scopes.LIST_REDIRECT),
			this.getRedirects.bind(this)
		);
		/**
		 * @api {post} /v1/redirects Add Redirect
		 * @apiVersion 1.0.0
		 * @apiName addRedirect
		 * @apiGroup Redirects
		 * @apiPermission authenticated user
		 *
		 * @apiParam (Request body) {String} from from
		 * @apiParam (Request body) {String} to to
		 * @apiParam (Request body) {String} status status
		 * @apiParam (Request body) {String} id id
		 *
		 * @apiExample {js} Example Request Payload:
		 * {"from":"100","to":"199","status":301,"id": "5d021b7974ad7e0c97b20122"}
		 *
		 * @apiSuccess (Success 200) {String} status Success code
		 *
		 * @apiSuccessExample {json} Success response:
		 *     HTTPS 200 OK
		 *     {"from": "100","to": "199","status": 301,"id": "5d021b7974ad7e0c97b20122"}
		 *
		 * @apiUse UnauthorizedError
		 */
		this.router.post(
			'/v1/redirects',
			security.checkRoleScope.bind(this, scopes.WRITE_REDIRECT),
			this.addRedirect.bind(this)
		);
		/**
		 * @api {get} /v1/redirects/:id Get Single Redirect
		 * @apiVersion 1.0.0
		 * @apiName getSingleRedirect
		 * @apiGroup Redirects
		 * @apiPermission authenticated user
		 *
		 * @apiParam (Request param) {String} id The Redirect id
		 *
		 * @apiExample {js} Example usage:
		 * Request URL: http://localhost:3001/api/v1/redirects/5cf6520b5407a83e20be98b9
		 *
		 * @apiSuccess (Success 200) {String} status Success code
		 *
		 * @apiSuccessExample {json} Success response:
		 *     HTTPS 200 OK
		 *     {"from":"","to":"","status":301,"id":"5d021b7974ad7e0c97b20122"}
		 *
		 * @apiUse UnauthorizedError
		 */
		this.router.get(
			'/v1/redirects/:id',
			security.checkRoleScope.bind(this, scopes.READ_REDIRECT),
			this.getSingleRedirect.bind(this)
		);
		/**
		 * @api {put} /v1/redirects/:id Update Redirect
		 * @apiVersion 1.0.0
		 * @apiName updateRedirect
		 * @apiGroup Redirects
		 * @apiPermission authenticated user
		 *
		 * @apiParam (Request param) {String} id The Redirect id
		 * @apiParam (Request body) {String} from from
		 * @apiParam (Request body) {String} to to
		 * @apiParam (Request body) {String} status status
		 * @apiParam (Request body) {String} id Redirect id
		 *
		 * @apiExample {js} Example Request Payload:
		 * {"from":"100","to":"199","status":301,"id": "5d021b7974ad7e0c97b20122"}
		 *
		 * @apiSuccess (Success 200) {String} status Success code
		 *
		 * @apiSuccessExample {json} Success response:
		 *     HTTPS 200 OK
		 *     {"from":"100","to":"199","status":301,"id": "5d021b7974ad7e0c97b20122"}
		 *
		 * @apiUse UnauthorizedError
		 */
		this.router.put(
			'/v1/redirects/:id',
			security.checkRoleScope.bind(this, scopes.WRITE_REDIRECT),
			this.updateRedirect.bind(this)
		);
		/**
		 * @api {delete} /v1/redirects/:id Delete Redirect
		 * @apiVersion 1.0.0
		 * @apiName deleteRedirect
		 * @apiGroup Redirects
		 * @apiPermission authenticated user
		 *
		 * @apiParam (Request param) {String} id The Redirect id
		 *
		 * @apiExample {js} Example usage:
		 * Request URL: http://localhost:3001/api/v1/redirects/5cf6520b5407a83e20be98b9
		 *
		 * @apiSuccess (Success 200) {String} status Success code
		 *
		 * @apiSuccessExample {json} Success response:
		 *     HTTPS 200 OK
		 *
		 * @apiUse UnauthorizedError
		 */
		this.router.delete(
			'/v1/redirects/:id',
			security.checkRoleScope.bind(this, scopes.DELETE_REDIRECT),
			this.deleteRedirect.bind(this)
		);
	}

	getRedirects(req, res, next) {
		RedirectsService.getRedirects(req.query)
			.then(data => {
				res.send(data);
			})
			.catch(next);
	}

	getSingleRedirect(req, res, next) {
		RedirectsService.getSingleRedirect(req.params.id)
			.then(data => {
				if (data) {
					res.send(data);
				} else {
					res.status(404).end();
				}
			})
			.catch(next);
	}

	addRedirect(req, res, next) {
		RedirectsService.addRedirect(req.body)
			.then(data => {
				res.send(data);
			})
			.catch(next);
	}

	updateRedirect(req, res, next) {
		RedirectsService.updateRedirect(req.params.id, req.body)
			.then(data => {
				if (data) {
					res.send(data);
				} else {
					res.status(404).end();
				}
			})
			.catch(next);
	}

	deleteRedirect(req, res, next) {
		RedirectsService.deleteRedirect(req.params.id)
			.then(data => {
				res.status(data ? 200 : 404).end();
			})
			.catch(next);
	}
}

export default RedirectsRoute;
