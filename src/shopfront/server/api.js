import APIClient from 'eshop-client';
import serverSettings from './settings';

const api = new APIClient({
	apiBaseUrl: serverSettings.apiBaseUrl,
	apiKey: serverSettings.apiKey
});

export default api;
