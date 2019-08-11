import security from '../lib/security';
import DiscountsService from '../services/discounts/discounts';
import scopes from '../lib/scopes';

class DiscountsRoute {
	constructor(router) {
		this.router = router;
		this.registerRoutes();
	}

	registerRoutes() {
		/**
		 * @api {get} /v1/discounts Get discounts
		 * @apiVersion 1.0.0
		 * @apiName getDiscounts
		 * @apiGroup Discounts
		 * @apiPermission authenticated user
		 *
		 *
		 * @apiExample {js} Example usage:
		 * Request URL: http://localhost:3001/api/v1/discounts
		 *
		 * @apiSuccess (Success 200) {String} status Success code
		 *
		 * @apiSuccessExample {json} Success response:
		 *     HTTPS 200 OK
		 *     [{"date_created":"2019-06-17T03:15:14.590Z","date_updated":null,"code":"COUPON002","description":"COUPON002","type":"COUPON","tenant_id":"5d06fe02f75bae1e6daed801","deleted":false,"id":"5d0705c233f8db27d308f417"}]
		 *
		 * @apiUse UnauthorizedError
		 */
		this.router.get(
			'/v1/discounts',
			security.checkRoleScope.bind(this, scopes.LIST_DISCOUNT),
			this.getDiscounts.bind(this)
		);
		/**
		 * @api {post} /v1/discounts Add discounts
		 * @apiVersion 1.0.0
		 * @apiName addDiscounts
		 * @apiGroup Discounts
		 * @apiPermission authenticated user
		 *
		 * @apiParam (Request body) {String} code The Discount code
		 * @apiParam (Request body) {String} description The Discount description
		 * @apiParam (Request body) {String} type The Discount type
		 * @apiParam (Request body) {String} amount The Discount amount
		 * @apiParam (Request body) {String} category_ids The Discount applied for categories
		 * @apiParam (Request body) {String} product_ids The Discount applied for products
		 * @apiParam (Request body) {String} enabled enabled?
		 * @apiParam (Request body) {String} date_from The Discount date_enabled_from
		 * @apiParam (Request body) {String} date_to The Discount date_enabled_to title
		 * @apiParam (Request body) {String} quantity_min Minimum quantity requirements for discount codes
		 * @apiParam (Request body) {String} quantity_max Maximum quantity requirements for discount codes
		 * @apiParam (Request body) {String} quantity Number of times code can be used before automatically becoming inactive
		 * @apiParam (Request body) {String} tenant_id The tenant id
		 *
		 * @apiExample {js} Example Request Payload:
		 * {"code": "COUPON005", "description": "COUPON005", "type": "COUPON"}
		 *
		 * @apiSuccess (Success 200) {String} status Success code
		 *
		 * @apiSuccessExample {json} Success response:
		 *     HTTPS 200 OK
		 *     {"date_created":"2019-06-17T03:15:14.590Z","date_updated":null,"code":"COUPON002","description":"COUPON002","type":"COUPON","tenant_id":"5d06fe02f75bae1e6daed801","deleted":false,"id":"5d0705c233f8db27d308f417"}
		 *
		 * @apiUse UnauthorizedError
		 */
		this.router.post(
			'/v1/discounts',
			security.checkRoleScope.bind(this, scopes.WRITE_DISCOUNT),
			this.addDiscount.bind(this)
		);
		/**
		 * @api {get} /v1/discounts/:id Get Single Page
		 * @apiVersion 1.0.0
		 * @apiName getSingleDiscount
		 * @apiGroup Discounts
		 * @apiPermission authenticated user
		 *
		 * @apiParam (Request param) {String} id The pages id
		 *
		 * @apiExample {js} Example usage:
		 * Request URL: http://localhost:3001/api/v1/discounts/5cff81ed7ceb7a138e5e7139?
		 *
		 * @apiSuccess (Success 200) {String} status Success code
		 *
		 * @apiSuccessExample {json} Success response:
		 *     HTTPS 200 OK
		 *     {"date_created":"2019-06-17T03:15:14.590Z","date_updated":null,"code":"COUPON002","description":"COUPON002","type":"COUPON","tenant_id":"5d06fe02f75bae1e6daed801","deleted":false,"id":"5d0705c233f8db27d308f417"}
		 *
		 * @apiUse UnauthorizedError
		 */
		this.router.get(
			'/v1/discounts/:id',
			security.checkRoleScope.bind(this, scopes.READ_DISCOUNT),
			this.getSingleDiscount.bind(this)
		);
		/**
		 * @api {put} /v1/discounts/:id Update Discount
		 * @apiVersion 1.0.0
		 * @apiName updateDiscount
		 * @apiGroup Discounts
		 * @apiPermission authenticated user
		 *
		 * @apiParam (Request param) {String} id The Discount id
		 * @apiParam (Request body) {String} code The Discount code
		 * @apiParam (Request body) {String} description The Discount description
		 * @apiParam (Request body) {String} category_ids The Discount applied for categories
		 * @apiParam (Request body) {String} product_ids The Discount applied for products
		 * @apiParam (Request body) {String} branding_ids The Discount applied for brands
		 * @apiParam (Request body) {String} type The Discount type
		 * @apiParam (Request body) {String} amount The Discount amount
		 * @apiParam (Request body) {String} enabled enabled?
		 * @apiParam (Request body) {String} date_enabled_from The Discount date_enabled_from
		 * @apiParam (Request body) {String} date_enabled_to The Discount date_enabled_to title
		 * @apiParam (Request body) {String} quantity_min Minimum quantity requirements for discount codes
		 * @apiParam (Request body) {String} quantity_max Maximum quantity requirements for discount codes
		 * @apiParam (Request body) {String} quantity Number of times code can be used before automatically becoming inactive
		 * @apiParam (Request body) {String} tenant_id The tenant id
		 *
		 * @apiExample {js} Example Request Payload:
		 * {"id": "5d0709e63b603e2ab2af3833", "code": "COUPON007", "description": "COUPON007", "type": "COUPON"}
		 *
		 * @apiSuccess (Success 200) {String} status Success code
		 *
		 * @apiSuccessExample {json} Success response:
		 *     HTTPS 200 OK
		 * 	   {"date_created":"2019-06-17T03:15:14.590Z","date_updated":"2019-06-17T08:47:01.451Z","code":"COUPON007","description":"COUPON007","type":"COUPON","tenant_id":"5d06fe02f75bae1e6daed801","deleted":false,"id":"5d0705c233f8db27d308f417"}
		 *
		 * @apiUse UnauthorizedError
		 */
		this.router.put(
			'/v1/discounts/:id',
			security.checkRoleScope.bind(this, scopes.WRITE_DISCOUNT),
			this.updateDiscount.bind(this)
		);
		/**
		 * @api {delete} /v1/discounts/:id Delete Discount
		 * @apiVersion 1.0.0
		 * @apiName deleteDiscount
		 * @apiGroup Discounts
		 * @apiPermission authenticated user
		 *
		 * @apiParam (Request param) {String} id The Discount id
		 *
		 * @apiExample {js} Example usage:
		 * Request URL: http://localhost:3001/api/v1/discounts/5cff81ed7ceb7a138e5e7139
		 *
		 * @apiSuccess (Success 200) {String} status Success code
		 *
		 * @apiSuccessExample {json} Success response:
		 *     HTTPS 200 OK
		 *
		 * @apiUse UnauthorizedError
		 */
		this.router.delete(
			'/v1/discounts/:id',
			security.checkRoleScope.bind(this, scopes.DELETE_DISCOUNT),
			this.deleteDiscount.bind(this)
		);

		/**
		 * @api {post} /v1/discounts/apply Apply discount code
		 * @apiVersion 1.0.0
		 * @apiName applyDiscount
		 * @apiGroup Discounts
		 * @apiPermission authenticated user
		 *
		 * @apiParam (Request body) {String} code The Discount code
		 *
		 * @apiExample {js} Example Request Payload:
		 * {"code": "COUPON005", "order_id": "7df8827ceb7a138e5e7139"}
		 *
		 * @apiSuccess (Success 200) {String} status Success code
		 *
		 * @apiSuccessExample {json} Success response:
		 *     HTTPS 200 OK
		 * 	   {"date_created":"2019-07-04T03:30:49.088Z","date_placed":null,"date_updated":"2019-07-11T04:00:57.440Z","date_closed":null,"date_paid":null,"date_cancelled":null,"number":1000,"shipping_status":"","items":[{"id":"5d25978110894903fde60a61","product_id":"5d1d72231010e63e914ba1ed","variant_id":null,"quantity":2,"discount_total":0,"name":"air-max-90-betrue-shoe","price":2000,"price_total":4000,"sku":"503880","tax_class":"","tax_total":0,"variant_name":"","weight":0}],"transactions":[],"discounts":[],"billing_address":{"address1":"","address2":"","city":"09","country":"US","state":"LA","phone":"","postal_code":"","full_name":"","company":"","tax_number":"","coordinates":{"latitude":"","longitude":""},"details":null},"shipping_address":{"address1":"123 Road River st.","address2":"123","city":"09","country":"US","state":"LA","phone":"0909090909","postal_code":"12355","full_name":"name","company":"","tax_number":"","coordinates":{"latitude":"","longitude":""},"details":null},"item_tax":0,"shipping_tax":0,"shipping_discount":0,"shipping_price":25,"item_tax_included":true,"shipping_tax_included":true,"closed":false,"cancelled":false,"delivered":false,"paid":false,"hold":false,"draft":false,"cart":true,"email":"tuan.le@evizi.com","mobile":"0909000000","referrer_url":"http://localhost:3000/blueshop/men","landing_url":"http://localhost/blueshop/","channel":"","note":"","comments":"454545","coupon":{"code":"CP002","type":"cart_percent","amount":10,"date_created":"2019-07-10T10:19:12.354Z","date_updated":null,"description":"CP002","enabled":true,"tenant_id":"5d1d71cb1010e63e914ba1e4","deleted":false,"id":"5d25bba0254242686e675ec6"},"tracking_number":"","customer_id":null,"status_id":null,"payment_method_id":"5d1d72891010e63e914ba1f2","shipping_method_id":"5d25c0e488971f6f698be598","tags":[],"browser":{"ip":"::1","user_agent":"Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.77 Safari/537.36"},"tenant_id":"5d1d71cb1010e63e914ba1e4","deleted":false,"id":"5d1d72e91010e63e914ba1f3","status":"","shipping_method":"Express","payment_method":"Paypal","payment_method_gateway":"paypal-checkout","weight_total":0,"discount_total":400,"subtotal":4000,"tax_included_total":0,"tax_total":0,"shipping_total":25,"grand_total":3625}
		 *
		 * @apiUse UnauthorizedError
		 */
		this.router.post(
			'/v1/discounts/apply',
			security.checkRoleScope.bind(this, scopes.WRITE_CART),
			this.applyDiscount.bind(this)
		);
	}

	getDiscounts(req, res, next) {
		DiscountsService.getDiscounts(req.get('x-tenant-id'), req.query)
			.then(data => {
				res.send(data);
			})
			.catch(next);
	}

	getSingleDiscount(req, res, next) {
		DiscountsService.getSingleDiscount(req.get('x-tenant-id'), req.params.id)
			.then(data => {
				if (data) {
					res.send(data);
				} else {
					res.status(404).end();
				}
			})
			.catch(next);
	}

	addDiscount(req, res, next) {
		DiscountsService.addDiscount(req.get('x-tenant-id'), req.body)
			.then(data => {
				res.send(data);
			})
			.catch(next);
	}

	updateDiscount(req, res, next) {
		DiscountsService.updateDiscount(
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

	deleteDiscount(req, res, next) {
		DiscountsService.deleteDiscount(req.params.id)
			.then(data => {
				res.status(data ? 200 : 404).end();
			})
			.catch(next);
	}

	applyDiscount(req, res, next) {
		DiscountsService.applyDiscount(req.get('x-tenant-id'), req.body)
			.then(data => {
				if (data) {
					res.send(data);
				} else {
					res.status(404).end();
				}
			})
			.catch(next);
	}
}

export default DiscountsRoute;
