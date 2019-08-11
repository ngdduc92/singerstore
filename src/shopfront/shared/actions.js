import * as t from './actionTypes';
import {
	PAGE,
	PRODUCT_CATEGORY,
	PRODUCT,
	RESERVED,
	SEARCH,
	SYSTEM_PAGE
} from './pageTypes';
import queryString from 'query-string';
import { animateScroll } from 'react-scroll';
import api from '../client/api';
import * as analytics from './analytics';
import utils from './lib/utils';

const PRODUCT_FIELDS =
	'path,id,name,category_id,category_ids,category_name,sku,images,enabled,discontinued,stock_status,stock_quantity,price,on_sale,regular_price,attributes,tags,position';

const getLiApi = () => {
	const token = localStorage.getItem('token');
	if (token) {
		api.setToken(utils.decrypt(token));
	}
	const tenantId = localStorage.getItem('tenant_id');
	if (tenantId) {
		api.setTenantId(utils.decrypt(tenantId));
	}
	return api;
};

const getPublicApi = () => {
	const tenantId = localStorage.getItem('tenant_id');
	if (tenantId) {
		api.setTenantId(utils.decrypt(tenantId));
	}
	const pApi = api.public;
	return pApi;
};

const requestProduct = () => ({ type: t.PRODUCT_REQUEST });

const receiveProduct = product => ({ type: t.PRODUCT_RECEIVE, product });

export const fetchProducts = () => async (dispatch, getState) => {
	dispatch(requestProducts());
	const { app } = getState();
	const filter = getParsedProductFilter(app.productFilter);
	const pApi = getPublicApi();
	const response = await pApi.products.list(filter);
	const products = response.json;
	dispatch(receiveProducts(null));
	dispatch(receiveProducts(products));
};

export const getProductFilterForCategory = locationSearch => {
	const queryFilter = queryString.parse(locationSearch);

	let attributes = {};
	for (const querykey in queryFilter) {
		if (querykey.startsWith('attributes.')) {
			attributes[querykey] = queryFilter[querykey];
		}
	}

	return {
		priceFrom: parseInt(queryFilter.price_from || 0),
		priceTo: parseInt(queryFilter.price_to || 0),
		attributes: attributes,
		search: null
	};
};

export const getProductFilterForSearch = locationSearch => {
	const queryFilter = queryString.parse(locationSearch);

	return {
		categoryId: null,
		priceFrom: parseInt(queryFilter.price_from || 0),
		priceTo: parseInt(queryFilter.price_to || 0),
		search: queryFilter.search,
		sort: 'search'
	};
};

export const getParsedProductFilter = productFilter => {
	const filter = Object.assign(
		{},
		{
			on_sale: productFilter.onSale,
			search: productFilter.search,
			category_id: productFilter.categoryId,
			price_from: productFilter.priceFrom,
			price_to: productFilter.priceTo,
			sort: productFilter['sort'],
			fields: productFilter['fields'],
			limit: productFilter['limit'],
			offset: 0,
			enabled: true
		},
		productFilter.attributes
	);

	return filter;
};

const requestProducts = () => ({ type: t.PRODUCTS_REQUEST });

const receiveProducts = products => ({ type: t.PRODUCTS_RECEIVE, products });

export const fetchMoreProducts = () => async (dispatch, getState) => {
	const { app } = getState();
	if (
		app.loadingProducts ||
		app.loadingMoreProducts ||
		app.products.length === 0 ||
		!app.productsHasMore
	) {
		return;
	} else {
		dispatch(requestMoreProducts());

		const filter = getParsedProductFilter(app.productFilter);
		filter.offset = app.products.length;
		const pApi = getPublicApi();
		const response = await pApi.products.list(filter);
		const products = response.json;
		dispatch(receiveMoreProducts(products));
		animateScroll.scrollMore(200);
	}
};

const requestMoreProducts = () => ({ type: t.MORE_PRODUCTS_REQUEST });

const receiveMoreProducts = products => ({
	type: t.MORE_PRODUCTS_RECEIVE,
	products
});

const requestPage = () => ({ type: t.PAGE_REQUEST });

const receivePage = pageDetails => ({ type: t.PAGE_RECEIVE, pageDetails });

