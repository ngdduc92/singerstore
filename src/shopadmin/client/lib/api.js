import APIClient from 'eshop-client';
import settings from 'lib/settings';
import utils from '../../../shopfront/shared/lib/utils';

const tenantId = localStorage.getItem('tenant_id');

let data = {
	apiBaseUrl: settings.apiBaseUrl || '/api',
	apiKey: settings.apiKey,
	tenantId: utils.decrypt(tenantId)
};
const token = localStorage.getItem('token');

if (token) {
	data = {
		apiBaseUrl: settings.apiBaseUrl || '/api',
		apiKey: settings.apiKey,
		tenantId: utils.decrypt(tenantId),
		token: utils.decrypt(token)
	};
}
const api = new APIClient(data);

export default api;
