import security from '../lib/security';
import ProductsService from '../services/products/products';
import ProductOptionsService from '../services/products/options';
import ProductOptionValuesService from '../services/products/optionValues';
import ProductVariantsService from '../services/products/variants';
import ProductImagesService from '../services/products/images';
import scopes from '../lib/scopes';

class ProductsRoute {
	constructor(router) {
		this.router = router;
		this.registerRoutes();
	}

	registerRoutes() {
		/**
		 * @api {get} /v1/products Get Products
		 * @apiVersion 1.0.0
		 * @apiName getProducts
		 * @apiGroup Products
		 * @apiPermission authenticated user
		 *
		 * @apiParam (Request param) {String} category_id Product category id
		 * @apiParam (Request param) {String} enabled Product enabled?
		 * @apiParam (Request param) {String} fields Product fields
		 * @apiParam (Request param) {String} ids Product ids
		 * @apiParam (Request param) {String} limit limit
		 * @apiParam (Request param) {String} offsetoffset
		 * @apiParam (Request param) {String} on_sale on_sale?
		 * @apiParam (Request param) {String} price_from Product price from
		 * @apiParam (Request param) {String} price_to Product price to
		 * @apiParam (Request param) {String} search Search
		 * @apiParam (Request param) {String} sku Product SKU
		 * @apiParam (Request param) {String} sort Sort by
		 * @apiParam (Request param) {String} tags Product Tags
		 *
		 * @apiExample {js} Example Request:
		 * Request URL: http://localhost:3001/api/v1/products?category_id=5cf652135407a83e20be98c0&discontinued=false&fields=id%2Cname%2Ccategory_id%2Ccategory_ids%2Ccategory_name%2Csku%2Cimages%2Cenabled%2Cdiscontinued%2Cstock_status%2Cstock_quantity%2Cprice%2Con_sale%2Cregular_price%2Curl&limit=50&offset=0&search=&sort=name
		 *
		 * @apiSuccess (Success 200) {String} status Success code
		 * @apiSuccess (Success 304) {String} status Success code
		 *
		 * @apiSuccessExample {json} Success response:
		 *     HTTPS 304 Not Modified
		 *     {"price":{"min":100,"max":5000},"attributes":[],"total_count":6,"has_more":false,"data":[{"images":[{"id":"5cf881d25407a83e20be98c5","alt":"","position":99,"filename":"503877_DJ2DG_8454_001_075_0000_Light-Ophidia-small-shoulder-bag.jpg","url":"/images/products/5cf6520b5407a83e20be98b9/5cf8812a5407a83e20be98c4/503877_DJ2DG_8454_001_075_0000_Light-Ophidia-small-shoulder-bag.jpg"},{"id":"5cf881d45407a83e20be98c6","alt":"","position":99,"filename":"503877_DJ2DG_8454_002_075_0000_Light-Ophidia-small-shoulder-bag.jpg","url":"/images/products/5cf6520b5407a83e20be98b9/5cf8812a5407a83e20be98c4/503877_DJ2DG_8454_002_075_0000_Light-Ophidia-small-shoulder-bag.jpg"}],"name":"Ophidia small shoulder bag","tags":[],"attributes":[{"name":"Brading","value":"Gucci"}],"enabled":true,"discontinued":false,"slug":"ophidia-small-shoulder-bag","sku":"503877","stock_quantity":1000,"category_id":"5cf652135407a83e20be98c0","tenant_id":"5cf6520b5407a83e20be98b9","deleted":false,"path":"/women/ophidia-small-shoulder-bag","id":"5cf8812a5407a83e20be98c4","category_name":"Women","stock_status":"available","price":2000,"on_sale":true,"regular_price":2000},{"images":[{"id":"5cf884805407a83e20be98cc","alt":"","position":0,"filename":"569940_ZAB1U_9403_001_100_0000_Light-Belted-dress-with-poppy-print.jpg","url":"/images/products/5cf6520b5407a83e20be98b9/5cf883765407a83e20be98c9/569940_ZAB1U_9403_001_100_0000_Light-Belted-dress-with-poppy-print.jpg"},{"id":"5cf8847e5407a83e20be98cb","alt":"","position":1,"filename":"569940_ZAB1U_9403_004_100_0000_Light-Belted-dress-with-poppy-print.jpg","url":"/images/products/5cf6520b5407a83e20be98b9/5cf883765407a83e20be98c9/569940_ZAB1U_9403_004_100_0000_Light-Belted-dress-with-poppy-print.jpg"}],"name":"Belted dress with poppy print","tags":[],"attributes":[],"enabled":true,"discontinued":false,"slug":"belted-dress-with-poppy-print","sku":"503879","stock_quantity":5000,"category_id":"5cf652135407a83e20be98c0","tenant_id":"5cf6520b5407a83e20be98b9","deleted":false,"path":"/women/belted-dress-with-poppy-print","id":"5cf883765407a83e20be98c9","category_name":"Women","stock_status":"available","price":5000,"on_sale":false,"regular_price":5000},{"images":[{"id":"5cf886e15407a83e20be98cf","alt":"","position":99,"filename":"air-max-720-betrue-shoe.jpg","url":"/images/products/5cf6520b5407a83e20be98b9/5cf886805407a83e20be98ce/air-max-720-betrue-shoe.jpg"},{"id":"5cf886e35407a83e20be98d0","alt":"","position":99,"filename":"air-max-720-betrue-shoe--1-.jpg","url":"/images/products/5cf6520b5407a83e20be98b9/5cf886805407a83e20be98ce/air-max-720-betrue-shoe--1-.jpg"},{"id":"5cf886e45407a83e20be98d1","alt":"","position":99,"filename":"air-max-720-betrue-shoe--2-.jpg","url":"/images/products/5cf6520b5407a83e20be98b9/5cf886805407a83e20be98ce/air-max-720-betrue-shoe--2-.jpg"},{"id":"5cf886e65407a83e20be98d2","alt":"","position":99,"filename":"air-max-720-betrue-shoe--3-.jpg","url":"/images/products/5cf6520b5407a83e20be98b9/5cf886805407a83e20be98ce/air-max-720-betrue-shoe--3-.jpg"}],"name":"NIKE AIR MAX 720 BETRUE","tags":[],"attributes":[{"name":"Branding","value":"Nike"}],"enabled":true,"discontinued":false,"slug":"air-max-720-betrue-shoe","sku":"503880","stock_quantity":5000,"category_id":"5cf652135407a83e20be98c0","tenant_id":"5cf6520b5407a83e20be98b9","deleted":false,"path":"/women/air-max-720-betrue-shoe","id":"5cf886805407a83e20be98ce","category_name":"Women","stock_status":"available","price":300,"on_sale":false,"regular_price":300},{"images":[{"id":"5cf8879e5407a83e20be98d4","alt":"","position":99,"filename":"air-max-90-betrue-shoe.jpg","url":"/images/products/5cf6520b5407a83e20be98b9/5cf8877c5407a83e20be98d3/air-max-90-betrue-shoe.jpg"},{"id":"5cf8879f5407a83e20be98d5","alt":"","position":99,"filename":"air-max-90-betrue-shoe--1-.jpg","url":"/images/products/5cf6520b5407a83e20be98b9/5cf8877c5407a83e20be98d3/air-max-90-betrue-shoe--1-.jpg"},{"id":"5cf887a15407a83e20be98d6","alt":"","position":99,"filename":"air-max-90-betrue-shoe--2-.jpg","url":"/images/products/5cf6520b5407a83e20be98b9/5cf8877c5407a83e20be98d3/air-max-90-betrue-shoe--2-.jpg"}],"name":"NIKE AIR MAX 90 BETRUE","tags":[],"attributes":[],"enabled":true,"discontinued":false,"slug":"air-max-90-betrue-shoe","sku":"503881","stock_quantity":1000,"category_id":"5cf652135407a83e20be98c1","tenant_id":"5cf6520b5407a83e20be98b9","deleted":false,"path":"/men/air-max-90-betrue-shoe","id":"5cf8877c5407a83e20be98d3","category_name":"Men","stock_status":"available","price":250,"on_sale":false,"regular_price":250},{"images":[{"id":"5cf8bd135407a83e20be98d8","alt":"","position":99,"filename":"61otC53lILL._SX700_.jpg","url":"/images/products/5cf6520b5407a83e20be98b9/5cf8bce95407a83e20be98d7/61otC53lILL._SX700_.jpg"}],"name":"Union Performance Long Sleeve Rashguard","tags":[],"attributes":[],"enabled":true,"discontinued":false,"slug":"union-performance-long-sleeve-rashguard","sku":"503882","stock_quantity":100,"category_id":"5cf652135407a83e20be98c2","tenant_id":"5cf6520b5407a83e20be98b9","deleted":false,"path":"/kids/union-performance-long-sleeve-rashguard","id":"5cf8bce95407a83e20be98d7","category_name":"Kids","stock_status":"available","price":100,"on_sale":false,"regular_price":100},{"images":[{"id":"5cf9dcbd754c66729795f0be","alt":"","position":99,"filename":"71sywJMHcSL._SX700_.jpg","url":"/images/products/5cf6520b5407a83e20be98b9/5cf9dc35754c66729795f0bd/71sywJMHcSL._SX700_.jpg"},{"id":"5cf9dcbf754c66729795f0bf","alt":"","position":99,"filename":"81u+OJkGVYL._SX700_.jpg","url":"/images/products/5cf6520b5407a83e20be98b9/5cf9dc35754c66729795f0bd/81u+OJkGVYL._SX700_.jpg"}],"name":"Michael Kors MK8714 - Lexington","tags":[],"attributes":[],"enabled":true,"discontinued":false,"slug":"michael-kors-mk8714-lexington","sku":"503885","stock_quantity":2,"category_id":"5cf885e95407a83e20be98cd","tenant_id":"5cf6520b5407a83e20be98b9","deleted":false,"path":"/gifts/michael-kors-mk8714-lexington","id":"5cf9dc35754c66729795f0bd","category_name":"Gifts","stock_status":"available","price":325,"on_sale":false,"regular_price":325}]}
		 *
		 * @apiUse UnauthorizedError
		 */
		this.router.get(
			'/v1/products',
			security.checkRoleScope.bind(this, scopes.LIST_PRODUCT),
			this.getProducts.bind(this)
		);
		/**
		 * @api {post} /v1/products Add Product
		 * @apiVersion 1.0.0
		 * @apiName addProduct
		 * @apiGroup Products
		 * @apiPermission authenticated user
		 *
		 * @apiParam (Request body) {String} enabled product enabled
		 * @apiParam (Request body) {String} category_id category id
		 *
		 * @apiExample {js} Example request payload:
		 * {"enabled":false,"category_id":"all"}
		 *
		 * @apiSuccess (Success 200) {String} status Success code
		 *
		 * @apiSuccessExample {json} Success response:
		 *     HTTPS 200 OK
		 *     {"date_created":"2019-06-07T07:33:39.276Z","date_updated":null,"images":[],"dimensions":{"length":0,"width":0,"height":0},"name":"","description":"","meta_description":"","meta_title":"","tags":[],"attributes":[],"enabled":false,"discontinued":false,"slug":"","sku":"","code":"","tax_class":"","related_product_ids":[],"prices":[],"quantity_inc":1,"quantity_min":1,"weight":0,"stock_quantity":0,"position":null,"date_stock_expected":null,"date_sale_from":null,"date_sale_to":null,"stock_tracking":false,"stock_preorder":false,"stock_backorder":false,"category_id":null,"category_ids":[],"tenant_id":"5cf6520b5407a83e20be98b9","deleted":false,"cost_price":0,"regular_price":0,"sale_price":0,"on_sale":false,"variable":false,"price":0,"stock_status":"out_of_stock","url":"/","path":"/","category_name":"","category_slug":"","id":"5cfa135301218a081e08964f"}
		 *
		 * @apiUse UnauthorizedError
		 */
		this.router.post(
			'/v1/products',
			security.checkRoleScope.bind(this, scopes.WRITE_PRODUCT),
			this.addProduct.bind(this)
		);
		/**
		 * @api {get} /v1/products/:productId Get Single Product
		 * @apiVersion 1.0.0
		 * @apiName getSingleProduct
		 * @apiGroup Products
		 * @apiPermission authenticated user
		 *
		 * @apiParam (Request param) {String} id The productId
		 *
		 * @apiExample {js} Example usage:
		 * http://localhost:3001/api/v1/products/5cf883765407a83e20be98c9?
		 *
		 * @apiSuccess (Success 200, 304) {String} response Success response
		 *
		 * @apiSuccessExample {json} Success response:
		 *     HTTPS 304 Not Modified
		 *     {"date_created":"2019-06-06T03:07:34.479Z","date_updated":"2019-06-06T03:11:54.897Z","images":[{"id":"5cf884805407a83e20be98cc","alt":"","position":0,"filename":"569940_ZAB1U_9403_001_100_0000_Light-Belted-dress-with-poppy-print.jpg","url":"/images/products/5cf6520b5407a83e20be98b9/5cf883765407a83e20be98c9/569940_ZAB1U_9403_001_100_0000_Light-Belted-dress-with-poppy-print.jpg"},{"id":"5cf8847e5407a83e20be98cb","alt":"","position":1,"filename":"569940_ZAB1U_9403_004_100_0000_Light-Belted-dress-with-poppy-print.jpg","url":"/images/products/5cf6520b5407a83e20be98b9/5cf883765407a83e20be98c9/569940_ZAB1U_9403_004_100_0000_Light-Belted-dress-with-poppy-print.jpg"}],"dimensions":{"length":0,"width":0,"height":0},"name":"Belted dress with poppy print","description":"","meta_description":"","meta_title":"","tags":[],"attributes":[],"enabled":true,"discontinued":false,"slug":"belted-dress-with-poppy-print","sku":"503879","code":"","tax_class":"","related_product_ids":[],"prices":[],"quantity_inc":1,"quantity_min":1,"weight":0,"stock_quantity":5000,"position":null,"date_stock_expected":null,"date_sale_from":null,"date_sale_to":null,"stock_tracking":false,"stock_preorder":false,"stock_backorder":false,"category_id":"5cf652135407a83e20be98c0","category_ids":[],"tenant_id":"5cf6520b5407a83e20be98b9","deleted":false,"options":[],"cost_price":0,"regular_price":5000,"sale_price":0,"on_sale":false,"variable":false,"price":5000,"stock_status":"available","url":"/women/belted-dress-with-poppy-print","path":"/women/belted-dress-with-poppy-print","category_name":"Women","category_slug":"women","id":"5cf883765407a83e20be98c9"}
		 *
		 * @apiUse UnauthorizedError
		 */
		this.router.get(
			'/v1/products/:productId',
			security.checkRoleScope.bind(this, scopes.READ_PRODUCT),
			this.getSingleProduct.bind(this)
		);
		/**
		 * @api {put} /v1/products/:productId Update Product
		 * @apiVersion 1.0.0
		 * @apiName updateProduct
		 * @apiGroup Products
		 * @apiPermission authenticated user
		 *
		 * @apiParam (Request param) {String} productId The productId
		 * @apiParam (Request body) {String} id The productId
		 * @apiParam (Request body) {String} name The product name
		 * @apiParam (Request body) {String} slug The product url slug
		 * @apiParam (Request body) {String} meta_title The product meta_title
		 * @apiParam (Request body) {String} meta_description The product meta_description
		 * @apiParam (Request body) {String} description The product description
		 * @apiParam (Request body) {String} regular_price The product regular price
		 * @apiParam (Request body) {String} sale_price The product sale price
		 * @apiParam (Request body) {String} date_sale_from The product date sale from
		 * @apiParam (Request body) {String} date_sale_to The product date sale to
		 * @apiParam (Request body) {String} sku The product sku
		 * @apiParam (Request body) {String} stock_quantity The stock quantity
		 * @apiParam (Request body) {String} weight The product weight
		 * @apiParam (Request body) {String} date_stock_expected The date stock expected
		 * @apiParam (Request body) {String} stock_tracking The stock tracking
		 * @apiParam (Request body) {String} stock_preorder The stock preorder
		 * @apiParam (Request body) {String} stock_backorder The stock backorder
		 * @apiParam (Request body) {String} discontinued The product discontinued?
		 * @apiParam (Request body) {String} enabled The product enabled?
		 *
		 * @apiExample {js} Example request payload:
		 * {	"id":"5cfa11e701218a081e08964e",
		 * 	"name":"product name",
		 *	"slug":"slug",
		 *	"meta_title":"",
		 *	"meta_description":"",
		 *	"description":"<p>description</p>"
		 * }
		 * @apiExample {js} Example request payload:
		 * { "id":"5cf883765407a83e20be98c9",
		 *	"regular_price":"4800",
		 *	"sale_price":0,
		 *	"date_sale_from":null,
		 *	"date_sale_to":null,
		 *	"sku":"503879",
		 *	"stock_quantity":5000,
		 *	"weight":0,
		 *	"date_stock_expected":null,
		 *	"stock_tracking":false,
		 *	"stock_preorder":false,
		 *	"stock_backorder":false,
		 *	"discontinued":false,
		 *	"enabled":true
		 * }
		 *
		 * @apiSuccess (Success 200) {String} status Success code
		 *
		 * @apiSuccessExample {json} Success response:
		 *     HTTPS 200 OK
		 *     {"date_created":"2019-06-07T07:27:35.445Z","date_updated":"2019-06-07T07:29:38.368Z","images":[],"dimensions":{"length":0,"width":0,"height":0},"name":"sdfsdf","description":"<p>description</p>","meta_description":"","meta_title":"","tags":[],"attributes":[],"enabled":false,"discontinued":false,"slug":"sdfsdf","sku":"","code":"","tax_class":"","related_product_ids":[],"prices":[],"quantity_inc":1,"quantity_min":1,"weight":0,"stock_quantity":0,"position":null,"date_stock_expected":null,"date_sale_from":null,"date_sale_to":null,"stock_tracking":false,"stock_preorder":false,"stock_backorder":false,"category_id":null,"category_ids":[],"tenant_id":"5cf6520b5407a83e20be98b9","deleted":false,"cost_price":0,"regular_price":0,"sale_price":0,"on_sale":false,"variable":false,"price":0,"stock_status":"out_of_stock","url":"/slug","path":"/newproduct","category_name":"","category_slug":"","id":"5cfa11e701218a081e08964e"}
		 *
		 * @apiUse UnauthorizedError
		 */
		this.router.put(
			'/v1/products/:productId',
			security.checkRoleScope.bind(this, scopes.WRITE_PRODUCT),
			this.updateProduct.bind(this)
		);

		/**
		 * @api {delete} /v1/products/:productId Delete Product
		 * @apiVersion 1.0.0
		 * @apiName deleteProduct
		 * @apiGroup Products
		 * @apiPermission authenticated user
		 *
		 * @apiParam (Request param) {String} productId The productId
		 *
		 * @apiExample {js} Example usage:
		 * http://localhost:3001/api/v1/products/5cfa135301218a081e08964f
		 *
		 * @apiSuccess (Success 200, 304) {String} response Success response
		 *
		 * @apiSuccessExample {json} Success response:
		 *     HTTPS 200 OK
		 *
		 * @apiUse UnauthorizedError
		 */
		this.router.delete(
			'/v1/products/:productId',
			security.checkRoleScope.bind(this, scopes.DELETE_PRODUCT),
			this.deleteProduct.bind(this)
		);
		/**
		 * @api {get} /v1/products/:productId/images Get Images
		 * @apiVersion 1.0.0
		 * @apiName getImages
		 * @apiGroup Products
		 * @apiPermission authenticated user
		 *
		 * @apiParam (Request param) {String} productId The productId
		 *
		 * @apiExample {js} Example usage:
		 * http://localhost:3001/api/v1/products/5cfa135301218a081e08964f/images
		 *
		 * @apiSuccess (Success 200, 304) {String} response Success response
		 *
		 * @apiSuccessExample {json} Success response:
		 *     HTTPS 304 Not Modified
		 *     [{   "id": "5cf884805407a83e20be98cc",
		 *		"alt": "",
		 *		"position": 0,
		 *		"filename": "569940_ZAB1U_9403_001_100_0000_Light-Belted-dress-with-poppy-print.jpg",
		 *		"url": "/images/products/5cf6520b5407a83e20be98b9/5cf883765407a83e20be98c9/569940_ZAB1U_9403_001_100_0000_Light-Belted-dress-with-poppy-print.jpg"
		 *	}, {
		 *		"id": "5cf8847e5407a83e20be98cb",
		 *		"alt": "",
		 *		"position": 1,
		 *		"filename": "569940_ZAB1U_9403_004_100_0000_Light-Belted-dress-with-poppy-print.jpg",
		 *		"url": "/images/products/5cf6520b5407a83e20be98b9/5cf883765407a83e20be98c9/569940_ZAB1U_9403_004_100_0000_Light-Belted-dress-with-poppy-print.jpg"
		 *	}]
		 *
		 * @apiUse UnauthorizedError
		 */
		this.router.get(
			'/v1/products/:productId/images',
			security.checkRoleScope.bind(this, scopes.READ_PRODUCT),
			this.getImages.bind(this)
		);
		/**
		 * @api {post} /v1/products/:productId/images Add Image
		 * @apiVersion 1.0.0
		 * @apiName addImage
		 * @apiGroup Products
		 * @apiPermission authenticated user
		 *
		 * @apiParam (Request param) {String} productId The productId
		 * @apiHeader {String} Content-Type Content-Type : multipart/form-data
		 *
		 * @apiExample {js} Example request:
		 * file: (binary)
		 *
		 * @apiSuccess (Success 200) {String} response Success response
		 *
		 * @apiSuccessExample {json} Success response:
		 *     HTTPS 200 OK
		 *     [{
		 *		"id": "5cfa1a6a01218a081e089650",
		 *		"alt": "",
		 *		"position": 99,
		 *		"filename": "image-from-2019-06-04-17-08-20.png"
		 *	  }]
		 *
		 * @apiUse UnauthorizedError
		 */
		this.router.post(
			'/v1/products/:productId/images',
			security.checkRoleScope.bind(this, scopes.WRITE_PRODUCT),
			this.addImage.bind(this)
		);
		/**
		 * @api {put} /v1/products/:productId/images/:imageId Update Image
		 * @apiVersion 1.0.0
		 * @apiName updateImage
		 * @apiGroup Products
		 * @apiPermission authenticated user
		 *
		 * @apiParam (Request param) {String} productId The productId
		 * @apiParam (Request param) {String} imageId The imageId
		 *
		 * @apiExample {js} Example request payload:
		 * {"id":"5cfa1a6a01218a081e089650","alt":"texttext"}
		 *
		 * @apiSuccess (Success 200) {String} status Success code
		 *
		 * @apiSuccessExample {json} Success response:
		 *     HTTPS 200 OK
		 *
		 * @apiUse UnauthorizedError
		 */
		this.router.put(
			'/v1/products/:productId/images/:imageId',
			security.checkRoleScope.bind(this, scopes.WRITE_PRODUCT),
			this.updateImage.bind(this)
		);
		/**
		 * @api {delete} /v1/products/:productId/images/:imageId Delete Image
		 * @apiVersion 1.0.0
		 * @apiName deleteImage
		 * @apiGroup Products
		 * @apiPermission authenticated user
		 *
		 * @apiParam (Request param) {String} productId The productId
		 * @apiParam (Request param) {String} imageId The imageId
		 *
		 * @apiExample {js} Example request:
		 * http://localhost:3001/api/v1/products/5cf883765407a83e20be98c9/images/5cfa1a6a01218a081e089650
		 *
		 * @apiSuccess (Success 200) {String} status Success code
		 *
		 * @apiSuccessExample {json} Success response:
		 *     HTTPS 200 OK
		 *
		 * @apiUse UnauthorizedError
		 */
		this.router.delete(
			'/v1/products/:productId/images/:imageId',
			security.checkRoleScope.bind(this, scopes.WRITE_PRODUCT),
			this.deleteImage.bind(this)
		);
		/**
		 * @api {get} /v1/products/:productId/sku Is Sku Exists
		 * @apiVersion 1.0.0
		 * @apiName isSkuExists
		 * @apiGroup Products
		 * @apiPermission authenticated user
		 *
		 * @apiParam (Request param) {String} productId The productId
		 *
		 * @apiExample {js} Example usage:
		 * http://localhost:3001/api/v1/products/5cf883765407a83e20be98c9/sku
		 *
		 * @apiSuccess (Success 200) {String} status Success code
		 *
		 * @apiSuccessExample {json} Success response:
		 *     HTTPS 200 OK
		 *
		 * @apiUse UnauthorizedError
		 */
		this.router.get(
			'/v1/products/:productId/sku',
			security.checkRoleScope.bind(this, scopes.READ_PRODUCT),
			this.isSkuExists.bind(this)
		);
		/**
		 * @api {get} /v1/products/:productId/slug Is Slug Exists
		 * @apiVersion 1.0.0
		 * @apiName isSlugExists
		 * @apiGroup Products
		 * @apiPermission authenticated user
		 *
		 * @apiParam (Request param) {String} productId The productId
		 *
		 * @apiExample {js} Example usage:
		 * http://localhost:3001/api/v1/products/5cf883765407a83e20be98c9/slug
		 *
		 * @apiSuccess (Success 200) {String} status Success code
		 *
		 * @apiSuccessExample {json} Success response:
		 *     HTTPS 200 OK
		 *
		 * @apiUse UnauthorizedError
		 */
		this.router.get(
			'/v1/products/:productId/slug',
			security.checkRoleScope.bind(this, scopes.READ_PRODUCT),
			this.isSlugExists.bind(this)
		);
		/**
		 * @api {get} /v1/products/:productId/options Get Options
		 * @apiVersion 1.0.0
		 * @apiName getOptions
		 * @apiGroup Products
		 * @apiPermission authenticated user
		 *
		 * @apiParam (Request param) {String} productId The productId
		 *
		 * @apiExample {js} Example usage:
		 * http://localhost:3001/api/v1/products/5cf883765407a83e20be98c9/options
		 *
		 * @apiSuccess (Success 200) {String} status Success code
		 *
		 * @apiSuccessExample {json} Success response:
		 *     HTTPS 200 OK
		 *     [{"id":"5cfa201401218a081e089651","name":"New option","control":"select","required":true,"position":0,"values":[]}]
		 *
		 * @apiUse UnauthorizedError
		 */
		this.router.get(
			'/v1/products/:productId/options',
			security.checkRoleScope.bind(this, scopes.READ_PRODUCT),
			this.getOptions.bind(this)
		);
		/**
		 * @api {get} /v1/products/:productId/options/:optionId Get Single Option
		 * @apiVersion 1.0.0
		 * @apiName getSingleOption
		 * @apiGroup Products
		 * @apiPermission authenticated user
		 *
		 * @apiParam (Request param) {String} productId The productId
		 * @apiParam (Request param) {String} optionId The optionId
		 *
		 * @apiExample {js} Example usage:
		 * http://localhost:3001/api/v1/products/5cf883765407a83e20be98c9/options/5cfa201401218a081e089651
		 *
		 * @apiSuccess (Success 200) {String} status Success code
		 *
		 * @apiSuccessExample {json} Success response:
		 *     HTTPS 200 OK
		 *     {"id":"5cfa201401218a081e089651","name":"New option","control":"select","required":true,"position":0,"values":[]}
		 *
		 * @apiUse UnauthorizedError
		 */
		this.router.get(
			'/v1/products/:productId/options/:optionId',
			security.checkRoleScope.bind(this, scopes.READ_PRODUCT),
			this.getSingleOption.bind(this)
		);
		/**
		 * @api {post} /v1/products/:productId/options Add Option
		 * @apiVersion 1.0.0
		 * @apiName addOption
		 * @apiGroup Products
		 * @apiPermission authenticated user
		 *
		 * @apiParam (Request param) {String} productId The productId
		 * @apiParam (Request body) {String} name The option name
		 * @apiParam (Request body) {String} position The option position
		 * @apiParam (Request body) {String} required The option required
		 * @apiParam (Request body) {String} control The option control
		 *
		 * @apiExample {js} Example request payload:
		 * {"name":"New option","position":0,"required":true,"control":"select"}
		 *
		 * @apiSuccess (Success 200) {String} status Success code
		 *
		 * @apiSuccessExample {json} Success response:
		 *     HTTPS 200 OK
		 *     [{"id":"5cff1d267ceb7a138e5e7124","name":"New option","control":"select","required":true,"position":0,"values":[]}]
		 *
		 * @apiUse UnauthorizedError
		 */
		this.router.post(
			'/v1/products/:productId/options',
			security.checkRoleScope.bind(this, scopes.WRITE_PRODUCT),
			this.addOption.bind(this)
		);
		/**
		 * @api {put} /v1/products/:productId/options/:optionId Update Option
		 * @apiVersion 1.0.0
		 * @apiName updateOption
		 * @apiGroup Products
		 * @apiPermission authenticated user
		 *
		 * @apiParam (Request param) {String} productId The productId
		 * @apiParam (Request param) {String} optionId The optionId
		 * @apiParam (Request body) {String} id The option id
		 * @apiParam (Request body) {String} name The option name
		 * @apiParam (Request body) {String} control The option control
		 * @apiParam (Request body) {String} required The option required
		 * @apiParam (Request body) {String} position The option position
		 * @apiParam (Request body) {String} values The option values
		 *
		 * @apiExample {js} Example request payload:
		 * {"id":"5cff1d267ceb7a138e5e7124","name":"New option 1","control":"select","required":true,"position":"0","values":[]}
		 *
		 * @apiSuccess (Success 200) {String} status Success code
		 *
		 * @apiSuccessExample {json} Success response:
		 *     HTTPS 200 OK
		 *     [{"id":"5cff1d267ceb7a138e5e7124","name":"New option 1","control":"select","required":true,"position":0,"values":[]}]
		 *
		 * @apiUse UnauthorizedError
		 */
		this.router.put(
			'/v1/products/:productId/options/:optionId',
			security.checkRoleScope.bind(this, scopes.WRITE_PRODUCT),
			this.updateOption.bind(this)
		);
		/**
		 * @api {delete} /v1/products/:productId/options/:optionId Delete Option
		 * @apiVersion 1.0.0
		 * @apiName deleteOption
		 * @apiGroup Products
		 * @apiPermission authenticated user
		 *
		 * @apiParam (Request param) {String} productId The productId
		 * @apiParam (Request param) {String} optionId The optionId
		 *
		 * @apiExample {js} Example usage:
		 * http://localhost:3001/api/v1/products/5cff1d167ceb7a138e5e7123/options/5cff1d267ceb7a138e5e7124
		 *
		 * @apiSuccess (Success 200) {String} status Success code
		 *
		 * @apiSuccessExample {json} Success response:
		 *     HTTPS 200 OK
		 *
		 * @apiUse UnauthorizedError
		 */
		this.router.delete(
			'/v1/products/:productId/options/:optionId',
			security.checkRoleScope.bind(this, scopes.WRITE_PRODUCT),
			this.deleteOption.bind(this)
		);
		/**
		 * @api {get} /v1/products/:productId/options/:optionId/values Get Option Values
		 * @apiVersion 1.0.0
		 * @apiName getOptionValues
		 * @apiGroup Products
		 * @apiPermission authenticated user
		 *
		 * @apiParam (Request param) {String} productId The productId
		 * @apiParam (Request param) {String} optionId The optionId
		 *
		 * @apiSuccess (Success 200) {String} status Success code
		 *
		 * @apiSuccessExample {json} Success response:
		 *     HTTPS 200 OK
		 *     [{"id":"5cff20d07ceb7a138e5e7127","name":"value name"}]
		 *
		 * @apiUse UnauthorizedError
		 */
		this.router.get(
			'/v1/products/:productId/options/:optionId/values',
			security.checkRoleScope.bind(this, scopes.READ_PRODUCT),
			this.getOptionValues.bind(this)
		);
		/**
		 * @api {get} /v1/products/:productId/options/:optionId/values/:valueId Get Single Option Value
		 * @apiVersion 1.0.0
		 * @apiName getSingleOptionValue
		 * @apiGroup Products
		 * @apiPermission authenticated user
		 *
		 * @apiParam (Request param) {String} productId The productId
		 * @apiParam (Request param) {String} optionId The optionId
		 * @apiParam (Request param) {String} valueId The valueId
		 *
		 * @apiExample {js} Example usage:
		 * http://localhost:3001/api/v1/products/5cff1d167ceb7a138e5e7123/options/5cff1fc57ceb7a138e5e7125/values/5cff20d47ceb7a138e5e7128
		 *
		 * @apiSuccess (Success 200) {String} status Success code
		 *
		 * @apiSuccessExample {json} Success response:
		 *     HTTPS 200 OK
		 *     {"id":"5cff20d47ceb7a138e5e7128","name":"value name"}
		 *
		 * @apiUse UnauthorizedError
		 */
		this.router.get(
			'/v1/products/:productId/options/:optionId/values/:valueId',
			security.checkRoleScope.bind(this, scopes.READ_PRODUCT),
			this.getSingleOptionValue.bind(this)
		);
		/**
		 * @api {post} /v1/products/:productId/options/:optionId/values Add Option Value
		 * @apiVersion 1.0.0
		 * @apiName addOptionValue
		 * @apiGroup Products
		 * @apiPermission authenticated user
		 *
		 * @apiParam (Request param) {String} productId The productId
		 * @apiParam (Request param) {String} optionId The optionId
		 *
		 * @apiSuccess (Success 200) {String} status Success code
		 *
		 * @apiSuccessExample {json} Success response:
		 *     HTTPS 200 OK
		 *
		 * @apiUse UnauthorizedError
		 */
		this.router.post(
			'/v1/products/:productId/options/:optionId/values',
			security.checkRoleScope.bind(this, scopes.WRITE_PRODUCT),
			this.addOptionValue.bind(this)
		);
		/**
		 * @api {put} /v1/products/:productId/options/:optionId/values/:valueId Update Option Value
		 * @apiVersion 1.0.0
		 * @apiName updateOptionValue
		 * @apiGroup Products
		 * @apiPermission authenticated user
		 *
		 * @apiParam (Request param) {String} productId The productId
		 * @apiParam (Request param) {String} optionId The optionId
		 * @apiParam (Request param) {String} valueId The valueId
		 * @apiParam (Request body) {String} name The value name
		 *
		 * @apiExample {js} Example request payload:
		 * {"name":"value name"}
		 *
		 * @apiSuccess (Success 200) {String} status Success code
		 *
		 * @apiSuccessExample {json} Success response:
		 *     HTTPS 200 OK
		 *     [{"id":"5cff20d07ceb7a138e5e7127","name":"option name1"}]
		 *
		 * @apiUse UnauthorizedError
		 */
		this.router.put(
			'/v1/products/:productId/options/:optionId/values/:valueId',
			security.checkRoleScope.bind(this, scopes.WRITE_PRODUCT),
			this.updateOptionValue.bind(this)
		);
		/**
		 * @api {delete} /v1/products/:productId/options/:optionId/values/:valueId Delete Option Value
		 * @apiVersion 1.0.0
		 * @apiName deleteOptionValue
		 * @apiGroup Products
		 * @apiPermission authenticated user
		 *
		 * @apiParam (Request param) {String} productId The productId
		 * @apiParam (Request param) {String} optionId The optionId
		 * @apiParam (Request param) {String} valueId The valueId
		 *
		 * @apiExample {js} Example usage:
		 * http://localhost:3001/api/v1/products/5cff1d167ceb7a138e5e7123/options/5cff1fc57ceb7a138e5e7125/values/5cff1fde7ceb7a138e5e7126
		 *
		 * @apiSuccess (Success 200) {String} status Success code
		 *
		 * @apiSuccessExample {json} Success response:
		 *     HTTPS 200 OK
		 *
		 * @apiUse UnauthorizedError
		 */
		this.router.delete(
			'/v1/products/:productId/options/:optionId/values/:valueId',
			security.checkRoleScope.bind(this, scopes.WRITE_PRODUCT),
			this.deleteOptionValue.bind(this)
		);
		/**
		 * @api {get} /v1/products/:productId/variants Get Variants
		 * @apiVersion 1.0.0
		 * @apiName getVariants
		 * @apiGroup Products
		 * @apiPermission authenticated user
		 *
		 * @apiParam (Request param) {String} productId The productId
		 *
		 * @apiExample {js} Example usage:
		 * http://localhost:3001/api/v1/products/5cff1d167ceb7a138e5e7123/variants
		 *
		 * @apiSuccess (Success 200) {String} status Success code
		 *
		 * @apiSuccessExample {json} Success response:
		 *     HTTPS 200 OK
		 *
		 * @apiUse UnauthorizedError
		 */
		this.router.get(
			'/v1/products/:productId/variants',
			security.checkRoleScope.bind(this, scopes.READ_PRODUCT),
			this.getVariants.bind(this)
		);
		/**
		 * @api {post} /v1/products/:productId/variants Add Variant
		 * @apiVersion 1.0.0
		 * @apiName addVariant
		 * @apiGroup Products
		 * @apiPermission authenticated user
		 *
		 * @apiParam (Request param) {String} productId The productId
		 * @apiParam (Request body) {String} price The price
		 * @apiParam (Request body) {String} stock_quantity The stock quantity
		 * @apiParam (Request body) {String} weight The weight
		 *
		 * @apiExample {js} Example request payload:
		 * {"price":0,"stock_quantity":0,"weight":0}
		 *
		 * @apiSuccess (Success 200) {String} status Success code
		 *
		 * @apiSuccessExample {json} Success response:
		 *     HTTPS 200 OK
		 *     [{"id":"5cff24117ceb7a138e5e7129","sku":"","price":0,"stock_quantity":0,"weight":0,"options":[]}]
		 *
		 * @apiUse UnauthorizedError
		 */
		this.router.post(
			'/v1/products/:productId/variants',
			security.checkRoleScope.bind(this, scopes.WRITE_PRODUCT),
			this.addVariant.bind(this)
		);
		/**
		 * @api {put} /v1/products/:productId/variants Update Variant
		 * @apiVersion 1.0.0
		 * @apiName updateVariant
		 * @apiGroup Products
		 * @apiPermission authenticated user
		 *
		 * @apiParam (Request param) {String} productId The productId
		 * @apiParam (Request body) {String} price The price
		 * @apiParam (Request body) {String} stock_quantity The stock quantity
		 * @apiParam (Request body) {String} weight The weight
		 *
		 * @apiExample {js} Example request payload:
		 * {"price":1000}
		 *
		 * @apiSuccess (Success 200) {String} status Success code
		 *
		 * @apiSuccessExample {json} Success response:
		 *     HTTPS 200 OK
		 *     [{"id":"5cff24117ceb7a138e5e7129","sku":"","price":1000,"stock_quantity":20,"weight":0,"options":[]}]
		 *
		 * @apiUse UnauthorizedError
		 */
		this.router.put(
			'/v1/products/:productId/variants/:variantId',
			security.checkRoleScope.bind(this, scopes.WRITE_PRODUCT),
			this.updateVariant.bind(this)
		);
		/**
		 * @api {delete} /v1/products/:productId/variants Delete Variant
		 * @apiVersion 1.0.0
		 * @apiName deleteVariant
		 * @apiGroup Products
		 * @apiPermission authenticated user
		 *
		 * @apiParam (Request param) {String} productId The productId
		 *
		 * @apiExample {js} Example usage:
		 * Request URL: http://localhost:3001/api/v1/products/5cff1d167ceb7a138e5e7123/variants/5cff24117ceb7a138e5e7129
		 *
		 * @apiSuccess (Success 200) {String} status Success code
		 *
		 * @apiSuccessExample {json} Success response:
		 *     HTTPS 200 OK
		 *
		 * @apiUse UnauthorizedError
		 */
		this.router.delete(
			'/v1/products/:productId/variants/:variantId',
			security.checkRoleScope.bind(this, scopes.WRITE_PRODUCT),
			this.deleteVariant.bind(this)
		);
		/**
		 * @api {put} /v1/products/:productId/variants/:variantId/options Set Variant Option
		 * @apiVersion 1.0.0
		 * @apiName setVariantOption
		 * @apiGroup Products
		 * @apiPermission authenticated user
		 *
		 * @apiParam (Request param) {String} productId The productId
		 * @apiParam (Request param) {String} variantId The variantId
		 * @apiParam (Request body) {String} option_id The option id
		 * @apiParam (Request body) {String} value_id The value id
		 *
		 * @apiExample {js} Example request payload:
		 * {"option_id":"5cff1fc57ceb7a138e5e7125","value_id":"5cff20d07ceb7a138e5e7127"}
		 *
		 * @apiSuccess (Success 200) {String} status Success code
		 *
		 * @apiSuccessExample {json} Success response:
		 *     HTTPS 200 OK
		 *     [{"id":"5cff26ad7ceb7a138e5e712a","sku":"","price":1000,"stock_quantity":0,"weight":0,"options":[{"option_id":"5cff1fc57ceb7a138e5e7125","value_id":"5cff20d07ceb7a138e5e7127"}]}]
		 *
		 * @apiUse UnauthorizedError
		 */
		this.router.put(
			'/v1/products/:productId/variants/:variantId/options',
			security.checkRoleScope.bind(this, scopes.WRITE_PRODUCT),
			this.setVariantOption.bind(this)
		);
	}

