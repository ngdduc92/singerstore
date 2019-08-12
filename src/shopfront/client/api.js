import APIClient from 'eshop-client';
import clientSettings from './settings';

const api = new APIClient({
	apiBaseUrl: clientSettings.apiBaseUrl,
	apiKey: clientSettings.apiKey
});

export default api;
