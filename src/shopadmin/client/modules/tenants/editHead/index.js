import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { deleteCurrentTenant } from '../actions';
import Buttons from './components/buttons';

const mapStateToProps = (state, ownProps) => {
	return {
		tenant: state.tenants.editTenant
	};
};

const mapDispatchToProps = (dispatch, ownProps) => {
	const tenantUrlName = localStorage.getItem('tenant_url_name');
	const locale = location.pathname.split('/')[2];
	return {
		onDelete: () => {
			dispatch(deleteCurrentTenant());
			ownProps.history.push(`/${tenantUrlName}/${locale}/admin/tenants`);
		}
	};
};

export default withRouter(
	connect(
		mapStateToProps,
		mapDispatchToProps
	)(Buttons)
);
