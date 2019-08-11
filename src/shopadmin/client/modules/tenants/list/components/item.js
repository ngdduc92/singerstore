import React from 'react';
import { Link } from 'react-router-dom';
import Divider from 'material-ui/Divider';
import messages from 'lib/text';
import style from './style.css';
import Checkbox from 'material-ui/Checkbox';
import { ListItem } from 'material-ui/List';
import scopes from 'lib/scopes';
import userScopes from 'lib/userScopes';

const TenantItem = ({ tenant, onSelect, selected, settings }) => {
	let tenantClass = style.tenantName;
	tenantClass += ' ' + style.tenantActive;
	const tenantName =
		tenant.name && tenant.name.length > 0 ? tenant.name : `<${messages.draft}>`;
	const tenantUrlName = localStorage.getItem('tenant_url_name');
	const locale = location.pathname.split('/')[2];
	return (
		<div className={'tenants-item' + (selected === true ? ' selected' : '')}>
			<ListItem
				style={{ cursor: 'normal' }}
				primaryText={
					<div className="row middle-xs">
						<div className="col-xs-1">
							<Checkbox
								checked={selected}
								onCheck={(event, isInputChecked) => {
									onSelect(tenant.id, isInputChecked);
								}}
							/>
						</div>
						<div className="col-xs-3">
							{userScopes.includes(scopes.READ_TENANT) ? (
								<Link
									to={`/${tenantUrlName}/${locale}/admin/tenants/${tenant.id}`}
									className={tenantClass}
								>
									{tenantName}
								</Link>
							) : (
								tenantName
							)}
						</div>
						<div className={'col-xs-3'}>{tenant.email}</div>
						<div className={'col-xs-5'}>{tenant.address}</div>
					</div>
				}
			/>
			<Divider />
		</div>
	);
};

export default TenantItem;
