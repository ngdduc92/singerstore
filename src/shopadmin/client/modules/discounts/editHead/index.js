import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { deleteCurrentDiscount } from '../actions';
import Buttons from './components/buttons';

const mapStateToProps = (state, ownProps) => {
	return {
		discount: state.discounts.editDiscount
	};
};

const mapDispatchToProps = (dispatch, ownProps) => {
	return {
		onDelete: () => {
			dispatch(deleteCurrentDiscount());
			const tenantUrlName = localStorage.getItem('tenant_url_name');
			const locale = location.pathname.split('/')[2];
			ownProps.history.push(`/${tenantUrlName}/${locale}/admin/discounts`);
		}
	};
};

export default withRouter(
	connect(
		mapStateToProps,
		mapDispatchToProps
	)(Buttons)
);
