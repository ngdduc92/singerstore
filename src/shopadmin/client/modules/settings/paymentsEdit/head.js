import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { deletePaymentMethod } from '../actions';
import Buttons from './components/headButtons';

const mapStateToProps = (state, ownProps) => {
	return {
		paymentMethod: state.settings.paymentMethodEdit
	};
};

const mapDispatchToProps = (dispatch, ownProps) => {
	return {
		onDelete: id => {
			dispatch(deletePaymentMethod(id));
			const tenantUrlName = localStorage.getItem('tenant_url_name');
			const locale = location.pathname.split('/')[2];
			ownProps.history.push(
				`/${tenantUrlName}/${locale}/admin/settings/payments`
			);
		}
	};
};

export default withRouter(
	connect(
		mapStateToProps,
		mapDispatchToProps
	)(Buttons)
);