export const fetchCart = () => async (dispatch, getState) => {
	dispatch(requestCart());
	const liApi = getLiApi();
	if (liApi.token) {
		const response = await liApi.cart
			.retrieve(localStorage.getItem('email'))
			.then(cartResponse => utils.fillCartItems(liApi, cartResponse));
		dispatch(receiveCart(response.json));
	} else {
		dispatch(receiveCart(null));
	}
};

const requestCart = () => ({ type: t.CART_REQUEST });

const receiveCart = cart => ({ type: t.CART_RECEIVE, cart });

export const addCartItem = item => async (dispatch, getState) => {
	dispatch(requestAddCartItem());
	const liApi = getLiApi();
	const email = localStorage.getItem('email');
	let response = null;
	const cartResponse = await liApi.cart.retrieve(email);
	if (cartResponse.json) {
		response = await liApi.cart
			.createItem(item)
			.then(res => utils.fillCartItems(liApi, res));
	} else {
		const userId = utils.decrypt(localStorage.getItem('user_id'));
		let newCart = {
			cart: true,
			draft: false,
			shipping_address: {},
			email: email
		};
		response = await liApi.users
			.retrieve(userId)
			.then(res => {
				const userInfo = res.json;
				newCart.shipping_address.full_name = userInfo.full_name;
				newCart.shipping_address.country = userInfo.country;
				newCart.shipping_address.state = userInfo.state;
				newCart.shipping_address.city = userInfo.city;
				newCart.shipping_address.phone = userInfo.phone;
				newCart.shipping_address.address1 = userInfo.address1;
				newCart.shipping_address.address2 = userInfo.address2;
				newCart.mobile = userInfo.phone;
				return newCart;
			})
			.then(newCart => {
				return liApi.cart.create(newCart).then(res => {
					return liApi.cart
						.createItem(item)
						.then(cartResponse => utils.fillCartItems(liApi, cartResponse));
				});
			});
	}
	const cart = response.json;
	dispatch(receiveCart(cart));
	analytics.addCartItem({
		item: item,
		cart: cart
	});
};

const requestAddCartItem = () => ({ type: t.CART_ITEM_ADD_REQUEST });

export const updateCartItemQuantity = (itemId, quantity) => async (
	dispatch,
	getState
) => {
	dispatch(requestUpdateCartItemQuantity());
	const liApi = getLiApi();
	const data = {
		quantity: quantity
	};
	const response = await liApi.cart
		.updateItem(itemId, data)
		.then(cartResponse => utils.fillCartItems(liApi, cartResponse));
	dispatch(receiveCart(response.json));
	dispatch(fetchShippingMethods());
};

const requestUpdateCartItemQuantity = () => ({
	type: t.CART_ITEM_UPDATE_REQUEST
});

export const deleteCartItem = itemId => async (dispatch, getState) => {
	dispatch(requestDeleteCartItem());
	const { app } = getState();
	const liApi = getLiApi();
	const response = await liApi.cart
		.deleteItem(itemId)
		.then(cartResponse => utils.fillCartItems(liApi, cartResponse));
	dispatch(receiveCart(response.json));
	dispatch(fetchShippingMethods());
	analytics.deleteCartItem({
		itemId: itemId,
		cart: app.cart
	});
};

const requestDeleteCartItem = () => ({ type: t.CART_ITEM_DELETE_REQUEST });

export const fetchPaymentMethods = () => async (dispatch, getState) => {
	dispatch(requestPaymentMethods());
	const liApi = getLiApi();
	const cartResponse = await liApi.cart.retrieve(localStorage.getItem('email'));
	const cartId = cartResponse.json.id;
	const filter = {
		enabled: true,
		order_id: cartId
	};
	const response = await liApi.paymentMethods.list(filter);
	const methods = response.json.map(item => {
		delete item.conditions;
		return item;
	});
	dispatch(receivePaymentMethods(methods));
};

const requestPaymentMethods = () => ({ type: t.PAYMENT_METHODS_REQUEST });

const receivePaymentMethods = methods => ({
	type: t.PAYMENT_METHODS_RECEIVE,
	methods
});

