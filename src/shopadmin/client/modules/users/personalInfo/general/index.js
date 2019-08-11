import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { updateUser } from '../../actions';
import UserGeneralForm from './components/form';

const mapStateToProps = (state, ownProps) => {
	return {
		initialValues: state.users.editUser
	};
};

const mapDispatchToProps = (dispatch, ownProps) => {
	return {
		onSubmit: values => {
			dispatch(
				updateUser({
					id: values.id,
					full_name: values.full_name,
					email: values.email,
					role: values.role,
					country: values.country,
					state: values.state,
					city: values.city,
					phone: values.phone,
					address1: values.address1,
					address2: values.address2,
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
	)(UserGeneralForm)
);
