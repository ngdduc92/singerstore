import security from '../lib/security';
import SecurityKeysService from '../services/security/securityKeys';
import scopes from '../lib/scopes';

class SecurityKeysRoute {
	constructor(router) {
		this.router = router;
		this.registerRoutes();
	}

	registerRoutes() {
		this.router.get(
			'/v1/security/apikeys',
			security.checkRoleScope.bind(this, scopes.LIST_API_KEY),
			this.getKeys.bind(this)
		);
		this.router.get(
			'/v1/security/apikeys/blacklist',
			security.checkRoleScope.bind(this, scopes.LIST_API_KEY),
			this.getKeysBlacklist.bind(this)
		);
		this.router.post(
			'/v1/security/apikeys',
			security.checkRoleScope.bind(this, scopes.WRITE_API_KEY),
			this.addKey.bind(this)
		);
		this.router.get(
			'/v1/security/apikeys/:id',
			security.checkRoleScope.bind(this, scopes.READ_API_KEY),
			this.getSingleKey.bind(this)
		);
		this.router.put(
			'/v1/security/apikeys/:id',
			security.checkRoleScope.bind(this, scopes.WRITE_API_KEY),
			this.updateKey.bind(this)
		);
		this.router.delete(
			'/v1/security/apikeys/:id',
			security.checkRoleScope.bind(this, scopes.DELETE_API_KEY),
			this.deleteKey.bind(this)
		);
	}

	getKeys(req, res, next) {
		SecurityKeysService.getKeys(req.query)
			.then(data => {
				res.send(data);
			})
			.catch(next);
	}

	getKeysBlacklist(req, res, next) {
		SecurityKeysService.getKeysBlacklist()
			.then(data => {
				res.send(data);
			})
			.catch(next);
	}

	getSingleKey(req, res, next) {
		SecurityKeysService.getSingleKey(req.params.id)
			.then(data => {
				if (data) {
					res.send(data);
				} else {
					res.status(404).end();
				}
			})
			.catch(next);
	}

	addKey(req, res, next) {
		SecurityKeysService.addKey(req.body)
			.then(data => {
				res.send(data);
			})
			.catch(next);
	}

	updateKey(req, res, next) {
		SecurityKeysService.updateKey(req.params.id, req.body)
			.then(data => {
				if (data) {
					res.send(data);
				} else {
					res.status(404).end();
				}
			})
			.catch(next);
	}

	deleteKey(req, res, next) {
		SecurityKeysService.deleteKey(req.params.id)
			.then(data => {
				res.end();
			})
			.catch(next);
	}
}

export default SecurityKeysRoute;
