import React from 'react';
import { Switch, Route, NavLink } from 'react-router-dom';
import messages from 'lib/text';
import { List, ListItem } from 'material-ui/List';
import FontIcon from 'material-ui/FontIcon';
import General from 'modules/settings/general';
import GeneralLogo from 'modules/settings/generalLogo';
import Theme from 'modules/settings/themeSettings';
import Shipping from 'modules/settings/shipping';
import ShippingEdit from 'modules/settings/shippingEdit';
import Payments from 'modules/settings/payments';
import PaymentsEdit from 'modules/settings/paymentsEdit';
import Email from 'modules/settings/email';
import Smtp from 'modules/settings/smtp';
import EmailTemplate from 'modules/settings/emailTemplates';
import ApiKeys from 'modules/settings/securityKeys/list';
import ApiKeysEdit from 'modules/settings/securityKeys/edit';
import Webhooks from 'modules/settings/webhooks/list';
import WebhooksEdit from 'modules/settings/webhooks/edit';
import { Auth } from 'lib/auth';
import scopes from 'lib/scopes';
import userScopes from 'lib/userScopes';

const styles = {
	link: {
		color: 'inherit',
		textDecoration: 'none',
		fontWeight: 'inherit',
		display: 'block'
	},
	linkActive: {
		backgroundColor: 'rgba(0,0,0,0.1)'
	}
};

const tenantUrlName = localStorage.getItem('tenant_url_name');
const locale = location.pathname.split('/')[2];

const SettingsMenu = () => (
	<List>
		{userScopes.includes(scopes.READ_GENERAL_SETTINGS) && (
			<NavLink
				style={styles.link}
				activeStyle={styles.linkActive}
				to={`/${tenantUrlName}/${locale}/admin/settings`}
				exact={true}
			>
				<ListItem
					primaryText={messages.settings_general}
					leftIcon={<FontIcon className="material-icons">settings</FontIcon>}
				/>
			</NavLink>
		)}
		{userScopes.includes(scopes.LIST_SHIPPING_METHOD) && (
			<NavLink
				style={styles.link}
				activeStyle={styles.linkActive}
				to={`/${tenantUrlName}/${locale}/admin/settings/shipping`}
			>
				<ListItem
					primaryText={messages.settings_shipping}
					leftIcon={
						<FontIcon className="material-icons">local_shipping</FontIcon>
					}
				/>
			</NavLink>
		)}
		{userScopes.includes(scopes.LIST_PAYMENT_METHOD) && (
			<NavLink
				style={styles.link}
				activeStyle={styles.linkActive}
				to={`/${tenantUrlName}/${locale}/admin/settings/payments`}
			>
				<ListItem
					primaryText={messages.settings_payments}
					leftIcon={<FontIcon className="material-icons">payment</FontIcon>}
				/>
			</NavLink>
		)}
		{userScopes.includes(scopes.READ_THEME_SETTINGS) && (
			<NavLink
				style={styles.link}
				activeStyle={styles.linkActive}
				to={`/${tenantUrlName}/${locale}/admin/settings/theme`}
			>
				<ListItem
					primaryText={messages.settings_theme}
					leftIcon={<FontIcon className="material-icons">palette</FontIcon>}
				/>
			</NavLink>
		)}
		{userScopes.includes(scopes.READ_EMAIL_SETTINGS) && (
			<NavLink
				style={styles.link}
				activeStyle={styles.linkActive}
				to={`/${tenantUrlName}/${locale}/admin/settings/email`}
			>
				<ListItem
					primaryText={messages.settings_emails}
					leftIcon={<FontIcon className="material-icons">email</FontIcon>}
				/>
			</NavLink>
		)}
		{userScopes.includes(scopes.LIST_API_KEY) && (
			<NavLink
				style={styles.link}
				activeStyle={styles.linkActive}
				to={`/${tenantUrlName}/${locale}/admin/settings/apikeys`}
			>
				<ListItem
					primaryText={messages.settings_apiKeys}
					leftIcon={<FontIcon className="material-icons">vpn_key</FontIcon>}
				/>
			</NavLink>
		)}
		{userScopes.includes(scopes.LIST_WEBHOOK) && (
			<NavLink
				style={styles.link}
				activeStyle={styles.linkActive}
				to={`/${tenantUrlName}/${locale}/admin/settings/webhooks`}
			>
				<ListItem
					primaryText={messages.webhooks}
					leftIcon={<FontIcon className="material-icons">http</FontIcon>}
				/>
			</NavLink>
		)}
	</List>
);

