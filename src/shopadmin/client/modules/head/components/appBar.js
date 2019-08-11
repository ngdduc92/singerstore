import React from 'react';
import { Link } from 'react-router-dom';
import messages from 'lib/text';
import ProductCategoryHead from 'modules/productCategories/head/index';
import CustomerGroupHead from 'modules/customerGroups/head/index';
import CustomersHead from 'modules/customers/listHead/index';
import CustomerHead from 'modules/customers/editHead/index';
import ProductsHead from 'modules/products/listHead/index';
import ProductHead from 'modules/products/editHead/index';
import OrdersHead from 'modules/orders/listHead/index';
import OrderHead from 'modules/orders/editHead/index';
import OrderStatusHead from 'modules/orderStatuses/head/index';
import PaymentMethodHead from 'modules/settings/paymentsEdit/head';
import PaymentMethodListHead from 'modules/settings/payments/head';
import ShippingMethodHead from 'modules/settings/shippingEdit/head';
import ShippingMethodListHead from 'modules/settings/shipping/head';
import PageHead from 'modules/pages/edit/head';
import PageListHead from 'modules/pages/list/head';
import ApiKeyListHead from 'modules/settings/securityKeys/list/head';
import WebhooksListHead from 'modules/settings/webhooks/list/head';
import WebhooksEditHead from 'modules/settings/webhooks/edit/head';
import AppsHead from 'modules/apps/head';
import FileListHead from 'modules/files/list/head';
import DrawerMenu from './drawer';
import FontIcon from 'material-ui/FontIcon';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import TenantsHead from 'modules/tenants/listHead/index';
import TenantUpdateHead from 'modules/tenants/editHead/index';
import UsersHead from 'modules/users/listHead/index';
import UserUpdateHead from 'modules/users/editHead/index';
import DiscountsHead from 'modules/discounts/listHead/index';
import DiscountHead from 'modules/discounts/editHead/index';
import utils from '../../../../../shopfront/shared/lib/utils';
import roles from 'lib/roles';

