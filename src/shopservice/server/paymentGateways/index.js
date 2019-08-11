import OrdersService from '../services/orders/orders';
import SettingsService from '../services/settings/settings';
import PaymentGatewaysService from '../services/settings/paymentGateways';
import PayPalCheckout from './PayPalCheckout';
import LiqPay from './LiqPay';
import StripeElements from './StripeElements';

const getOptions = (tenantId, orderId) => {
	return Promise.all([
		OrdersService.getSingleOrder(tenantId, orderId),
		SettingsService.getSettings(tenantId)
	]).then(([order, settings]) => {
		if (order && order.payment_method_id) {
			return PaymentGatewaysService.getGateway(
				order.payment_method_gateway
			).then(gatewaySettings => {
				const options = {
					gateway: order.payment_method_gateway,
					gatewaySettings: gatewaySettings,
					order: order,
					amount: order.grand_total,
					currency: settings.currency_code
				};

				return options;
			});
		}
	});
};

const getPaymentFormSettings = (tenantId, orderId) => {
	return getOptions(tenantId, orderId).then(options => {
		switch (options.gateway) {
			case 'paypal-checkout':
				return PayPalCheckout.getPaymentFormSettings(options);
			case 'liqpay':
				return LiqPay.getPaymentFormSettings(options);
			case 'stripe-elements':
				return StripeElements.getPaymentFormSettings(options);
			default:
				return Promise.reject('Invalid gateway');
		}
	});
};

const paymentNotification = (req, res, gateway) => {
	const tenantId = req.get('x-tenant-id');
	return PaymentGatewaysService.getGateway(gateway).then(gatewaySettings => {
		const options = {
			gateway: gateway,
			gatewaySettings: gatewaySettings,
			req: req,
			res: res
		};

		switch (gateway) {
			case 'paypal-checkout':
				return PayPalCheckout.paymentNotification(tenantId, options);
			case 'liqpay':
				return LiqPay.paymentNotification(tenantId, options);
			default:
				return Promise.reject('Invalid gateway');
		}
	});
};

const processOrderPayment = async (tenantId, order) => {
	const orderAlreadyCharged = order.paid === true;
	if (orderAlreadyCharged) {
		return true;
	}

	const gateway = order.payment_method_gateway;
	const gatewaySettings = await PaymentGatewaysService.getGateway(gateway);
	const settings = await SettingsService.getSettings(tenantId);

	switch (gateway) {
		case 'stripe-elements':
			return StripeElements.processOrderPayment({
				tenantId,
				order,
				gatewaySettings,
				settings
			});
		default:
			return Promise.reject('Invalid gateway');
	}
};

export default {
	getPaymentFormSettings: getPaymentFormSettings,
	paymentNotification: paymentNotification,
	processOrderPayment: processOrderPayment
};