const Settings = ({ match }) => {
	return (
		<div className="row row--no-gutter col-full-height">
			<div className="col-xs-12 col-sm-4 col-md-3 col--no-gutter scroll col-full-height">
				<SettingsMenu />
			</div>
			<div className="col-xs-12 col-sm-8 col-md-9 col--no-gutter scroll col-full-height">
				<Switch>
					{userScopes.includes(scopes.READ_GENERAL_SETTINGS) && (
						<Route
							path="/:tenantUrlName/:locale/admin/settings"
							exact
							component={Auth(General)}
						/>
					)}
					{userScopes.includes(scopes.READ_GENERAL_SETTINGS) && (
						<Route
							path="/:tenantUrlName/:locale/admin/settings/general/logo"
							exact
							component={Auth(GeneralLogo)}
						/>
					)}
					{userScopes.includes(scopes.READ_THEME_SETTINGS) &&
						userScopes.includes(scopes.WRITE_THEME_SETTINGS) && (
							<Route
								path="/:tenantUrlName/:locale/admin/settings/theme"
								exact
								component={Auth(Theme)}
							/>
						)}
					{userScopes.includes(scopes.LIST_SHIPPING_METHOD) && (
						<Route
							path="/:tenantUrlName/:locale/admin/settings/shipping"
							exact
							component={Auth(Shipping)}
						/>
					)}
					{userScopes.includes(scopes.WRITE_SHIPPING_METHOD) && (
						<Route
							path="/:tenantUrlName/:locale/admin/settings/shipping/add"
							exact
							component={Auth(ShippingEdit)}
						/>
					)}
					{userScopes.includes(scopes.READ_SHIPPING_METHOD) && (
						<Route
							path="/:tenantUrlName/:locale/admin/settings/shipping/:methodId"
							exact
							component={Auth(ShippingEdit)}
						/>
					)}
					{userScopes.includes(scopes.LIST_PAYMENT_METHOD) && (
						<Route
							path="/:tenantUrlName/:locale/admin/settings/payments"
							exact
							component={Auth(Payments)}
						/>
					)}
					{userScopes.includes(scopes.WRITE_PAYMENT_METHOD) && (
						<Route
							path="/:tenantUrlName/:locale/admin/settings/payments/add"
							exact
							component={Auth(PaymentsEdit)}
						/>
					)}
					{userScopes.includes(scopes.READ_PAYMENT_METHOD) && (
						<Route
							path="/:tenantUrlName/:locale/admin/settings/payments/:methodId"
							exact
							component={Auth(PaymentsEdit)}
						/>
					)}
					{userScopes.includes(scopes.LIST_API_KEY) && (
						<Route
							path="/:tenantUrlName/:locale/admin/settings/apikeys"
							exact
							component={Auth(ApiKeys)}
						/>
					)}
					{userScopes.includes(scopes.WRITE_API_KEY) && (
						<Route
							path="/:tenantUrlName/:locale/admin/settings/apikeys/add"
							exact
							component={Auth(ApiKeysEdit)}
						/>
					)}
					{userScopes.includes(scopes.READ_API_KEY) && (
						<Route
							path="/:tenantUrlName/:locale/admin/settings/apikeys/:apiKeyId"
							exact
							component={Auth(ApiKeysEdit)}
						/>
					)}
					{userScopes.includes(scopes.READ_EMAIL_SETTINGS) && (
						<Route
							path="/:tenantUrlName/:locale/admin/settings/email"
							exact
							component={Auth(Email)}
						/>
					)}
					{userScopes.includes(scopes.READ_SMTP) && (
						<Route
							path="/:tenantUrlName/:locale/admin/settings/email/smtp"
							exact
							component={Auth(Smtp)}
						/>
					)}
					{userScopes.includes(scopes.READ_EMAIL_TEMPLATE) && (
						<Route
							path="/:tenantUrlName/:locale/admin/settings/email/templates/:templateName"
							exact
							component={Auth(EmailTemplate)}
						/>
					)}
					{userScopes.includes(scopes.LIST_WEBHOOK) && (
						<Route
							path="/:tenantUrlName/:locale/admin/settings/webhooks"
							exact
							component={Auth(Webhooks)}
						/>
					)}
					{userScopes.includes(scopes.WRITE_WEBHOOK) && (
						<Route
							path="/:tenantUrlName/:locale/admin/settings/webhooks/add"
							exact
							component={Auth(WebhooksEdit)}
						/>
					)}
					{userScopes.includes(scopes.READ_WEBHOOK) && (
						<Route
							path="/:tenantUrlName/:locale/admin/settings/webhooks/:webhookId"
							exact
							component={Auth(WebhooksEdit)}
						/>
					)}
				</Switch>
			</div>
		</div>
	);
};

export default Settings;