export const fetchShippingMethods = () => async (dispatch, getState) => {
	dispatch(requestShippingMethods());
	const liApi = getLiApi();
	const cartResponse = await liApi.cart.retrieve(localStorage.getItem('email'));
	const cartId = cartResponse.json.id;
	const filter = {
		enabled: true,
		order_id: cartId
	};
	const response = await liApi.shippingMethods.list(filter);
	dispatch(receiveShippingMethods(response.json));
};

const requestShippingMethods = () => ({ type: t.SHIPPING_METHODS_REQUEST });

const receiveShippingMethods = methods => ({
	type: t.SHIPPING_METHODS_RECEIVE,
	methods
});

export const checkout = (cart, history) => async (dispatch, getState) => {
	dispatch(requestCheckout());
	const liApi = getLiApi();
	if (cart) {
		const data = {
			shipping_address: cart.shipping_address,
			billing_address: cart.billing_address,
			email: cart.email,
			mobile: cart.mobile,
			payment_method_id: cart.payment_method_id,
			shipping_method_id: cart.shipping_method_id,
			comments: cart.comments
		};
		if (data.shipping_address) {
			await liApi.cart.updateShippingAddress(data.shipping_address);
		}
		if (data.billing_address) {
			await liApi.cart.updateBillingAddress(data.billing_address);
		}
		await liApi.cart
			.update(data)
			.then(cartResponse => utils.fillCartItems(liApi, cartResponse));
	}

	const cartResponse = await liApi.cart
		.retrieve(localStorage.getItem('email'))
		.then(res => utils.fillCartItems(liApi, res));
	const chargeNeeded = !!cartResponse.json.payment_token;

	if (chargeNeeded) {
		const chargeResponse = await liApi.cart.client.post(`/v1/cart/charge`);
		const chargeSucceeded = chargeResponse.status === 200;
		if (!chargeSucceeded) {
			return;
		}
	}

	const response = await liApi.cart
		.checkout()
		.then(cartResponse => utils.fillCartItems(liApi, cartResponse));
	const order = response.json;
	dispatch(receiveCheckout(order));
	history.push(
		`/${localStorage.getItem('tenant_url_name')}/${
			location.pathname.split('/')[2]
		}/checkout-success`
	);
	analytics.checkoutSuccess({ order: order });
};

const requestCheckout = () => ({ type: t.CHECKOUT_REQUEST });

const receiveCheckout = order => ({ type: t.CHECKOUT_RECEIVE, order });

export const receiveSitemap = currentPage => ({
	type: t.SITEMAP_RECEIVE,
	currentPage
});

export const setCurrentLocation = location => ({
	type: t.LOCATION_CHANGED,
	location
});

export const setCategory = categoryId => (dispatch, getState) => {
	const { app } = getState();
	const category = app.categories.find(c => c.id === categoryId);
	if (category) {
		dispatch(setCurrentCategory(category));
		dispatch(setProductsFilter({ categoryId: categoryId }));
		dispatch(receiveProduct(null));
	}
};

const setCurrentCategory = category => ({
	type: t.SET_CURRENT_CATEGORY,
	category
});

export const setSort = sort => (dispatch, getState) => {
	dispatch(setProductsFilter({ sort: sort }));
	dispatch(fetchProducts());
};

const setProductsFilter = filter => ({
	type: t.SET_PRODUCTS_FILTER,
	filter: filter
});

export const analyticsSetShippingMethod = method_id => (dispatch, getState) => {
	const { app } = getState();
	analytics.setShippingMethod({
		methodId: method_id,
		allMethods: app.shippingMethods
	});
};

export const analyticsSetPaymentMethod = method_id => (dispatch, getState) => {
	const { app } = getState();
	analytics.setPaymentMethod({
		methodId: method_id,
		allMethods: app.paymentMethods
	});
};

export const updateCart = (data, callback) => async (dispatch, getState) => {
	const liApi = getLiApi();
	if (data.shipping_address) {
		await liApi.cart.updateShippingAddress(data.shipping_address);
	}
	if (data.billing_address) {
		await liApi.cart.updateBillingAddress(data.billing_address);
	}

	const response = await liApi.cart
		.update(data)
		.then(cartResponse => utils.fillCartItems(liApi, cartResponse));
	const newCart = response.json;
	dispatch(receiveCart(newCart));
	if (typeof callback === 'function') {
		callback(newCart);
	}
};

