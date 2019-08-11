import security from '../lib/security';
import UsersService from '../services/users/users';
import scopes from '../lib/scopes';

class UsersRoute {
	constructor(router) {
		this.router = router;
		this.registerRoutes();
	}

	registerRoutes() {
		/**
		 * @api {get} /v1/users Get Users
		 * @apiVersion 1.0.0
		 * @apiName getUsers
		 * @apiGroup Users
		 * @apiPermission authenticated user
		 *
		 *
		 * @apiExample {js} Example usage:
		 * Request URL: http://localhost:3001/api/v1/users
		 *
		 * @apiSuccess (Success 200) {String} status Success code
		 *
		 * @apiSuccessExample {json} Success response:
		 *     HTTPS 200 OK
		 *
		 * @apiUse UnauthorizedError
		 */
		this.router.get(
			'/v1/users',
			security.checkRoleScope.bind(this, scopes.LIST_USER),
			this.getUsers.bind(this)
		);
		/**
	    * @api {post} /v1/users Add User
	    * @apiVersion 1.0.0
	    * @apiName addUser
	    * @apiGroup Users
	    * @apiPermission authenticated user
	    *
	    * @apiParam (Request body) {String} id The pages id
	    *
	    * @apiExample {js} Example usage:
	    * Request URL: http://localhost:3001/api/v1/users
	    *
	    * @apiSuccess (Success 200) {String} status Success code
	    *
	    * @apiSuccessExample {json} Success response:
	    *     HTTPS 200 OK

	    *
	    * @apiUse UnauthorizedError
	    */
		this.router.post(
			'/v1/users',
			security.checkRoleScope.bind(this, scopes.WRITE_USER),
			this.addUser.bind(this)
		);
		/**
		 * @api {get} /v1/users/:id Get Single User By Id
		 * @apiVersion 1.0.0
		 * @apiName getSingleUserById
		 * @apiGroup Users
		 * @apiPermission authenticated user
		 *
		 * @apiParam (Request param) {String} id The user id
		 *
		 * @apiExample {js} Example usage:
		 * Request URL: http://localhost:3001/api/v1/users/5cf64e61d6a06f3d3debbe84?
		 *
		 * @apiSuccess (Success 200) {String} status Success code
		 *
		 * @apiSuccessExample {json} Success response:
		 *     HTTPS 200 OK
		 *
		 * @apiUse UnauthorizedError
		 */
		this.router.get(
			'/v1/users/:id',
			security.checkRoleScope.bind(this, scopes.READ_USER),
			this.getSingleUserById.bind(this)
		);

		this.router.put(
			'/v1/users/:id',
			security.checkRoleScope.bind(this, scopes.WRITE_USER),
			this.updateUser.bind(this)
		);

		this.router.delete(
			'/v1/users/:id',
			security.checkRoleScope.bind(this, scopes.DELETE_USER),
			this.deleteUser.bind(this)
		);
	}

	getUsers(req, res, next) {
		UsersService.getUsers(req.get('x-tenant-id'), req.query)
			.then(data => {
				res.send(data);
			})
			.catch(next);
	}

	getSingleUserById(req, res, next) {
		UsersService.getSingleUserById(req.get('x-tenant-id'), req.params.id)
			.then(data => {
				if (data) {
					res.send(data);
				} else {
					res.status(404).end();
				}
			})
			.catch(next);
	}

	addUser(req, res, next) {
		UsersService.addUser(req.get('x-tenant-id'), req.body)
			.then(data => {
				res.send(data);
			})
			.catch(next);
	}

	updateUser(req, res, next) {
		UsersService.updateUser(req.get('x-tenant-id'), req.params.id, req.body)
			.then(data => {
				if (data) {
					res.send(data);
				} else {
					res.status(404).end();
				}
			})
			.catch(next);
	}

	deleteUser(req, res, next) {
		UsersService.deleteUser(req.params.id)
			.then(data => {
				res.status(data ? 200 : 404).end();
			})
			.catch(next);
	}
}

export default UsersRoute;
