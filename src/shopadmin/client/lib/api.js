import APIClient from 'singerstore-api-client';
import settings from 'lib/settings';
import utils from '../../../shopfront/shared/lib/utils';

const tenantId = localStorage.getItem('tenant_id');

let data = {
	apiBaseUrl: settings.apiBaseUrl || '/api',
	apiKey: settings.apiKey,
	tenantId: utils.decrypt(tenantId)
};
const token = localStorage.getItem('token');
const webstoreToken = localStorage.getItem('webstore_token');

if (token) {
	data = {
		apiBaseUrl: settings.apiBaseUrl || '/api',
		apiKey: settings.apiKey,
		tenantId: utils.decrypt(tenantId),
		token: utils.decrypt(token),
		webstoreToken: webstoreToken
	};
}
const api = new APIClient(data);

export default api;
