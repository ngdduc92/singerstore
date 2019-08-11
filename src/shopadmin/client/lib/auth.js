import React from 'react';
import api from './api';
import NotFound from '../routes/notFound';
import utils from '../../../shopfront/shared/lib/utils';
import roles from './roles';

const Authorization = () => (WrappedComponent) => {
	return class WithAuthorization extends React.Component {
		constructor(props) {
			super(props);
			this.state = {
				component: null
			}
		}

		componentDidMount() {
			const tenantUrlName = location.pathname.split('/')[1];
			const locale = location.pathname.split('/')[2];
			const role = localStorage.getItem('role');
			const loginPath = `/${tenantUrlName}/${locale}/admin/login`;
			const tenantsPath = `/${tenantUrlName}/${locale}/admin/tenants`;
			const adminPath = `/${tenantUrlName}/${locale}/admin`;
			let homePath = null;
			switch (role) {
				case roles.OWNER:
					homePath = tenantsPath;
					break;
				case roles.ADMINISTRATOR:
					homePath = adminPath;
					break;
				case roles.SELLER:
					homePath = adminPath;
					break;
				default:
			}
			if (role === roles.CUSTOMER) {
				this.setState({
					component: <NotFound />
				});
			} else {
				if (location.pathname !== loginPath) {
					if (localStorage.getItem('tenant_url_name') === tenantUrlName) {
						if (!utils.isCurrentTokenValid()) {
							utils.removeTenant();
							utils.removeLoginItems();
							location.replace(loginPath);
						} else {
							this.setState({
								component: <WrappedComponent {...this.props} />
							});
						}
					} else {
						this.checkTenantId(tenantUrlName, loginPath);
					}
				} else {
					if (localStorage.getItem('tenant_url_name') === tenantUrlName) {
						if (utils.isCurrentTokenValid()) {
							location.replace(homePath);
						} else {
							this.setState({
								component: <WrappedComponent {...this.props} />
							});
						}
					} else {
						this.checkTenantId(tenantUrlName, loginPath);
					}
				}
			}
		}

		checkTenantId(tenantUrlName, loginPath) {
			utils.removeTenant();
			utils.removeLoginItems();
			api.public.getTenantIdByUrlName(tenantUrlName)
				.then(res => {
					const tenantId =  res.json.id;
					if (tenantId) {
						utils.saveTenant({
							tenant_url_name: tenantUrlName,
							tenant_id: utils.encrypt(tenantId)
						});
						if (location.pathname !== loginPath) {
							location.replace(loginPath);
						} else {
							this.setState({
								component: <WrappedComponent {...this.props} />
							});
						}
					} else {
						this.setState({
							component: <NotFound />
						});
					}
				})
				.catch(error => {
					this.setState({
						component: <NotFound />
					});
				});
		}

		render() {
			return this.state.component;
		}
  	}
}

export const Auth = Authorization();