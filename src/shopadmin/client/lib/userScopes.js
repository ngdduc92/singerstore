import rolesScopes from '../../../shopservice/server/lib/rolesScopes';

const getUserScopes = (role) => {
	let userScopes = [];
	rolesScopes.map(item => item.role === role ? userScopes = item.scopes : null);
	return userScopes;
};

export default getUserScopes(localStorage.getItem('role'));