export const setCurrentPage = location => async (dispatch, getState) => {
	let locationPathname = '/404';
	let locationSearch = '';
	let locationHash = '';

	if (location) {
		locationPathname = location.pathname;
		locationSearch = location.search;
		locationHash = location.hash;
	}

	const { app } = getState();
	let statePathname = '/404';
	let stateSearch = '';
	let stateHash = '';

	if (app.location) {
		statePathname = app.location.pathname;
		stateSearch = app.location.search;
		stateHash = app.location.hash;
	}

	const currentPageAlreadyInState =
		statePathname === locationPathname && stateSearch === locationSearch;

	if (currentPageAlreadyInState) {
		// same page
	} else {
		dispatch(
			setCurrentLocation({
				hasHistory: true,
				pathname: locationPathname,
				search: locationSearch,
				hash: locationHash
			})
		);
		const tenantUrlName = locationPathname.split('/')[1];
		const locale = locationPathname.split('/')[2];
		const category = app.categories.find(
			c => `/${tenantUrlName}/${locale}${c.path}` === locationPathname
		);
		const pApi = getPublicApi();
		if (category) {
			const newCurrentPage = {
				type: 'product-category',
				path: category.path,
				resource: category.id
			};
			dispatch(receiveSitemap(newCurrentPage)); // remove .data
			dispatch(fetchDataOnCurrentPageChange(newCurrentPage));
		} else {
			const sitemapResponse = await pApi.sitemap.retrieve({
				tenantUrlName: tenantUrlName,
				path: locationPathname,
				locale: locale
			});
			let status = sitemapResponse.status;
			let json = sitemapResponse.json;
			if (status === 200) {
				if (json.type === 'product') {
					const productResponse = await pApi.products.retrieve(json.resource);
					if (productResponse.status === 404) {
						status = 404;
					} else {
						json.data = productResponse.json;
					}
				} else if (json.type === 'page') {
					const pageResponse = await pApi.pages.retrieve(json.resource);
					if (pageResponse.status === 404) {
						status = 404;
					} else {
						json.data = pageResponse.json;
					}
				}
			}
			if (status === 404) {
				dispatch(
					receiveSitemap({
						type: 404,
						path: locationPathname,
						resource: null
					})
				);
			} else {
				const newCurrentPage = json;
				dispatch(receiveSitemap(newCurrentPage));
				dispatch(fetchDataOnCurrentPageChange(newCurrentPage));
			}
		}
	}
};

const fetchDataOnCurrentPageChange = currentPage => (dispatch, getState) => {
	const { app } = getState();
	let productFilter = null;

	// clear product data
	dispatch(receiveProduct(null));

	analytics.pageView({
		path: currentPage.path,
		title: '-'
	});

	switch (currentPage.type) {
		case PRODUCT_CATEGORY:
			productFilter = getProductFilterForCategory(app.location.search);
			dispatch(setCategory(currentPage.resource));
			dispatch(setProductsFilter(productFilter));
			dispatch(fetchProducts());
			break;
		case SEARCH:
			productFilter = getProductFilterForSearch(app.location.search);
			dispatch(setProductsFilter(productFilter));
			dispatch(fetchProducts());
			analytics.search({ searchText: productFilter.search });
			break;
		case PRODUCT:
			const productData = currentPage.data;
			dispatch(receiveProduct(productData));
			analytics.productView({ product: productData });
			break;
		case PAGE:
			const pageData = currentPage.data;
			dispatch(receivePage(pageData));
			break;
		case SYSTEM_PAGE:
			if (
				currentPage.path ===
				`/${currentPage.path.split('/')[1]}/${
					currentPage.path.split('/')[2]
				}/checkout`
			) {
				analytics.checkoutView({ order: app.cart });
			} else {
				const pApi = getPublicApi();
				pApi.settings.retrieve().then(res => {
					const settings = res.json;
					productFilter = {
						categoryId: null,
						search: null,
						priceFrom: 0,
						priceTo: 0,
						sort: settings.default_product_sorting,
						fields:
							settings.product_fields && settings.product_fields !== ''
								? settings.product_fields
								: PRODUCT_FIELDS,
						limit:
							settings.products_limit && settings.products_limit !== 0
								? settings.products_limit
								: 30
					};
					dispatch(setProductsFilter(productFilter));
					dispatch(fetchProducts());
				});
			}
			break;
	}
};

