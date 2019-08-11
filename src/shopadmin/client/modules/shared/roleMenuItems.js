import React from 'react';
import MenuItem from 'material-ui/MenuItem';
import roles from 'lib/roles';

const getRoleMenuItems = () => {
	let roleMenuItems = [];
	const roles_arr = [roles.ADMINISTRATOR, roles.SELLER, roles.CUSTOMER];
	roleMenuItems.push(<MenuItem value="" key="none" primaryText="None" />);
	for (const role of roles_arr) {
		roleMenuItems.push(<MenuItem value={role} key={role} primaryText={role} />);
	}
	return roleMenuItems;
};

export default getRoleMenuItems();
