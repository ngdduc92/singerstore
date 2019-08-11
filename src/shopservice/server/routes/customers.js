import security from '../lib/security';
import CustomersService from '../services/customers/customers';
import scopes from '../lib/scopes';

class CustomersRoute {
	constructor(router) {
		this.router = router;
		this.registerRoutes();
	}

	registerRoutes() {
		/**
		 * @api {get} /v1/customers Get customers
		 * @apiVersion 1.0.0
		 * @apiName getCustomers
		 * @apiGroup Customers
		 * @apiPermission authenticated user
		 *
		 * @apiParam (Request param) {String} group_id The customer's group_id
		 * @apiParam (Request param) {String} limit limit
		 * @apiParam (Request param) {String} offset offset
		 *
		 * @apiExample {js} Example usage:
		 * Request URL: http://localhost:3001/api/v1/customers?group_id=all&limit=50&offset=0
		 *
		 * @apiSuccess (Success 200) {String} status Success code
		 *
		 * @apiSuccessExample {json} Success response:
		 *     HTTPS 200 OK
		 * 	   {"total_count":1,"has_more":false,"data":[{"date_created":"2019-06-13T08:40:39.369Z","date_updated":null,"total_spent":0,"orders_count":0,"note":"Note","email":"addcustomer1@gmail.com","mobile":"090000000","full_name":"Customer 001","gender":"male","group_id":null,"tags":[],"social_accounts":[],"birthdate":null,"addresses":[{"id":"5d02134874ad7e0c97b2011d","address1":"","address2":"","city":"","country":"","state":"","phone":"","postal_code":"","full_name":"","company":"","tax_number":"","coordinates":{"latitude":"","longitude":""},"details":null,"default_billing":false,"default_shipping":false},{"id":"5d02136b74ad7e0c97b2011e","address1":"123 DN","address2":"","city":"AA City","country":"US","state":"","phone":"0090909090","postal_code":"12345","full_name":"customer name 2","company":"evizi","tax_number":"","coordinates":{"latitude":"","longitude":""},"details":null,"default_billing":false,"default_shipping":false},{"id":"5d0214e474ad7e0c97b2011f","address1":"123 DN","address2":"","city":"AA City","country":"US","state":"","phone":"0090909090","postal_code":"12345","full_name":"customer name 2","company":"evizi","tax_number":"","coordinates":{"latitude":"","longitude":""},"details":null,"default_billing":false,"default_shipping":false}],"browser":{"ip":"","user_agent":""},"tenant_id":"5d01c28374ad7e0c97b200e2","deleted":false,"id":"5d020c0774ad7e0c97b2011b","group_name":"","billing":{"id":"5d02134874ad7e0c97b2011d","address1":"","address2":"","city":"","country":"","state":"","phone":"","postal_code":"","full_name":"","company":"","tax_number":"","coordinates":{"latitude":"","longitude":""},"details":null,"default_billing":false,"default_shipping":false},"shipping":{"id":"5d02134874ad7e0c97b2011d","address1":"","address2":"","city":"","country":"","state":"","phone":"","postal_code":"","full_name":"","company":"","tax_number":"","coordinates":{"latitude":"","longitude":""},"details":null,"default_billing":false,"default_shipping":false}}]}
		 *
		 * @apiUse UnauthorizedError
		 */
		this.router.get(
			'/v1/customers',
			security.checkRoleScope.bind(this, scopes.LIST_CUSTOMER),
			this.getCustomers.bind(this)
		);
		/**
		 * @api {post} /v1/customers Add a customer
		 * @apiVersion 1.0.0
		 * @apiName addCustomer
		 * @apiGroup Customers
		 * @apiPermission authenticated user
		 *
		 * @apiParam (Request body) {String} group_id The customer's group_id
		 * @apiParam (Request body) {String} note Note
		 * @apiParam (Request body) {String} email The customer's email
		 * @apiParam (Request body) {String} mobile The customer's mobile
		 * @apiParam (Request body) {String} full_name The customer's full name
		 * @apiParam (Request body) {String} gender The customer's gender
		 * @apiParam (Request body) {String} social_accounts The customer's social accounts
		 * @apiParam (Request body) {String} birthdate The customer's birthdate
		 * @apiParam (Request body) {String} addresses The customer's addresses
		 * @apiParam (Request body) {String} tenant_id The tenantid
		 * @apiParam (Request body) {String} billing The customer's billing address
		 * @apiParam (Request body) {String} shipping The customer's shipping address
		 *
		 * @apiExample {js} Example Request Payload:
		 * {"note": "Note","email": "addcustomer1@gmail.com","mobile": "090000000","full_name": "Customer 001","gender": "Male","social_accounts": [],"birthdate": null,"addresses": [],"tenant_id": "5d01c28374ad7e0c97b200e2","billing": {},"shipping": {}}
		 *
		 * @apiSuccess (Success 200) {String} status Success code
		 *
		 * @apiSuccessExample {json} Success response:
		 *     HTTPS 200 OK
		 *     {"date_created":"2019-06-13T08:40:39.369Z","date_updated":null,"total_spent":0,"orders_count":0,"note":"Note","email":"addcustomer1@gmail.com","mobile":"090000000","full_name":"Customer 001","gender":"male","group_id":null,"tags":[],"social_accounts":[],"birthdate":null,"addresses":[],"browser":{"ip":"","user_agent":""},"tenant_id":"5d01c28374ad7e0c97b200e2","deleted":false,"id":"5d020c0774ad7e0c97b2011b","group_name":"","billing":{},"shipping":{}}
		 *
		 * @apiUse UnauthorizedError
		 */
		this.router.post(
			'/v1/customers',
			security.checkRoleScope.bind(this, scopes.WRITE_CUSTOMER),
			this.addCustomer.bind(this)
		);
		/**
		 * @api {get} /v1/customers/:id Get a customer
		 * @apiVersion 1.0.0
		 * @apiName getSingleCustomer
		 * @apiGroup Customers
		 * @apiPermission authenticated user
		 *
		 * @apiParam (Request param) {String} id The customer's id
		 *
		 * @apiExample {js} Example usage:
		 * Request URL: http://localhost:3001/api/v1/customers/5d02062674ad7e0c97b20113?
		 *
		 * @apiSuccess (Success 200) {String} status Success code
		 *
		 * @apiSuccessExample {json} Success response:
		 *     HTTPS 200 OK
		 *	   {"date_created":"2019-06-13T08:15:34.180Z","date_updated":"2019-06-13T08:21:59.845Z","total_spent":0,"orders_count":0,"note":"","email":"tuan.le1@evizi.com","mobile":"0909000000","full_name":"tuan le1","gender":"","group_id":"5d01c33774ad7e0c97b200ec","tags":[],"social_accounts":[],"birthdate":null,"addresses":[{"id":"5d02062674ad7e0c97b20112","address1":"123 DN","address2":"","city":"","country":"US","state":"","phone":"","postal_code":"","full_name":"tuan le","company":"","tax_number":"","coordinates":{"latitude":"","longitude":""},"details":null,"default_billing":false,"default_shipping":false}],"browser":{"ip":"","user_agent":""},"tenant_id":"5d01c28374ad7e0c97b200e2","deleted":false,"id":"5d02062674ad7e0c97b20113","group_name":"VIP","shipping":{"id":"5d02062674ad7e0c97b20112","address1":"123 DN","address2":"","city":"","country":"US","state":"","phone":"","postal_code":"","full_name":"tuan le","company":"","tax_number":"","coordinates":{"latitude":"","longitude":""},"details":null,"default_billing":false,"default_shipping":false},"billing":{"id":"5d02062674ad7e0c97b20112","address1":"123 DN","address2":"","city":"","country":"US","state":"","phone":"","postal_code":"","full_name":"tuan le","company":"","tax_number":"","coordinates":{"latitude":"","longitude":""},"details":null,"default_billing":false,"default_shipping":false}}
		 *
		 * @apiUse UnauthorizedError
		 */
		this.router.get(
			'/v1/customers/:id',
			security.checkRoleScope.bind(this, scopes.READ_CUSTOMER),
			this.getSingleCustomer.bind(this)
		);
		/**
		 * @api {put} /v1/customers/:id Update customer
		 * @apiVersion 1.0.0
		 * @apiName updateCustomer
		 * @apiGroup Customers
		 * @apiPermission authenticated user
		 *
		 * @apiParam (Request param) {String} id The customer's id
		 * @apiParam (Request body) {String} id The customer's id
		 * @apiParam (Request body) {String} note Note
		 * @apiParam (Request body) {String} full_name The customer's full name
		 * @apiParam (Request body) {String} group_id The customer's group_id
		 * @apiParam (Request body) {String} email The customer's email
		 * @apiParam (Request body) {String} mobile The customer's mobile
		 *
		 * @apiExample {js} Example Request Payload:
		 * {"id":"5d02062674ad7e0c97b20113","note":"","full_name":"tuan le1","group_id":"5d01c33774ad7e0c97b200ec","email":"tuan.le1@evizi.com","mobile":"0909000000"}
		 *
		 * @apiSuccess (Success 200) {String} status Success code
		 *
		 * @apiSuccessExample {json} Success response:
		 *     HTTPS 200 OK
		 *	   {"date_created":"2019-06-13T08:15:34.180Z","date_updated":"2019-06-13T08:21:59.845Z","total_spent":0,"orders_count":0,"note":"","email":"tuan.le1@evizi.com","mobile":"0909000000","full_name":"tuan le1","gender":"","group_id":"5d01c33774ad7e0c97b200ec","tags":[],"social_accounts":[],"birthdate":null,"addresses":[{"id":"5d02062674ad7e0c97b20112","address1":"123 DN","address2":"","city":"","country":"US","state":"","phone":"","postal_code":"","full_name":"tuan le","company":"","tax_number":"","coordinates":{"latitude":"","longitude":""},"details":null,"default_billing":false,"default_shipping":false}],"browser":{"ip":"","user_agent":""},"tenant_id":"5d01c28374ad7e0c97b200e2","deleted":false,"id":"5d02062674ad7e0c97b20113","group_name":"VIP","shipping":{"id":"5d02062674ad7e0c97b20112","address1":"123 DN","address2":"","city":"","country":"US","state":"","phone":"","postal_code":"","full_name":"tuan le","company":"","tax_number":"","coordinates":{"latitude":"","longitude":""},"details":null,"default_billing":false,"default_shipping":false},"billing":{"id":"5d02062674ad7e0c97b20112","address1":"123 DN","address2":"","city":"","country":"US","state":"","phone":"","postal_code":"","full_name":"tuan le","company":"","tax_number":"","coordinates":{"latitude":"","longitude":""},"details":null,"default_billing":false,"default_shipping":false}}
		 *
		 * @apiUse UnauthorizedError
		 */
		this.router.put(
			'/v1/customers/:id',
			security.checkRoleScope.bind(this, scopes.WRITE_CUSTOMER),
			this.updateCustomer.bind(this)
		);
		/**
		 * @api {delete} /v1/customers/:id Delete customer
		 * @apiVersion 1.0.0
		 * @apiName deleteCustomer
		 * @apiGroup Customers
		 * @apiPermission authenticated user
		 *
		 * @apiParam (Request param) {String} id The customer's id
		 *
		 * @apiExample {js} Example usage:
		 * Request URL: http://localhost:3001/api/v1/customers/5cff62127ceb7a138e5e712c
		 *
		 * @apiSuccess (Success 200) {String} status Success code
		 *
		 * @apiSuccessExample {json} Success response:
		 *     HTTPS 200 OK
		 *
		 * @apiUse UnauthorizedError
		 */
		this.router.delete(
			'/v1/customers/:id',
			security.checkRoleScope.bind(this, scopes.DELETE_CUSTOMER),
			this.deleteCustomer.bind(this)
		);
		/**
		 * @api {post} /v1/customers/:id/addresses Add Address
		 * @apiVersion 1.0.0
		 * @apiName addAddress
		 * @apiGroup Customers
		 * @apiPermission authenticated user
		 *
		 * @apiParam (Request param) {String} id The customer's id
		 * @apiParam (Request body) {String} address1 The customer's address1
		 * @apiParam (Request body) {String} address2 The customer's address2
		 * @apiParam (Request body) {String} city The customer's City
		 * @apiParam (Request body) {String} company The customer's Company
		 * @apiParam (Request body) {String} coordinates The customer's address coordinates
		 * @apiParam (Request body) {String} country The customer's country
		 * @apiParam (Request body) {String} default_billing Is default_billing?
		 * @apiParam (Request body) {String} default_shipping Is default_shipping?
		 * @apiParam (Request body) {String} details The customer's details
		 * @apiParam (Request body) {String} full_name The customer's full name
		 * @apiParam (Request body) {String} id The customer's id
		 * @apiParam (Request body) {String} phone The customer's phone
		 * @apiParam (Request body) {String} postal_code Postal code
		 * @apiParam (Request body) {String} state State
		 * @apiParam (Request body) {String} tax_number Tax number
		 *
		 * @apiExample {js} Example Request Payload:
		 * {"address1":"123 DN","address2":"","city":"AA City","country":"US","state":"","phone":"0090909090","postal_code":"12345","full_name":"customer name 2","company":"evizi","tax_number":"","coordinates":{"latitude":"","longitude":""},"details":null,"default_billing":false,"default_shipping":false}
		 *
		 * @apiSuccess (Success 200) {String} status Success code
		 *
		 * @apiSuccessExample {json} Success response:
		 *     HTTPS 200 OK
		 *
		 * @apiUse UnauthorizedError
		 */
		this.router.post(
			'/v1/customers/:id/addresses',
			security.checkRoleScope.bind(this, scopes.WRITE_CUSTOMER),
			this.addAddress.bind(this)
		);
		/**
		 * @api {put} /v1/customers/:id/addresses/:address_id Update Address
		 * @apiVersion 1.0.0
		 * @apiName updateAddress
		 * @apiGroup Customers
		 * @apiPermission authenticated user
		 *
		 * @apiParam (Request param) {String} id The customer's id
		 * @apiParam (Request param) {String} address_id The customer's address_id
		 * @apiParam (Request body) {String} address1 The customer's address1
		 * @apiParam (Request body) {String} address2 The customer's address2
		 * @apiParam (Request body) {String} city The customer's City
		 * @apiParam (Request body) {String} company The customer's Company
		 * @apiParam (Request body) {String} coordinates The customer's address coordinates
		 * @apiParam (Request body) {String} country The customer's country
		 * @apiParam (Request body) {String} default_billing Is default_billing?
		 * @apiParam (Request body) {String} default_shipping Is default_shipping?
		 * @apiParam (Request body) {String} details The customer's details
		 * @apiParam (Request body) {String} full_name The customer's full name
		 * @apiParam (Request body) {String} id The customer's id
		 * @apiParam (Request body) {String} phone The customer's phone
		 * @apiParam (Request body) {String} postal_code Postal code
		 * @apiParam (Request body) {String} state State
		 * @apiParam (Request body) {String} tax_number Tax number
		 *
		 * @apiExample {js} Example Request Payload:
		 * {"id":"5d02093474ad7e0c97b20117","address1":"123 DN","address2":"08 Suite","city":"LA city","country":"US","state":"","phone":"0090909090","postal_code":"12345","full_name":"tuan le2","company":"","tax_number":"","coordinates":{"latitude":"","longitude":""},"details":null,"default_billing":false,"default_shipping":false}
		 *
		 * @apiSuccess (Success 200) {String} status Success code
		 *
		 * @apiSuccessExample {json} Success response:
		 *     HTTPS 200 OK
		 *
		 * @apiUse UnauthorizedError
		 */
		this.router.put(
			'/v1/customers/:id/addresses/:address_id',
			security.checkRoleScope.bind(this, scopes.WRITE_CUSTOMER),
			this.updateAddress.bind(this)
		);
		/**
		 * @api {delete} /v1/customers/:id/addresses/:address_id Delete Address
		 * @apiVersion 1.0.0
		 * @apiName deleteAddress
		 * @apiGroup Customers
		 * @apiPermission authenticated user
		 *
		 * @apiParam (Request param) {String} id The customer's id
		 * @apiParam (Request param) {String} address_id The customer's address_id
		 *
		 * @apiExample {js} Example usage:
		 * Request URL: http://localhost:3001/api/v1/customers/5cff62127ceb7a138e5e712c/addresses/5cff62127ceb7a138e5e7132
		 *
		 * @apiSuccess (Success 200) {String} status Success code
		 *
		 * @apiSuccessExample {json} Success response:
		 *     HTTPS 200 OK
		 *
		 * @apiUse UnauthorizedError
		 */
		this.router.delete(
			'/v1/customers/:id/addresses/:address_id',
			security.checkRoleScope.bind(this, scopes.WRITE_CUSTOMER),
			this.deleteAddress.bind(this)
		);
		/**
		 * @api {post} /v1/customers/:id/addresses/:address_id/default_billing Set Default Billing
		 * @apiVersion 1.0.0
		 * @apiName setDefaultBilling
		 * @apiGroup Customers
		 * @apiPermission authenticated user
		 *
		 * @apiParam (Request param) {String} id The customers id
		 * @apiParam (Request param) {String} address_id The customers address_id
		 *
		 * @apiExample {js} Example usage:
		 * Request URL: http://localhost:3001/api/v1/customers/5cff62127ceb7a138e5e712c/addresses/5cff62127ceb7a138e5e7132/default_billing
		 *
		 * @apiSuccess (Success 200) {String} status Success code
		 *
		 * @apiSuccessExample {json} Success response:
		 *     HTTPS 200 OK
		 *
		 * @apiUse UnauthorizedError
		 */
		this.router.post(
			'/v1/customers/:id/addresses/:address_id/default_billing',
			security.checkRoleScope.bind(this, scopes.WRITE_CUSTOMER),
			this.setDefaultBilling.bind(this)
		);
		/**
		 * @api {post} /v1/customers/:id/addresses/:address_id/default_shipping Set Default Shipping
		 * @apiVersion 1.0.0
		 * @apiName setDefaultShipping
		 * @apiGroup Customers
		 * @apiPermission authenticated user
		 *
		 * @apiParam (Request param) {String} id The customers id
		 * @apiParam (Request param) {String} address_id The customers address_id
		 *
		 * @apiExample {js} Example usage:
		 * Request URL: http://localhost:3001/api/v1/customers/5cff62127ceb7a138e5e712c/addresses/5cff62127ceb7a138e5e7132/default_shipping
		 *
		 * @apiSuccess (Success 200) {String} status Success code
		 *
		 * @apiSuccessExample {json} Success response:
		 *     HTTPS 200 OK
		 *
		 * @apiUse UnauthorizedError
		 */
		this.router.post(
			'/v1/customers/:id/addresses/:address_id/default_shipping',
			security.checkRoleScope.bind(this, scopes.WRITE_CUSTOMER),
			this.setDefaultShipping.bind(this)
		);
	}

