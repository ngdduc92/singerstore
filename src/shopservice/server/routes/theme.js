import security from '../lib/security';
import ThemeSettingsService from '../services/theme/settings';
import ThemeAssetsService from '../services/theme/assets';
import ThemePlaceholdersService from '../services/theme/placeholders';
import scopes from '../lib/scopes';

class ThemeRoute {
	constructor(router) {
		this.router = router;
		this.registerRoutes();
	}

	registerRoutes() {
		/**
		 * @api {get} /v1/theme/settings Get Settings
		 * @apiVersion 1.0.0
		 * @apiName getSettings
		 * @apiGroup Theme
		 * @apiPermission authenticated user
		 *
		 *
		 * @apiExample {js} Example usage:
		 * Request URL: http://localhost:3001/api/v1/theme/settings?
		 *
		 * @apiSuccess (Success 200) {String} status Success code
		 * @apiSuccess (Success 304) {String} status Success code
		 *
		 * @apiSuccessExample {json} Success response:
		 *     HTTPS 304 Not Modified
		 *     {"tenant_id":"5cf6520b5407a83e20be98b9","bigThumbnailWidth":800,"button_addtocart_bg":"#ff8000","button_addtocart_color":"#ffffff","button_addtocart_text":"","button_loadmore_bg":"#ff8000","button_loadmore_color":"#ffffff","cartThumbnailWidth":100,"checkoutButtonClass":"checkout-button button is-primary","checkoutEditButtonClass":"checkout-button button","checkoutInputClass":"checkout-field","deleted":false,"details_price_color":"#ff8000","disqus_shortname":"","footer_about":"","footer_contacts":[{"text":""},{"text":""},{"text":""},{"text":""}],"footer_logo_url":"","footer_menu_1_items":[{"text":"About","url":""},{"text":"Careers","url":""},{"text":"Brand Inquiries","url":""}],"footer_menu_1_title":"Company","footer_menu_2_items":[{"text":"FAQ / Contact us","url":""},{"text":"Return Policy","url":""},{"text":"Shipping & Tax","url":""}],"footer_menu_2_title":"Customer service","footer_social":[{"type":"facebook","url":""},{"type":"twitter","url":""}],"hide_footer_on_checkout":false,"home_gallery_shownav":true,"home_products_limit":8,"home_products_sort":"-date_updated","home_products_title":"","home_slider":[],"home_slider_color":"#ffffff","limit_viewed_products":4,"listThumbnailWidth":340,"list_image_max_height":280,"list_price_color":"#ff8000","maxCartItemQty":100,"page_list_tag":"blog","previewThumbnailWidth":100,"product_gallery_shownav":true,"product_thumbnail_position":"left","search_placeholder":"","show_category_breadcrumbs":true,"show_discount_countdown":true,"show_product_breadcrumbs":true,"show_product_filter":true,"show_viewed_products":true,"sortNewest":"-date_created","sortPriceHigh":"-price","sortPriceLow":"price"}
		 *
		 * @apiUse UnauthorizedError
		 */
		this.router.get(
			'/v1/theme/settings',
			security.checkRoleScope.bind(this, scopes.READ_THEME_SETTINGS),
			this.getSettings.bind(this)
		);
		/**
		 * @api {put} /v1/theme/settings Update Settings
		 * @apiVersion 1.0.0
		 * @apiName updateSettings
		 * @apiGroup Theme
		 * @apiPermission authenticated user
		 *
		 *
		 * @apiExample {js} Example Request Payload:
		 * {"tenant_id":"5cf6520b5407a83e20be98b9","bigThumbnailWidth":800,"button_addtocart_bg":"#ff8000","button_addtocart_color":"#ffffff","button_addtocart_text":"","button_loadmore_bg":"#ff8000","button_loadmore_color":"#ffffff","cartThumbnailWidth":100,"checkoutButtonClass":"checkout-button button is-primary","checkoutEditButtonClass":"checkout-button button","checkoutInputClass":"checkout-field","deleted":false,"details_price_color":"#ff8000","disqus_shortname":"","footer_about":"","footer_contacts":[{"text":""},{"text":""},{"text":""},{"text":""}],"footer_logo_url":"","footer_menu_1_items":[{"text":"About","url":""},{"text":"Careers","url":""},{"text":"Brand Inquiries","url":""}],"footer_menu_1_title":"Company","footer_menu_2_items":[{"text":"FAQ / Contact us","url":""},{"text":"Return Policy","url":""},{"text":"Shipping & Tax","url":""}],"footer_menu_2_title":"Customer service","footer_social":[{"type":"facebook","url":""},{"type":"twitter","url":""}],"hide_footer_on_checkout":false,"home_gallery_shownav":true,"home_products_limit":8,"home_products_sort":"-date_updated","home_products_title":"","home_slider":[],"home_slider_color":"#ffffff","limit_viewed_products":4,"listThumbnailWidth":340,"list_image_max_height":280,"list_price_color":"#ff8000","maxCartItemQty":200,"page_list_tag":"blog","previewThumbnailWidth":100,"product_gallery_shownav":true,"product_thumbnail_position":"left","search_placeholder":"","show_category_breadcrumbs":true,"show_discount_countdown":true,"show_product_breadcrumbs":true,"show_product_filter":true,"show_viewed_products":true,"sortNewest":"-date_created","sortPriceHigh":"-price","sortPriceLow":"price"}
		 *
		 * @apiSuccess (Success 200) {String} status Success code
		 *
		 * @apiSuccessExample {json} Success response:
		 *     HTTPS 200 OK
		 *
		 * @apiUse UnauthorizedError
		 */
		this.router.put(
			'/v1/theme/settings',
			security.checkRoleScope.bind(this, scopes.WRITE_THEME_SETTINGS),
			this.updateSettings.bind(this)
		);
		/**
		 * @api {get} /v1/theme/settings_schema Get Settings Schema
		 * @apiVersion 1.0.0
		 * @apiName getSettingsSchema
		 * @apiGroup Theme
		 * @apiPermission authenticated user
		 *
		 * @apiParam (Request body) {String} id The pages id
		 *
		 * @apiExample {js} Example usage:
		 * Request URL: http://localhost:3001/api/v1/theme/settings_schema?
		 *
		 * @apiSuccess (Success 200) {String} status Success code
		 * @apiSuccess (Success 304) {String} status Success code
		 *
		 * @apiSuccessExample {json} Success response:
		 *     HTTPS 304 Not Modified
		 *     [{"section":"Footer","key":"footer_logo_url","type":"image","label":"Logo"},{"section":"Product List","key":"list_image_max_height","type":"number","label":"Image max height"},{"section":"Product Details","key":"button_addtocart_bg","type":"color","label":"Button Add to Cart. Background color."},{"section":"Product Details","key":"button_addtocart_color","type":"color","label":"Button Add to Cart. Text color."},{"section":"Product Details","key":"button_addtocart_text","type":"string","label":"Button Add to Cart. Text."},{"section":"Product List","key":"button_loadmore_bg","type":"color","label":"Button Load more. Background color."},{"section":"Product List","key":"button_loadmore_color","type":"color","label":"Button Load more. Text color."},{"section":"Product List","key":"button_loadmore_text","type":"string","label":"Button Load more. Text."},{"section":"Product List","key":"list_price_color","type":"color","label":"Price color"},{"section":"Product List","key":"list_price_size","type":"number","label":"Price font size (px)"},{"section":"Product Details","key":"details_price_color","type":"color","label":"Price color"},{"section":"Product Details","key":"details_price_size","type":"number","label":"Price font size (px)"},{"section":"Header","key":"search_placeholder","type":"string","label":"Search placeholder"},{"section":"Product List","key":"show_product_filter","type":"boolean","label":"Show Product Filter"},{"section":"Product Details","key":"show_product_breadcrumbs","type":"boolean","label":"Show breadcrumbs"},{"section":"Product List","key":"show_category_breadcrumbs","type":"boolean","label":"Show breadcrumbs"},{"section":"Product Details","key":"show_discount_countdown","type":"boolean","label":"Show discount countdown"},{"section":"Home","key":"home_products_title","type":"string","label":"Featured Products Title"},{"section":"Home","key":"home_products_sort","type":"string","label":"Featured Products Sort By"},{"section":"Home","key":"home_products_sku","type":"string","label":"Featured Products SKUs"},{"section":"Home","key":"home_products_limit","type":"number","label":"Featured Products Items Count"},{"section":"Cart and Checkout","key":"hide_footer_on_checkout","type":"boolean","label":"Hide footer on checkout"},{"section":"Cart and Checkout","key":"checkoutInputClass","type":"string","label":"Text input class"},{"section":"Cart and Checkout","key":"checkoutButtonClass","type":"string","label":"Button class"},{"section":"Cart and Checkout","key":"checkoutEditButtonClass","type":"string","label":"Edit button class"},{"section":"Product List","key":"sortNewest","type":"string","label":"Sort by newest (comma separated fields)"},{"section":"Product List","key":"sortPriceLow","type":"string","label":"Sort by low price (comma separated fields)"},{"section":"Product List","key":"sortPriceHigh","type":"string","label":"Sort by high price (comma separated fields)"},{"section":"Product Details","key":"product_thumbnail_position","type":"string","label":"Gallery thumbnail position","options":[{"label":"Top","value":"top"},{"label":"Right","value":"right"},{"label":"Bottom","value":"bottom"},{"label":"Left","value":"left"}]},{"section":"Product Details","key":"disqus_shortname","type":"string","label":"DISQUS shortname"},{"section":"Footer","key":"footer_about","type":"string","label":"Short description"},{"section":"Footer","key":"footer_menu_1_title","type":"string","label":"Menu 1 title"},{"section":"Footer","key":"footer_menu_2_title","type":"string","label":"Menu 2 title"},{"section":"Cart and Checkout","key":"maxCartItemQty","type":"number","label":"Max Quantity"},{"section":"Cart and Checkout","key":"cartThumbnailWidth","type":"number","label":"Image width (px)"},{"section":"Product List","key":"listThumbnailWidth","type":"number","label":"Image width (px)"},{"section":"Product Details","key":"previewThumbnailWidth","type":"number","label":"Thumbnail image width (px)"},{"section":"Product Details","key":"bigThumbnailWidth","type":"number","label":"Image width (px)"},{"section":"Home","key":"category_list_thumbnail_width","type":"number","label":"Category list. Image width (px)"},{"section":"Footer","key":"footer_menu_1_items","type":"array","label":"Menu 1 (links)","properties":[{"key":"text","type":"string","label":"Link text"},{"key":"url","type":"string","label":"Link url"}]},{"section":"Footer","key":"footer_menu_2_items","type":"array","label":"Menu 2 (links)","properties":[{"key":"text","type":"string","label":"Link text"},{"key":"url","type":"string","label":"Link url"}]},{"section":"Footer","key":"footer_social","type":"array","label":"Social icons","properties":[{"key":"type","type":"string","label":"Type","options":[{"label":"Facebook","value":"facebook"},{"label":"Twitter","value":"twitter"},{"label":"Instagram","value":"instagram"},{"label":"VK","value":"vk"}]},{"key":"url","type":"string","label":"Url"}]},{"section":"Home","key":"home_slider","type":"array","label":"Slider","properties":[{"key":"image","type":"image","label":"Image"},{"key":"title","type":"string","label":"Title"},{"key":"description","type":"string","label":"Description"},{"key":"path","type":"string","label":"Page path"}]},{"section":"Home","key":"home_slider_color","type":"color","label":"Slider text color"},{"section":"Footer","key":"footer_contacts","type":"array","label":"Contacts","properties":[{"key":"text","type":"string","label":"Text line"}]},{"section":"Header","key":"header_menu","type":"array","label":"Menu","properties":[{"key":"text","type":"string","label":"Link text"},{"key":"url","type":"string","label":"Link url"}]},{"section":"Product Details","key":"related_products_title","type":"string","label":"Related Products Title"},{"section":"Product Details","key":"product_gallery_shownav","type":"boolean","label":"Show Navigation Arrows in Gallery"},{"section":"Home","key":"home_gallery_shownav","type":"boolean","label":"Show Navigation Arrows in Gallery"},{"section":"Product Details","key":"show_viewed_products","type":"boolean","label":"Show recently viewed products"},{"section":"Product Details","key":"limit_viewed_products","type":"number","label":"Count of recently viewed products"},{"section":"Pages","key":"page_list_tag","type":"string","label":"Tag to create page list (blog, news, articles or docs)"}]
		 *
		 * @apiUse UnauthorizedError
		 */
		this.router.get(
			'/v1/theme/settings_schema/:lang',
			security.checkRoleScope.bind(this, scopes.READ_THEME_SETTINGS),
			this.getSettingsSchema.bind(this)
		);
		/**
		 * @api {post} /v1/theme/assets Upload File
		 * @apiVersion 1.0.0
		 * @apiName uploadFile
		 * @apiGroup Theme
		 * @apiPermission authenticated user
		 *
		 *
		 * @apiExample {js} Example usage:
		 * Request URL: http://localhost:3001/api/v1/theme/assets
		 * Request payload: file: (binary)
		 *
		 * @apiSuccess (Success 200) {String} status Success code
		 *
		 * @apiSuccessExample {json} Success response:
		 *     HTTPS 200 OK
		 *     {"file":"/logos/5cf6520b5407a83e20be98b9/61otC53lILL._SX700_.jpg","size":25335}
		 *
		 * @apiUse UnauthorizedError
		 */
		this.router.post(
			'/v1/theme/assets',
			security.checkRoleScope.bind(this, scopes.WRITE_THEME_SETTINGS),
			this.uploadFile.bind(this)
		);
		/**
		 * @api {delete} /v1/theme/assets/:file Delete File
		 * @apiVersion 1.0.0
		 * @apiName deleteFile
		 * @apiGroup Theme
		 * @apiPermission authenticated user
		 *
		 * @apiParam (Request param) {String} file The file name
		 *
		 * @apiExample {js} Example usage:
		 * Request URL: http://localhost:3001/api/v1/theme/assets/61otC53lILL._SX700_.jpg
		 *
		 * @apiSuccess (Success 200) {String} status Success code
		 *
		 * @apiSuccessExample {json} Success response:
		 *     HTTPS 200 OK
		 *
		 * @apiUse UnauthorizedError
		 */
		this.router.delete(
			'/v1/theme/assets/:file',
			security.checkRoleScope.bind(this, scopes.WRITE_THEME_SETTINGS),
			this.deleteFile.bind(this)
		);
		/**
		 * @api {get} /v1/theme/placeholders Get Placeholders
		 * @apiVersion 1.0.0
		 * @apiName getPlaceholders
		 * @apiGroup Theme
		 * @apiPermission authenticated user
		 *
		 *
		 * @apiExample {js} Example usage:
		 * Request URL: http://localhost:3001/api/v1/theme/placeholders
		 *
		 * @apiSuccess (Success 200) {String} status Success code
		 *
		 * @apiSuccessExample {json} Success response:
		 *     HTTPS 200 OK
		 *
		 * @apiUse UnauthorizedError
		 */
		this.router.get(
			'/v1/theme/placeholders',
			security.checkRoleScope.bind(this, scopes.READ_THEME_SETTINGS),
			this.getPlaceholders.bind(this)
		);
		/**
		 * @api {post} /v1/theme/placeholders Add Placeholder
		 * @apiVersion 1.0.0
		 * @apiName addPlaceholder
		 * @apiGroup Theme
		 * @apiPermission authenticated user
		 *
		 * @apiExample {js} Example usage:
		 * Request URL: http://localhost:3001/api/v1/theme/placeholders
		 *
		 * @apiSuccess (Success 200) {String} status Success code
		 *
		 * @apiSuccessExample {json} Success response:
		 *     HTTPS 200 OK
		 *
		 * @apiUse UnauthorizedError
		 */
		this.router.post(
			'/v1/theme/placeholders',
			security.checkRoleScope.bind(this, scopes.WRITE_THEME_SETTINGS),
			this.addPlaceholder.bind(this)
		);
		/**
		 * @api {get} /v1/theme/placeholders/:key Get Single Placeholder
		 * @apiVersion 1.0.0
		 * @apiName getSinglePlaceholder
		 * @apiGroup Theme
		 * @apiPermission authenticated user
		 *
		 * @apiParam (Request param) {String} key The Placeholder key
		 *
		 * @apiExample {js} Example usage:
		 * Request URL: http://localhost:3001/api/v1/theme/placeholders/123
		 *
		 * @apiSuccess (Success 200) {String} status Success code
		 *
		 * @apiSuccessExample {json} Success response:
		 *     HTTPS 200 OK
		 *
		 * @apiUse UnauthorizedError
		 */
		this.router.get(
			'/v1/theme/placeholders/:key',
			security.checkRoleScope.bind(this, scopes.READ_THEME_SETTINGS),
			this.getSinglePlaceholder.bind(this)
		);
		/**
		 * @api {put} /v1/theme/placeholders/:key Update Placeholder
		 * @apiVersion 1.0.0
		 * @apiName updatePlaceholder
		 * @apiGroup Theme
		 * @apiPermission authenticated user
		 *
		 * @apiParam (Request param) {String} key The Placeholder key
		 *
		 * @apiExample {js} Example usage:
		 * Request URL: http://localhost:3001/api/v1/theme/placeholders/123
		 *
		 * @apiSuccess (Success 200) {String} status Success code
		 *
		 * @apiSuccessExample {json} Success response:
		 *     HTTPS 200 OK
		 *
		 * @apiUse UnauthorizedError
		 */
		this.router.put(
			'/v1/theme/placeholders/:key',
			security.checkRoleScope.bind(this, scopes.WRITE_THEME_SETTINGS),
			this.updatePlaceholder.bind(this)
		);
		/**
		 * @api {delete} /v1/theme/placeholders/:key Delete Placeholder
		 * @apiVersion 1.0.0
		 * @apiName deletePlaceholder
		 * @apiGroup Theme
		 * @apiPermission authenticated user
		 *
		 * @apiParam (Request param) {String} key The Placeholder key
		 *
		 * @apiExample {js} Example usage:
		 * Request URL: http://localhost:3001/api/v1/theme/placeholders/123
		 *
		 * @apiSuccess (Success 200) {String} status Success code
		 *
		 * @apiSuccessExample {json} Success response:
		 *     HTTPS 200 OK
		 * @apiUse UnauthorizedError
		 */
		this.router.delete(
			'/v1/theme/placeholders/:key',
			security.checkRoleScope.bind(this, scopes.WRITE_THEME_SETTINGS),
			this.deletePlaceholder.bind(this)
		);
	}

