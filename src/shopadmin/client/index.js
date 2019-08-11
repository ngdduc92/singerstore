import '../../../public/admin-assets/css/flexboxgrid.min.css';
import '../../../public/admin-assets/css/style.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunkMiddleware from 'redux-thunk';
import { fetchSettings } from 'modules/settings/actions';
import { connectToWebSocket } from 'lib/apiWebSocket';
import reducers from './rootReducer';
import App from './app';

const store = createStore(reducers, applyMiddleware(thunkMiddleware));
store.dispatch(fetchSettings());

if (window.WebSocket) {
	connectToWebSocket(store);
} else {
	console.log('WebSocket is not supported by your browser.');
}

ReactDOM.render(
	<Provider store={store}>
		<App />
	</Provider>,
	document.getElementById('app')
);
