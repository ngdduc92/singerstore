import * as t from './actionTypes';

const initialState = {
	editDiscount: null,
	items: [],
	selected: [],
	hasMore: false,
	totalCount: 0,
	types: [],

	isUpdating: false,
	loadingItems: false,

	errorFetchEdit: null,
	errorLoadingItems: null,
	errorUpdate: null,

	filter: {
		search: '',
		enabled: null
	},
	isCreating: false,
	createDiscount: null
};

export default (state = initialState, action) => {
	switch (action.type) {
		case t.DISCOUNT_DETAIL_REQUEST:
			return Object.assign({}, state, {});
		case t.DISCOUNT_DETAIL_RECEIVE:
			return Object.assign({}, state, {
				editDiscount: action.item
			});
		case t.DISCOUNT_DETAIL_ERASE:
			return Object.assign({}, state, {
				isUpdating: false,
				editDiscount: null
			});
		case t.DISCOUNT_DETAIL_FAILURE:
			return Object.assign({}, state, {
				errorFetchEdit: action.error
			});
		case t.DISCOUNTS_REQUEST:
			return Object.assign({}, state, {
				loadingItems: true
			});
		case t.DISCOUNTS_RECEIVE:
			return Object.assign({}, state, {
				loadingItems: false,
				hasMore: action.has_more,
				totalCount: action.total_count,
				items: action.data
			});
		case t.DISCOUNTS_FAILURE:
			return Object.assign({}, state, {
				errorLoadingItems: action.error
			});
		case t.DISCOUNTS_SELECT:
			return Object.assign({}, state, {
				selected: [...state.selected, action.discountId]
			});
		case t.DISCOUNTS_DESELECT:
			return Object.assign({}, state, {
				selected: state.selected.filter(id => id !== action.discountId)
			});
		case t.DISCOUNTS_DESELECT_ALL:
			return Object.assign({}, state, {
				selected: []
			});
		case t.DISCOUNTS_SELECT_ALL:
			let selected = state.items.map(item => item.id);
			return Object.assign({}, state, {
				selected: selected
			});
		case t.DISCOUNTS_SET_FILTER:
			const newFilter = Object.assign({}, state.filter, action.filter);
			return Object.assign({}, state, {
				filter: newFilter
			});
		case t.DISCOUNTS_MORE_REQUEST:
			return Object.assign({}, state, {
				loadingItems: true
			});
		case t.DISCOUNTS_MORE_RECEIVE:
			return Object.assign({}, state, {
				loadingItems: false,
				hasMore: action.has_more,
				totalCount: action.total_count,
				items: [...state.items, ...action.data]
			});
		case t.DISCOUNT_UPDATE_REQUEST:
			return Object.assign({}, state, {
				isUpdating: true
			});
		case t.DISCOUNT_UPDATE_FAILURE:
		case t.DISCOUNT_UPDATE_SUCCESS:
			return Object.assign({}, state, {
				isUpdating: false,
				editDiscount: action.item
			});
		case t.DISCOUNT_DELETE_SUCCESS:
		case t.DISCOUNT_CREATE_REQUEST:
			return Object.assign({}, state, {
				isCreating: true
			});
		case t.DISCOUNT_CREATE_FAILURE:
		case t.DISCOUNT_CREATE_SUCCESS:
			return Object.assign({}, state, {
				isCreating: false,
				createDiscount: action.item
			});
		case t.DISCOUNT_DETAIL_ERASE:
			return Object.assign({}, state, {
				isCreating: false,
				createDiscount: null
			});
		default:
			return state;
	}
};
