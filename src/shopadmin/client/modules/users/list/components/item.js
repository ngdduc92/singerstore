import React from 'react';
import { Link } from 'react-router-dom';
import Divider from 'material-ui/Divider';
import style from './style.css';
import Checkbox from 'material-ui/Checkbox';
import { ListItem } from 'material-ui/List';
import scopes from 'lib/scopes';
import userScopes from 'lib/userScopes';

const UserItem = ({ user, onSelect, selected, settings }) => {
	let userClass = style.userName;
	userClass += ' ' + style.userActive;
	const tenantUrlName = localStorage.getItem('tenant_url_name');
	const locale = location.pathname.split('/')[2];
	return (
		<div className={'users-item' + (selected === true ? ' selected' : '')}>
			<ListItem
				style={{ cursor: 'normal' }}
				primaryText={
					<div className="row middle-xs">
						<div className="col-xs-1">
							<Checkbox
								checked={selected}
								onCheck={(event, isInputChecked) => {
									onSelect(user.id, isInputChecked);
								}}
							/>
						</div>
						<div className="col-xs-4">
							{userScopes.includes(scopes.READ_USER) ? (
								<Link
									to={`/${tenantUrlName}/${locale}/admin/users/${user.id}`}
									className={userClass}
								>
									{user.email}
								</Link>
							) : (
								user.email
							)}
						</div>
						<div className={'col-xs-4'}>{user.tel}</div>
						<div className={'col-xs-3'}>{user.role}</div>
					</div>
				}
			/>
			<Divider />
		</div>
	);
};

export default UserItem;
