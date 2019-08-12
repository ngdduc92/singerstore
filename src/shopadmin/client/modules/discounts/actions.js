import * as t from './actionTypes';
import api from 'lib/api';

function requestDiscount() {
	return {
		type: t.DISCOUNT_DETAIL_REQUEST
	};
}

function receiveDiscount(item) {
	return {
		type: t.DISCOUNT_DETAIL_RECEIVE,
		item
	};
}

function receiveDiscountError(error) {
	return {
		type: t.DISCOUNT_DETAIL_FAILURE,
		error
	};
}

export function cancelDiscountEdit() {
	return {
		type: t.DISCOUNT_DETAIL_ERASE
	};
}

export function cancelDiscountCreate() {
	return {
		type: t.DISCOUNT_CREATE_ERASE
	};
}

function requestDiscounts() {
	return {
		type: t.DISCOUNTS_REQUEST
	};
}

function requestMoreDiscounts() {
	return {
		type: t.DISCOUNTS_MORE_REQUEST
	};
}

function receiveDiscountsMore({ has_more, total_count, data }) {
	return {
		type: t.DISCOUNTS_MORE_RECEIVE,
		has_more,
		total_count,
		data
	};
}

function receiveDiscounts({ has_more, total_count, data }) {
	return {
		type: t.DISCOUNTS_RECEIVE,
		has_more,
		total_count,
		data
	};
}

function receiveDiscountsError(error) {
	return {
		type: t.DISCOUNTS_FAILURE,
		error
	};
}

export function selectDiscount(id) {
	return {
		type: t.DISCOUNTS_SELECT,
		discountId: id
	};
}

export function deselectDiscount(id) {
	return {
		type: t.DISCOUNTS_DESELECT,
		discountId: id
	};
}

export function deselectAllDiscount() {
	return {
		type: t.DISCOUNTS_DESELECT_ALL
	};
}

export function selectAllDiscount() {
	return {
		type: t.DISCOUNTS_SELECT_ALL
	};
}

export function setFilter(filter) {
	return {
		type: t.DISCOUNTS_SET_FILTER,
		filter: filter
	};
}

function deleteDiscountsSuccess() {
	return {
		type: t.DISCOUNT_DELETE_SUCCESS
	};
}

function requestUpdateDiscount() {
	return {
		type: t.DISCOUNT_UPDATE_REQUEST
	};
}

function receiveUpdateDiscount(item) {
	return {
		type: t.DISCOUNT_UPDATE_SUCCESS,
		item
	};
}

function errorUpdateDiscount(error) {
	return {
		type: t.DISCOUNT_UPDATE_FAILURE,
		error
	};
}

function requestCreateDiscount() {
	return {
		type: t.DISCOUNT_CREATE_REQUEST
	};
}

function receiveCreateDiscount(item) {
	return {
		type: t.DISCOUNT_CREATE_SUCCESS,
		item
	};
}

function errorCreateDiscount(error) {
	return {
		type: t.DISCOUNT_CREATE_FAILURE,
		error
	};
}

const getFilter = (state, offset = 0) => {
	const searchTerm = state.discounts.filter.search;

	let filter = {
		limit: 50,
		search: searchTerm,
		offset: offset
	};

	return filter;
};

export function fetchDiscounts() {
	return (dispatch, getState) => {
		const state = getState();
		if (state.discounts.loadingItems) {
			// do nothing
		} else {
			dispatch(requestDiscounts());
			dispatch(deselectAllDiscount());

			let filter = getFilter(state);

			return api.discounts
				.list(filter)
				.then(({ status, json }) => {
					dispatch(receiveDiscounts(json));
					dispatch(fetchDiscountTypes());
				})
				.catch(error => {
					dispatch(receiveDiscountsError(error));
				});
		}
	};
}

export function fetchMoreDiscounts() {
	return (dispatch, getState) => {
		const state = getState();
		if (!state.discounts.loadingItems) {
			dispatch(requestMoreDiscounts());

			const offset = state.discounts.items.length;
			let filter = getFilter(state, offset);

			return api.discounts
				.list(filter)
				.then(({ status, json }) => {
					dispatch(receiveDiscountsMore(json));
				})
				.catch(error => {
					dispatch(receiveDiscountsError(error));
				});
		}
	};
}

export function deleteCurrentDiscount() {
	return (dispatch, getState) => {
		const state = getState();
		let discount = state.discounts.editDiscount;
		if (discount && discount.id) {
			return api.discounts
				.delete(discount.id)
				.then(() => {})
				.catch(err => {
					console.log(err);
				});
		}
	};
}

export function deleteDiscounts() {
	return (dispatch, getState) => {
		const state = getState();
		let promises = state.discounts.selected.map(id => api.discounts.delete(id));

		return Promise.all(promises)
			.then(values => {
				dispatch(deleteDiscountsSuccess());
				dispatch(deselectAllDiscount());
				dispatch(fetchDiscounts());
			})
			.catch(err => {
				console.log(err);
			});
	};
}

export function updateDiscount(data) {
	return (dispatch, getState) => {
		dispatch(requestUpdateDiscount());
		return api.discounts
			.update(data.id, data)
			.then(({ status, json }) => {
				dispatch(receiveUpdateDiscount(json));
			})
			.catch(error => {
				dispatch(errorUpdateDiscount(error));
			});
	};
}

export function createDiscount(data, history) {
	return (dispatch, getState) => {
		dispatch(requestCreateDiscount());
		const tenantUrlName = localStorage.getItem('tenant_url_name');
		const locale = location.pathname.split('/')[2];
		return api.discounts
			.create(data)
			.then(({ status, json }) => {
				dispatch(receiveCreateDiscount(json));
				history.push(`/${tenantUrlName}/${locale}/admin/discounts`);
			})
			.catch(error => {
				dispatch(errorCreateDiscount(error));
			});
	};
}

export function fetchDiscount(id) {
	return (dispatch, getState) => {
		dispatch(requestDiscount());

		return api.discounts
			.retrieve(id)
			.then(({ status, json }) => {
				dispatch(receiveDiscount(json));
			})
			.catch(error => {
				dispatch(receiveDiscountError(error));
			});
	};
}
