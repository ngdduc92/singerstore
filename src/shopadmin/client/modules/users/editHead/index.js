import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { deleteCurrentUser } from '../actions';
import Buttons from './components/buttons';

const mapStateToProps = (state, ownProps) => {
	return {
		user: state.users.editUser
	};
};

const mapDispatchToProps = (dispatch, ownProps) => {
	return {
		onDelete: () => {
			dispatch(deleteCurrentUser());
			const tenantUrlName = localStorage.getItem('tenant_url_name');
			const locale = location.pathname.split('/')[2];
			ownProps.history.push(`/${tenantUrlName}/${locale}/admin/users`);
		}
	};
};

export default withRouter(
	connect(
		mapStateToProps,
		mapDispatchToProps
	)(Buttons)
);
