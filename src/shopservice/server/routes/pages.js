import security from '../lib/security';
import PagesService from '../services/pages/pages';
import scopes from '../lib/scopes';

class PagesRoute {
	constructor(router) {
		this.router = router;
		this.registerRoutes();
	}

	registerRoutes() {
		/**
		 * @api {get} /v1/pages Get pages
		 * @apiVersion 1.0.0
		 * @apiName getPages
		 * @apiGroup Pages
		 * @apiPermission authenticated user
		 *
		 * @apiParam (Request body) {String} id The pages id
		 *
		 * @apiExample {js} Example usage:
		 * http://localhost:3000/blueshop/admin/pages
		 *
		 * @apiSuccess (Success 200) {String} status Success code
		 *
		 * @apiSuccessExample {json} Success response:
		 *     HTTPS 200 OK
		 *     <html>
		 *
		 * @apiUse UnauthorizedError
		 */
		this.router.get(
			'/v1/pages',
			security.checkRoleScope.bind(this, scopes.LIST_PAGE),
			this.getPages.bind(this)
		);
		/**
		 * @api {post} /v1/pages Add page
		 * @apiVersion 1.0.0
		 * @apiName addPage
		 * @apiGroup Pages
		 * @apiPermission authenticated user
		 *
		 * @apiParam (Request body) {String} enabled Page enabled?
		 * @apiParam (Request body) {String} meta_title Page meta title
		 * @apiParam (Request body) {String} slug slug
		 *
		 * @apiExample {js} Example Request Payload:
		 * {"enabled":true,"meta_title":"Test Page","slug":"test"}
		 *
		 * @apiSuccess (Success 200) {String} status Success code
		 *
		 * @apiSuccessExample {json} Success response:
		 *     HTTPS 200 OK
		 *     {"date_created":"2019-06-11T10:26:53.608Z","content":"","meta_description":"","meta_title":"Test Page","enabled":true,"tags":[],"tenant_id":"5cf6520b5407a83e20be98b9","deleted":false,"slug":"test","id":"5cff81ed7ceb7a138e5e7139","url":"/test","path":"/test"}
		 *
		 * @apiUse UnauthorizedError
		 */
		this.router.post(
			'/v1/pages',
			security.checkRoleScope.bind(this, scopes.WRITE_PAGE),
			this.addPage.bind(this)
		);
		/**
		 * @api {get} /v1/pages/:id Get Single Page
		 * @apiVersion 1.0.0
		 * @apiName getSinglePage
		 * @apiGroup Pages
		 * @apiPermission authenticated user
		 *
		 * @apiParam (Request param) {String} id The pages id
		 *
		 * @apiExample {js} Example usage:
		 * Request URL: http://localhost:3001/api/v1/pages/5cff81ed7ceb7a138e5e7139?
		 *
		 * @apiSuccess (Success 200) {String} status Success code
		 *
		 * @apiSuccessExample {json} Success response:
		 *     HTTPS 200 OK
		 *     {"date_created":"2019-06-11T10:26:53.608Z","content":"","meta_description":"","meta_title":"Test Page","enabled":true,"tags":[],"tenant_id":"5cf6520b5407a83e20be98b9","deleted":false,"slug":"test","id":"5cff81ed7ceb7a138e5e7139","url":"/test","path":"/test"}
		 *
		 * @apiUse UnauthorizedError
		 */
		this.router.get(
			'/v1/pages/:id',
			security.checkRoleScope.bind(this, scopes.READ_PAGE),
			this.getSinglePage.bind(this)
		);
		/**
		 * @api {put} /v1/pages/:id Update Page
		 * @apiVersion 1.0.0
		 * @apiName updatePage
		 * @apiGroup Pages
		 * @apiPermission authenticated user
		 *
		 * @apiParam (Request param) {String} id The pages id
		 * @apiParam (Request body) {String} content The pages content
		 * @apiParam (Request body) {String} date_created Date created
		 * @apiParam (Request body) {String} deleted deleted?
		 * @apiParam (Request body) {String} enabled enabled?
		 * @apiParam (Request body) {String} id Page id
		 * @apiParam (Request body) {String} meta_description Meta description
		 * @apiParam (Request body) {String} meta_title Meta title
		 * @apiParam (Request body) {String} path path
		 * @apiParam (Request body) {String} slug slug
		 * @apiParam (Request body) {String} tags tags
		 * @apiParam (Request body) {String} tenant_id The tenant id
		 * @apiParam (Request body) {String} url Url
		 *
		 * @apiExample {js} Example Request Payload:
		 * {"date_created":"2019-06-11T10:26:53.608Z","content":"","meta_description":"test","meta_title":"Test Page","enabled":true,"tags":[],"tenant_id":"5cf6520b5407a83e20be98b9","deleted":false,"slug":"test","id":"5cff81ed7ceb7a138e5e7139","url":"/test","path":"/test"}
		 *
		 * @apiSuccess (Success 200) {String} status Success code
		 *
		 * @apiSuccessExample {json} Success response:
		 *     HTTPS 200 OK
		 *
		 * @apiUse UnauthorizedError
		 */
		this.router.put(
			'/v1/pages/:id',
			security.checkRoleScope.bind(this, scopes.WRITE_PAGE),
			this.updatePage.bind(this)
		);
		/**
		 * @api {delete} /v1/pages/:id Delete Page
		 * @apiVersion 1.0.0
		 * @apiName deletePage
		 * @apiGroup Pages
		 * @apiPermission authenticated user
		 *
		 * @apiParam (Request param) {String} id The pages id
		 *
		 * @apiExample {js} Example usage:
		 * Request URL: http://localhost:3001/api/v1/pages/5cff81ed7ceb7a138e5e7139
		 *
		 * @apiSuccess (Success 200) {String} status Success code
		 *
		 * @apiSuccessExample {json} Success response:
		 *     HTTPS 200 OK
		 *
		 * @apiUse UnauthorizedError
		 */
		this.router.delete(
			'/v1/pages/:id',
			security.checkRoleScope.bind(this, scopes.DELETE_PAGE),
			this.deletePage.bind(this)
		);
	}

	getPages(req, res, next) {
		PagesService.getPages(req.get('x-tenant-id'), req.query)
			.then(data => {
				res.send(data);
			})
			.catch(next);
	}

	getSinglePage(req, res, next) {
		PagesService.getSinglePage(req.get('x-tenant-id'), req.params.id)
			.then(data => {
				if (data) {
					res.send(data);
				} else {
					res.status(404).end();
				}
			})
			.catch(next);
	}

	addPage(req, res, next) {
		PagesService.addPage(req.get('x-tenant-id'), req.body)
			.then(data => {
				res.send(data);
			})
			.catch(next);
	}

	updatePage(req, res, next) {
		PagesService.updatePage(req.get('x-tenant-id'), req.params.id, req.body)
			.then(data => {
				if (data) {
					res.send(data);
				} else {
					res.status(404).end();
				}
			})
			.catch(next);
	}

	deletePage(req, res, next) {
		PagesService.deletePage(req.params.id)
			.then(data => {
				res.status(data ? 200 : 404).end();
			})
			.catch(next);
	}
}

export default PagesRoute;
