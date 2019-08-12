import React from 'react';
import { Link } from 'react-router-dom';
import Checkbox from 'material-ui/Checkbox';
import { ListItem } from 'material-ui/List';
import Divider from 'material-ui/Divider';
import FontIcon from 'material-ui/FontIcon';
import * as helper from 'lib/helper';
import style from './style.css';
import scopes from 'lib/scopes';
import userScopes from 'lib/userScopes';

const CustomersListItem = ({ customer, onSelect, selected, settings }) => {
	const checked = selected.includes(customer.id);
	let totalSpentFormatted = helper.formatCurrency(
		customer.total_spent,
		settings
	);
	const tenantUrlName = location.pathname.split('/')[1];
	const locale = location.pathname.split('/')[2];

	return (
		<div className={'customers-item' + (checked === true ? ' selected' : '')}>
			<ListItem
				style={{ cursor: 'normal' }}
				primaryText={
					<div className="row middle-xs">
						<div className="col-xs-1">
							<Checkbox
								checked={checked}
								onCheck={(event, isInputChecked) => {
									onSelect(customer.id, isInputChecked);
								}}
							/>
						</div>
						<div className="col-xs-4">
							{userScopes.includes(scopes.READ_CUSTOMER) ? (
								<Link
									to={`/${tenantUrlName}/${locale}/admin/customer/${customer.id}`}
									className={style.customerName}
								>
									{customer.email}
									<br />
									<small>{customer.group_name}</small>
								</Link>
							) : (
								customer.email
							)}
						</div>
						<div className={'col-xs-4 ' + style.location}>
							{customer.shipping && customer.shipping.city && (
								<span>
									<FontIcon
										style={{
											color: 'rgba(0, 0, 0, 0.4)',
											fontSize: 16,
											marginRight: 6
										}}
										className="material-icons"
									>
										place
									</FontIcon>
									{customer.shipping.city}
								</span>
							)}
						</div>
						<div className="col-xs-1">{customer.orders_count || 0}</div>
						<div className="col-xs-2">
							<div className={style.price}>{totalSpentFormatted}</div>
						</div>
					</div>
				}
			/>
			<Divider />
		</div>
	);
};

export default CustomersListItem;
