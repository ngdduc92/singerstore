import security from '../lib/security';
import CategoriesService from '../services/products/productCategories';
import scopes from '../lib/scopes';

class ProductCategoriesRoute {
	constructor(router) {
		this.router = router;
		this.registerRoutes();
	}

	registerRoutes() {
		/**
		 * @api {get} /v1/product_categories Get Categories
		 * @apiVersion 1.0.0
		 * @apiName getCategories
		 * @apiGroup Product Categories
		 * @apiPermission authenticated user
		 *
		 *
		 * @apiExample {js} Example usage:
		 * Request URL: http://localhost:3001/api/v1/product_categories?
		 *
		 * @apiSuccess (Success 200) {String} status Success code
		 *
		 * @apiSuccessExample {json} Success response:
		 *     HTTPS 200 OK
		 *     [{"date_created":"2019-06-04T11:12:19.047Z","date_updated":"2019-06-04T11:12:19.047Z","image":"","name":"Women","description":"","meta_description":"","meta_title":"","enabled":true,"sort":"","parent_id":null,"position":1,"tenant_id":"5cf6520b5407a83e20be98b9","slug":"women","deleted":false,"id":"5cf652135407a83e20be98c0","url":"/women","path":"/women"}]
		 *
		 * @apiUse UnauthorizedError
		 */
		this.router.get(
			'/v1/product_categories',
			security.checkRoleScope.bind(this, scopes.LIST_PRODUCT_CATEGORY),
			this.getCategories.bind(this)
		);
		/**
		 * @api {post} /v1/product_categories Add Category
		 * @apiVersion 1.0.0
		 * @apiName addCategory
		 * @apiGroup Product Categories
		 * @apiPermission authenticated user
		 *
		 * @apiParam (Request body) {String} enabled Category enabled?
		 *
		 * @apiExample {js} Example Request Payload:
		 * {"enabled":false}
		 *
		 * @apiSuccess (Success 200) {String} status Success code
		 *
		 * @apiSuccessExample {json} Success response:
		 *     HTTPS 200 OK
		 *     {"date_created":"2019-06-12T07:11:51.377Z","date_updated":null,"image":"","name":"","description":"","meta_description":"","meta_title":"","enabled":false,"sort":"","parent_id":null,"position":5,"tenant_id":"5cf6520b5407a83e20be98b9","deleted":false,"id":"5d00a5b77ceb7a138e5e713b"}
		 *
		 * @apiUse UnauthorizedError
		 */
		this.router.post(
			'/v1/product_categories',
			security.checkRoleScope.bind(this, scopes.WRITE_PRODUCT_CATEGORY),
			this.addCategory.bind(this)
		);
		/**
		 * @api {get} /v1/product_categories/:id Get Single Category
		 * @apiVersion 1.0.0
		 * @apiName getSingleCategory
		 * @apiGroup Product Categories
		 * @apiPermission authenticated user
		 *
		 * @apiParam (Request param) {String} id The product category id
		 *
		 * @apiExample {js} Example usage:
		 * Request URL: http://localhost:3001/api/v1/product_categories/5d00a5b77ceb7a138e5e713b
		 *
		 * @apiSuccess (Success 200) {String} status Success code
		 *
		 * @apiSuccessExample {json} Success response:
		 *     HTTPS 200 OK
		 *     {"date_created":"2019-06-12T07:11:51.377Z","date_updated":"2019-06-12T07:14:06.873Z","image":"","name":"Beauty","description":"<p>Beauty</p>","meta_description":"Beauty","meta_title":"Beauty","enabled":true,"sort":"","parent_id":null,"position":5,"tenant_id":"5cf6520b5407a83e20be98b9","deleted":false,"slug":"beauty","id":"5d00a5b77ceb7a138e5e713b","url":"/beauty","path":"/beauty"}
		 *
		 * @apiUse UnauthorizedError
		 */
		this.router.get(
			'/v1/product_categories/:id',
			security.checkRoleScope.bind(this, scopes.READ_PRODUCT_CATEGORY),
			this.getSingleCategory.bind(this)
		);
		/**
		 * @api {put} /v1/product_categories/:id Update Category
		 * @apiVersion 1.0.0
		 * @apiName updateCategory
		 * @apiGroup Product Categories
		 * @apiPermission authenticated user
		 *
		 * @apiParam (Request body) {String} date_created Category date created
		 * @apiParam (Request body) {String} date_updated Category date updated
		 * @apiParam (Request body) {String} deleted Category deleted?
		 * @apiParam (Request body) {String} description Category description
		 * @apiParam (Request body) {String} enabled Category enabled?
		 * @apiParam (Request body) {String} id Category id
		 * @apiParam (Request body) {String} meta_description Category meta_description
		 * @apiParam (Request body) {String} meta_title Category title
		 * @apiParam (Request body) {String} name Category name
		 * @apiParam (Request body) {String} parent_id Category parentid
		 * @apiParam (Request body) {String} position Category position
		 * @apiParam (Request body) {String} slug Category slug
		 * @apiParam (Request body) {String} sort sort
		 * @apiParam (Request body) {String} tenant_id tenantid
		 *
		 * @apiExample {js} Example usage:
		 * {"date_created":"2019-06-12T07:11:51.377Z","date_updated":null,"name":"Beauty","description":"<p>Beauty</p>","meta_description":"Beauty","meta_title":"Beauty","enabled":true,"sort":"","parent_id":null,"position":5,"tenant_id":"5cf6520b5407a83e20be98b9","deleted":false,"id":"5d00a5b77ceb7a138e5e713b","slug":"beauty"}
		 *
		 * @apiSuccess (Success 200) {String} status Success code
		 *
		 * @apiSuccessExample {json} Success response:
		 *     HTTPS 200 OK
		 *     {"date_created":"2019-06-12T07:11:51.377Z","date_updated":"2019-06-12T07:14:06.873Z","image":"","name":"Beauty","description":"<p>Beauty</p>","meta_description":"Beauty","meta_title":"Beauty","enabled":true,"sort":"","parent_id":null,"position":5,"tenant_id":"5cf6520b5407a83e20be98b9","deleted":false,"slug":"beauty","id":"5d00a5b77ceb7a138e5e713b","url":"/beauty","path":"/beauty"}
		 *
		 * @apiUse UnauthorizedError
		 */
		this.router.put(
			'/v1/product_categories/:id',
			security.checkRoleScope.bind(this, scopes.WRITE_PRODUCT_CATEGORY),
			this.updateCategory.bind(this)
		);
		/**
		 * @api {delete} /v1/product_categories/:id Delete Category
		 * @apiVersion 1.0.0
		 * @apiName deleteCategory
		 * @apiGroup Product Categories
		 * @apiPermission authenticated user
		 *
		 * @apiParam (Request param) {String} id The Category id
		 *
		 * @apiExample {js} Example usage:
		 * Request URL: http://localhost:3001/api/v1/product_categories/5d00a5b77ceb7a138e5e713b
		 *
		 * @apiSuccess (Success 200) {String} status Success code
		 *
		 * @apiSuccessExample {json} Success response:
		 *     HTTPS 200 OK
		 *
		 * @apiUse UnauthorizedError
		 */
		this.router.delete(
			'/v1/product_categories/:id',
			security.checkRoleScope.bind(this, scopes.DELETE_PRODUCT_CATEGORY),
			this.deleteCategory.bind(this)
		);
		/**
		 * @api {post} /v1/product_categories/:id/image Upload Category Image
		 * @apiVersion 1.0.0
		 * @apiName uploadCategoryImage
		 * @apiGroup Product Categories
		 * @apiPermission authenticated user
		 *
		 * @apiParam (Request param) {String} id The Category id
		 *
		 * @apiExample {js} Example usage:
		 * Request URL: http://localhost:3001/api/v1/product_categories/5d00a5b77ceb7a138e5e713b/image
		 * Content-Type: multipart/form-data
		 * file: (binary)
		 *
		 * @apiSuccess (Success 200) {String} status Success code
		 *
		 * @apiSuccessExample {json} Success response:
		 *     HTTPS 200 OK
		 *     {"file":"81u+OJkGVYL._SX700_.jpg","size":24921}
		 *
		 * @apiUse UnauthorizedError
		 */
		this.router.post(
			'/v1/product_categories/:id/image',
			security.checkRoleScope.bind(this, scopes.WRITE_PRODUCT_CATEGORY),
			this.uploadCategoryImage.bind(this)
		);
		/**
		 * @api {delete} /v1/product_categories/:id/image Delete Category Image
		 * @apiVersion 1.0.0
		 * @apiName deleteCategoryImage
		 * @apiGroup Product Categories
		 * @apiPermission authenticated user
		 *
		 * @apiParam (Request param) {String} id The Category id
		 *
		 * @apiExample {js} Example usage:
		 * Request URL: http://localhost:3001/api/v1/product_categories/5d00a5b77ceb7a138e5e713b/image
		 *
		 * @apiSuccess (Success 200) {String} status Success code
		 *
		 * @apiSuccessExample {json} Success response:
		 *     HTTPS 200 OK
		 *
		 * @apiUse UnauthorizedError
		 */
		this.router.delete(
			'/v1/product_categories/:id/image',
			security.checkRoleScope.bind(this, scopes.WRITE_PRODUCT_CATEGORY),
			this.deleteCategoryImage.bind(this)
		);
	}

