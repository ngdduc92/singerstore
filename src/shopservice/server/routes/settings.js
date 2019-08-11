import security from '../lib/security';
import SettingsService from '../services/settings/settings';
import EmailSettingsService from '../services/settings/email';
import EmailTemplatesService from '../services/settings/emailTemplates';
import scopes from '../lib/scopes';

class SettingsRoute {
	constructor(router) {
		this.router = router;
		this.registerRoutes();
	}

	registerRoutes() {
		/**
		 * @api {get} /v1/settings Get Settings
		 * @apiVersion 1.0.0
		 * @apiName getSettings
		 * @apiGroup Settings
		 * @apiPermission authenticated user
		 *
		 * @apiSuccess (Success 200) {String} status Success code
		 * @apiSuccess (Success 304) {String} status Success code
		 *
		 * @apiSuccessExample {json} Success response:
		 *     HTTPS 304 Not Modified
		 *     {"domain":"","logo_file":"download.png","language":"en","currency_code":"USD","currency_symbol":"$","currency_format":"${amount}","thousand_separator":",","decimal_separator":".","decimal_number":2,"timezone":"Asia/Singapore","date_format":"MMMM D, YYYY","time_format":"h:mm a","default_shipping_country":"","default_shipping_state":"","default_shipping_city":"","default_product_sorting":"stock_status,price,position","product_fields":"path,id,name,category_id,category_name,sku,images,enabled,discontinued,stock_status,stock_quantity,price,on_sale,regular_price,attributes,tags,position","products_limit":30,"weight_unit":"kg","length_unit":"cm","hide_billing_address":false,"order_confirmation_copy_to":"","logo":"/logos/5cf6520b5407a83e20be98b9/download.png","tenant_id":"5cf6520b5407a83e20be98b9"}
		 *
		 * @apiUse UnauthorizedError
		 */
		this.router.get(
			'/v1/settings',
			security.checkRoleScope.bind(this, scopes.READ_GENERAL_SETTINGS),
			this.getSettings.bind(this)
		);
		/**
		 * @api {put} /v1/settings Update Settings
		 * @apiVersion 1.0.0
		 * @apiName updateSettings
		 * @apiGroup Settings
		 * @apiPermission authenticated user
		 *
		 * @apiParam (Request body) {String}	currency_code Currency code
		 * @apiParam (Request body) {String}	currency_format Currency format
		 * @apiParam (Request body) {String} currency_symbol Currency symbol
		 * @apiParam (Request body) {String} date_format Date format
		 * @apiParam (Request body) {String} decimal_number Decimal number
		 * @apiParam (Request body) {String} decimal_separator Decimal separator ".", ","
		 * @apiParam (Request body) {String} default_product_sorting Product sorting "stock_status,price,position"
		 * @apiParam (Request body) {String} default_shipping_city Default shipping city
		 * @apiParam (Request body) {String} default_shipping_country Default shipping country
		 * @apiParam (Request body) {String} default_shipping_state Default shipping state
		 * @apiParam (Request body) {String} domain domain
		 * @apiParam (Request body) {String} hide_billing_address hide billing address?
		 * @apiParam (Request body) {String} language The language
		 * @apiParam (Request body) {String} length_unit Length Unit
		 * @apiParam (Request body) {String} logo The logo img
		 * @apiParam (Request body) {String} order_confirmation_copy_to order_confirmation_copy_to
		 * @apiParam (Request body) {String} product_fields Product fields
		 * @apiParam (Request body) {String} products_limit Products limit
		 * @apiParam (Request body) {String} tenant_id The tenant id
		 * @apiParam (Request body) {String} thousand_separator Thousand separator: ","
		 * @apiParam (Request body) {String} time_format Time format
		 * @apiParam (Request body) {String} timezone The timezone
		 * @apiParam (Request body) {String} weight_unit Weight unit
		 *
		 * @apiExample {js} Example request payload:
		 * {"domain":"","language":"en","currency_code":"USD","currency_symbol":"$","currency_format":"${amount}","thousand_separator":",","decimal_separator":".","decimal_number":2,"timezone":"Asia/Singapore","date_format":"MMMM D, YYYY","time_format":"h:mm a","default_shipping_country":"","default_shipping_state":"","default_shipping_city":"HCM city","default_product_sorting":"stock_status,price,position","product_fields":"path,id,name,category_id,category_name,sku,images,enabled,discontinued,stock_status,stock_quantity,price,on_sale,regular_price,attributes,tags,position","products_limit":30,"weight_unit":"kg","length_unit":"cm","hide_billing_address":false,"order_confirmation_copy_to":"","logo":"/logos/5cf6520b5407a83e20be98b9/download.png","tenant_id":"5cf6520b5407a83e20be98b9"}
		 *
		 * @apiSuccess (Success 200) {String} status Success code
		 *
		 * @apiSuccessExample {json} Success response:
		 *     HTTPS 200 OK
		 *     {"domain":"","logo_file":"download.png","language":"en","currency_code":"USD","currency_symbol":"$","currency_format":"${amount}","thousand_separator":",","decimal_separator":".","decimal_number":2,"timezone":"Asia/Singapore","date_format":"MMMM D, YYYY","time_format":"h:mm a","default_shipping_country":"","default_shipping_state":"","default_shipping_city":"HCM city","default_product_sorting":"stock_status,price,position","product_fields":"path,id,name,category_id,category_name,sku,images,enabled,discontinued,stock_status,stock_quantity,price,on_sale,regular_price,attributes,tags,position","products_limit":30,"weight_unit":"kg","length_unit":"cm","hide_billing_address":false,"order_confirmation_copy_to":"","logo":"/logos/5cf6520b5407a83e20be98b9/download.png","tenant_id":"5cf6520b5407a83e20be98b9"}
		 *
		 * @apiUse UnauthorizedError
		 */
		this.router.put(
			'/v1/settings',
			security.checkRoleScope.bind(this, scopes.WRITE_GENERAL_SETTINGS),
			this.updateSettings.bind(this)
		);
		/**
		 * @api {get} /v1/settings/email Get Email Settings
		 * @apiVersion 1.0.0
		 * @apiName getEmailSettings
		 * @apiGroup Settings
		 * @apiPermission authenticated user
		 *
		 *
		 * @apiSuccess (Success 200) {String} status Success code
		 * @apiSuccess (Success 304) {String} status Success code
		 *
		 * @apiSuccessExample {json} Success response:
		 *     HTTPS 304 Not Modified
		 * 	  {"host":"smtp.gmail.com","port":465,"user":"mailuser@gmail.com","pass":"pass","from_name":"name","from_address":"dinhduc.nguyen92@gmail.com"}
		 *
		 * @apiUse UnauthorizedError
		 */
		this.router.get(
			'/v1/settings/email',
			security.checkRoleScope.bind(this, scopes.READ_SMTP),
			this.getEmailSettings.bind(this)
		);
		/**
		 * @api {put} /v1/settings/email Update Email Settings
		 * @apiVersion 1.0.0
		 * @apiName updateEmailSettings
		 * @apiGroup Settings
		 * @apiPermission authenticated user
		 *
		 * @apiSuccess (Success 200) {String} status Success code
		 *
		 * @apiSuccessExample {json} Success response:
		 *     HTTPS 200 OK
		 *
		 * @apiUse UnauthorizedError
		 */
		this.router.put(
			'/v1/settings/email',
			security.checkRoleScope.bind(this, scopes.WRITE_SMTP),
			this.updateEmailSettings.bind(this)
		);
		/**
		 * @api {get} /v1/settings/email/templates/:name Get Email Template
		 * @apiVersion 1.0.0
		 * @apiName getEmailTemplate
		 * @apiGroup Settings
		 * @apiPermission authenticated user
		 *
		 * @apiParam (Request body) {String} name The template name
		 *
		 * @apiExample {js} Example usage:
		 * Request URL: http://localhost:3001/api/v1/settings/email/templates/tenant_registration?
		 *
		 * @apiSuccess (Success 200) {String} status Success code
		 * @apiSuccess (Success 304) {String} status Success code
		 *
		 * @apiSuccessExample {json} Success response:
		 *     HTTPS 304 Not Modified
		 *     {"tenant_id":"5cf64e61d6a06f3d3debbe82","deleted":false,"name":"tenant_registration","subject":"Tenant's account password from singerstore for {{email}}","body":"<div> <div style=\"color: #202020; line-height: 1.5;\">       Your email address {{email}} was just used to request<br />a new password.       <div style=\"padding: 60px 0px;\">{{newPassword}}</div>    If this was not you, you can safely ignore this email.<br /><br />       Best,<br />       EShop Robot</div>"}
		 *
		 * @apiUse UnauthorizedError
		 */
		this.router.get(
			'/v1/settings/email/templates/:name',
			security.checkRoleScope.bind(this, scopes.READ_EMAIL_TEMPLATE),
			this.getEmailTemplate.bind(this)
		);
		/**
		 * @api {put} /v1/settings/email/templates/:name Update Email Template
		 * @apiVersion 1.0.0
		 * @apiName updateEmailTemplate
		 * @apiGroup Settings
		 * @apiPermission authenticated user
		 *
		 * @apiParam (Request param) {String} name The template name
		 *
		 * @apiExample {js} Example usage:
		 * Request URL: http://localhost:3001/api/v1/settings/email/templates/tenant_registration
		 *
		 * @apiExample {js} Example request payload:
		 *	{"tenant_id":"5cf64e61d6a06f3d3debbe82","deleted":false,"name":"tenant_registration","subject":"Tenant's account password from singerstore for {{email}}","body":"<div> <div style=\"color: #202020; line-height: 1.5;\">       Your email address {{email}} was just used to request<br />a new password.       <div style=\"padding: 61px 0px;\">{{newPassword}}</div>    If this was not you, you can safely ignore this email.<br /><br />       Best,<br />       EShop Robot</div>","templateName":"tenant_registration"}
		 *
		 * @apiSuccess (Success 200) {String} status Success code
		 *
		 * @apiSuccessExample {json} Success response:
		 *     HTTPS 200 OK
		 *     {"tenant_id":"5cf64e61d6a06f3d3debbe82","deleted":false,"name":"tenant_registration","subject":"Tenant's account password from singerstore for {{email}}","body":"<div> <div style=\"color: #202020; line-height: 1.5;\">       Your email address {{email}} was just used to request<br />a new password.       <div style=\"padding: 61px 0px;\">{{newPassword}}</div>    If this was not you, you can safely ignore this email.<br /><br />       Best,<br />       EShop Robot</div>"}
		 *
		 * @apiUse UnauthorizedError
		 */
		this.router.put(
			'/v1/settings/email/templates/:name',
			security.checkRoleScope.bind(this, scopes.WRITE_EMAIL_TEMPLATE),
			this.updateEmailTemplate.bind(this)
		);
		/**
		 * @api {post} /v1/settings/logo Upload Logo
		 * @apiVersion 1.0.0
		 * @apiName uploadLogo
		 * @apiGroup Settings
		 * @apiPermission authenticated user
		 *
		 * @apiExample {js} Example usage:
		 * Request URL: http://localhost:3001/api/v1/settings/logo
		 * Request payload: file: (binary)
		 *
		 * @apiSuccess (Success 200) {String} status Success code
		 *
		 * @apiSuccessExample {json} Success response:
		 *     HTTPS 200 OK
		 *     {"file":"Screenshot-from-2019-06-04-17-02-09.png","size":97938}
		 *
		 * @apiUse UnauthorizedError
		 */
		this.router.post(
			'/v1/settings/logo',
			security.checkRoleScope.bind(this, scopes.WRITE_GENERAL_SETTINGS),
			this.uploadLogo.bind(this)
		);
		/**
		 * @api {delete} /v1/settings/logo Delete Logo
		 * @apiVersion 1.0.0
		 * @apiName deleteLogo
		 * @apiGroup Settings
		 * @apiPermission authenticated user
		 *
		 * @apiParam (Request body) {String} id The pages id
		 *
		 * @apiExample {js} Example usage:
		 * Request URL: http://localhost:3001/api/v1/settings/logo
		 *
		 * @apiSuccess (Success 200) {String} status Success code
		 *
		 * @apiSuccessExample {json} Success response:
		 *     HTTPS 200 OK
		 *
		 * @apiUse UnauthorizedError
		 */
		this.router.delete(
			'/v1/settings/logo',
			security.checkRoleScope.bind(this, scopes.WRITE_GENERAL_SETTINGS),
			this.deleteLogo.bind(this)
		);
	}

