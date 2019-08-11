import TenantsService from '../services/tenants/tenants';
import UsersService from '../services/users/users';
import VerificationTokensService from '../services/verificationTokens';
import SitemapService from '../services/sitemap';
import ProductsService from '../services/products/products';
import PagesService from '../services/pages/pages';
import ThemeSettingsService from '../services/theme/settings';
import CategoriesService from '../services/products/productCategories';
import ThemePlaceholdersService from '../services/theme/placeholders';
import SettingsService from '../services/settings/settings';
import RedirectsService from '../services/redirects';
import OrdersService from '../services/orders/orders';

class PublicRoute {
	constructor(router) {
		this.router = router;
		this.registerRoutes();
	}

	registerRoutes() {
		this.router.get(
			'/v1/p/tenants/:tenantUrlName',
			this.getTenantIdByUrlName.bind(this)
		);
		this.router.post('/v1/p/register', this.register.bind(this));
		this.router.post('/v1/p/resetPassword', this.resetPassword.bind(this));
		this.router.post('/v1/p/authorize', this.authorize.bind(this));
		this.router.get(
			'/v1/p/verification_tokens/:id',
			this.getSingleTokenById.bind(this)
		);
		this.router.put(
			'/v1/p/disable_verification_tokens/:id',
			this.disableVerificationToken.bind(this)
		);
		this.router.put(
			'/v1/p/update_users_password/:id',
			this.updateUserPassword.bind(this)
		);
		this.router.put(
			'/v1/p/active_users_account/:id',
			this.activeUserAccount.bind(this)
		);
		this.router.get('/v1/p/sitemap', this.getSitemap.bind(this));
		this.router.get('/v1/p/pages', this.getPages.bind(this));
		this.router.get('/v1/p/products', this.getProducts.bind(this));
		this.router.get(
			'/v1/p/products/:productId',
			this.getSingleProduct.bind(this)
		);
		this.router.get('/v1/p/pages/:pageId', this.getSinglePage.bind(this));
		this.router.get('/v1/p/theme/settings', this.getThemeSettings.bind(this));
		this.router.get('/v1/p/product_categories', this.getCategories.bind(this));
		this.router.get(
			'/v1/p/theme/placeholders',
			this.getPlaceholders.bind(this)
		);
		this.router.get('/v1/p/settings', this.getSettings.bind(this));
		this.router.get('/v1/p/redirects', this.getRedirects.bind(this));
		this.router.get('/v1/p/cart', this.getCart.bind(this));
		this.router.get('/v1/p/logout', this.logout.bind(this));
	}

	getTenantIdByUrlName(req, res, next) {
		TenantsService.getTenantIdByUrlName(req.params.tenantUrlName)
			.then(data => {
				if (data) {
					res.send(data);
				} else {
					res.status(404).end();
				}
			})
			.catch(next);
	}

	register(req, res, next) {
		UsersService.register(req.get('x-tenant-id'), req.body)
			.then(data => {
				if (data) {
					res.send(data);
				} else {
					res.status(404).end();
				}
			})
			.catch(next);
	}

	resetPassword(req, res, next) {
		UsersService.resetPassword(req)
			.then(data => {
				if (data) {
					res.send(data);
				} else {
					res.status(404).end();
				}
			})
			.catch(next);
	}

	authorize(req, res, next) {
		UsersService.authorize(req.get('x-tenant-id'), req.body)
			.then(data => {
				if (data) {
					res.send(data);
				} else {
					res.status(404).end();
				}
			})
			.catch(next);
	}

	getSingleTokenById(req, res, next) {
		VerificationTokensService.getSingleTokenById(req.params.id)
			.then(data => {
				if (data) {
					res.send(data);
				} else {
					res.status(404).end();
				}
			})
			.catch(next);
	}

	disableVerificationToken(req, res, next) {
		VerificationTokensService.updateToken(req.params.id, { enabled: false })
			.then(data => {
				if (data) {
					res.send(data);
				} else {
					res.status(404).end();
				}
			})
			.catch(next);
	}

	updateUserPassword(req, res, next) {
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

	activeUserAccount(req, res, next) {
		UsersService.updateUser(req.get('x-tenant-id'), req.params.id, {
			enabled: true
		})
			.then(data => {
				if (data) {
					res.send(data);
				} else {
					res.status(404).end();
				}
			})
			.catch(next);
	}

	getSitemap(req, res, next) {
		if (req.query.path) {
			SitemapService.getSinglePath(
				req.get('x-tenant-id'),
				req.query.tenantUrlName,
				req.query.path,
				req.query.locale,
				req.query.enabled
			)
				.then(data => {
					if (data) {
						res.send(data);
					} else {
						res.status(404).end();
					}
				})
				.catch(next);
		} else {
			SitemapService.getPaths(
				req.get('x-tenant-id'),
				req.query.tenantUrlName,
				req.query.locale,
				req.query.enabled
			)
				.then(data => {
					res.send(data);
				})
				.catch(next);
		}
	}

	getPages(req, res, next) {
		PagesService.getPages(req.get('x-tenant-id'), req.query)
			.then(data => {
				if (data) {
					res.send(data);
				} else {
					res.status(404).end();
				}
			})
			.catch(next);
	}

	getProducts(req, res, next) {
		ProductsService.getProducts(req.get('x-tenant-id'), req.query)
			.then(data => {
				if (data) {
					res.send(data);
				} else {
					res.status(404).end();
				}
			})
			.catch(next);
	}

	getSingleProduct(req, res, next) {
		ProductsService.getSingleProduct(
			req.get('x-tenant-id'),
			req.params.productId
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

	getSinglePage(req, res, next) {
		PagesService.getSinglePage(req.get('x-tenant-id'), req.params.pageId)
			.then(data => {
				if (data) {
					res.send(data);
				} else {
					res.status(404).end();
				}
			})
			.catch(next);
	}

	getThemeSettings(req, res, next) {
		ThemeSettingsService.getSettings(req.get('x-tenant-id'))
			.then(data => {
				res.send(data);
			})
			.catch(next);
	}

	getCategories(req, res, next) {
		CategoriesService.getCategories(req.get('x-tenant-id'), req.query)
			.then(data => {
				res.send(data);
			})
			.catch(next);
	}

	getPlaceholders(req, res, next) {
		ThemePlaceholdersService.getPlaceholders()
			.then(data => {
				res.send(data);
			})
			.catch(next);
	}

	getSettings(req, res, next) {
		SettingsService.getSettings(req.get('x-tenant-id'))
			.then(data => {
				res.send(data);
			})
			.catch(next);
	}

	getRedirects(req, res, next) {
		RedirectsService.getRedirects(req.query)
			.then(data => {
				res.send(data);
			})
			.catch(next);
	}

	getCart(req, res, next) {
		const cartId = req.signedCookies.cart_id;
		if (cartId) {
			OrdersService.getSingleOrder(req.get('x-tenant-id'), cartId)
				.then(data => {
					if (data) {
						res.send(data);
					} else {
						res.status(404).end();
					}
				})
				.catch(next);
		} else {
			res.send();
		}
	}

	logout(req, res, next) {
		res.clearCookie('cart_id');
		res.send();
	}
}

export default PublicRoute;