	getCustomers(req, res, next) {
		CustomersService.getCustomers(req.get('x-tenant-id'), req.query)
			.then(data => {
				res.send(data);
			})
			.catch(next);
	}

	getSingleCustomer(req, res, next) {
		CustomersService.getSingleCustomer(req.get('x-tenant-id'), req.params.id)
			.then(data => {
				if (data) {
					res.send(data);
				} else {
					res.status(404).end();
				}
			})
			.catch(next);
	}

	addCustomer(req, res, next) {
		CustomersService.addCustomer(req.get('x-tenant-id'), req.body)
			.then(data => {
				res.send(data);
			})
			.catch(next);
	}

	updateCustomer(req, res, next) {
		CustomersService.updateCustomer(
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

	deleteCustomer(req, res, next) {
		CustomersService.deleteCustomer(req.get('x-tenant-id'), req.params.id)
			.then(data => {
				res.status(data ? 200 : 404).end();
			})
			.catch(next);
	}

	addAddress(req, res, next) {
		const customer_id = req.params.id;
		CustomersService.addAddress(customer_id, req.body)
			.then(data => {
				res.end();
			})
			.catch(next);
	}

	updateAddress(req, res, next) {
		const customer_id = req.params.id;
		const address_id = req.params.address_id;
		CustomersService.updateAddress(customer_id, address_id, req.body)
			.then(data => {
				res.end();
			})
			.catch(next);
	}

	deleteAddress(req, res, next) {
		const customer_id = req.params.id;
		const address_id = req.params.address_id;
		CustomersService.deleteAddress(customer_id, address_id)
			.then(data => {
				res.end();
			})
			.catch(next);
	}

	setDefaultBilling(req, res, next) {
		const customer_id = req.params.id;
		const address_id = req.params.address_id;
		CustomersService.setDefaultBilling(customer_id, address_id)
			.then(data => {
				res.end();
			})
			.catch(next);
	}

	setDefaultShipping(req, res, next) {
		const customer_id = req.params.id;
		const address_id = req.params.address_id;
		CustomersService.setDefaultShipping(customer_id, address_id)
			.then(data => {
				res.end();
			})
			.catch(next);
	}
}

export default CustomersRoute;
