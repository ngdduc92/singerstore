import React from 'react';
import { Link } from 'react-router-dom';
import messages from 'lib/text';
import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';

const Buttons = () => {
	const tenantUrlName = localStorage.getItem('tenant_url_name');
	const locale = location.pathname.split('/')[2];
	return (
		<span>
			<Link to={`/${tenantUrlName}/${locale}/admin/settings/apikeys/add`}>
				<IconButton
					touch={true}
					tooltipPosition="bottom-left"
					tooltip={messages.settings_addApiKey}
				>
					<FontIcon color="#fff" className="material-icons">
						add
					</FontIcon>
				</IconButton>
			</Link>
		</span>
	);
};

export default Buttons;
