import React from 'react';
import messages from 'lib/text';
import api from 'lib/api';
import utils from '../../../shopfront/shared/lib/utils';
import RaisedButton from 'material-ui/RaisedButton';
import Paper from 'material-ui/Paper';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

export default class LoginForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			email: '',
			error: null,
			password: '',
			showPassword: false,
			tenantUrlName: this.props.match.params.tenantUrlName,
			isLoginForm: true,
			isForgotPasswordForm: false
		};
	}

	componentDidMount() {
		api.setTenantId(utils.decrypt(localStorage.getItem('tenant_id')));
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

	handleKeyPress = e => {
		if (e.keyCode === 13 || e.which === 13) {
			this.handleSubmit();
		}
	};

	handleSubmit = () => {
		this.setState({
			error: null
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
					const tokenData = utils.parseToken(token);
					if (tokenData) {
						utils.saveLoginItems({
							token: utils.encrypt(token),
							email: tokenData.email,
							expiration_date: tokenData.exp * 1000,
							role: tokenData.role,
							user_id: utils.encrypt(tokenData.userId)
						});
						location.reload();
					}
				} else {
					this.setState({
						error: authorizeResponse.json.error
					});
				}
			})
			.catch(error => {
				this.setState({
					error: error
				});
			});
	};

	handleClickShowPassword = () => {
		this.setState(state => ({ showPassword: !state.showPassword }));
	};

	openForgotPassword = () => {
		this.setState({
			isLoginForm: false,
			error: null,
			isForgotPasswordForm: true
		});
	};

	openLogin = () => {
		this.setState({
			isLoginForm: true,
			error: null,
			isForgotPasswordForm: false
		});
	};

	handleResetPassword = e => {
		e.preventDefault();
		this.setState({
			error: null
		});

		const locale = location.pathname.split('/')[2];
		const resetPasswordData = {
			email: this.state.email,
			locale: locale,
			isAdmin: true
		};
		api.public
			.resetPassword(resetPasswordData)
			.then(resetPasswordResponse => {
				let isEmailSent = resetPasswordResponse.json.sent;
				if (isEmailSent) {
					this.setState({
						error: messages.emailIsSent
					});
				} else {
					this.setState({
						error: resetPasswordResponse.json.error
					});
				}
			})
			.catch(error => {
				this.setState({
					error: error
				});
			});
	};

	render() {
		const {
			email,
			password,
			error,
			isLoginForm,
			isForgotPasswordForm
		} = this.state;

		let response = null;
		let content = null;
		if (error) {
			response = <div className="loginErrorResponse">{error}</div>;
		}

		if (isLoginForm) {
			content = (
				<Paper className="loginBox" zDepth={1}>
					<div className="loginTitle">{messages.loginTitle}</div>
					<div className="loginInput">
						<TextField
							type="email"
							id="email"
							value={email}
							onChange={this.handleEmailChange}
							onKeyPress={this.handleKeyPress}
							label={messages.email}
							fullWidth={true}
						/>
						<FormControl fullWidth={true}>
							<InputLabel htmlFor="password">Password</InputLabel>
							<Input
								id="password"
								type={this.state.showPassword ? 'text' : 'password'}
								value={password}
								onChange={this.handlePasswordChange}
								onKeyPress={this.handleKeyPress}
								endAdornment={
									<InputAdornment position="end">
										<IconButton
											aria-label="Toggle password visibility"
											onClick={this.handleClickShowPassword}
										>
											{this.state.showPassword ? (
												<Visibility />
											) : (
												<VisibilityOff />
											)}
										</IconButton>
									</InputAdornment>
								}
							/>
						</FormControl>
					</div>
					<div className="login-forgot">
						<a onClick={this.openForgotPassword}>{messages.forgotPassword}</a>
					</div>
					<RaisedButton
						label="Login"
						primary={true}
						onClick={this.handleSubmit}
					/>
				</Paper>
			);
		} else if (isForgotPasswordForm) {
			content = (
				<Paper className="loginBox" zDepth={1}>
					<div className="loginTitle">{messages.resetPassword}</div>
					<div className="loginInput reset-password-warning">
						{messages.resetPasswordWarning}
					</div>
					<div className="reset-password">
						<form onSubmit={this.handleResetPassword}>
							<TextField
								name="forgot-email"
								type="email"
								value={email}
								onChange={this.handleEmailChange}
								placeholder={messages.email}
							/>
							<RaisedButton
								primary={true}
								onClick={this.handleResetPassword}
								label={messages.resetPassword}
							/>
							<div className="sign-up">
								{messages.alreadyMember}{' '}
								<a onClick={this.openLogin}>{'Login'}</a>
							</div>
						</form>
					</div>
				</Paper>
			);
		}

		return (
			<div className="row col-full-height center-xs middle-xs">
				<div className="col-xs-12 col-sm-8 col-md-6 col-lg-4">
					{content}
					{response}
				</div>
			</div>
		);
	}
}
