import * as t from './actionTypes';

const initialState = {
	editUser: null,
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
	createUser: null
};

export default (state = initialState, action) => {
	switch (action.type) {
		case t.USER_DETAIL_REQUEST:
			return Object.assign({}, state, {});
		case t.USER_DETAIL_RECEIVE:
			return Object.assign({}, state, {
				editUser: action.item
			});
		case t.USER_DETAIL_ERASE:
			return Object.assign({}, state, {
				isUpdating: false,
				editUser: null
			});
		case t.USER_DETAIL_FAILURE:
			return Object.assign({}, state, {
				errorFetchEdit: action.error
			});
		case t.USERS_REQUEST:
			return Object.assign({}, state, {
				loadingItems: true
			});
		case t.USERS_RECEIVE:
			return Object.assign({}, state, {
				loadingItems: false,
				hasMore: action.has_more,
				totalCount: action.total_count,
				items: action.data
			});
		case t.USERS_FAILURE:
			return Object.assign({}, state, {
				errorLoadingItems: action.error
			});
		case t.USERS_SELECT:
			return Object.assign({}, state, {
				selected: [...state.selected, action.userId]
			});
		case t.USERS_DESELECT:
			return Object.assign({}, state, {
				selected: state.selected.filter(id => id !== action.userId)
			});
		case t.USERS_DESELECT_ALL:
			return Object.assign({}, state, {
				selected: []
			});
		case t.USERS_SELECT_ALL:
			let selected = state.items.map(item => item.id);
			return Object.assign({}, state, {
				selected: selected
			});
		case t.USERS_SET_FILTER:
			const newFilter = Object.assign({}, state.filter, action.filter);
			return Object.assign({}, state, {
				filter: newFilter
			});
		case t.USERS_MORE_REQUEST:
			return Object.assign({}, state, {
				loadingItems: true
			});
		case t.USERS_MORE_RECEIVE:
			return Object.assign({}, state, {
				loadingItems: false,
				hasMore: action.has_more,
				totalCount: action.total_count,
				items: [...state.items, ...action.data]
			});
		case t.USER_UPDATE_REQUEST:
			return Object.assign({}, state, {
				isUpdating: true
			});
		case t.USER_UPDATE_FAILURE:
		case t.USER_UPDATE_SUCCESS:
			return Object.assign({}, state, {
				isUpdating: false,
				editUser: action.item
			});
		case t.USER_DELETE_SUCCESS:
		case t.USER_CREATE_REQUEST:
			return Object.assign({}, state, {
				isCreating: true
			});
		case t.USER_CREATE_FAILURE:
		case t.USER_CREATE_SUCCESS:
			return Object.assign({}, state, {
				isCreating: false,
				createUser: action.item
			});
		case t.USER_DETAIL_ERASE:
			return Object.assign({}, state, {
				isCreating: false,
				createUser: null
			});
		default:
			return state;
	}
};
