import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { createUser } from '../../actions';
import UserCreateGeneralForm from './components/form';

const mapStateToProps = (state, ownProps) => {
	return {
		initialValues: state.users.createUser
	};
};

const mapDispatchToProps = (dispatch, ownProps) => {
	return {
		onSubmit: values => {
			dispatch(
				createUser(
					{
						full_name: values.full_name,
						email: values.email,
						password: Math.random()
							.toString(36)
							.slice(-8),

						phone: values.phone,
						country: values.country,
						state: values.state,
						city: values.city,
						address1: values.address1,
						address2: values.address2,
						role: values.role,
						enabled: true
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
	)(UserCreateGeneralForm)
);
