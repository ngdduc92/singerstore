import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { deleteShippingMethod } from '../actions';
import Buttons from './components/headButtons';

const mapStateToProps = (state, ownProps) => {
	return {
		shippingMethod: state.settings.shippingMethodEdit
	};
};

const mapDispatchToProps = (dispatch, ownProps) => {
	const tenantUrlName = localStorage.getItem('tenant_url_name');
	const locale = location.pathname.split('/')[2];
	return {
		onDelete: id => {
			dispatch(deleteShippingMethod(id));
			ownProps.history.push(
				`/${tenantUrlName}/${locale}/admin/settings/shipping`
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