	getProducts(req, res, next) {
		ProductsService.getProducts(req.get('x-tenant-id'), req.query)
			.then(data => {
				res.send(data);
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

	addProduct(req, res, next) {
		ProductsService.addProduct(req.get('x-tenant-id'), req.body)
			.then(data => {
				res.send(data);
			})
			.catch(next);
	}

	updateProduct(req, res, next) {
		ProductsService.updateProduct(
			req.get('x-tenant-id'),
			req.params.productId,
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

	deleteProduct(req, res, next) {
		ProductsService.deleteProduct(req.params.productId)
			.then(data => {
				res.status(data ? 200 : 404).end();
			})
			.catch(next);
	}

	getImages(req, res, next) {
		ProductImagesService.getImages(req.get('x-tenant-id'), req.params.productId)
			.then(data => {
				res.send(data);
			})
			.catch(next);
	}

	async addImage(req, res, next) {
		await ProductImagesService.addImage(req, res, next);
	}

	updateImage(req, res, next) {
		ProductImagesService.updateImage(
			req.params.productId,
			req.params.imageId,
			req.body
		).then(data => {
			res.end();
		});
	}

	deleteImage(req, res, next) {
		ProductImagesService.deleteImage(
			req.get('x-tenant-id'),
			req.params.productId,
			req.params.imageId
		).then(data => {
			res.end();
		});
	}

	isSkuExists(req, res, next) {
		ProductsService.isSkuExists(req.query.sku, req.params.productId)
			.then(exists => {
				res.status(exists ? 200 : 404).end();
			})
			.catch(next);
	}

	isSlugExists(req, res, next) {
		ProductsService.isSlugExists(req.query.slug, req.params.productId)
			.then(exists => {
				res.status(exists ? 200 : 404).end();
			})
			.catch(next);
	}

	getOptions(req, res, next) {
		ProductOptionsService.getOptions(req.params.productId)
			.then(data => {
				res.send(data);
			})
			.catch(next);
	}

	getSingleOption(req, res, next) {
		ProductOptionsService.getSingleOption(
			req.params.productId,
			req.params.optionId
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

	addOption(req, res, next) {
		ProductOptionsService.addOption(req.params.productId, req.body)
			.then(data => {
				res.send(data);
			})
			.catch(next);
	}

	updateOption(req, res, next) {
		ProductOptionsService.updateOption(
			req.params.productId,
			req.params.optionId,
			req.body
		)
			.then(data => {
				res.send(data);
			})
			.catch(next);
	}

	deleteOption(req, res, next) {
		ProductOptionsService.deleteOption(
			req.params.productId,
			req.params.optionId
		)
			.then(data => {
				res.send(data);
			})
			.catch(next);
	}

	getOptionValues(req, res, next) {
		ProductOptionValuesService.getOptionValues(
			req.params.productId,
			req.params.optionId
		)
			.then(data => {
				res.send(data);
			})
			.catch(next);
	}

	getSingleOptionValue(req, res, next) {
		ProductOptionValuesService.getSingleOptionValue(
			req.params.productId,
			req.params.optionId,
			req.params.valueId
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

	addOptionValue(req, res, next) {
		ProductOptionValuesService.addOptionValue(
			req.params.productId,
			req.params.optionId,
			req.body
		)
			.then(data => {
				res.send(data);
			})
			.catch(next);
	}

	updateOptionValue(req, res, next) {
		ProductOptionValuesService.updateOptionValue(
			req.params.productId,
			req.params.optionId,
			req.params.valueId,
			req.body
		)
			.then(data => {
				res.send(data);
			})
			.catch(next);
	}

	deleteOptionValue(req, res, next) {
		ProductOptionValuesService.deleteOptionValue(
			req.params.productId,
			req.params.optionId,
			req.params.valueId
		)
			.then(data => {
				res.send(data);
			})
			.catch(next);
	}

	getVariants(req, res, next) {
		ProductVariantsService.getVariants(req.params.productId)
			.then(data => {
				res.send(data);
			})
			.catch(next);
	}

	addVariant(req, res, next) {
		ProductVariantsService.addVariant(req.params.productId, req.body)
			.then(data => {
				res.send(data);
			})
			.catch(next);
	}

	updateVariant(req, res, next) {
		ProductVariantsService.updateVariant(
			req.params.productId,
			req.params.variantId,
			req.body
		)
			.then(data => {
				res.send(data);
			})
			.catch(next);
	}

	deleteVariant(req, res, next) {
		ProductVariantsService.deleteVariant(
			req.params.productId,
			req.params.variantId
		)
			.then(data => {
				res.send(data);
			})
			.catch(next);
	}

	setVariantOption(req, res, next) {
		ProductVariantsService.setVariantOption(
			req.params.productId,
			req.params.variantId,
			req.body
		)
			.then(data => {
				res.send(data);
			})
			.catch(next);
	}
}

export default ProductsRoute;
