import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import {
	fetchTenants,
	deleteTenants,
	createTenant,
	setFilter
} from '../actions';
import Buttons from './components/buttons';

const mapStateToProps = (state, ownProps) => {
	return {
		search: state.tenants.filter.search,
		selectedCount: state.tenants.selected.length
	};
};

const mapDispatchToProps = (dispatch, ownProps) => {
	return {
		setSearch: (event, value) => {
			dispatch(setFilter({ search: value }));
			dispatch(fetchTenants());
		},
		onDelete: () => {
			dispatch(deleteTenants());
		},
		onCreate: () => {
			dispatch(createTenant(ownProps.history));
		}
	};
};

export default withRouter(
	connect(
		mapStateToProps,
		mapDispatchToProps
	)(Buttons)
);
