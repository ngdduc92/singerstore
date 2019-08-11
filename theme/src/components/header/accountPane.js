import React from 'react';
import { themeSettings, text, api, locale } from '../../lib/settings';
import utils from '../../../../src/shopfront/shared/lib/utils';

export default class Account extends React.Component {
	constructor(props) {
		super(props);
	}

	myProfile = () => {
		const tenantUrlName = localStorage.getItem('tenant_url_name');
		const userId = localStorage.getItem('user_id');
		location.replace(`/${tenantUrlName}/${locale}/profile?id=${userId}`);
	};

	changePassword = () => {
		const tenantUrlName = localStorage.getItem('tenant_url_name');
		const userId = localStorage.getItem('user_id');
		location.replace(
			`/${tenantUrlName}/${locale}/change-password?id=${userId}`
		);
	};

	logout = () => {
		const tenantUrlName = localStorage.getItem('tenant_url_name');
		api.setToken(null);
		utils.removeLoginItems();
		api.public
			.logout()
			.then(res => location.replace(`/${tenantUrlName}/${locale}/`));
	};

	render() {
		return (
			<div className="account-menu-content">
				<a onClick={this.myProfile}>{text.myProfile}</a>
				<a onClick={this.changePassword}>{text.changePassword}</a>
				<a id="logout-link" onClick={this.logout}>
					{text.signout}
				</a>
			</div>
		);
	}
}