export default class AppBarTop extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			open: false
		};
	}

	handleToggle = () => this.setState({ open: !this.state.open });
	handleClose = () => this.setState({ open: false });

	getLeftButton(link) {
		return (
			<Link to={link}>
				<IconButton>
					<FontIcon color="#fff" className="material-icons">
						arrow_back
					</FontIcon>
				</IconButton>
			</Link>
		);
	}

	render() {
		const {
			location,
			productCategoryName,
			productsSelectedCount,
			customersSelectedCount,
			customerGroupName,
			ordersSelectedCount,
			orderStatusName,
			orderNumber,
			tenantsSelectedCount,
			usersSelectedCount,
			discountsSelectedCount
		} = this.props;
		const pathname = location.pathname;
		const tenantUrlName = localStorage.getItem('tenant_url_name');
		const locale = pathname.split('/')[2];
		const role = localStorage.getItem('role');
		if (pathname.split('/')[1] !== tenantUrlName) {
			return null;
		} else {
			if (!utils.isCurrentTokenValid() || role === roles.CUSTOMER) {
				return null;
			}
		}
		let title = null;
		let leftButton = (
			<IconButton onClick={this.handleToggle}>
				<FontIcon className="material-icons">menu</FontIcon>
			</IconButton>
		);
		let rightElements = null;
		if (pathname === `/${tenantUrlName}/${locale}/admin/products`) {
			title = messages.products_title;
			if (productCategoryName) {
				title = (
					<span>
						{messages.products_title}
						<FontIcon
							style={{ top: 6 }}
							color="#fff"
							className="material-icons"
						>
							chevron_right
						</FontIcon>
						{productCategoryName}
					</span>
				);
			}
			if (productsSelectedCount > 0) {
				title = `${productsSelectedCount} ${messages.selected}`;
			}
			rightElements = <ProductsHead />;
		}
		if (pathname === `/${tenantUrlName}/${locale}/admin/orders`) {
			title = messages.orders_title;
			if (orderStatusName) {
				title = (
					<span>
						{messages.orders_title}
						<FontIcon
							style={{ top: 6 }}
							color="#fff"
							className="material-icons"
						>
							chevron_right
						</FontIcon>
						{orderStatusName}
					</span>
				);
			}
			if (ordersSelectedCount > 0) {
				title = `${ordersSelectedCount} ${messages.selected}`;
			}
			rightElements = <OrdersHead />;
		} else if (
			pathname === `/${tenantUrlName}/${locale}/admin/orders/statuses`
		) {
			title = orderStatusName
				? messages.editOrderStatus
				: messages.orderStatuses;
			leftButton = this.getLeftButton(
				`/${tenantUrlName}/${locale}/admin/orders`
			);
			rightElements = <OrderStatusHead />;
		} else if (
			pathname.startsWith(`/${tenantUrlName}/${locale}/admin/orders/`)
		) {
			title = orderNumber
				? `${messages.order} #${orderNumber}`
				: messages.order;
			leftButton = this.getLeftButton(
				`/${tenantUrlName}/${locale}/admin/orders`
			);
			rightElements = <OrderHead />;
		} else if (
			pathname.startsWith(`/${tenantUrlName}/${locale}/admin/customer/`)
		) {
			title = messages.customer;
			leftButton = this.getLeftButton(
				`/${tenantUrlName}/${locale}/admin/customers`
			);
			rightElements = <CustomerHead />;
		} else if (
			pathname === `/${tenantUrlName}/${locale}/admin/products/categories`
		) {
			title = productCategoryName
				? messages.productCategories_titleEdit
				: messages.productCategories_title;
			leftButton = this.getLeftButton(
				`/${tenantUrlName}/${locale}/admin/products`
			);
			rightElements = <ProductCategoryHead />;
		} else if (
			pathname.startsWith(`/${tenantUrlName}/${locale}/admin/products/`) &&
			pathname.includes('/options/')
		) {
			const productId = pathname.split('/')[5];
			title = messages.editProductOption;
			leftButton = this.getLeftButton(
				`/${tenantUrlName}/${locale}/admin/products/${productId}`
			);
		} else if (
			pathname.startsWith(`/${tenantUrlName}/${locale}/admin/products/`)
		) {
			title = messages.products_titleEdit;
			leftButton = this.getLeftButton(
				`/${tenantUrlName}/${locale}/admin/products`
			);
			rightElements = <ProductHead />;
		} else if (pathname === `/${tenantUrlName}/${locale}/admin/customers`) {
			title = messages.customers_title;
			if (customerGroupName) {
				title = (
					<span>
						{messages.customers_title}
						<FontIcon
							style={{ top: 6 }}
							color="#fff"
							className="material-icons"
						>
							chevron_right
						</FontIcon>
						{customerGroupName}
					</span>
				);
			}
			if (customersSelectedCount > 0) {
				title = `${customersSelectedCount} ${messages.selected}`;
			}
			rightElements = <CustomersHead />;
		} else if (
			pathname === `/${tenantUrlName}/${locale}/admin/customers/groups`
		) {
			title = customerGroupName
				? messages.customerGroups_titleEdit
				: messages.customerGroups_title;
			leftButton = this.getLeftButton(
				`/${tenantUrlName}/${locale}/admin/customers`
			);
			rightElements = <CustomerGroupHead />;
		} else if (
			pathname === `/${tenantUrlName}/${locale}/admin/settings/email`
		) {
			title = messages.settings_emailSettings;
		} else if (
			pathname === `/${tenantUrlName}/${locale}/admin/settings/email/smtp`
		) {
			title = messages.settings_smtpSettings;
			leftButton = this.getLeftButton(
				`/${tenantUrlName}/${locale}/admin/settings/email`
			);
		} else if (
			pathname ===
			`/${tenantUrlName}/${locale}/admin/settings/email/templates/order_confirmation`
		) {
			title = messages.settings_orderConfirmation;
			leftButton = this.getLeftButton(
				`/${tenantUrlName}/${locale}/admin/settings/email`
			);
		} else if (
			pathname ===
			`/${tenantUrlName}/${locale}/admin/settings/email/templates/reset_password`
		) {
			title = messages.settings_resetPassword;
			leftButton = this.getLeftButton(
				`/${tenantUrlName}/${locale}/admin/settings/email`
			);
		} else if (
			pathname ===
			`/${tenantUrlName}/${locale}/admin/settings/email/templates/account_activation`
		) {
			title = messages.settings_accountActivation;
			leftButton = this.getLeftButton(
				`/${tenantUrlName}/${locale}/admin/settings/email`
			);
		} else if (
			pathname ===
			`/${tenantUrlName}/${locale}/admin/settings/email/templates/account_info`
		) {
			title = messages.settings_accountInfo;
			leftButton = this.getLeftButton(
				`/${tenantUrlName}/${locale}/admin/settings/email`
			);
		} else if (
			pathname === `/${tenantUrlName}/${locale}/admin/settings/theme`
		) {
			title = messages.settings_themeSettings;
		} else if (
			pathname === `/${tenantUrlName}/${locale}/admin/settings/shipping`
		) {
			title = messages.settings_shippingMethods;
			rightElements = <ShippingMethodListHead />;
		} else if (
			pathname === `/${tenantUrlName}/${locale}/admin/settings/payments`
		) {
			title = messages.settings_paymentsMethods;
			rightElements = <PaymentMethodListHead />;
		} else if (
			pathname === `/${tenantUrlName}/${locale}/admin/settings/shipping/add`
		) {
			title = messages.settings_addShippingMethod;
			leftButton = this.getLeftButton(
				`/${tenantUrlName}/${locale}/admin/settings/shipping`
			);
		} else if (
			pathname === `/${tenantUrlName}/${locale}/admin/settings/payments/add`
		) {
			title = messages.settings_addPaymentMethod;
			leftButton = this.getLeftButton(
				`/${tenantUrlName}/${locale}/admin/settings/payments`
			);
		} else if (
			pathname.startsWith(
				`/${tenantUrlName}/${locale}/admin/settings/shipping/`
			)
		) {
			title = messages.settings_editShippingMethod;
			leftButton = this.getLeftButton(
				`/${tenantUrlName}/${locale}/admin/settings/shipping`
			);
			rightElements = <ShippingMethodHead />;
		} else if (
			pathname.startsWith(
				`/${tenantUrlName}/${locale}/admin/settings/payments/`
			)
		) {
			title = messages.settings_editPaymentMethod;
			leftButton = this.getLeftButton(
				`/${tenantUrlName}/${locale}/admin/settings/payments`
			);
			rightElements = <PaymentMethodHead />;
		} else if (
			pathname === `/${tenantUrlName}/${locale}/admin/settings/general` ||
			pathname === `/${tenantUrlName}/${locale}/admin/settings`
		) {
			title = messages.settings_generalSettings;
		} else if (
			pathname === `/${tenantUrlName}/${locale}/admin/settings/general/logo`
		) {
			title = messages.logo;
			leftButton = this.getLeftButton(
				`/${tenantUrlName}/${locale}/admin/settings`
			);
		} else if (pathname === `/${tenantUrlName}/${locale}/admin/pages`) {
			title = messages.settings_pages;
			rightElements = <PageListHead />;
		} else if (pathname === `/${tenantUrlName}/${locale}/admin/pages/add`) {
			title = messages.settings_addPage;
			leftButton = this.getLeftButton(
				`/${tenantUrlName}/${locale}/admin/pages`
			);
		} else if (
			pathname.startsWith(`/${tenantUrlName}/${locale}/admin/pages/`)
		) {
			title = messages.settings_editPage;
			leftButton = this.getLeftButton(
				`/${tenantUrlName}/${locale}/admin/pages`
			);
			rightElements = <PageHead />;
		} else if (pathname === `/${tenantUrlName}/${locale}/admin/files`) {
			title = messages.files;
			rightElements = <FileListHead />;
		} else if (
			pathname === `/${tenantUrlName}/${locale}/admin/settings/apikeys`
		) {
			title = messages.settings_apiKeys;
			rightElements = <ApiKeyListHead />;
		} else if (
			pathname === `/${tenantUrlName}/${locale}/admin/settings/apikeys/add`
		) {
			title = messages.settings_addApiKey;
			leftButton = this.getLeftButton(
				`/${tenantUrlName}/${locale}/admin/settings/apikeys`
			);
		} else if (pathname.startsWith('/admin/settings/apikeys/')) {
			title = messages.settings_editApiKey;
			leftButton = this.getLeftButton(
				`/${tenantUrlName}/${locale}/admin/settings/apikeys`
			);
		} else if (
			pathname === `/${tenantUrlName}/${locale}/admin/settings/webhooks`
		) {
			title = messages.webhooks;
			rightElements = <WebhooksListHead />;
		} else if (
			pathname === `/${tenantUrlName}/${locale}/admin/settings/webhooks/add`
		) {
			title = messages.webhookAdd;
			leftButton = this.getLeftButton(
				`/${tenantUrlName}/${locale}/admin/settings/webhooks`
			);
		} else if (
			pathname.startsWith(
				`/${tenantUrlName}/${locale}/admin/settings/webhooks/`
			)
		) {
			title = messages.webhookEdit;
			leftButton = this.getLeftButton(
				`/${tenantUrlName}/${locale}/admin/settings/webhooks`
			);
			rightElements = <WebhooksEditHead />;
		} else if (pathname === `/${tenantUrlName}/${locale}/admin/apps`) {
			title = messages.apps;
			rightElements = <AppsHead />;
		} else if (pathname === `/${tenantUrlName}/${locale}/admin/apps/login`) {
			title = messages.loginTitle;
			rightElements = <AppsHead />;
			leftButton = this.getLeftButton(`/${tenantUrlName}/${locale}/admin/apps`);
		} else if (pathname === `/${tenantUrlName}/${locale}/admin/apps/account`) {
			title = messages.account;
			leftButton = this.getLeftButton(`/${tenantUrlName}/${locale}/admin/apps`);
		} else if (
			pathname.startsWith(`/${tenantUrlName}/${locale}/admin/apps/service/`) ||
			pathname.startsWith(`/${tenantUrlName}/${locale}/admin/apps/app/`)
		) {
			title = messages.apps;
			leftButton = this.getLeftButton(`/${tenantUrlName}/${locale}/admin/apps`);
		} else if (pathname === `/${tenantUrlName}/${locale}/admin/tenants`) {
			title = messages.tenants_title;
			if (tenantsSelectedCount > 0) {
				title = `${tenantsSelectedCount} ${messages.selected}`;
			}
			rightElements = <TenantsHead />;
		} else if (pathname === `/${tenantUrlName}/${locale}/admin`) {
			title = messages.dashboard;
		} else if (
			pathname.startsWith(`/${tenantUrlName}/${locale}/admin/tenants/`)
		) {
			title = messages.tenants_titleEdit;
			leftButton = this.getLeftButton(
				`/${tenantUrlName}/${locale}/admin/tenants`
			);
			rightElements = <TenantUpdateHead />;
		} else if (pathname === `/${tenantUrlName}/${locale}/admin/tenants/add`) {
			title = messages.tenants_titleCreate;
			leftButton = this.getLeftButton(
				`/${tenantUrlName}/${locale}/admin/tenants`
			);
		} else if (pathname === `/${tenantUrlName}/${locale}/admin/users`) {
			title = messages.users_title;
			if (usersSelectedCount > 0) {
				title = `${usersSelectedCount} ${messages.selected}`;
			}
			rightElements = <UsersHead />;
		} else if (
			pathname.startsWith(`/${tenantUrlName}/${locale}/admin/users/`)
		) {
			title = messages.users_titleEdit;
			leftButton = this.getLeftButton(
				`/${tenantUrlName}/${locale}/admin/users`
			);
			rightElements = <UserUpdateHead />;
		} else if (pathname === `/${tenantUrlName}/${locale}/admin/users/add`) {
			title = messages.users_titleCreate;
			leftButton = this.getLeftButton(
				`/${tenantUrlName}/${locale}/admin/users`
			);
		} else if (
			pathname.startsWith(`/${tenantUrlName}/${locale}/admin/tenant-info/`)
		) {
			title = messages.tenant_info_title;
		} else if (
			pathname.startsWith(`/${tenantUrlName}/${locale}/admin/personal-info/`)
		) {
			title = messages.personal_info_title;
		} else if (pathname === `/${tenantUrlName}/${locale}/admin/discounts`) {
			title = messages.discounts_title;
			if (discountsSelectedCount > 0) {
				title = `${discountsSelectedCount} ${messages.selected}`;
			}
			rightElements = <DiscountsHead />;
		} else if (
			pathname.startsWith(`/${tenantUrlName}/${locale}/admin/discounts/`)
		) {
			title = messages.discounts_titleEdit;
			leftButton = this.getLeftButton(
				`/${tenantUrlName}/${locale}/admin/discounts`
			);
			rightElements = <DiscountHead />;
		} else if (pathname === `/${tenantUrlName}/${locale}/admin/discounts/add`) {
			title = messages.discounts_titleCreate;
			leftButton = this.getLeftButton(
				`/${tenantUrlName}/${locale}/admin/discounts`
			);
		}
		return (
			<div>
				<AppBar
					className="appBar"
					titleStyle={{ fontSize: 18 }}
					title={title}
					iconElementLeft={leftButton}
					iconElementRight={rightElements}
				/>
				<DrawerMenu
					open={this.state.open}
					onClose={this.handleClose}
					currentUrl={pathname}
				/>
			</div>
		);
	}
}
