import React from 'react';
import { text } from '../lib/settings';
import api from '../lib/api';
import utils from '../../../src/shopfront/shared/lib/utils';

export default class LoginForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			email: '',
			password: '',
			confirmPassword: '',
			responseMessage: null,
			isLoggedin: true,
			isLoginForm: true,
			isRegisterForm: false,
			isRegisterSuccess: false,
			isForgotPasswordForm: false,
			isEmailSent: false
		};
	}

	componentDidMount() {
		if (!utils.isCurrentTokenValid() && localStorage.getItem('token')) {
			utils.removeLoginItems();
			api.setToken(null);
			this.props.fetchCart();
		}
		this.setState({
			isLoggedin: utils.isCurrentTokenValid()
		});
	}

	handleEmailChange = event => {
		this.setState({
			email: event.target.value
		});
	};

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

	handleLogin = e => {
		e.preventDefault();
		this.setState({
			responseMessage: null
		});

		const authorizeData = {
			email: this.state.email,
			password: this.state.password
		};
		api.public
			.authorize(authorizeData)
			.then(authorizeResponse => {
				const token = authorizeResponse.json.token;
				if (token) {
					api.setToken(token);
					const tokenData = utils.parseToken(token);
					if (tokenData) {
						utils.saveLoginItems({
							token: utils.encrypt(token),
							email: tokenData.email,
							expiration_date: tokenData.exp * 1000,
							role: tokenData.role,
							user_id: utils.encrypt(tokenData.userId)
						});
						this.setState({
							isLoggedin: true
						});
						this.props.fetchCart();
					}
				} else {
					this.setState({
						responseMessage: authorizeResponse.json.error
					});
				}
			})
			.catch(error => {
				this.setState({
					responseMessage: error
				});
			});
	};

	handleLoginWithFacebook = e => {
		return null;
	};

	handleRegister = e => {
		e.preventDefault();
		this.setState({
			responseMessage: null
		});

		if (this.state.password !== this.state.confirmPassword) {
			this.setState({
				responseMessage: text.confirmPasswordNotMatch
			});
		} else {
			const registerData = {
				email: this.state.email,
				password: this.state.password
			};

			api.public
				.register(registerData)
				.then(registerResponse => {
					const sent = registerResponse.json.sent;
					if (sent) {
						this.setState({
							isLoginForm: false,
							isRegisterForm: false,
							isRegisterSuccess: true
						});
					} else {
						this.setState({
							responseMessage: registerResponse.json.error
						});
					}
				})
				.catch(error => {
					this.setState({
						responseMessage: error
					});
				});
		}
	};

	handleResetPassord = e => {
		e.preventDefault();
		this.setState({
			responseMessage: null
		});
		const locale = location.pathname.split('/')[2];
		const resetPasswordData = {
			email: this.state.email,
			locale: locale
		};
		api.public
			.resetPassword(resetPasswordData)
			.then(resetPasswordResponse => {
				let isEmailSent = resetPasswordResponse.json.sent;
				if (isEmailSent) {
					this.setState({
						responseMessage: text.emailIsSent
					});
				} else {
					this.setState({
						responseMessage: resetPasswordResponse.json.error
					});
				}
			})
			.catch(error => {
				this.setState({
					responseMessage: error
				});
			});
	};

	openLogin = () => {
		this.setState({
			isLoginForm: true,
			isRegisterForm: false,
			responseMessage: null,
			isRegisterSuccess: false,
			isForgotPasswordForm: false
		});
	};

	openRegister = () => {
		this.setState({
			isLoginForm: false,
			isRegisterForm: true,
			responseMessage: null,
			isRegisterSuccess: false,
			isForgotPasswordForm: false
		});
	};

	openForgotPassword = () => {
		this.setState({
			isLoginForm: false,
			isRegisterForm: false,
			responseMessage: null,
			isRegisterSuccess: false,
			isForgotPasswordForm: true
		});
	};

	render() {
		const {
			email,
			responseMessage,
			isLoggedin,
			isLoginForm,
			isRegisterForm,
			isRegisterSuccess,
			isForgotPasswordForm
		} = this.state;
		let response = null;
		let content = null;
		if (!isLoggedin) {
			if (responseMessage) {
				response = <div className="response">{responseMessage}</div>;
			}
			if (isLoginForm) {
				content = (
					<div>
						<h1>{text.signin}</h1>
						<div className="login-inputs">
							<form onSubmit={this.handleLogin}>
								<input
									name="login-email"
									type="email"
									value={email}
									onChange={this.handleEmailChange}
									placeholder={text.email}
								/>
								<input
									name="login-password"
									type="password"
									value={this.state.password}
									onChange={this.handlePasswordChange}
									placeholder={text.password}
									autoComplete="on"
								/>
								<div className="login-forgot">
									<a onClick={this.openForgotPassword}>{text.forgotPassword}</a>
								</div>
								<button
									name="login-submit-btn"
									className="login-btn"
									onClick={this.handleLogin}
								>
									{text.signin}
								</button>
							</form>
							<h2>
								<span>OR</span>
							</h2>
							<button
								className="login-fb-btn"
								onClick={this.handleLoginWithFacebook}
							>
								<i className="fab fa-facebook-square fb-icon" />
								{text.signinfb}
							</button>
							<div className="sign-up">
								{text.notMember}{' '}
								<a onClick={this.openRegister}>{text.signup}</a>
							</div>
						</div>
					</div>
				);
			} else if (isRegisterForm) {
				content = (
					<div>
						<h1>{text.signup}</h1>
						<div className="login-inputs">
							<form onSubmit={this.handleRegister}>
								<input
									name="register-email"
									type="email"
									value={email}
									onChange={this.handleEmailChange}
									placeholder={text.email}
								/>
								<input
									name="register-password"
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
								<button className="login-btn" onClick={this.handleRegister}>
									{text.signup}
								</button>
							</form>
							<h2>
								<span>OR</span>
							</h2>
							<button className="login-fb-btn">
								<i className="fab fa-facebook-square fb-icon" />
								{text.signinfb}
							</button>
							<div className="terms-service-warning">
								{text.termsServiceWarning1} <a>{text.termsService}</a>{' '}
								{text.termsServiceWarning2}
							</div>
							<div className="sign-up">
								{text.alreadyMember}{' '}
								<a onClick={this.openLogin}>{text.signin}</a>
							</div>
						</div>
					</div>
				);
			} else if (isRegisterSuccess) {
				content = (
					<div className="register-success-inform">
						{text.registerSuccessMsg}
					</div>
				);
			} else if (isForgotPasswordForm) {
				content = (
					<div>
						<h1>{text.resetPassword}</h1>
						<div className="reset-password-warning">
							{text.resetPasswordWarning}
						</div>
						<div className="login-inputs">
							<form onSubmit={this.handleResetPassord}>
								<input
									name="forgot-email"
									type="email"
									value={email}
									onChange={this.handleEmailChange}
									placeholder={text.email}
								/>
								<button className="login-btn" onClick={this.handleResetPassord}>
									{text.resetPassword}
								</button>
								<div className="sign-up">
									{text.alreadyMember}{' '}
									<a onClick={this.openLogin}>{text.signin}</a>
								</div>
							</form>
						</div>
					</div>
				);
			}

			return (
				<div className="login-modal">
					<div className="login-box">
						{content}
						{response}
					</div>
				</div>
			);
		} else {
			return null;
		}
	}
}
