import api from './api';
import {
	getParsedProductFilter,
	getProductFilterForCategory,
	getProductFilterForSearch
} from '../shared/actions';
import * as themeLocales from './themeLocales';
import {
	SYSTEM_PAGE,
	PAGE,
	PRODUCT_CATEGORY,
	PRODUCT,
	RESERVED,
	SEARCH
} from '../shared/pageTypes';
import utils from '../shared/lib/utils';

const PRODUCT_FIELDS =
	'path,id,name,category_id,category_ids,category_name,sku,images,enabled,discontinued,stock_status,stock_quantity,price,on_sale,regular_price,attributes,tags,position';
const CATEGORIES_FIELDS =
	'image,name,description,meta_description,meta_title,sort,parent_id,position,slug,id';

const getCurrentPage = (tenantUrlName, locale, path) => {
	return api.public.sitemap
		.retrieve({
			tenantUrlName: tenantUrlName,
			path: path,
			enabled: true,
			locale: locale
		})
		.then(sitemapResponse => {
			if (sitemapResponse.status === 200) {
				return sitemapResponse.json;
			} else if (sitemapResponse.status === 404) {
				return {
					type: 404,
					path: path,
					resource: null
				};
			} else {
				return Promise.reject(`Page response code = ${sitemapResponse.status}`);
			}
		});
};

const getProducts = productFilter => {
	let filter = getParsedProductFilter(productFilter);
	return api.public.products.list(filter).then(({ status, json }) => json);
};

const getProduct = currentPage => {
	if (currentPage.type === PRODUCT) {
		return api.public.products
			.retrieve(currentPage.resource)
			.then(({ status, json }) => json);
	} else {
		return {};
	}
};

const getPage = currentPage => {
	if (currentPage.type === PAGE) {
		return api.public.pages
			.retrieve(currentPage.resource)
			.then(({ status, json }) => json);
	} else {
		return {};
	}
};

const getThemeSettings = () => {
	return api.public.theme.settings
		.retrieve()
		.then(({ status, json }) => json)
		.catch(err => ({}));
};

const getAllData = (currentPage, productFilter, cookie) => {
	return Promise.all([
		api.public.productCategories
			.list({ enabled: true, fields: CATEGORIES_FIELDS })
			.then(({ status, json }) => json),
		api.public.cart
			.retrieve(cookie)
			.then(cartResponse =>
				cartResponse ? utils.fillCartItems(api, cartResponse) : null
			),
		getProducts(productFilter),
		getProduct(currentPage),
		getPage(currentPage),
		getThemeSettings()
	]).then(
		([categories, cartResponse, products, product, page, themeSettings]) => {
			let categoryDetails = null;
			if (currentPage.type === PRODUCT_CATEGORY) {
				categoryDetails = categories.find(c => c.id === currentPage.resource);
			}
			return {
				categories,
				cart: cartResponse.json,
				products,
				product,
				page,
				categoryDetails,
				themeSettings
			};
		}
	);
};

const getState = (currentPage, settings, allData, location, productFilter) => {
	const {
		categories,
		cart,
		products,
		product,
		page,
		categoryDetails,
		themeSettings
	} = allData;

	let productsTotalCount = 0;
	let productsHasMore = false;
	let productsMinPrice = 0;
	let productsMaxPrice = 0;
	let productsAttributes = [];

	if (products) {
		productsTotalCount = products.total_count;
		productsHasMore = products.has_more;
		productsAttributes = products.attributes;

		if (products.price) {
			productsMinPrice = products.price.min;
			productsMaxPrice = products.price.max;
		}
	}

	const state = {
		app: {
			settings: settings,
			location: location,
			currentPage: currentPage,
			pageDetails: page,
			categoryDetails: categoryDetails,
			productDetails: product,
			categories: categories,
			products: products && products.data ? products.data : [],
			productsTotalCount: productsTotalCount,
			productsHasMore: productsHasMore,
			productsMinPrice: productsMinPrice,
			productsMaxPrice: productsMaxPrice,
			productsAttributes: productsAttributes,
			paymentMethods: [],
			shippingMethods: [],
			loadingProducts: false,
			loadingMoreProducts: false,
			loadingShippingMethods: false,
			loadingPaymentMethods: false,
			processingCheckout: false,
			productFilter: {
				onSale: null,
				search: productFilter.search || '',
				categoryId: productFilter.categoryId,
				priceFrom: productFilter.priceFrom || 0,
				priceTo: productFilter.priceTo || 0,
				attributes: productFilter.attributes,
				sort: settings.default_product_sorting,
				fields:
					settings.product_fields && settings.product_fields !== ''
						? settings.product_fields
						: PRODUCT_FIELDS,
				limit:
					settings.products_limit && settings.products_limit !== 0
						? settings.products_limit
						: 30
			},
			cart: cart,
			order: null,
			themeSettings: themeSettings,
			discount: null,
			discountError: null
		}
	};

	return state;
};

const getFilter = (currentPage, urlQuery, settings) => {
	let productFilter = {
		sort: settings.default_product_sorting
	};

	if (currentPage.type === PRODUCT_CATEGORY) {
		productFilter = getProductFilterForCategory(urlQuery);
		productFilter.categoryId = currentPage.resource;
	} else if (currentPage.type === SEARCH) {
		productFilter = getProductFilterForSearch(urlQuery);
	}

	productFilter.fields =
		settings.product_fields && settings.product_fields !== ''
			? settings.product_fields
			: PRODUCT_FIELDS;
	productFilter.limit =
		settings.products_limit && settings.products_limit !== 0
			? settings.products_limit
			: 30;

	return productFilter;
};

export const loadState = req => {
	const cookie = req.get('cookie');
	const urlPath = req.path;
	const urlQuery = req.url.includes('?')
		? req.url.substring(req.url.indexOf('?'))
		: '';
	const location = {
		hasHistory: false,
		pathname: urlPath,
		search: urlQuery,
		hash: ''
	};
	const tenantUrlName = req.params.tenantUrlName;
	const locale = req.params.locale;
	return Promise.all([
		getCurrentPage(tenantUrlName, locale, req.path),
		api.public.settings.retrieve().then(({ status, json }) => json),
		themeLocales.getText(locale),
		api.public.theme.placeholders.list()
	]).then(([currentPage, settings, themeText, placeholdersResponse]) => {
		const productFilter = getFilter(currentPage, urlQuery, settings);

		return getAllData(currentPage, productFilter, cookie).then(allData => {
			const state = getState(
				currentPage,
				settings,
				allData,
				location,
				productFilter
			);
			return {
				state: state,
				themeText: themeText,
				placeholders: placeholdersResponse.json
			};
		});
	});
};