	getSettings(req, res, next) {
		SettingsService.getSettings(req.get('x-tenant-id'))
			.then(data => {
				res.send(data);
			})
			.catch(next);
	}

	updateSettings(req, res, next) {
		SettingsService.updateSettings(req.get('x-tenant-id'), req.body)
			.then(data => {
				if (data) {
					res.send(data);
				} else {
					res.status(404).end();
				}
			})
			.catch(next);
	}

	getEmailSettings(req, res, next) {
		EmailSettingsService.getEmailSettings(req.get('x-tenant-id'))
			.then(data => {
				res.send(data);
			})
			.catch(next);
	}

	updateEmailSettings(req, res, next) {
		EmailSettingsService.updateEmailSettings(req.body)
			.then(data => {
				if (data) {
					res.send(data);
				} else {
					res.status(404).end();
				}
			})
			.catch(next);
	}

	getEmailTemplate(req, res, next) {
		EmailTemplatesService.getEmailTemplate(
			req.get('x-tenant-id'),
			req.params.name
		)
			.then(data => {
				res.send(data);
			})
			.catch(next);
	}

	updateEmailTemplate(req, res, next) {
		EmailTemplatesService.updateEmailTemplate(
			req.get('x-tenant-id'),
			req.params.name,
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

	uploadLogo(req, res, next) {
		SettingsService.uploadLogo(req, res, next);
	}

	deleteLogo(req, res, next) {
		SettingsService.deleteLogo(req.get('x-tenant-id')).then(() => {
			res.end();
		});
	}
}

export default SettingsRoute;
