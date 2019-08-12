import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import messages from 'lib/text';
import Paper from 'material-ui/Paper';
import Divider from 'material-ui/Divider';
import FontIcon from 'material-ui/FontIcon';
import { List, ListItem } from 'material-ui/List';
import scopes from 'lib/scopes';
import userScopes from 'lib/userScopes';

export default class EmailSettings extends React.Component {
	constructor(props) {
		super(props);
	}

	getListItem(primaryText) {
		return (
			<ListItem
				rightIcon={
					<FontIcon className="material-icons">keyboard_arrow_right</FontIcon>
				}
				primaryText={primaryText}
			/>
		);
	}

	render() {
		const tenantUrlName = localStorage.getItem('tenant_url_name');
		const locale = location.pathname.split('/')[2];
		const accountActivationListItem = this.getListItem(
			messages.settings_accountActivation
		);
		const accountInfoListItem = this.getListItem(messages.settings_accountInfo);
		const orderConfirmationListItem = this.getListItem(
			messages.settings_orderConfirmation
		);
		const resetPasswordListItem = this.getListItem(
			messages.settings_resetPassword
		);
		return (
			<div>
				{userScopes.includes(scopes.READ_SMTP) && (
					<Fragment>
						<div style={{ margin: 20, color: 'rgba(0, 0, 0, 0.52)' }}>
							{messages.settings_smtp}
						</div>
						<Paper className="paper-box" zDepth={1}>
							<div style={{ width: '100%' }}>
								<List style={{ padding: 0 }}>
									<Link
										to={`/${tenantUrlName}/${locale}/admin/settings/email/smtp`}
										style={{ textDecoration: 'none' }}
									>
										<ListItem
											rightIcon={
												<FontIcon className="material-icons">
													keyboard_arrow_right
												</FontIcon>
											}
											primaryText={
												<div className="row">
													<div className="col-xs-6">
														{messages.settings_smtpSettings}
													</div>
												</div>
											}
										/>
									</Link>
								</List>
							</div>
						</Paper>
					</Fragment>
				)}
				<div style={{ margin: 20, color: 'rgba(0, 0, 0, 0.52)' }}>
					{messages.settings_emailTemplates}
				</div>
				<Paper className="paper-box" zDepth={1}>
					<div style={{ width: '100%' }}>
						<List style={{ padding: 0 }}>
							{userScopes.includes(scopes.READ_EMAIL_TEMPLATE) ? (
								<Fragment>
									<Link
										to={`/${tenantUrlName}/${locale}/admin/settings/email/templates/account_activation`}
										style={{ textDecoration: 'none' }}
									>
										{accountActivationListItem}
									</Link>
									<Divider />
									<Link
										to={`/${tenantUrlName}/${locale}/admin/settings/email/templates/account_info`}
										style={{ textDecoration: 'none' }}
									>
										{accountInfoListItem}
									</Link>
									<Divider />
									<Link
										to={`/${tenantUrlName}/${locale}/admin/settings/email/templates/order_confirmation`}
										style={{ textDecoration: 'none' }}
									>
										{orderConfirmationListItem}
									</Link>
									<Divider />
									<Link
										to={`/${tenantUrlName}/${locale}/admin/settings/email/templates/reset_password`}
										style={{ textDecoration: 'none' }}
									>
										{resetPasswordListItem}
									</Link>
								</Fragment>
							) : (
								<Fragment>
									{accountActivationListItem}
									<Divider />
									{accountInfoListItem}
									<Divider />
									{orderConfirmationListItem}
									<Divider />
									{resetPasswordListItem}
								</Fragment>
							)}
						</List>
					</div>
				</Paper>
			</div>
		);
	}
}
