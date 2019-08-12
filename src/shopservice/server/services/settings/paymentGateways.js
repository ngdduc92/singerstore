import { db } from '../../lib/mongo';
import parse from '../../lib/parse';

class PaymentGatewaysService {
	constructor() {}

	getGateway(tenantId, gatewayName) {
		return db
			.collection('paymentGateways')
			.findOne({
				name: gatewayName,
				tenant_id: parse.getObjectIDIfValid(tenantId)
			})
			.then(data => {
				return this.changeProperties(data);
			});
	}

	updateGateway(tenantId, gatewayName, data) {
		if (Object.keys(data).length === 0) {
			return this.getGateway(tenantId, gatewayName);
		} else {
			data.tenant_id = parse.getObjectIDIfValid(tenantId);
			return db
				.collection('paymentGateways')
				.updateOne(
					{ name: gatewayName, tenant_id: parse.getObjectIDIfValid(tenantId) },
					{ $set: data },
					{ upsert: true }
				)
				.then(res => this.getGateway(tenantId, gatewayName));
		}
	}

	changeProperties(data) {
		if (data) {
			delete data._id;
			delete data.name;
		}
		return data;
	}
}

export default new PaymentGatewaysService();