	getSettings(req, res, next) {
		ThemeSettingsService.getSettings(req.get('x-tenant-id'))
			.then(data => {
				res.send(data);
			})
			.catch(next);
	}

	updateSettings(req, res, next) {
		ThemeSettingsService.updateSettings(req.get('x-tenant-id'), req.body)
			.then(() => {
				res.end();
			})
			.catch(next);
	}

	getSettingsSchema(req, res, next) {
		ThemeSettingsService.getSettingsSchema(req.params.lang)
			.then(data => {
				res.send(data);
			})
			.catch(next);
	}

	uploadFile(req, res, next) {
		ThemeAssetsService.uploadFile(req, res, next);
	}

	deleteFile(req, res, next) {
		ThemeAssetsService.deleteFile(req.get('x-tenant-id'), req.params.file)
			.then(() => {
				res.end();
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

	getSinglePlaceholder(req, res, next) {
		ThemePlaceholdersService.getSinglePlaceholder(req.params.key)
			.then(data => {
				if (data) {
					res.send(data);
				} else {
					res.status(404).end();
				}
			})
			.catch(next);
	}

	addPlaceholder(req, res, next) {
		ThemePlaceholdersService.addPlaceholder(req.body)
			.then(data => {
				res.send(data);
			})
			.catch(next);
	}

	updatePlaceholder(req, res, next) {
		ThemePlaceholdersService.updatePlaceholder(req.params.key, req.body)
			.then(data => {
				if (data) {
					res.send(data);
				} else {
					res.status(404).end();
				}
			})
			.catch(next);
	}

	deletePlaceholder(req, res, next) {
		ThemePlaceholdersService.deletePlaceholder(req.params.key)
			.then(data => {
				res.status(data ? 200 : 404).end();
			})
			.catch(next);
	}
}

export default ThemeRoute;
