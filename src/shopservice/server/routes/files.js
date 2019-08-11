import security from '../lib/security';
import FilesService from '../services/files';
import scopes from '../lib/scopes';

class FilesRoute {
	constructor(router) {
		this.router = router;
		this.registerRoutes();
	}

	registerRoutes() {
		/**
		 * @api {get} /v1/files Get Files
		 * @apiVersion 1.0.0
		 * @apiName getFiles
		 * @apiGroup Files
		 * @apiPermission authenticated user
		 *
		 * @apiExample {js} Example usage:
		 * Request URL: http://localhost:3001/api/v1/files
		 *
		 * @apiSuccess (Success 200) {String} status Success code
		 * @apiSuccess (Success 304) {String} status Success code
		 *
		 * @apiSuccessExample {json} Success response:
		 *     HTTPS 304 Not Modified
		 *     []
		 *
		 * @apiUse UnauthorizedError
		 */
		this.router.get(
			'/v1/files',
			security.checkRoleScope.bind(this, scopes.LIST_FILE),
			this.getFiles.bind(this)
		);
		/**
		 * @api {post} /v1/files Upload Files
		 * @apiVersion 1.0.0
		 * @apiName uploadFile
		 * @apiGroup Files
		 * @apiPermission authenticated user
		 *
		 * @apiExample {js} Example usage:
		 * Request URL: http://localhost:3001/api/v1/files
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
			'/v1/files',
			security.checkRoleScope.bind(this, scopes.WRITE_FILE),
			this.uploadFile.bind(this)
		);
		/**
		 * @api {delete} /v1/files/:file Delete Files
		 * @apiVersion 1.0.0
		 * @apiName deleteFile
		 * @apiGroup Files
		 * @apiPermission authenticated user
		 *
		 * @apiParam (Request param) {String} file The file name
		 *
		 * @apiExample {js} Example usage:
		 * Request URL: http://localhost:3001/api/v1/files/81u+OJkGVYL._SX700_.jpg
		 *
		 * @apiSuccess (Success 200) {String} status Success code
		 *
		 * @apiSuccessExample {json} Success response:
		 *     HTTPS 200 OK
		 *
		 * @apiUse UnauthorizedError
		 */
		this.router.delete(
			'/v1/files/:file',
			security.checkRoleScope.bind(this, scopes.DELETE_FILE),
			this.deleteFile.bind(this)
		);
	}

	getFiles(req, res, next) {
		FilesService.getFiles(req.get('x-tenant-id'))
			.then(data => {
				res.send(data);
			})
			.catch(next);
	}

	uploadFile(req, res, next) {
		FilesService.uploadFile(req, res, next);
	}

	deleteFile(req, res, next) {
		FilesService.deleteFile(req.get('x-tenant-id'), req.params.file)
			.then(() => {
				res.end();
			})
			.catch(next);
	}
}

export default FilesRoute;
