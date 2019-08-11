import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { createTenant } from '../../actions';
import TenantCreateGeneralForm from './components/form';

const mapStateToProps = (state, ownProps) => {
	return {
		initialValues: state.tenants.createTenant
	};
};

const mapDispatchToProps = (dispatch, ownProps) => {
	return {
		onSubmit: values => {
			dispatch(
				createTenant(
					{
						name: values.name,
						email: values.email,
						url_name: values.url_name,
						address: values.address,
						tel: values.tel
					},
					ownProps.history
				)
			);
		}
	};
};

export default withRouter(
	connect(
		mapStateToProps,
		mapDispatchToProps
	)(TenantCreateGeneralForm)
);
