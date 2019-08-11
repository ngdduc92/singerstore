import React from 'react';
import { text } from '../../lib/settings';
import ResetPasswordSuccess from './resetPasswordSuccess';

export default class ResetPassword extends React.Component {
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

	handleResetPassord = e => {
		e.preventDefault();
		this.setState({
			responseMessage: null
		});
		if (this.state.password.length === 0) {
			this.setState({
				responseMessage: text.passwordRequired
			});
			return;
		}
		if (this.state.password !== this.state.confirmPassword) {
			this.setState({
				responseMessage: text.confirmPasswordNotMatch
			});
			return;
		}
		const data = {
			password: this.state.password
		};
		this.props.resetPassword(data);
	};

	render() {
		let response = this.state.responseMessage;
		const { resetPassword } = this.props.state;
		if (resetPassword) {
			if (resetPassword.isSuccess) {
				return <ResetPasswordSuccess />;
			} else {
				if (resetPassword.isToken) {
					response = text.resetPasswordFailed;
				} else {
					response = text.verificationTokenInvalid;
				}
			}
		}
		return (
			<div className="reset-password-box">
				<h1>{text.resetPassword}</h1>
				<div className="reset-password-inputs">
					<form onSubmit={this.handleResetPassord}>
						<input
							type="password"
							value={this.state.password}
							onChange={this.handlePasswordChange}
							placeholder={text.password}
							autoComplete="off"
						/>
						<input
							type="password"
							value={this.state.confirmPassword}
							onChange={this.handleConfirmPasswordChange}
							placeholder={text.confirmPassword}
							autoComplete="off"
						/>
						<button
							className="reset-password-btn"
							onClick={this.handleResetPassord}
						>
							{text.update}
						</button>
					</form>
				</div>
				<div className="response">{response}</div>
			</div>
		);
	}
}
