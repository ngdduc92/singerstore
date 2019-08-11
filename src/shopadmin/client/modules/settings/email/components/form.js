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

	render() {
		let smtp = null;
		const tenantUrlName = localStorage.getItem('tenant_url_name');
		const locale = location.pathname.split('/')[2];
		if (userScopes.includes(scopes.READ_SMTP)) {
			smtp = (
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
			);
		}

		return (
			<div>
				{smtp}
				<div style={{ margin: 20, color: 'rgba(0, 0, 0, 0.52)' }}>
					{messages.settings_emailTemplates}
				</div>
				<Paper className="paper-box" zDepth={1}>
					<div style={{ width: '100%' }}>
						<List style={{ padding: 0 }}>
							<Link
								to={`/${tenantUrlName}/${locale}/admin/settings/email/templates/account_activation`}
								style={{ textDecoration: 'none' }}
							>
								<ListItem
									rightIcon={
										<FontIcon className="material-icons">
											keyboard_arrow_right
										</FontIcon>
									}
									primaryText={messages.settings_accountActivation}
								/>
							</Link>
							<Divider />
							<Link
								to={`/${tenantUrlName}/${locale}/admin/settings/email/templates/account_info`}
								style={{ textDecoration: 'none' }}
							>
								<ListItem
									rightIcon={
										<FontIcon className="material-icons">
											keyboard_arrow_right
										</FontIcon>
									}
									primaryText={messages.settings_accountInfo}
								/>
							</Link>
							<Divider />
							<Link
								to={`/${tenantUrlName}/${locale}/admin/settings/email/templates/order_confirmation`}
								style={{ textDecoration: 'none' }}
							>
								<ListItem
									rightIcon={
										<FontIcon className="material-icons">
											keyboard_arrow_right
										</FontIcon>
									}
									primaryText={messages.settings_orderConfirmation}
								/>
							</Link>
							<Divider />
							<Link
								to={`/${tenantUrlName}/${locale}/admin/settings/email/templates/reset_password`}
								style={{ textDecoration: 'none' }}
							>
								<ListItem
									rightIcon={
										<FontIcon className="material-icons">
											keyboard_arrow_right
										</FontIcon>
									}
									primaryText={messages.settings_resetPassword}
								/>
							</Link>
						</List>
					</div>
				</Paper>
			</div>
		);
	}
}
