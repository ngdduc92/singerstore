import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunkMiddleware from 'redux-thunk';
import { BrowserRouter } from 'react-router-dom';
import { initOnClient } from 'theme';
import reducers from '../shared/reducers';
import * as analytics from '../shared/analytics';
import App from '../shared/app';
import api from './api';
import utils from '../shared/lib/utils';
import { CookiesProvider } from 'react-cookie';

const initialState = window.__APP_STATE__;
const themeText = window.__APP_TEXT__;
const store = createStore(
	reducers,
	initialState,
	applyMiddleware(thunkMiddleware)
);
const tenantUrlName = location.pathname.split('/')[1];
const locale = location.pathname.split('/')[2];

const render = () => {
	const tenantId = localStorage.getItem('tenant_id');
	const token = localStorage.getItem('token');
	api.setTenantId(tenantId ? utils.decrypt(tenantId) : undefined);
	api.setToken(token ? utils.decrypt(token) : undefined);
	initOnClient({
		themeSettings: initialState.app.themeSettings,
		text: themeText,
		locale,
		api,
		tenantUrlName
	});

	ReactDOM.hydrate(
		<Provider store={store}>
			<CookiesProvider>
				<BrowserRouter>
					<App />
				</BrowserRouter>
			</CookiesProvider>
		</Provider>,
		document.getElementById('app')
	);

	analytics.onPageLoad({ state: initialState });

	if ('serviceWorker' in navigator) {
		window.addEventListener('load', () => {
			navigator.serviceWorker
				.register('/sw.js')
				.then(registration => {
					console.log('SW registered.');
				})
				.catch(registrationError => {
					console.log('SW registration failed: ', registrationError);
				});
		});
	}
};

if (localStorage.getItem('tenant_url_name') !== tenantUrlName) {
	utils.removeTenant();
	utils.removeLoginItems();
	api.public.getTenantIdByUrlName(tenantUrlName).then(res => {
		const tenantId = res.json.id;
		if (tenantId) {
			utils.saveTenant({
				tenant_url_name: tenantUrlName,
				tenant_id: utils.encrypt(tenantId)
			});
		}
		render();
	});
} else {
	render();
}
