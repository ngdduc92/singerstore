import queryString from 'query-string';
import { getJSONLD } from './lib/jsonld';
import {
	fetchCart,
	addCartItem,
	deleteCartItem,
	updateCartItemQuantity,
	fetchMoreProducts,
	setSort,
	fetchShippingMethods,
	fetchPaymentMethods,
	updateCart,
	checkout,
	resetPassword,
	activeAccount,
	fetchUser,
	updateUser,
	applyDiscount,
	fetchProducts
} from './actions';

const setQuery = (history, query) => {
	if (history && history.location) {
		const newLocation =
			history.location.pathname + '?' + queryString.stringify(query);
		history.push(newLocation);
	}
};

export const mapStateToProps = (state, ownProps) => {
	return {
		state: state.app
	};
};

export const mapDispatchToProps = (dispatch, ownProps) => {
	return {
		fetchCart: () => {
			dispatch(fetchCart());
		},
		addCartItem: (email, item) => {
			dispatch(addCartItem(email, item));
		},
		deleteCartItem: item_id => {
			dispatch(deleteCartItem(item_id));
		},
		updateCartItemQuantity: (item_id, quantity) => {
			dispatch(updateCartItemQuantity(item_id, quantity));
		},
		updateCart: (data, callback) => {
			dispatch(updateCart(data, callback));
		},
		checkout: data => {
			dispatch(checkout(data, ownProps.history));
		},
		loadMoreProducts: () => {
			dispatch(fetchMoreProducts());
		},
		loadShippingMethods: () => {
			dispatch(fetchShippingMethods());
		},
		loadPaymentMethods: () => {
			dispatch(fetchPaymentMethods());
		},
		setSearch: search => {
			const query = queryString.parse(ownProps.history.location.search);
			query.search = search;
			setQuery(ownProps.history, query);
		},
		setSort: sort => {
			dispatch(setSort(sort));
		},
		setPriceFromAndTo: (priceFrom, priceTo) => {
			const query = queryString.parse(ownProps.history.location.search);
			query.price_from = priceFrom;
			query.price_to = priceTo;
			setQuery(ownProps.history, query);
		},
		setPriceFrom: priceFrom => {
			const query = queryString.parse(ownProps.history.location.search);
			query.price_from = priceFrom;
			setQuery(ownProps.history, query);
		},
		setPriceTo: priceTo => {
			const query = queryString.parse(ownProps.history.location.search);
			query.price_to = priceTo;
			setQuery(ownProps.history, query);
		},
		setFilterAttribute: (name, value) => {
			let query = queryString.parse(ownProps.history.location.search);
			const queryKey = `attributes.${name}`;

			if (query[queryKey]) {
				if (Array.isArray(query[queryKey])) {
					query[queryKey].push(value);
				} else {
					query[queryKey] = [query[queryKey], value];
				}
			} else {
				query[queryKey] = [value];
			}

			setQuery(ownProps.history, query);
		},
		unsetFilterAttribute: (name, value) => {
			let query = queryString.parse(ownProps.history.location.search);
			const queryKey = `attributes.${name}`;
			const values = query[queryKey];

			if (values) {
				if (Array.isArray(values)) {
					query[queryKey] = values.filter(v => v !== value);
				} else {
					query[queryKey] = undefined;
				}
			}

			setQuery(ownProps.history, query);
		},
		setLocation: path => {
			ownProps.history.push(path);
		},
		goBack: () => {
			if (ownProps.history.length > 0) {
				ownProps.history.goBack();
			}
		},
		getJSONLD: state => {
			return getJSONLD(state);
		},
		resetPassword: data => {
			dispatch(resetPassword(data));
		},
		activeAccount: () => {
			dispatch(activeAccount());
		},
		fetchUser: userId => {
			dispatch(fetchUser(userId));
		},
		updateUser: (userId, data) => {
			dispatch(updateUser(userId, data));
		},
		applyDiscount: code => {
			dispatch(applyDiscount(code));
		},
		fetchProducts: () => {
			dispatch(fetchProducts());
		}
	};
};
