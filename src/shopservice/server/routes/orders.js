import security from '../lib/security';
import OrdersService from '../services/orders/orders';
import OrderAddressService from '../services/orders/orderAddress';
import OrderItemsService from '../services/orders/orderItems';
import OrdertTansactionsService from '../services/orders/orderTransactions';
import OrdertDiscountsService from '../services/orders/orderDiscounts';
import PaymentGateways from '../paymentGateways';
import scopes from '../lib/scopes';

class OrdersRoute {
	constructor(router) {
		this.router = router;
		this.registerRoutes();
	}

	registerRoutes() {
		/**
		 * @api {get} /v1/orders Get Orders
		 * @apiVersion 1.0.0
		 * @apiName getOrders
		 * @apiGroup Orders
		 * @apiPermission authenticated user
		 *
		 * @apiParam (Request param) {String} cart Get cart?
		 * @apiParam (Request param) {String} draft Get draft?
		 * @apiParam (Request param) {String} limit Get limit
		 * @apiParam (Request param) {String} offset offset
		 * @apiParam (Request param) {String} status_id Status id
		 *
		 * @apiExample {js} Example usage:
		 * Request URL: http://localhost:3001/api/v1/orders?draft=false&limit=50&offset=0&status_id=all
		 *
		 * @apiSuccess (Success 200) {String} status Success code
		 * @apiSuccess (Success 304) {String} status Success code
		 *
		 * @apiSuccessExample {json} Success response:
		 *     HTTPS 304 Not Modified
		 *     {"total_count":1,"has_more":false,"data":[{"date_created":"2019-06-13T08:14:42.877Z","date_placed":"2019-06-13T08:16:29.000Z","date_updated":"2019-06-13T08:16:29.727Z","date_closed":null,"date_paid":null,"date_cancelled":null,"number":1003,"shipping_status":"","items":[{"id":"5d02060474ad7e0c97b20111","product_id":"5d01c38074ad7e0c97b200ed","variant_id":null,"quantity":1,"discount_total":0,"name":"Air max 720","price":300,"price_total":300,"sku":"503880","tax_class":"","tax_total":0,"variant_name":"","weight":0}],"transactions":[],"discounts":[],"billing_address":{"address1":"","address2":"","city":"","country":"","state":"","phone":"","postal_code":"","full_name":"","company":"","tax_number":"","coordinates":{"latitude":"","longitude":""},"details":null},"shipping_address":{"address1":"123 DN","address2":"","city":"","country":"US","state":"","phone":"","postal_code":"","full_name":"tuan le","company":"","tax_number":"","coordinates":{"latitude":"","longitude":""},"details":null},"item_tax":0,"shipping_tax":0,"shipping_discount":0,"shipping_price":15,"item_tax_included":true,"shipping_tax_included":true,"closed":false,"cancelled":false,"delivered":false,"paid":false,"hold":false,"draft":true,"cart":false,"email":"tuan.le1@evizi.com","mobile":"0909000000","referrer_url":"admin","landing_url":"","channel":"","note":"","comments":"","coupon":"","tracking_number":"000002A","customer_id":"5d02062674ad7e0c97b20113","status_id":"5d02056374ad7e0c97b20109","payment_method_id":"5d01c5cf74ad7e0c97b200ff","shipping_method_id":"5d01c58f74ad7e0c97b200fd","tags":[],"browser":{"ip":"","user_agent":""},"tenant_id":"5d01c28374ad7e0c97b200e2","deleted":false,"id":"5d0205f274ad7e0c97b20110","status":"In progress","shipping_method":"UPS","payment_method":"Paypal","payment_method_gateway":"paypal-checkout","weight_total":0,"discount_total":0,"subtotal":300,"tax_included_total":0,"tax_total":0,"shipping_total":15,"grand_total":315}]}		 *
		 *
		 * @apiUse UnauthorizedError
		 */
		this.router.get(
			'/v1/orders',
			security.checkRoleScope.bind(this, scopes.LIST_ORDER),
			this.getOrders.bind(this)
		);
		/**
		 * @api {post} /v1/orders Add Order
		 * @apiVersion 1.0.0
		 * @apiName addOrder
		 * @apiGroup Orders
		 * @apiPermission authenticated user
		 *
		 * @apiParam (Request body) {String} draft draft?
		 * @apiParam (Request body) {String} referrer_url referrer url
		 *
		 * @apiExample {js} Example Request Payload:
		 * {"draft":true,"referrer_url":"admin"}
		 *
		 * @apiSuccess (Success 200) {String} status Success code
		 *
		 * @apiSuccessExample {json} Success response:
		 *     HTTPS 200 OK
		 *     {"date_created":"2019-06-11T08:56:02.177Z","date_placed":null,"date_updated":null,"date_closed":null,"date_paid":null,"date_cancelled":null,"number":1001,"shipping_status":"","items":[],"transactions":[],"discounts":[],"billing_address":{"address1":"","address2":"","city":"","country":"","state":"","phone":"","postal_code":"","full_name":"","company":"","tax_number":"","coordinates":{"latitude":"","longitude":""},"details":null},"shipping_address":{"address1":"","address2":"","city":"","country":"","state":"","phone":"","postal_code":"","full_name":"","company":"","tax_number":"","coordinates":{"latitude":"","longitude":""},"details":null},"item_tax":0,"shipping_tax":0,"shipping_discount":0,"shipping_price":0,"item_tax_included":true,"shipping_tax_included":true,"closed":false,"cancelled":false,"delivered":false,"paid":false,"hold":false,"draft":true,"email":"","mobile":"","referrer_url":"admin","landing_url":"","channel":"","note":"","comments":"","coupon":"","tracking_number":"","customer_id":null,"status_id":null,"payment_method_id":null,"shipping_method_id":null,"tags":[],"browser":{"ip":"","user_agent":""},"tenant_id":"5cf6520b5407a83e20be98b9","deleted":false,"id":"5cff6ca27ceb7a138e5e712e","status":"","shipping_method":"","payment_method":"","payment_method_gateway":"","weight_total":0,"discount_total":0,"subtotal":0,"tax_included_total":0,"tax_total":0,"shipping_total":0,"grand_total":0}
		 *
		 * @apiUse UnauthorizedError
		 */
		this.router.post(
			'/v1/orders',
			security.checkRoleScope.bind(this, scopes.WRITE_ORDER),
			this.addOrder.bind(this)
		);
		/**
		 * @api {get} /v1/orders/:id Get Single Order
		 * @apiVersion 1.0.0
		 * @apiName getSingleOrder
		 * @apiGroup Orders
		 * @apiPermission authenticated user
		 *
		 * @apiParam (Request param) {String} id The order id
		 *
		 * @apiExample {js} Example usage:
		 * Request URL: http://localhost:3001/api/v1/orders/5cff6ca27ceb7a138e5e712e?
		 *
		 * @apiSuccess (Success 200) {String} status Success code
		 *
		 * @apiSuccessExample {json} Success response:
		 *     HTTPS 200 OK
		 *     {"date_created":"2019-06-11T08:56:02.177Z","date_placed":"2019-06-11T09:00:15.000Z","date_updated":"2019-06-11T09:04:19.595Z","date_closed":null,"date_paid":null,"date_cancelled":null,"number":1001,"shipping_status":"","items":[{"id":"5cff75837ceb7a138e5e7130","product_id":"5cf886805407a83e20be98ce","variant_id":null,"quantity":1,"discount_total":0,"name":"NIKE AIR MAX 720 BETRUE","price":300,"price_total":300,"sku":"503880","tax_class":"","tax_total":0,"variant_name":"","weight":0}],"transactions":[],"discounts":[],"billing_address":{"address1":"","address2":"","city":"","country":"","state":"","phone":"","postal_code":"","full_name":"","company":"","tax_number":"","coordinates":{"latitude":"","longitude":""},"details":null},"shipping_address":{"address1":"","address2":"","city":"HCM City","country":"Viet Nam","state":"","phone":"","postal_code":"","full_name":"","company":"","tax_number":"","coordinates":{"latitude":"","longitude":""},"details":null},"item_tax":0,"shipping_tax":0,"shipping_discount":0,"shipping_price":0,"item_tax_included":true,"shipping_tax_included":true,"closed":false,"cancelled":false,"delivered":false,"paid":false,"hold":false,"draft":false,"email":"tuan.le@evizi.com","mobile":"","referrer_url":"admin","landing_url":"","channel":"","note":"","comments":"","coupon":"","tracking_number":"000001A","customer_id":null,"status_id":null,"payment_method_id":null,"shipping_method_id":null,"tags":[],"browser":{"ip":"","user_agent":""},"tenant_id":"5cf6520b5407a83e20be98b9","deleted":false,"id":"5cff6ca27ceb7a138e5e712e","status":"","shipping_method":"","payment_method":"","payment_method_gateway":"","weight_total":0,"discount_total":0,"subtotal":300,"tax_included_total":0,"tax_total":0,"shipping_total":0,"grand_total":300}
		 *
		 * @apiUse UnauthorizedError
		 */
		this.router.get(
			'/v1/orders/:id',
			security.checkRoleScope.bind(this, scopes.READ_ORDER),
			this.getSingleOrder.bind(this)
		);
		/**
		 * @api {put} /v1/orders/:id Update Order
		 * @apiVersion 1.0.0
		 * @apiName updateOrder
		 * @apiGroup Orders
		 * @apiPermission authenticated user
		 *
		 * @apiParam (Request param) {String} id The order id
		 * @apiParam (Request body) {String} comments The order comments
		 * @apiParam (Request body) {String} email The order email
		 * @apiParam (Request body) {String} id The order id
		 * @apiParam (Request body) {String} mobile The order mobile
		 * @apiParam (Request body) {String} note The order note
		 * @apiParam (Request body) {String} payment_method_id The order payment method id
		 * @apiParam (Request body) {String} shipping_method_id The order shipping method id
		 * @apiParam (Request body) {String} status_id The order status id
		 * @apiParam (Request body) {String} tracking_number The order tracking number
		 *
		 * @apiExample {js} Example Request Payload:
		 * Request Payload
		 * {"id":"5cff6ca27ceb7a138e5e712e","tracking_number":"000001A","status_id":null,"shipping_method_id":null,"payment_method_id":null,"comments":"","note":"","email":"tuan.le@evizi.com","mobile":""}
		 *
		 * @apiSuccess (Success 200) {String} status Success code
		 *
		 * @apiSuccessExample {json} Success response:
		 *     HTTPS 200 OK
		 *     {"date_created":"2019-06-11T08:56:02.177Z","date_placed":"2019-06-11T09:00:15.000Z","date_updated":"2019-06-11T09:04:19.595Z","date_closed":null,"date_paid":null,"date_cancelled":null,"number":1001,"shipping_status":"","items":[],"transactions":[],"discounts":[],"billing_address":{"address1":"","address2":"","city":"","country":"","state":"","phone":"","postal_code":"","full_name":"","company":"","tax_number":"","coordinates":{"latitude":"","longitude":""},"details":null},"shipping_address":{"address1":"","address2":"","city":"","country":"","state":"","phone":"","postal_code":"","full_name":"","company":"","tax_number":"","coordinates":{"latitude":"","longitude":""},"details":null},"item_tax":0,"shipping_tax":0,"shipping_discount":0,"shipping_price":0,"item_tax_included":true,"shipping_tax_included":true,"closed":false,"cancelled":false,"delivered":false,"paid":false,"hold":false,"draft":false,"email":"tuan.le@evizi.com","mobile":"","referrer_url":"admin","landing_url":"","channel":"","note":"","comments":"","coupon":"","tracking_number":"000001A","customer_id":null,"status_id":null,"payment_method_id":null,"shipping_method_id":null,"tags":[],"browser":{"ip":"","user_agent":""},"tenant_id":"5cf6520b5407a83e20be98b9","deleted":false,"id":"5cff6ca27ceb7a138e5e712e","status":"","shipping_method":"","payment_method":"","payment_method_gateway":"","weight_total":0,"discount_total":0,"subtotal":0,"tax_included_total":0,"tax_total":0,"shipping_total":0,"grand_total":0}
		 *
		 * @apiUse UnauthorizedError
		 */
		this.router.put(
			'/v1/orders/:id',
			security.checkRoleScope.bind(this, scopes.WRITE_ORDER),
			this.updateOrder.bind(this)
		);
		/**
		 * @api {delete} /v1/orders/:id Delete Order
		 * @apiVersion 1.0.0
		 * @apiName deleteOrder
		 * @apiGroup Orders
		 * @apiPermission authenticated user
		 *
		 * @apiParam (Request param) {String} id The order id
		 *
		 * @apiExample {js} Example usage:
		 * Request URL: http://localhost:3001/api/v1/orders/5cff6ca27ceb7a138e5e712e
		 *
		 * @apiSuccess (Success 200) {String} status Success code
		 *
		 * @apiSuccessExample {json} Success response:
		 *     HTTPS 200 OK
		 *
		 * @apiUse UnauthorizedError
		 */
		this.router.delete(
			'/v1/orders/:id',
			security.checkRoleScope.bind(this, scopes.DELETE_ORDER),
			this.deleteOrder.bind(this)
		);

		/**
		 * @api {put} /v1/orders/:id/recalculate Recalculate Order
		 * @apiVersion 1.0.0
		 * @apiName recalculateOrder
		 * @apiGroup Orders
		 * @apiPermission authenticated user
		 *
		 * @apiParam (Request param) {String} id The order id
		 *
		 * @apiExample {js} Example usage:
		 * Request URL: http://localhost:3001/api/v1/orders/5cff6ca27ceb7a138e5e712e/recalculate
		 *
		 * @apiSuccess (Success 200) {String} status Success code
		 *
		 * @apiSuccessExample {json} Success response:
		 *     HTTPS 200 OK
		 *
		 * @apiUse UnauthorizedError
		 */
		this.router.put(
			'/v1/orders/:id/recalculate',
			security.checkRoleScope.bind(this, scopes.WRITE_ORDER),
			this.recalculateOrder.bind(this)
		);
		/**
		 * @api {put} /v1/orders/:id/checkout Checkout Order
		 * @apiVersion 1.0.0
		 * @apiName checkoutOrder
		 * @apiGroup Orders
		 * @apiPermission authenticated user
		 *
		 * @apiParam (Request param) {String} id The order id
		 *
		 * @apiExample {js} Example usage:
		 * Request URL: http://localhost:3001/api/v1/orders/5cff6ca27ceb7a138e5e712e/checkout
		 *
		 * @apiSuccess (Success 200) {String} status Success code
		 *
		 * @apiSuccessExample {json} Success response:
		 *     HTTPS 200 OK
		 *     {"date_created":"2019-06-11T08:56:02.177Z","date_placed":"2019-06-11T09:00:15.000Z","date_updated":"2019-06-11T09:00:15.234Z","date_closed":null,"date_paid":null,"date_cancelled":null,"number":1001,"shipping_status":"","items":[],"transactions":[],"discounts":[],"billing_address":{"address1":"","address2":"","city":"","country":"","state":"","phone":"","postal_code":"","full_name":"","company":"","tax_number":"","coordinates":{"latitude":"","longitude":""},"details":null},"shipping_address":{"address1":"","address2":"","city":"","country":"","state":"","phone":"","postal_code":"","full_name":"","company":"","tax_number":"","coordinates":{"latitude":"","longitude":""},"details":null},"item_tax":0,"shipping_tax":0,"shipping_discount":0,"shipping_price":0,"item_tax_included":true,"shipping_tax_included":true,"closed":false,"cancelled":false,"delivered":false,"paid":false,"hold":false,"draft":false,"email":"","mobile":"","referrer_url":"admin","landing_url":"","channel":"","note":"","comments":"","coupon":"","tracking_number":"","customer_id":null,"status_id":null,"payment_method_id":null,"shipping_method_id":null,"tags":[],"browser":{"ip":"","user_agent":""},"tenant_id":"5cf6520b5407a83e20be98b9","deleted":false,"id":"5cff6ca27ceb7a138e5e712e","status":"","shipping_method":"","payment_method":"","payment_method_gateway":"","weight_total":0,"discount_total":0,"subtotal":0,"tax_included_total":0,"tax_total":0,"shipping_total":0,"grand_total":0}
		 *
		 * @apiUse UnauthorizedError
		 */
		this.router.put(
			'/v1/orders/:id/checkout',
			security.checkRoleScope.bind(this, scopes.WRITE_ORDER),
			this.checkoutOrder.bind(this)
		);
		/**
		 * @api {put} /v1/orders/:id/cancel Cancel Order
		 * @apiVersion 1.0.0
		 * @apiName cancelOrder
		 * @apiGroup Orders
		 * @apiPermission authenticated user
		 *
		 * @apiParam (Request body) {String} id The order id
		 *
		 * @apiExample {js} Example usage:
		 * Request URL: http://localhost:3001/api/v1/orders/5cff6ca27ceb7a138e5e712e/cancel
		 *
		 * @apiSuccess (Success 200) {String} status Success code
		 *
		 * @apiSuccessExample {json} Success response:
		 *     HTTPS 200 OK
		 *     {"date_created":"2019-06-11T08:56:02.177Z","date_placed":"2019-06-11T09:00:15.000Z","date_updated":"2019-06-11T09:41:27.225Z","date_closed":null,"date_paid":null,"date_cancelled":null,"number":1001,"shipping_status":"","items":[{"id":"5cff75837ceb7a138e5e7130","product_id":"5cf886805407a83e20be98ce","variant_id":null,"quantity":1,"discount_total":0,"name":"NIKE AIR MAX 720 BETRUE","price":300,"price_total":300,"sku":"503880","tax_class":"","tax_total":0,"variant_name":"","weight":0}],"transactions":[],"discounts":[],"billing_address":{"address1":"","address2":"","city":"","country":"","state":"","phone":"","postal_code":"","full_name":"","company":"","tax_number":"","coordinates":{"latitude":"","longitude":""},"details":null},"shipping_address":{"address1":"","address2":"","city":"HCM City","country":"Viet Nam","state":"","phone":"","postal_code":"","full_name":"","company":"","tax_number":"","coordinates":{"latitude":"","longitude":""},"details":null},"item_tax":0,"shipping_tax":0,"shipping_discount":0,"shipping_price":0,"item_tax_included":true,"shipping_tax_included":true,"closed":true,"cancelled":false,"delivered":false,"paid":false,"hold":false,"draft":false,"email":"tuan.le@evizi.com","mobile":"","referrer_url":"admin","landing_url":"","channel":"","note":"","comments":"","coupon":"","tracking_number":"000001A","customer_id":null,"status_id":null,"payment_method_id":null,"shipping_method_id":null,"tags":[],"browser":{"ip":"","user_agent":""},"tenant_id":"5cf6520b5407a83e20be98b9","deleted":false,"id":"5cff6ca27ceb7a138e5e712e","status":"","shipping_method":"","payment_method":"","payment_method_gateway":"","weight_total":0,"discount_total":0,"subtotal":300,"tax_included_total":0,"tax_total":0,"shipping_total":0,"grand_total":300}
		 *
		 * @apiUse UnauthorizedError
		 */
		this.router.put(
			'/v1/orders/:id/cancel',
			security.checkRoleScope.bind(this, scopes.WRITE_ORDER),
			this.cancelOrder.bind(this)
		);
		/**
		 * @api {put} /v1/orders/:id/close Close Order
		 * @apiVersion 1.0.0
		 * @apiName closeOrder
		 * @apiGroup Orders
		 * @apiPermission authenticated user
		 *
		 * @apiParam (Request body) {String} id The order id
		 *
		 * @apiExample {js} Example usage:
		 * Request URL: http://localhost:3001/api/v1/orders/5cff6ca27ceb7a138e5e712e/close
		 *
		 * @apiSuccess (Success 200) {String} status Success code
		 *
		 * @apiSuccessExample {json} Success response:
		 *     HTTPS 200 OK
		 *     {"date_created":"2019-06-11T08:56:02.177Z","date_placed":"2019-06-11T09:00:15.000Z","date_updated":"2019-06-11T09:41:27.225Z","date_closed":null,"date_paid":null,"date_cancelled":null,"number":1001,"shipping_status":"","items":[{"id":"5cff75837ceb7a138e5e7130","product_id":"5cf886805407a83e20be98ce","variant_id":null,"quantity":1,"discount_total":0,"name":"NIKE AIR MAX 720 BETRUE","price":300,"price_total":300,"sku":"503880","tax_class":"","tax_total":0,"variant_name":"","weight":0}],"transactions":[],"discounts":[],"billing_address":{"address1":"","address2":"","city":"","country":"","state":"","phone":"","postal_code":"","full_name":"","company":"","tax_number":"","coordinates":{"latitude":"","longitude":""},"details":null},"shipping_address":{"address1":"","address2":"","city":"HCM City","country":"Viet Nam","state":"","phone":"","postal_code":"","full_name":"","company":"","tax_number":"","coordinates":{"latitude":"","longitude":""},"details":null},"item_tax":0,"shipping_tax":0,"shipping_discount":0,"shipping_price":0,"item_tax_included":true,"shipping_tax_included":true,"closed":true,"cancelled":false,"delivered":false,"paid":false,"hold":false,"draft":false,"email":"tuan.le@evizi.com","mobile":"","referrer_url":"admin","landing_url":"","channel":"","note":"","comments":"","coupon":"","tracking_number":"000001A","customer_id":null,"status_id":null,"payment_method_id":null,"shipping_method_id":null,"tags":[],"browser":{"ip":"","user_agent":""},"tenant_id":"5cf6520b5407a83e20be98b9","deleted":false,"id":"5cff6ca27ceb7a138e5e712e","status":"","shipping_method":"","payment_method":"","payment_method_gateway":"","weight_total":0,"discount_total":0,"subtotal":300,"tax_included_total":0,"tax_total":0,"shipping_total":0,"grand_total":300}
		 *
		 * @apiUse UnauthorizedError
		 */
		this.router.put(
			'/v1/orders/:id/close',
			security.checkRoleScope.bind(this, scopes.WRITE_ORDER),
			this.closeOrder.bind(this)
		);
		/**
		 * @api {put} /v1/orders/:id/billing_address Update Billing Address
		 * @apiVersion 1.0.0
		 * @apiName updateBillingAddress
		 * @apiGroup Orders
		 * @apiPermission authenticated user
		 *
		 * @apiParam (Request param) {String} id The order id
		 *
		 * @apiSuccess (Success 200) {String} status Success code
		 *
		 * @apiSuccessExample {json} Success response:
		 *     HTTPS 200 OK
		 *
		 * @apiUse UnauthorizedError
		 */
		this.router.put(
			'/v1/orders/:id/billing_address',
			security.checkRoleScope.bind(this, scopes.WRITE_ORDER),
			this.updateBillingAddress.bind(this)
		);
		/**
		 * @api {put} /v1/orders/:id/shipping_address Update Shipping Address
		 * @apiVersion 1.0.0
		 * @apiName updateShippingAddress
		 * @apiGroup Orders
		 * @apiPermission authenticated user
		 *
		 * @apiParam (Request param) {String} id The order id
		 * @apiParam (Request body) {String} address1 Address 1
		 * @apiParam (Request body) {String} address2 Address 2
		 * @apiParam (Request body) {String} city City
		 * @apiParam (Request body) {String} company Company
		 * @apiParam (Request body) {String} coordinates Map Coordinates {latitude: "", longitude: ""}
		 * @apiParam (Request body) {String} country Country
		 * @apiParam (Request body) {String} details Details
		 * @apiParam (Request body) {String} full_name Full name
		 * @apiParam (Request body) {String} phone Phone
		 * @apiParam (Request body) {String} postal_code Postal code
		 * @apiParam (Request body) {String} state State
		 * @apiParam (Request body) {String} tax_number Tax number
		 *
		 * @apiExample {js} Example Request Payload:
		 * {"address1":"","address2":"","city":"HCM City","country":"Viet Nam","state":"","phone":"","postal_code":"","full_name":"","company":"","tax_number":"","coordinates":{"latitude":"","longitude":""},"details":null}
		 *
		 * @apiSuccess (Success 200) {String} status Success code
		 *
		 * @apiSuccessExample {json} Success response:
		 *     HTTPS 200 OK
		 *     {"date_created":"2019-06-11T08:56:02.177Z","date_placed":"2019-06-11T09:00:15.000Z","date_updated":"2019-06-11T09:04:19.595Z","date_closed":null,"date_paid":null,"date_cancelled":null,"number":1001,"shipping_status":"","items":[],"transactions":[],"discounts":[],"billing_address":{"address1":"","address2":"","city":"","country":"","state":"","phone":"","postal_code":"","full_name":"","company":"","tax_number":"","coordinates":{"latitude":"","longitude":""},"details":null},"shipping_address":{"address1":"","address2":"","city":"HCM City","country":"Viet Nam","state":"","phone":"","postal_code":"","full_name":"","company":"","tax_number":"","coordinates":{"latitude":"","longitude":""},"details":null},"item_tax":0,"shipping_tax":0,"shipping_discount":0,"shipping_price":0,"item_tax_included":true,"shipping_tax_included":true,"closed":false,"cancelled":false,"delivered":false,"paid":false,"hold":false,"draft":false,"email":"tuan.le@evizi.com","mobile":"","referrer_url":"admin","landing_url":"","channel":"","note":"","comments":"","coupon":"","tracking_number":"000001A","customer_id":null,"status_id":null,"payment_method_id":null,"shipping_method_id":null,"tags":[],"browser":{"ip":"","user_agent":""},"tenant_id":"5cf6520b5407a83e20be98b9","deleted":false,"id":"5cff6ca27ceb7a138e5e712e","status":"","shipping_method":"","payment_method":"","payment_method_gateway":"","weight_total":0,"discount_total":0,"subtotal":0,"tax_included_total":0,"tax_total":0,"shipping_total":0,"grand_total":0}
		 *
		 * @apiUse UnauthorizedError
		 */
		this.router.put(
			'/v1/orders/:id/shipping_address',
			security.checkRoleScope.bind(this, scopes.WRITE_ORDER),
			this.updateShippingAddress.bind(this)
		);

		/**
		 * @api {post} /v1/orders/:id/items Add Item
		 * @apiVersion 1.0.0
		 * @apiName addItem
		 * @apiGroup Orders
		 * @apiPermission authenticated user
		 *
		 * @apiParam (Request param) {String} id The order id
		 * @apiParam (Request body) {String} product_id The product id
		 * @apiParam (Request body) {String} variant_id The item variant id
		 * @apiParam (Request body) {String} quantity The item quantity
		 *
		 * @apiExample {js} Example Request Payload:
		 * {"product_id":"5cf886805407a83e20be98ce","variant_id":null,"quantity":1}
		 *
		 * @apiSuccess (Success 200) {String} status Success code
		 *
		 * @apiSuccessExample {json} Success response:
		 *     HTTPS 200 OK
		 *     {"date_created":"2019-06-11T08:56:02.177Z","date_placed":"2019-06-11T09:00:15.000Z","date_updated":"2019-06-11T09:04:19.595Z","date_closed":null,"date_paid":null,"date_cancelled":null,"number":1001,"shipping_status":"","items":[{"id":"5cff75837ceb7a138e5e7130","product_id":"5cf886805407a83e20be98ce","variant_id":null,"quantity":1,"discount_total":0,"name":"NIKE AIR MAX 720 BETRUE","price":300,"price_total":300,"sku":"503880","tax_class":"","tax_total":0,"variant_name":"","weight":0}],"transactions":[],"discounts":[],"billing_address":{"address1":"","address2":"","city":"","country":"","state":"","phone":"","postal_code":"","full_name":"","company":"","tax_number":"","coordinates":{"latitude":"","longitude":""},"details":null},"shipping_address":{"address1":"","address2":"","city":"HCM City","country":"Viet Nam","state":"","phone":"","postal_code":"","full_name":"","company":"","tax_number":"","coordinates":{"latitude":"","longitude":""},"details":null},"item_tax":0,"shipping_tax":0,"shipping_discount":0,"shipping_price":0,"item_tax_included":true,"shipping_tax_included":true,"closed":false,"cancelled":false,"delivered":false,"paid":false,"hold":false,"draft":false,"email":"tuan.le@evizi.com","mobile":"","referrer_url":"admin","landing_url":"","channel":"","note":"","comments":"","coupon":"","tracking_number":"000001A","customer_id":null,"status_id":null,"payment_method_id":null,"shipping_method_id":null,"tags":[],"browser":{"ip":"","user_agent":""},"tenant_id":"5cf6520b5407a83e20be98b9","deleted":false,"id":"5cff6ca27ceb7a138e5e712e","status":"","shipping_method":"","payment_method":"","payment_method_gateway":"","weight_total":0,"discount_total":0,"subtotal":300,"tax_included_total":0,"tax_total":0,"shipping_total":0,"grand_total":300}
		 *
		 * @apiUse UnauthorizedError
		 */
		this.router.post(
			'/v1/orders/:id/items',
			security.checkRoleScope.bind(this, scopes.WRITE_ORDER),
			this.addItem.bind(this)
		);
		/**
		 * @api {put} /v1/orders/:id/items/:item_id Update Item
		 * @apiVersion 1.0.0
		 * @apiName updateItem
		 * @apiGroup Orders
		 * @apiPermission authenticated user
		 *
		 * @apiParam (Request param) {String} id The order id
		 * @apiParam (Request param) {String} item_id The item id
		 * @apiParam (Request body) {String} quantity The item quantity
		 * @apiParam (Request body) {String} variant_id The variant id
		 *
		 * @apiExample {js} Example Request Payload:
		 * {"quantity":1,"variant_id":null}
		 *
		 * @apiSuccess (Success 200) {String} status Success code
		 *
		 * @apiSuccessExample {json} Success response:
		 *     HTTPS 200 OK
		 *     {{"date_created":"2019-06-11T08:56:02.177Z","date_placed":"2019-06-11T09:00:15.000Z","date_updated":"2019-06-11T09:04:19.595Z","date_closed":null,"date_paid":null,"date_cancelled":null,"number":1001,"shipping_status":"","items":[{"id":"5cff71857ceb7a138e5e712f","product_id":"5cf8877c5407a83e20be98d3","variant_id":null,"quantity":1,"discount_total":0,"name":"NIKE AIR MAX 90 BETRUE","price":250,"price_total":250,"sku":"503881","tax_class":"","tax_total":0,"variant_name":"","weight":0}],"transactions":[],"discounts":[],"billing_address":{"address1":"","address2":"","city":"","country":"","state":"","phone":"","postal_code":"","full_name":"","company":"","tax_number":"","coordinates":{"latitude":"","longitude":""},"details":null},"shipping_address":{"address1":"","address2":"","city":"HCM City","country":"Viet Nam","state":"","phone":"","postal_code":"","full_name":"","company":"","tax_number":"","coordinates":{"latitude":"","longitude":""},"details":null},"item_tax":0,"shipping_tax":0,"shipping_discount":0,"shipping_price":0,"item_tax_included":true,"shipping_tax_included":true,"closed":false,"cancelled":false,"delivered":false,"paid":false,"hold":false,"draft":false,"email":"tuan.le@evizi.com","mobile":"","referrer_url":"admin","landing_url":"","channel":"","note":"","comments":"","coupon":"","tracking_number":"000001A","customer_id":null,"status_id":null,"payment_method_id":null,"shipping_method_id":null,"tags":[],"browser":{"ip":"","user_agent":""},"tenant_id":"5cf6520b5407a83e20be98b9","deleted":false,"id":"5cff6ca27ceb7a138e5e712e","status":"","shipping_method":"","payment_method":"","payment_method_gateway":"","weight_total":0,"discount_total":0,"subtotal":250,"tax_included_total":0,"tax_total":0,"shipping_total":0,"grand_total":250}
		 *
		 * @apiUse UnauthorizedError
		 */
		this.router.put(
			'/v1/orders/:id/items/:item_id',
			security.checkRoleScope.bind(this, scopes.WRITE_ORDER),
			this.updateItem.bind(this)
		);
		/**
		 * @api {delete} /v1/orders/:id/items/:item_id Delete Item
		 * @apiVersion 1.0.0
		 * @apiName deleteItem
		 * @apiGroup Orders
		 * @apiPermission authenticated user
		 *
		 * @apiParam (Request param) {String} id The order id
		 * @apiParam (Request param) {String} item_id The item id
		 *
		 * @apiExample {js} Example usage:
		 * Request URL: http://localhost:3001/api/v1/orders/5cff6ca27ceb7a138e5e712e/items/5cff71857ceb7a138e5e712f
		 *
		 * @apiSuccess (Success 200) {String} status Success code
		 *
		 * @apiSuccessExample {json} Success response:
		 *     HTTPS 200 OK
		 *     {"date_created":"2019-06-11T08:56:02.177Z","date_placed":"2019-06-11T09:00:15.000Z","date_updated":"2019-06-11T09:04:19.595Z","date_closed":null,"date_paid":null,"date_cancelled":null,"number":1001,"shipping_status":"","items":[],"transactions":[],"discounts":[],"billing_address":{"address1":"","address2":"","city":"","country":"","state":"","phone":"","postal_code":"","full_name":"","company":"","tax_number":"","coordinates":{"latitude":"","longitude":""},"details":null},"shipping_address":{"address1":"","address2":"","city":"HCM City","country":"Viet Nam","state":"","phone":"","postal_code":"","full_name":"","company":"","tax_number":"","coordinates":{"latitude":"","longitude":""},"details":null},"item_tax":0,"shipping_tax":0,"shipping_discount":0,"shipping_price":0,"item_tax_included":true,"shipping_tax_included":true,"closed":false,"cancelled":false,"delivered":false,"paid":false,"hold":false,"draft":false,"email":"tuan.le@evizi.com","mobile":"","referrer_url":"admin","landing_url":"","channel":"","note":"","comments":"","coupon":"","tracking_number":"000001A","customer_id":null,"status_id":null,"payment_method_id":null,"shipping_method_id":null,"tags":[],"browser":{"ip":"","user_agent":""},"tenant_id":"5cf6520b5407a83e20be98b9","deleted":false,"id":"5cff6ca27ceb7a138e5e712e","status":"","shipping_method":"","payment_method":"","payment_method_gateway":"","weight_total":0,"discount_total":0,"subtotal":0,"tax_included_total":0,"tax_total":0,"shipping_total":0,"grand_total":0}
		 *
		 * @apiUse UnauthorizedError
		 */
		this.router.delete(
			'/v1/orders/:id/items/:item_id',
			security.checkRoleScope.bind(this, scopes.WRITE_ORDER),
			this.deleteItem.bind(this)
		);
		/**
		 * @api {post} /v1/orders/:id/transactions Add Transaction
		 * @apiVersion 1.0.0
		 * @apiName addTransaction
		 * @apiGroup Orders
		 * @apiPermission authenticated user
		 *
		 * @apiParam (Request param) {String} id The order id
		 *
		 * @apiSuccess (Success 200) {String} status Success code
		 *
		 * @apiSuccessExample {json} Success response:
		 *     HTTPS 200 OK
		 *
		 * @apiUse UnauthorizedError
		 */
		this.router.post(
			'/v1/orders/:id/transactions',
			security.checkRoleScope.bind(this, scopes.WRITE_ORDER),
			this.addTransaction.bind(this)
		);
		/**
		 * @api {put} /v1/orders/:id/transactions/:transaction_id Update Transaction
		 * @apiVersion 1.0.0
		 * @apiName updateTransaction
		 * @apiGroup Orders
		 * @apiPermission authenticated user
		 *
		 * @apiParam (Request param) {String} id The order id
		 * @apiParam (Request param) {String} transaction_id The transaction id
		 *
		 * @apiSuccess (Success 200) {String} status Success code
		 *
		 * @apiSuccessExample {json} Success response:
		 *     HTTPS 200 OK
		 *
		 * @apiUse UnauthorizedError
		 */
		this.router.put(
			'/v1/orders/:id/transactions/:transaction_id',
			security.checkRoleScope.bind(this, scopes.WRITE_ORDER),
			this.updateTransaction.bind(this)
		);
		/**
		 * @api {delete} /v1/orders/:id/transactions/:transaction_id Delete Transaction
		 * @apiVersion 1.0.0
		 * @apiName deleteTransaction
		 * @apiGroup Orders
		 * @apiPermission authenticated user
		 *
		 * @apiParam (Request param) {String} id The order id
		 * @apiParam (Request param) {String} transaction_id The transaction id
		 *
		 * @apiSuccess (Success 200) {String} status Success code
		 *
		 * @apiSuccessExample {json} Success response:
		 *     HTTPS 200 OK
		 *
		 * @apiUse UnauthorizedError
		 */
		this.router.delete(
			'/v1/orders/:id/transactions/:transaction_id',
			security.checkRoleScope.bind(this, scopes.WRITE_ORDER),
			this.deleteTransaction.bind(this)
		);

		/**
		 * @api {post} /v1/orders/:id/discounts Add Discount
		 * @apiVersion 1.0.0
		 * @apiName addDiscount
		 * @apiGroup Orders
		 * @apiPermission authenticated user
		 *
		 * @apiParam (Request param) {String} id The order id
		 *
		 * @apiExample {js} Example usage:
		 * Request URL: http://localhost:3001/api/v1/orders/5cff78b77ceb7a138e5e7131/discounts
		 *
		 * @apiSuccess (Success 200) {String} status Success code
		 *
		 * @apiSuccessExample {json} Success response:
		 *     HTTPS 200 OK
		 *
		 * @apiUse UnauthorizedError
		 */
		this.router.post(
			'/v1/orders/:id/discounts',
			security.checkRoleScope.bind(this, scopes.WRITE_ORDER),
			this.addDiscount.bind(this)
		);
		/**
		 * @api {put} /v1/orders/:id/discounts/:discount_id Update Discount
		 * @apiVersion 1.0.0
		 * @apiName updateDiscount
		 * @apiGroup Orders
		 * @apiPermission authenticated user
		 *
		 * @apiParam (Request param) {String} id The order id
		 * @apiParam (Request param) {String} discount_id The discount id
		 *
		 * @apiExample {js} Example usage:
		 * Request URL: http://localhost:3001/api/v1/orders/5cff78b77ceb7a138e5e7131/discounts/5cff78b77ceb7a138e5e7132
		 *
		 * @apiSuccess (Success 200) {String} status Success code
		 *
		 * @apiSuccessExample {json} Success response:
		 *     HTTPS 200 OK
		 *
		 * @apiUse UnauthorizedError
		 */
		this.router.put(
			'/v1/orders/:id/discounts/:discount_id',
			security.checkRoleScope.bind(this, scopes.WRITE_ORDER),
			this.updateDiscount.bind(this)
		);
		/**
		 * @api {delete} /v1/orders/:id/discounts/:discount_id Delete Discount
		 * @apiVersion 1.0.0
		 * @apiName deleteDiscount
		 * @apiGroup Orders
		 * @apiPermission authenticated user
		 *
		 * @apiParam (Request param) {String} id The order id
		 * @apiParam (Request param) {String} discount_id The discount id
		 *
		 * @apiExample {js} Example usage:
		 * Request URL: http://localhost:3001/api/v1/orders/5cff78b77ceb7a138e5e7131/discounts/5cff78b77ceb7a138e5e7132
		 *
		 * @apiSuccess (Success 200) {String} status Success code
		 *
		 * @apiSuccessExample {json} Success response:
		 *     HTTPS 200 OK
		 *
		 * @apiUse UnauthorizedError
		 */
		this.router.delete(
			'/v1/orders/:id/discounts/:discount_id',
			security.checkRoleScope.bind(this, scopes.WRITE_ORDER),
			this.deleteDiscount.bind(this)
		);

		/**
		 * @api {get} /v1/orders/:id/payment_form_settings Get Payment Form Settings
		 * @apiVersion 1.0.0
		 * @apiName getPaymentFormSettings
		 * @apiGroup Orders
		 * @apiPermission authenticated user
		 *
		 * @apiParam (Request param) {String} id The order id
		 *
		 * @apiExample {js} Example usage:
		 * Request URL: http://localhost:3001/api/v1/orders/5cff78b77ceb7a138e5e7131/payment_form_settings
		 *
		 * @apiSuccess (Success 200) {String} status Success code
		 *
		 * @apiSuccessExample {json} Success response:
		 *     HTTPS 200 OK
		 *
		 * @apiUse UnauthorizedError
		 */
		this.router.get(
			'/v1/orders/:id/payment_form_settings',
			security.checkRoleScope.bind(this, scopes.WRITE_ORDER),
			this.getPaymentFormSettings.bind(this)
		);

		/**
		 * @api {post} /v1/orders/:id/charge Charge Order
		 * @apiVersion 1.0.0
		 * @apiName chargeOrder
		 * @apiGroup Orders
		 * @apiPermission authenticated user
		 *
		 * @apiParam (Request param) {String} id The order id
		 *
		 * @apiExample {js} Example usage:
		 * Request URL: http://localhost:3001/api/v1/orders/5cff78b77ceb7a138e5e7131/charge
		 *
		 * @apiSuccess (Success 200) {String} status Success code
		 *
		 * @apiSuccessExample {json} Success response:
		 *     HTTPS 200 OK
		 *
		 * @apiUse UnauthorizedError
		 */
		this.router.post(
			'/v1/orders/:id/charge',
			security.checkRoleScope.bind(this, scopes.WRITE_ORDER),
			this.chargeOrder.bind(this)
		);
	}

