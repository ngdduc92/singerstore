import * as t from './actionTypes';

const initialState = {
	editTenant: null,
	items: [],
	selected: [],
	hasMore: false,
	totalCount: 0,

	isUpdating: false,
	loadingItems: false,
	uploadingImages: false,

	errorFetchEdit: null,
	errorLoadingItems: null,
	errorUpdate: null,

	filter: {
		search: '',
		enabled: null
	},
	isCreating: false,
	createTenant: null
};

export default (state = initialState, action) => {
	switch (action.type) {
		case t.TENANT_DETAIL_REQUEST:
			return Object.assign({}, state, {});
		case t.TENANT_DETAIL_RECEIVE:
			return Object.assign({}, state, {
				editTenant: action.item
			});
		case t.TENANT_DETAIL_ERASE:
			return Object.assign({}, state, {
				isUpdating: false,
				editTenant: null
			});
		case t.TENANT_DETAIL_FAILURE:
			return Object.assign({}, state, {
				errorFetchEdit: action.error
			});
		case t.TENANTS_REQUEST:
			return Object.assign({}, state, {
				loadingItems: true
			});
		case t.TENANTS_RECEIVE:
			return Object.assign({}, state, {
				loadingItems: false,
				hasMore: action.has_more,
				totalCount: action.total_count,
				items: action.data
			});
		case t.TENANTS_FAILURE:
			return Object.assign({}, state, {
				errorLoadingItems: action.error
			});
		case t.TENANTS_SELECT:
			return Object.assign({}, state, {
				selected: [...state.selected, action.tenantId]
			});
		case t.TENANTS_DESELECT:
			return Object.assign({}, state, {
				selected: state.selected.filter(id => id !== action.tenantId)
			});
		case t.TENANTS_DESELECT_ALL:
			return Object.assign({}, state, {
				selected: []
			});
		case t.TENANTS_SELECT_ALL:
			let selected = state.items.map(item => item.id);
			return Object.assign({}, state, {
				selected: selected
			});
		case t.TENANTS_SET_FILTER:
			const newFilter = Object.assign({}, state.filter, action.filter);
			return Object.assign({}, state, {
				filter: newFilter
			});
		case t.TENANTS_MORE_REQUEST:
			return Object.assign({}, state, {
				loadingItems: true
			});
		case t.TENANTS_MORE_RECEIVE:
			return Object.assign({}, state, {
				loadingItems: false,
				hasMore: action.has_more,
				totalCount: action.total_count,
				items: [...state.items, ...action.data]
			});
		case t.TENANT_UPDATE_REQUEST:
			return Object.assign({}, state, {
				isUpdating: true
			});
		case t.TENANT_UPDATE_FAILURE:
		case t.TENANT_UPDATE_SUCCESS:
			return Object.assign({}, state, {
				isUpdating: false,
				editTenant: action.item
			});
		case t.TENANT_DELETE_SUCCESS:
		case t.TENANT_CREATE_REQUEST:
			return Object.assign({}, state, {
				isCreating: true
			});
		case t.TENANT_CREATE_FAILURE:
		case t.TENANT_CREATE_SUCCESS:
			return Object.assign({}, state, {
				isCreating: false,
				createTenant: action.item
			});
		case t.TENANT_DETAIL_ERASE:
			return Object.assign({}, state, {
				isCreating: false,
				createTenant: null
			});
		default:
			return state;
	}
};