const requestResetPassword = () => ({ type: t.RESET_PASSWORD_REQUEST });

const receiveResetPassword = resetPassword => ({
	type: t.RESET_PASSWORD_RECEIVE,
	resetPassword
});

const isTokenValid = token => {
	if (token) {
		const expiration_date =
			new Date(token.date_created).getTime() + 24 * 60 * 60 * 1000;
		return token.enabled && expiration_date > Date.now();
	} else {
		return false;
	}
};

export const resetPassword = data => async (dispatch, getState) => {
	dispatch(requestResetPassword());
	let res = null;
	const { app } = getState();
	const urlParams = new URLSearchParams(app.location.search);
	const tokenId = utils.decrypt(urlParams.get('token'));
	const pApi = getPublicApi();
	const tokenResponse = await pApi.getVerificationTokenById(tokenId);
	if (isTokenValid(tokenResponse.json)) {
		const userResponse = await pApi.updateUserPassword(
			tokenResponse.json.user_id,
			data
		);
		if (userResponse.status === 200) {
			pApi.disableVerificationToken(tokenId);
			res = { isSuccess: true, isToken: true };
		} else {
			res = { isSuccess: false, isToken: true };
		}
	} else {
		res = { isSuccess: false, isToken: false };
	}

	dispatch(receiveResetPassword(res));
};

const requestActiveAccount = () => ({ type: t.ACTIVE_ACCOUNT_REQUEST });

const receiveActiveAccount = activeAccount => ({
	type: t.ACTIVE_ACCOUNT_RECEIVE,
	activeAccount
});

export const activeAccount = () => async (dispatch, getState) => {
	dispatch(requestActiveAccount());
	let res = null;
	const { app } = getState();
	const urlParams = new URLSearchParams(app.location.search);
	const tokenId = utils.decrypt(urlParams.get('token'));
	const pApi = getPublicApi();
	const tokenResponse = await pApi.getVerificationTokenById(tokenId);
	if (isTokenValid(tokenResponse.json)) {
		const userResponse = await pApi.activeUserAccount(
			tokenResponse.json.user_id
		);
		if (userResponse.status === 200) {
			pApi.disableVerificationToken(tokenId);
			res = { isSuccess: true, isToken: true };
		} else {
			res = { isSuccess: false, isToken: true };
		}
	} else {
		res = { isSuccess: false, isToken: false };
	}

	dispatch(receiveActiveAccount(res));
};

const requestUser = () => ({ type: t.USER_REQUEST });

const receiveUser = user => ({
	type: t.USER_RECEIVE,
	user
});

export const fetchUser = userId => async (dispatch, getState) => {
	dispatch(requestUser());
	const liApi = getLiApi();
	const userResponse = await liApi.users.retrieve(userId);
	dispatch(receiveUser(userResponse.json));
};

export const updateUser = (userId, data) => async (dispatch, getState) => {
	dispatch(requestUser());
	const liApi = getLiApi();
	const userResponse = await liApi.users.update(userId, data);
	dispatch(receiveUser(userResponse.json));
};

export const applyDiscount = discountCode => async (dispatch, getState) => {
	dispatch(requestDiscount());
	if (discountCode) {
		const liApi = getLiApi();
		const cartResponse = await liApi.cart.retrieve(
			localStorage.getItem('email')
		);
		const cartId = cartResponse.json.id;
		const data = {
			code: discountCode,
			order_id: cartId
		};
		const response = await liApi.discounts
			.apply(data)
			.then(cartResponse => utils.fillCartItems(liApi, cartResponse));
		if (response.status === 200) {
			dispatch(receiveCart(response.json));
			dispatch(receiveDiscount(response.json.coupon));
		} else {
			dispatch(errorApplyDiscount(response.json.message));
		}
	} else {
		dispatch(errorApplyDiscount(null));
	}
};

const requestDiscount = () => ({ type: t.DISCOUNT_REQUEST });

const receiveDiscount = discount => ({ type: t.DISCOUNT_RECEIVE, discount });

const errorApplyDiscount = error => ({ type: t.DISCOUNT_APPLY_FAILURE, error });
