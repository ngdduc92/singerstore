import React from 'react';
import utils from '../../../shopfront/shared/lib/utils';
import api from 'lib/api';

export default class Logout extends React.Component {
	componentWillMount() {
		const tenantUrlName = localStorage.getItem('tenant_url_name');
		const locale = location.pathname.split('/')[2];
		const loginPath = `/${tenantUrlName}/${locale}/admin/login`;
		utils.removeLoginItems();
		api.public.logout().then(res => location.replace(loginPath));
	}

	render() {
		return null;
	}
}
