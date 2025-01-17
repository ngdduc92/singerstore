import messages from 'lib/text';
import settings from 'lib/settings';
import { fetchOrders } from 'modules/orders/actions';
import utils from '../../../shopfront/shared/lib/utils';

const AUTO_RECONNECT_INTERVAL = 1000; //1 seconds
const ORDER_CREATED = 'order.created';
let store = null;

export const connectToWebSocket = reduxStore => {
	store = reduxStore;
	connect();
};

const connect = () => {
	const wsUrl =
		settings.apiWebSocketUrl && settings.apiWebSocketUrl.length > 0
			? settings.apiWebSocketUrl
			: getWebSocketUrlFromCurrentLocation();

	const token = localStorage.getItem('token');
	if (token) {
		const ws = new WebSocket(`${wsUrl}/ws/dashboard?token=${utils.decrypt(token)}`);

		ws.onmessage = onMessage;
		ws.onopen = onOpen;
		ws.onclose = onClose;
		ws.onerror = onError;
	}
};

const getWebSocketUrlFromCurrentLocation = () => {
	const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
	return `${wsProtocol}//${window.location.host}`;
};

const onMessage = event => {
	try {
		const message = JSON.parse(event.data);
		eventHandler(message);
	} catch (err) {}
};

const onOpen = () => {
	console.log('Connection established.');
};

const onError = () => {};

const onClose = event => {
	if (event.code !== 1000) {
		
		console.log(`WebSocket connection closed with code: ${event.code}.`);
		// try to reconnect
		setTimeout(() => {
			connect();
		}, AUTO_RECONNECT_INTERVAL);
	}
};

const showNotification = (title, body, requireInteraction = false) => {
	let msg = new Notification(title, {
		body: body,
		tag: 'dashboard',
		requireInteraction: requireInteraction
	});

	msg.addEventListener('click', event => {
		parent.focus();
		event.target.close();
	});
};

const eventHandler = ({ event, payload }) => {
	switch (event) {
		case ORDER_CREATED:
			const order = payload;
			store.dispatch(fetchOrders());
			showNotification(
				`${messages.order} #${order.number}`,
				`${order.shipping_address.full_name}, ${order.shipping_address.city}`,
				true
			);
			break;
		default:
			break;
	}
};
