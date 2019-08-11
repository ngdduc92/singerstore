import React from 'react';
import { Link } from 'react-router-dom';
import messages from 'lib/text';
import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';
import scopes from 'lib/scopes';
import userScopes from 'lib/userScopes';

const Buttons = () => {
	const tenantUrlName = localStorage.getItem('tenant_url_name');
	const locale = location.pathname.split('/')[2];
	return (
		userScopes.includes(scopes.WRITE_PAGE) && (
			<span>
				<Link to={`/${tenantUrlName}/${locale}/admin/pages/add`}>
					<IconButton
						touch={true}
						tooltipPosition="bottom-left"
						tooltip={messages.settings_addPage}
					>
						<FontIcon color="#fff" className="material-icons">
							add
						</FontIcon>
					</IconButton>
				</Link>
			</span>
		)
	);
};

export default Buttons;
