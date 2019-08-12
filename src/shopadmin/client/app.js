import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Login from 'routes/login';
import Logout from 'routes/logout';
import OrdersBar from 'routes/ordersBar';
import NotFound from 'routes/notFound';
import Products from 'routes/products';
import ProductDetails from 'routes/products/edit';
import ProductCategories from 'routes/products/categories';
import Customers from 'routes/customers';
import CustomerDetails from 'routes/customers/edit';
import CustomerGroups from 'routes/customers/groups';
import Orders from 'routes/orders';
import OrderDetails from 'routes/orders/edit';
import OrderStatuses from 'routes/orders/statuses';
import Pages from 'routes/pages';
import PagesDetails from 'routes/pages/edit';
import Settings from 'routes/settings';
import Tenants from 'routes/tenants';
import TenantDetails from 'routes/tenants/edit';
import TenantNew from 'routes/tenants/create';
import TenantInfo from 'routes/tenants/tenantInfo';
import Users from 'routes/users';
import UserNew from 'routes/users/create';
import UserDetails from 'routes/users/edit';
import PersonalInfo from 'routes/users/personalInfo';
import Discounts from 'routes/discounts';
import DiscountNew from 'routes/discounts/create';
import DiscountDetails from 'routes/discounts/edit';
import ResetPassword from 'routes/resetPassword';
import { Auth } from './lib/auth';
import Head from './modules/head';
import {
	blue700,
	cyan700,
	pinkA200,
	grey100,
	grey300,
	grey400,
	white,
	darkBlack,
	fullBlack
} from 'material-ui/styles/colors';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import scopes from 'lib/scopes';
import userScopes from 'lib/userScopes';

const muiTheme = getMuiTheme({
	fontFamily: 'Roboto, sans-serif',
	palette: {
		primary1Color: blue700,
		primary2Color: cyan700,
		primary3Color: grey400,
		accent1Color: pinkA200,
		accent2Color: grey100,
		accent3Color: blue700,
		textColor: darkBlack,
		alternateTextColor: white,
		canvasColor: white,
		borderColor: grey300,
		pickerHeaderColor: blue700,
		shadowColor: fullBlack
	},
	appBar: {}
});

