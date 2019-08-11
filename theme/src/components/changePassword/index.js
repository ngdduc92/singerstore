import React from 'react';
import { themeSettings, text } from '../../lib/settings';
import utils from '../../../../src/shopfront/shared/lib/utils';
import ChangePasswordForm from './form';

export default class ChangePassword extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			userId: utils.decrypt(
				new URLSearchParams(props.location.search).get('id')
			)
		};
	}

	handleChangePasswordSubmit = values => {
		const userData = {
			password: values.newPassword
		};
		this.props.updateUser(this.state.userId, userData);
		values.newPassword = '';
		values.confirmPassword = '';
	};

	render() {
		const {
			checkoutInputClass = 'checkout-field',
			checkoutButtonClass = 'checkout-button'
		} = themeSettings;

		return (
			<div className="checkout-form">
				<ChangePasswordForm
					title={text.myProfile}
					inputClassName={checkoutInputClass}
					buttonClassName={checkoutButtonClass}
					onSubmit={this.handleChangePasswordSubmit}
				/>
			</div>
		);
	}
}
