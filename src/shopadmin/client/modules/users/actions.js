import * as t from './actionTypes';
import api from 'lib/api';
import utils from '../../../../shopfront/shared/lib/utils';

function requestUser() {
	return {
		type: t.USER_DETAIL_REQUEST
	};
}

function receiveUser(item) {
	return {
		type: t.USER_DETAIL_RECEIVE,
		item
	};
}

function receiveUserError(error) {
	return {
		type: t.USER_DETAIL_FAILURE,
		error
	};
}

export function cancelUserEdit() {
	return {
		type: t.USER_DETAIL_ERASE
	};
}

export function cancelUserCreate() {
	return {
		type: t.USER_CREATE_ERASE
	};
}

function requestUsers() {
	return {
		type: t.USERS_REQUEST
	};
}

function requestMoreUsers() {
	return {
		type: t.USERS_MORE_REQUEST
	};
}

function receiveUsersMore({ has_more, total_count, data }) {
	return {
		type: t.USERS_MORE_RECEIVE,
		has_more,
		total_count,
		data
	};
}

function receiveUsers({ has_more, total_count, data }) {
	return {
		type: t.USERS_RECEIVE,
		has_more,
		total_count,
		data
	};
}

function receiveUsersError(error) {
	return {
		type: t.USERS_FAILURE,
		error
	};
}

export function selectUser(id) {
	return {
		type: t.USERS_SELECT,
		userId: id
	};
}

export function deselectUser(id) {
	return {
		type: t.USERS_DESELECT,
		userId: id
	};
}

export function deselectAllUser() {
	return {
		type: t.USERS_DESELECT_ALL
	};
}

export function selectAllUser() {
	return {
		type: t.USERS_SELECT_ALL
	};
}

export function setFilter(filter) {
	return {
		type: t.USERS_SET_FILTER,
		filter: filter
	};
}

function deleteUsersSuccess() {
	return {
		type: t.USER_DELETE_SUCCESS
	};
}

function requestUpdateUser() {
	return {
		type: t.USER_UPDATE_REQUEST
	};
}

function receiveUpdateUser(item) {
	return {
		type: t.USER_UPDATE_SUCCESS,
		item
	};
}

function errorUpdateUser(error) {
	return {
		type: t.USER_UPDATE_FAILURE,
		error
	};
}

function requestCreateUser() {
	return {
		type: t.USER_CREATE_REQUEST
	};
}

function receiveCreateUser(item) {
	return {
		type: t.USER_CREATE_SUCCESS,
		item
	};
}

function errorCreateUser(error) {
	return {
		type: t.USER_CREATE_FAILURE,
		error
	};
}

const getFilter = (state, offset = 0) => {
	const searchTerm = state.users.filter.search;

	let filter = {
		limit: 50,
		search: searchTerm,
		offset: offset
	};

	return filter;
};

export function fetchUsers() {
	return (dispatch, getState) => {
		const state = getState();
		if (state.users.loadingItems) {
			// do nothing
		} else {
			dispatch(requestUsers());
			dispatch(deselectAllUser());

			let filter = getFilter(state);

			return api.users
				.list(filter)
				.then(({ status, json }) => {
					const items = [];
					items['data'] = json.data.filter(
						item => item.id !== utils.decrypt(localStorage.getItem('user_id'))
					);
					dispatch(receiveUsers(items));
				})
				.catch(error => {
					dispatch(receiveUsersError(error));
				});
		}
	};
}

export function fetchMoreUsers() {
	return (dispatch, getState) => {
		const state = getState();
		if (!state.users.loadingItems) {
			dispatch(requestMoreUsers());

			const offset = state.users.items.length;
			let filter = getFilter(state, offset);

			return api.users
				.list(filter)
				.then(({ status, json }) => {
					dispatch(receiveUsersMore(json));
				})
				.catch(error => {
					dispatch(receiveUsersError(error));
				});
		}
	};
}

export function deleteCurrentUser() {
	return (dispatch, getState) => {
		const state = getState();
		let user = state.users.editUser;
		if (user && user.id) {
			return api.users
				.delete(user.id)
				.then(() => {})
				.catch(err => {
					console.log(err);
				});
		}
	};
}

export function deleteUsers() {
	return (dispatch, getState) => {
		const state = getState();
		let promises = state.users.selected.map(id => api.users.delete(id));

		return Promise.all(promises)
			.then(values => {
				dispatch(deleteUsersSuccess());
				dispatch(deselectAllUser());
				dispatch(fetchUsers());
			})
			.catch(err => {
				console.log(err);
			});
	};
}

export function updateUser(data) {
	return (dispatch, getState) => {
		dispatch(requestUpdateUser());
		return api.users
			.update(data.id, data)
			.then(({ status, json }) => {
				dispatch(receiveUpdateUser(json));
			})
			.catch(error => {
				dispatch(errorUpdateUser(error));
			});
	};
}

export function createUser(data, history) {
	return (dispatch, getState) => {
		dispatch(requestCreateUser());
		const tenantUrlName = localStorage.getItem('tenant_url_name');
		const locale = location.pathname.split('/')[2];
		return api.users
			.create(data)
			.then(({ status, json }) => {
				dispatch(receiveCreateUser(json));
				history.push(`/${tenantUrlName}/${locale}/admin/users`);
			})
			.catch(error => {
				dispatch(errorCreateUser(error));
			});
	};
}

export function fetchUser(id) {
	return (dispatch, getState) => {
		dispatch(requestUser());

		return api.users
			.retrieve(id)
			.then(({ status, json }) => {
				dispatch(receiveUser(json));
			})
			.catch(error => {
				dispatch(receiveUserError(error));
			});
	};
}
