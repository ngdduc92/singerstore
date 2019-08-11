import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { updateUser } from '../../actions';
import UserChangePasswordForm from './components/form';

const mapStateToProps = (state, ownProps) => {
	return { initialValues: state.users.editUser };
};

const mapDispatchToProps = (dispatch, ownProps) => {
	return {
		onSubmit: values => {
			dispatch(
				updateUser({
					id: values.id,
					password: values.new_password
				})
			);
			values.new_password = '';
			values.confirm_password = '';
		}
	};
};

export default withRouter(
	connect(
		mapStateToProps,
		mapDispatchToProps
	)(UserChangePasswordForm)
);
