import * as t from './actionTypes';
import api from 'lib/api';
import utils from '../../../../shopfront/shared/lib/utils';

function requestTenant() {
	return {
		type: t.TENANT_DETAIL_REQUEST
	};
}

function receiveTenant(item) {
	return {
		type: t.TENANT_DETAIL_RECEIVE,
		item
	};
}

function receiveTenantError(error) {
	return {
		type: t.TENANT_DETAIL_FAILURE,
		error
	};
}

export function cancelTenantEdit() {
	return {
		type: t.TENANT_DETAIL_ERASE
	};
}

export function cancelTenantCreate() {
	return {
		type: t.TENANT_CREATE_ERASE
	};
}

function requestTenants() {
	return {
		type: t.TENANTS_REQUEST
	};
}

function requestMoreTenants() {
	return {
		type: t.TENANTS_MORE_REQUEST
	};
}

function receiveTenantsMore({ has_more, total_count, data }) {
	return {
		type: t.TENANTS_MORE_RECEIVE,
		has_more,
		total_count,
		data
	};
}

function receiveTenants({ has_more, total_count, data }) {
	return {
		type: t.TENANTS_RECEIVE,
		has_more,
		total_count,
		data
	};
}

function receiveTenantsError(error) {
	return {
		type: t.TENANTS_FAILURE,
		error
	};
}

export function selectTenant(id) {
	return {
		type: t.TENANTS_SELECT,
		tenantId: id
	};
}

export function deselectTenant(id) {
	return {
		type: t.TENANTS_DESELECT,
		tenantId: id
	};
}

export function deselectAllTenant() {
	return {
		type: t.TENANTS_DESELECT_ALL
	};
}

export function selectAllTenant() {
	return {
		type: t.TENANTS_SELECT_ALL
	};
}

export function setFilter(filter) {
	return {
		type: t.TENANTS_SET_FILTER,
		filter: filter
	};
}

function deleteTenantsSuccess() {
	return {
		type: t.TENANT_DELETE_SUCCESS
	};
}

function requestUpdateTenant() {
	return {
		type: t.TENANT_UPDATE_REQUEST
	};
}

function receiveUpdateTenant(item) {
	return {
		type: t.TENANT_UPDATE_SUCCESS,
		item
	};
}

function errorUpdateTenant(error) {
	return {
		type: t.TENANT_UPDATE_FAILURE,
		error
	};
}

function requestCreateTenant() {
	return {
		type: t.TENANT_CREATE_REQUEST
	};
}

function receiveCreateTenant(item) {
	return {
		type: t.TENANT_CREATE_SUCCESS,
		item
	};
}

function errorCreateTenant(error) {
	return {
		type: t.TENANT_CREATE_FAILURE,
		error
	};
}

const getFilter = (state, offset = 0) => {
	const searchTerm = state.tenants.filter.search;

	let filter = {
		limit: 50,
		search: searchTerm,
		offset: offset
	};

	return filter;
};

export function fetchTenants() {
	return (dispatch, getState) => {
		const state = getState();
		if (state.tenants.loadingItems) {
			// do nothing
		} else {
			dispatch(requestTenants());
			dispatch(deselectAllTenant());

			let filter = getFilter(state);

			return api.tenants
				.list(filter)
				.then(({ status, json }) => {
					const items = [];
					items['data'] = json.data.filter(
						item => item.id !== utils.decrypt(localStorage.getItem('tenant_id'))
					);
					dispatch(receiveTenants(items));
				})
				.catch(error => {
					dispatch(receiveTenantsError(error));
				});
		}
	};
}

export function fetchMoreTenants() {
	return (dispatch, getState) => {
		const state = getState();
		if (!state.tenants.loadingItems) {
			dispatch(requestMoreTenants());

			const offset = state.tenants.items.length;
			let filter = getFilter(state, offset);

			return api.tenants
				.list(filter)
				.then(({ status, json }) => {
					dispatch(receiveTenantsMore(json));
				})
				.catch(error => {
					dispatch(receiveTenantsError(error));
				});
		}
	};
}

export function deleteCurrentTenant() {
	return (dispatch, getState) => {
		const state = getState();
		let tenant = state.tenants.editTenant;
		if (tenant && tenant.id) {
			return api.tenants
				.delete(tenant.id)
				.then(() => {})
				.catch(err => {
					console.log(err);
				});
		}
	};
}

export function deleteTenants() {
	return (dispatch, getState) => {
		const state = getState();
		let promises = state.tenants.selected.map(id => api.tenants.delete(id));

		return Promise.all(promises)
			.then(values => {
				dispatch(deleteTenantsSuccess());
				dispatch(deselectAllTenant());
				dispatch(fetchTenants());
			})
			.catch(err => {
				console.log(err);
			});
	};
}

export function updateTenant(data) {
	return (dispatch, getState) => {
		dispatch(requestUpdateTenant());
		return api.tenants
			.update(data.id, data)
			.then(({ status, json }) => {
				dispatch(receiveUpdateTenant(json));
			})
			.catch(error => {
				dispatch(errorUpdateTenant(error));
			});
	};
}

export function createTenant(data, history) {
	return (dispatch, getState) => {
		dispatch(requestCreateTenant());
		const tenantUrlName = localStorage.getItem('tenant_url_name');
		const locale = location.pathname.split('/')[2];
		return api.tenants
			.create(data)
			.then(({ status, json }) => {
				dispatch(receiveCreateTenant(json));
				history.push(`/${tenantUrlName}/${locale}/admin/tenants`);
			})
			.catch(error => {
				dispatch(errorCreateTenant(error));
			});
	};
}

export function fetchTenant(id) {
	return (dispatch, getState) => {
		dispatch(requestTenant());

		return api.tenants
			.retrieve(id)
			.then(({ status, json }) => {
				dispatch(receiveTenant(json));
			})
			.catch(error => {
				dispatch(receiveTenantError(error));
			});
	};
}