export default () => (
	<Router>
		<MuiThemeProvider muiTheme={muiTheme}>
			<div id="container">
				<div id="headContainer">
					<Head />
				</div>
				<div id="bodyContainer">
					<Switch>
						{userScopes.includes(scopes.LIST_ORDER) && (
							<Route
								path="/:tenantUrlName/:locale/admin"
								exact
								component={Auth(OrdersBar)}
							/>
						)}
						{userScopes.includes(scopes.LIST_PRODUCT) && (
							<Route
								path="/:tenantUrlName/:locale/admin/products"
								exact
								component={Auth(Products)}
							/>
						)}
						{userScopes.includes(scopes.LIST_PRODUCT_CATEGORY) && (
							<Route
								path="/:tenantUrlName/:locale/admin/products/categories"
								exact
								component={Auth(ProductCategories)}
							/>
						)}
						{userScopes.includes(scopes.LIST_ORDER) && (
							<Route
								path="/:tenantUrlName/:locale/admin/orders"
								exact
								component={Auth(Orders)}
							/>
						)}
						{userScopes.includes(scopes.LIST_ORDER_STATUS) && (
							<Route
								path="/:tenantUrlName/:locale/admin/orders/statuses"
								exact
								component={Auth(OrderStatuses)}
							/>
						)}
						{userScopes.includes(scopes.READ_ORDER) && (
							<Route
								path="/:tenantUrlName/:locale/admin/orders/:orderId"
								exact
								component={Auth(OrderDetails)}
							/>
						)}
						{userScopes.includes(scopes.LIST_CUSTOMER) && (
							<Route
								path="/:tenantUrlName/:locale/admin/customers"
								exact
								component={Auth(Customers)}
							/>
						)}
						{userScopes.includes(scopes.LIST_CUSTOMER_GROUP) && (
							<Route
								path="/:tenantUrlName/:locale/admin/customers/groups"
								exact
								component={Auth(CustomerGroups)}
							/>
						)}
						{userScopes.includes(scopes.READ_CUSTOMER) && (
							<Route
								path="/:tenantUrlName/:locale/admin/customer/:customerId"
								exact
								component={Auth(CustomerDetails)}
							/>
						)}
						{userScopes.includes(scopes.READ_PRODUCT) && (
							<Route
								path="/:tenantUrlName/:locale/admin/products/:productId"
								component={Auth(ProductDetails)}
							/>
						)}
						{userScopes.includes(scopes.READ_PAGE_SETTINGS) && (
							<Route
								path="/:tenantUrlName/:locale/admin/pages"
								exact
								component={Auth(Pages)}
							/>
						)}
						{userScopes.includes(scopes.WRITE_PAGE) && (
							<Route
								path="/:tenantUrlName/:locale/admin/pages/add"
								exact
								component={Auth(PagesDetails)}
							/>
						)}
						{userScopes.includes(scopes.READ_PAGE) && (
							<Route
								path="/:tenantUrlName/:locale/admin/pages/:pageId"
								exact
								component={Auth(PagesDetails)}
							/>
						)}
						{userScopes.includes(scopes.READ_SETTINGS) && (
							<Route
								path="/:tenantUrlName/:locale/admin/settings"
								component={Auth(Settings)}
							/>
						)}
						{userScopes.includes(scopes.LIST_TENANT) && (
							<Route
								path="/:tenantUrlName/:locale/admin/tenants"
								exact
								component={Auth(Tenants)}
							/>
						)}
						{userScopes.includes(scopes.WRITE_TENANT) && (
							<Route
								path="/:tenantUrlName/:locale/admin/tenants/add"
								exact
								component={Auth(TenantNew)}
							/>
						)}
						{userScopes.includes(scopes.READ_TENANT) && (
							<Route
								path="/:tenantUrlName/:locale/admin/tenants/:tenantId"
								exact
								component={Auth(TenantDetails)}
							/>
						)}
						{userScopes.includes(scopes.LIST_USER) && (
							<Route
								path="/:tenantUrlName/:locale/admin/users"
								exact
								component={Auth(Users)}
							/>
						)}
						{userScopes.includes(scopes.WRITE_USER) && (
							<Route
								path="/:tenantUrlName/:locale/admin/users/add"
								exact
								component={Auth(UserNew)}
							/>
						)}
						{userScopes.includes(scopes.READ_USER) && (
							<Route
								path="/:tenantUrlName/:locale/admin/users/:userId"
								exact
								component={Auth(UserDetails)}
							/>
						)}
						{userScopes.includes(scopes.READ_TENANT) && (
							<Route
								path="/:tenantUrlName/:locale/admin/tenant-info/:tenantId"
								exact
								component={Auth(TenantInfo)}
							/>
						)}
						{userScopes.includes(scopes.READ_USER) && (
							<Route
								path="/:tenantUrlName/:locale/admin/personal-info/:userId"
								exact
								component={Auth(PersonalInfo)}
							/>
						)}
						{userScopes.includes(scopes.LIST_DISCOUNT) && (
							<Route
								path="/:tenantUrlName/:locale/admin/discounts"
								exact
								component={Auth(Discounts)}
							/>
						)}
						{userScopes.includes(scopes.WRITE_DISCOUNT) && (
							<Route
								path="/:tenantUrlName/:locale/admin/discounts/add"
								exact
								component={Auth(DiscountNew)}
							/>
						)}
						{userScopes.includes(scopes.READ_DISCOUNT) && (
							<Route
								path="/:tenantUrlName/:locale/admin/discounts/:discountId"
								exact
								component={Auth(DiscountDetails)}
							/>
						)}
						<Route
							path="/:tenantUrlName/:locale/admin/login"
							exact
							component={Auth(Login)}
						/>
						<Route
							path="/:tenantUrlName/:locale/admin/logout"
							exact
							component={Auth(Logout)}
						/>
						<Route
							path="/:tenantUrlName/:locale/admin/reset-password"
							exact
							component={Auth(ResetPassword)}
						/>
						<Route component={NotFound} />
					</Switch>
				</div>
			</div>
		</MuiThemeProvider>
	</Router>
);