	getCategories(req, res, next) {
		CategoriesService.getCategories(req.get('x-tenant-id'), req.query)
			.then(data => {
				res.send(data);
			})
			.catch(next);
	}

	getSingleCategory(req, res, next) {
		CategoriesService.getSingleCategory(req.get('x-tenant-id'), req.params.id)
			.then(data => {
				if (data) {
					res.send(data);
				} else {
					res.status(404).end();
				}
			})
			.catch(next);
	}

	addCategory(req, res, next) {
		CategoriesService.addCategory(req.get('x-tenant-id'), req.body)
			.then(data => {
				res.send(data);
			})
			.catch(next);
	}

	updateCategory(req, res, next) {
		CategoriesService.updateCategory(
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

	deleteCategory(req, res, next) {
		CategoriesService.deleteCategory(req.get('x-tenant-id'), req.params.id)
			.then(data => {
				res.status(data ? 200 : 404).end();
			})
			.catch(next);
	}

	uploadCategoryImage(req, res, next) {
		CategoriesService.uploadCategoryImage(
			req.get('x-tenant-id'),
			req,
			res,
			next
		);
	}

	deleteCategoryImage(req, res, next) {
		CategoriesService.deleteCategoryImage(
			req.get('x-tenant-id'),
			req.params.id
		);
		res.end();
	}
}

export default ProductCategoriesRoute;
