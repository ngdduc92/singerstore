import security from '../lib/security';
import OrdersService from '../services/orders/orders';
import OrderAddressService from '../services/orders/orderAddress';
import OrderItemsService from '../services/orders/orderItems';
import utils from '../lib/utils';
import PaymentGateways from '../paymentGateways';
import scopes from '../lib/scopes';

class CartRoute {
	constructor(router) {
		this.router = router;
		this.registerRoutes();
	}

	registerRoutes() {
		this.router.get(
			'/v1/cart',
			security.checkRoleScope.bind(this, scopes.READ_CART),
			this.getCart.bind(this)
		);
		this.router.post(
			'/v1/cart',
			security.checkRoleScope.bind(this, scopes.WRITE_CART),
			this.addCart.bind(this)
		);
		this.router.put(
			'/v1/cart',
			security.checkRoleScope.bind(this, scopes.WRITE_CART),
			this.updateCart.bind(this)
		);
		this.router.put(
			'/v1/cart/checkout',
			security.checkRoleScope.bind(this, scopes.PLACE_ORDER),
			this.checkout.bind(this)
		);
		this.router.put(
			'/v1/cart/billing_address',
			security.checkRoleScope.bind(this, scopes.WRITE_CART),
			this.updateBillingAddress.bind(this)
		);
		this.router.put(
			'/v1/cart/shipping_address',
			security.checkRoleScope.bind(this, scopes.WRITE_CART),
			this.updateShippingAddress.bind(this)
		);
		this.router.post(
			'/v1/cart/items',
			security.checkRoleScope.bind(this, scopes.WRITE_CART),
			this.addItem.bind(this)
		);
		this.router.put(
			'/v1/cart/items/:item_id',
			security.checkRoleScope.bind(this, scopes.WRITE_CART),
			this.updateItem.bind(this)
		);
		this.router.delete(
			'/v1/cart/items/:item_id',
			security.checkRoleScope.bind(this, scopes.DELETE_CART),
			this.deleteItem.bind(this)
		);
		this.router.post(
			'/v1/cart/charge',
			security.checkRoleScope.bind(this, scopes.PLACE_ORDER),
			this.charge.bind(this)
		);
		this.router.get(
			'/v1/cart/payment_form_settings',
			security.checkRoleScope.bind(this, scopes.PLACE_ORDER),
			this.getPaymentFormSettings.bind(this)
		);
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
			OrdersService.getOrders(req.get('x-tenant-id'), {
				cart: true,
				email: req.query.email,
				limit: 1
			})
				.then(cart => {
					if (cart) {
						if (cart.data && cart.data.length > 0) {
							res.cookie(
								'cart_id',
								cart.data[0].id,
								utils.getCartCookieOptions(req.protocol === 'https')
							);
							res.send(cart.data[0]);
						} else {
							res.send();
						}
					} else {
						res.status(404).end();
					}
				})
				.catch(next);
		}
	}

	addCart(req, res, next) {
		OrdersService.addOrder(req.get('x-tenant-id'), req.body)
			.then(data => {
				res.cookie(
					'cart_id',
					data.id,
					utils.getCartCookieOptions(req.protocol === 'https')
				);
				res.send(data);
			})
			.catch(next);
	}

	updateCart(req, res, next) {
		OrdersService.updateOrder(
			req.get('x-tenant-id'),
			req.signedCookies.cart_id,
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

	checkout(req, res, next) {
		OrdersService.checkoutOrder(
			req.get('x-tenant-id'),
			req.signedCookies.cart_id
		)
			.then(data => {
				res.clearCookie('cart_id');
				res.send(data);
			})
			.catch(next);
	}

	updateBillingAddress(req, res, next) {
		OrderAddressService.updateBillingAddress(
			req.get('x-tenant-id'),
			req.signedCookies.cart_id,
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

	updateShippingAddress(req, res, next) {
		OrderAddressService.updateShippingAddress(
			req.get('x-tenant-id'),
			req.signedCookies.cart_id,
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

	addItem(req, res, next) {
		OrderItemsService.addItem(
			req.get('x-tenant-id'),
			req.signedCookies.cart_id,
			req.body
		)
			.then(data => {
				res.send(data);
			})
			.catch(next);
	}

	updateItem(req, res, next) {
		const item_id = req.params.item_id;
		OrderItemsService.updateItem(
			req.get('x-tenant-id'),
			req.signedCookies.cart_id,
			item_id,
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

	deleteItem(req, res, next) {
		const item_id = req.params.item_id;
		OrderItemsService.deleteItem(
			req.get('x-tenant-id'),
			req.signedCookies.cart_id,
			item_id
		)
			.then(data => {
				res.send(data);
			})
			.catch(next);
	}

	async charge(req, res, next) {
		try {
			const isSuccess = await OrdersService.chargeOrder(
				req.get('x-tenant-id'),
				req.signedCookies.cart_id
			);
			res.status(isSuccess ? 200 : 500).end();
		} catch (err) {
			next(err);
		}
	}

	getPaymentFormSettings(req, res, next) {
		PaymentGateways.getPaymentFormSettings(
			req.get('x-tenant-id'),
			req.signedCookies.cart_id
		)
			.then(data => {
				res.send(data);
			})
			.catch(next);
	}
}

export default CartRoute;
