import React from 'react';
import messages from 'lib/text';
import ResetPasswordForm from './components/form';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { resetPassword } from '../actions';

const mapStateToProps = (state, ownProps) => {
	return {
		resetPassword: state.resetPassword.resetPassword
	};
};

const mapDispatchToProps = (dispatch, ownProps) => {
	return {
		onResetPassword: data => {
			dispatch(resetPassword(data));
		}
	};
};

export default withRouter(
	connect(
		mapStateToProps,
		mapDispatchToProps
	)(ResetPasswordForm)
);