	getOrders(req, res, next) {
		OrdersService.getOrders(req.get('x-tenant-id'), req.query)
			.then(data => {
				res.send(data);
			})
			.catch(next);
	}

	getSingleOrder(req, res, next) {
		OrdersService.getSingleOrder(req.get('x-tenant-id'), req.params.id)
			.then(data => {
				if (data) {
					res.send(data);
				} else {
					res.status(404).end();
				}
			})
			.catch(next);
	}

	addOrder(req, res, next) {
		OrdersService.addOrder(req.get('x-tenant-id'), req.body)
			.then(data => {
				res.send(data);
			})
			.catch(next);
	}

	updateOrder(req, res, next) {
		OrdersService.updateOrder(req.get('x-tenant-id'), req.params.id, req.body)
			.then(data => {
				if (data) {
					res.send(data);
				} else {
					res.status(404).end();
				}
			})
			.catch(next);
	}

	deleteOrder(req, res, next) {
		OrdersService.deleteOrder(req.get('x-tenant-id'), req.params.id)
			.then(data => {
				res.status(data ? 200 : 404).end();
			})
			.catch(next);
	}

	recalculateOrder(req, res, next) {
		OrderItemsService.calculateAndUpdateAllItems(
			req.get('x-tenant-id'),
			req.params.id
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

	checkoutOrder(req, res, next) {
		OrdersService.checkoutOrder(req.get('x-tenant-id'), req.params.id)
			.then(data => {
				res.send(data);
			})
			.catch(next);
	}

	cancelOrder(req, res, next) {
		OrdersService.cancelOrder(req.get('x-tenant-id'), req.params.id)
			.then(data => {
				res.send(data);
			})
			.catch(next);
	}

	closeOrder(req, res, next) {
		OrdersService.closeOrder(req.get('x-tenant-id'), req.params.id)
			.then(data => {
				res.send(data);
			})
			.catch(next);
	}

	updateBillingAddress(req, res, next) {
		OrderAddressService.updateBillingAddress(
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

	updateShippingAddress(req, res, next) {
		OrderAddressService.updateShippingAddress(
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

	addItem(req, res, next) {
		const order_id = req.params.id;
		OrderItemsService.addItem(req.get('x-tenant-id'), order_id, req.body)
			.then(data => {
				res.send(data);
			})
			.catch(next);
	}

	updateItem(req, res, next) {
		const order_id = req.params.id;
		const item_id = req.params.item_id;
		OrderItemsService.updateItem(
			req.get('x-tenant-id'),
			order_id,
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
		const order_id = req.params.id;
		const item_id = req.params.item_id;
		OrderItemsService.deleteItem(req.get('x-tenant-id'), order_id, item_id)
			.then(data => {
				res.send(data);
			})
			.catch(next);
	}

	addTransaction(req, res, next) {
		const order_id = req.params.id;
		OrdertTansactionsService.addTransaction(
			req.get('x-tenant-id'),
			order_id,
			req.body
		)
			.then(data => {
				res.send(data);
			})
			.catch(next);
	}

	updateTransaction(req, res, next) {
		const order_id = req.params.id;
		const transaction_id = req.params.item_id;
		OrdertTansactionsService.updateTransaction(
			req.get('x-tenant-id'),
			order_id,
			transaction_id,
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

	deleteTransaction(req, res, next) {
		const order_id = req.params.id;
		const transaction_id = req.params.item_id;
		OrdertTansactionsService.deleteTransaction(
			req.get('x-tenant-id'),
			order_id,
			transaction_id
		)
			.then(data => {
				res.send(data);
			})
			.catch(next);
	}

	addDiscount(req, res, next) {
		const order_id = req.params.id;
		OrdertDiscountsService.addDiscount(order_id, req.body)
			.then(data => {
				res.send(data);
			})
			.catch(next);
	}

	updateDiscount(req, res, next) {
		const order_id = req.params.id;
		const discount_id = req.params.item_id;
		OrdertDiscountsService.updateDiscount(
			req.get('x-tenant-id'),
			order_id,
			discount_id,
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
		const order_id = req.params.id;
		const discount_id = req.params.item_id;
		OrdertDiscountsService.deleteDiscount(
			req.get('x-tenant-id'),
			order_id,
			discount_id
		)
			.then(data => {
				res.send(data);
			})
			.catch(next);
	}

	getPaymentFormSettings(req, res, next) {
		const orderId = req.params.id;
		PaymentGateways.getPaymentFormSettings(req.get('x-tenant-id'), orderId)
			.then(data => {
				res.send(data);
			})
			.catch(next);
	}

	async chargeOrder(req, res, next) {
		const orderId = req.params.id;
		try {
			const isSuccess = await OrdersService.chargeOrder(
				req.get('x-tenant-id'),
				orderId
			);
			res.status(isSuccess ? 200 : 500).end();
		} catch (err) {
			next(err);
		}
	}
}

export default OrdersRoute;
