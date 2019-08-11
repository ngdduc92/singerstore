import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { updateTenant } from '../../actions';
import TenantGeneralForm from './components/form';

const mapStateToProps = (state, ownProps) => {
	return {
		initialValues: state.tenants.editTenant
	};
};

const mapDispatchToProps = (dispatch, ownProps) => {
	return {
		onSubmit: values => {
			dispatch(
				updateTenant({
					id: values.id,
					name: values.name,
					email: values.email,
					url_name: values.url_name,
					address: values.address,
					tel: values.tel,
					enabled: values.enabled
				})
			);
		}
	};
};

export default withRouter(
	connect(
		mapStateToProps,
		mapDispatchToProps
	)(TenantGeneralForm)
);
