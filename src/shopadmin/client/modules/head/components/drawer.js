import React from 'react';
import { NavLink } from 'react-router-dom';
import messages from 'lib/text';
import FontIcon from 'material-ui/FontIcon';
import Drawer from 'material-ui/Drawer';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import utils from '../../../../../shopfront/shared/lib/utils';
import scopes from 'lib/scopes';
import userScopes from 'lib/userScopes';
import roles from 'lib/roles';

const tenantUrlName = localStorage.getItem('tenant_url_name');
const tenantId = localStorage.getItem('tenant_id');
const userId = localStorage.getItem('user_id');
const role = localStorage.getItem('role');
const locale = location.pathname.split('/')[2];

const drawer_home = {
	title: messages.drawer_home,
	url: `/${tenantUrlName}/${locale}/admin`,
	icon: 'home'
};
const drawer_products = {
	title: messages.drawer_products,
	url: `/${tenantUrlName}/${locale}/admin/products`,
	icon: 'local_offer'
};
const drawer_orders = {
	title: messages.drawer_orders,
	url: `/${tenantUrlName}/${locale}/admin/orders`,
	icon: 'shopping_cart'
};
const drawer_customers = {
	title: messages.drawer_customers,
	url: `/${tenantUrlName}/${locale}/admin/customers`,
	icon: 'people'
};
const drawer_pages = {
	title: messages.settings_pages,
	url: `/${tenantUrlName}/${locale}/admin/pages`,
	icon: 'description'
};
const drawer_settings = {
	title: messages.drawer_settings,
	url:
		`/${tenantUrlName}/${locale}/admin/settings` +
		(role === roles.OWNER ? '/email' : ''),
	icon: 'settings'
};
const drawer_logout = {
	title: messages.drawer_logout,
	url: `/${tenantUrlName}/${locale}/admin/logout`,
	icon: 'exit_to_app'
};
const drawer_tenants = {
	title: messages.tenants_title,
	url: `/${tenantUrlName}/${locale}/admin/tenants`,
	icon: 'supervisor_account'
};
const drawer_tenant_info = {
	title: messages.tenant_info_title,
	url:
		`/${tenantUrlName}/${locale}/admin/tenant-info/` +
		(tenantId ? utils.decrypt(tenantId) : tenantId),
	icon: 'person'
};
const drawer_personal_info = {
	title: messages.personal_info_title,
	url:
		`/${tenantUrlName}/${locale}/admin/personal-info/` +
		(userId ? utils.decrypt(userId) : userId),
	icon: 'account_circle'
};
const drawer_users = {
	title: messages.users_title,
	url: `/${tenantUrlName}/${locale}/admin/users`,
	icon: 'supervised_user_circle'
};

const drawer_discounts = {
	title: messages.drawer_discounts,
	url: `/${tenantUrlName}/${locale}/admin/discounts`,
	icon: 'description'
};

const menuItems = [
	userScopes.includes(scopes.LIST_ORDER) && drawer_home,
	userScopes.includes(scopes.LIST_TENANT) && drawer_tenants,
	userScopes.includes(scopes.LIST_PRODUCT) && drawer_products,
	userScopes.includes(scopes.LIST_ORDER) && drawer_orders,
	userScopes.includes(scopes.LIST_CUSTOMER) && drawer_customers,
	userScopes.includes(scopes.READ_PAGE_SETTINGS) && drawer_pages,
	userScopes.includes(scopes.LIST_DISCOUNT) && drawer_discounts,
	userScopes.includes(scopes.READ_SETTINGS) && drawer_settings,
	userScopes.includes(scopes.LIST_USER) && drawer_users,
	userScopes.includes(scopes.READ_TENANT) && drawer_tenant_info,
	userScopes.includes(scopes.READ_USER) && drawer_personal_info,
	drawer_logout
];

const styles = {
	link: {
		display: 'block',
		color: 'rgba(0,0,0,0.82)',
		textDecoration: 'none'
	},
	linkActive: {
		color: 'rgb(25, 118, 210)',
		backgroundColor: 'rgba(0,0,0,0.05)'
	},
	icon: {
		left: 12,
		color: 'rgba(0,0,0,0.54)'
	},
	iconActive: {
		left: 12,
		color: 'inherit'
	},
	itemInnerDiv: {
		paddingLeft: 76,
		fontSize: 14,
		fontWeight: 500,
		color: 'inherit'
	},
	item: {
		color: 'inherit'
	},
	appBar: {
		backgroundColor: '#fff',
		paddingLeft: 28
	},
	appBarTitle: {
		color: '#777',
		fontSize: 18
	},
	menu: {
		paddingTop: 0
	}
};

const DrawerMenu = ({ open, onClose, currentUrl }) => {
	const items = menuItems.map(
		(item, index) =>
			item && (
				<NavLink
					to={item.url}
					key={index}
					exact={true}
					style={styles.link}
					activeStyle={styles.linkActive}
				>
					<MenuItem
						onClick={onClose}
						primaryText={item.title}
						innerDivStyle={styles.itemInnerDiv}
						style={styles.item}
						leftIcon={
							<FontIcon
								style={
									item.url === currentUrl ? styles.iconActive : styles.icon
								}
								className="material-icons"
							>
								{item.icon}
							</FontIcon>
						}
					/>
				</NavLink>
			)
	);

	return (
		<Drawer docked={false} width={280} open={open} onRequestChange={onClose}>
			<AppBar
				title={messages.drawer_title}
				style={styles.appBar}
				titleStyle={styles.appBarTitle}
				zDepth={0}
				iconElementLeft={
					<IconButton onClick={onClose}>
						<FontIcon color="#9e9e9e" className="material-icons">
							menu
						</FontIcon>
					</IconButton>
				}
			/>
			<Menu listStyle={styles.menu} disableAutoFocus={true}>
				{items}
			</Menu>
		</Drawer>
	);
};

export default DrawerMenu;
