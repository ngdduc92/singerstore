import React from 'react';
import messages from 'lib/text';
import style from './style.css';
import { Field, reduxForm } from 'redux-form';
import { TextField } from 'redux-form-material-ui';
import RaisedButton from 'material-ui/RaisedButton';
import Paper from 'material-ui/Paper';
import ResetPasswordSuccess from './resetPasswordSuccess';

class ResetPasswordForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			password: '',
			confirmPassword: '',
			responseMessage: null
		};
	}

	handlePasswordChange = event => {
		this.setState({
			password: event.target.value
		});
	};

	handleConfirmPasswordChange = event => {
		this.setState({
			confirmPassword: event.target.value
		});
	};

	handleResetPassword = e => {
		e.preventDefault();
		this.setState({
			responseMessage: null
		});
		if (this.state.password.length === 0) {
			this.setState({
				responseMessage: messages.passwordRequired
			});
			return;
		}
		if (this.state.password !== this.state.confirmPassword) {
			this.setState({
				responseMessage: messages.errors_confirm_password
			});
			return;
		}
		const data = {
			password: this.state.password
		};
		this.props.onResetPassword(data);
	};

	render() {
		let {
			handleSubmit,
			pristine,
			reset,
			submitting,
			resetPassword
		} = this.props;
		let response = this.state.responseMessage;
		if (resetPassword) {
			if (resetPassword.isSuccess) {
				return <ResetPasswordSuccess />;
			} else {
				if (resetPassword.isToken) {
					response = messages.resetPasswordFailed;
				} else {
					response = messages.verificationTokenInvalid;
				}
			}
		}
		return (
			<Paper className={style.resetPasswordBox}>
				<h1 className={style.resetPasswordTitle}>{messages.resetPassword}</h1>
				<div className={style.resetPasswordInputs}>
					<form onSubmit={this.handleResetPassord}>
						<Field
							name="password"
							type="password"
							className={style.resetPasswordInputs}
							component={TextField}
							value={this.state.password}
							onChange={this.handlePasswordChange}
							placeholder={messages.password}
							autoComplete="off"
							fullWidth={true}
						/>
						<Field
							name="confirmPassword"
							type="password"
							className={style.resetPasswordInputs}
							component={TextField}
							value={this.state.confirmPassword}
							onChange={this.handleConfirmPasswordChange}
							placeholder={messages.confirm_password}
							autoComplete="off"
							fullWidth={true}
						/>
						<RaisedButton
							className={style.resetPasswordBtn}
							primary={true}
							onClick={this.handleResetPassword}
							label={messages.update}
						/>
					</form>
				</div>
				<div className={style.response}>{response}</div>
			</Paper>
		);
	}
}

export default reduxForm({
	form: 'ResetPasswordForm',
	enableReinitialize: true
})(ResetPasswordForm);
