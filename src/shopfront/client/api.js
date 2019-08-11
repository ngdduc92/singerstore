import APIClient from 'singerstore-api-client';
import clientSettings from './settings';

const api = new APIClient({
	apiBaseUrl: clientSettings.apiBaseUrl,
	apiKey: clientSettings.apiKey
});

export default api;
