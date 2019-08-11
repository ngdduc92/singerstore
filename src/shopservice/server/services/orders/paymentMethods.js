import { ObjectID } from 'mongodb';
import { db } from '../../lib/mongo';
import utils from '../../lib/utils';
import parse from '../../lib/parse';
import PaymentMethodsLightService from './paymentMethodsLight';
import OrdersService from './orders';

class PaymentMethodsService {
	constructor() {}

	getFilter(tenantId, params = {}) {
		return new Promise((resolve, reject) => {
			let filter = {};
			const id = parse.getObjectIDIfValid(params.id);
			const enabled = parse.getBooleanIfValid(params.enabled);
			const tenant_id = parse.getObjectIDIfValid(tenantId);

			if (id) {
				filter._id = new ObjectID(id);
			}

			if (enabled !== null) {
				filter.enabled = enabled;
			}

			if (tenant_id) {
				filter.tenant_id = tenant_id;
			}
			filter.deleted = parse.getBooleanIfValid(params.deleted, false);
			const order_id = parse.getObjectIDIfValid(params.order_id);

			if (order_id) {
				return OrdersService.getSingleOrder(tenantId, order_id).then(order => {
					if (order) {
						const shippingMethodObjectID = parse.getObjectIDIfValid(
							order.shipping_method_id
						);

						filter['$and'] = [];
						filter['$and'].push({
							$or: [
								{
									'conditions.subtotal_min': 0
								},
								{
									'conditions.subtotal_min': {
										$lte: order.subtotal
									}
								}
							]
						});
						filter['$and'].push({
							$or: [
								{
									'conditions.subtotal_max': 0
								},
								{
									'conditions.subtotal_max': {
										$gte: order.subtotal
									}
								}
							]
						});

						if (
							order.shipping_address.country &&
							order.shipping_address.country.length > 0
						) {
							filter['$and'].push({
								$or: [
									{
										'conditions.countries': {
											$size: 0
										}
									},
									{
										'conditions.countries': order.shipping_address.country
									}
								]
							});
						}

						if (shippingMethodObjectID) {
							filter['$and'].push({
								$or: [
									{
										'conditions.shipping_method_ids': {
											$size: 0
										}
									},
									{
										'conditions.shipping_method_ids': shippingMethodObjectID
									}
								]
							});
						}
					}
					resolve(filter);
				});
			} else {
				resolve(filter);
			}
		});
	}

	getMethods(tenantId, params = {}) {
		return this.getFilter(tenantId, params).then(filter => {
			return PaymentMethodsLightService.getMethods(filter);
		});
	}

	getSingleMethod(tenantId, id) {
		if (!ObjectID.isValid(id)) {
			return Promise.reject('Invalid identifier');
		}
		return this.getMethods(tenantId, { id: id }).then(methods => {
			return methods.length > 0 ? methods[0] : null;
		});
	}

	addMethod(tenantId, data) {
		const method = this.getValidDocumentForInsert(tenantId, data);
		return db
			.collection('paymentMethods')
			.insertMany([method])
			.then(res => this.getSingleMethod(tenantId, res.ops[0]._id.toString()));
	}

	updateMethod(tenantId, id, data) {
		if (!ObjectID.isValid(id)) {
			return Promise.reject('Invalid identifier');
		}
		const methodObjectID = new ObjectID(id);
		const method = this.getValidDocumentForUpdate(id, data);

		return db
			.collection('paymentMethods')
			.updateOne(
				{
					_id: methodObjectID
				},
				{ $set: method }
			)
			.then(res => this.getSingleMethod(tenantId, id));
	}

	deleteMethod(id) {
		if (!ObjectID.isValid(id)) {
			return Promise.reject('Invalid identifier');
		}
		const methodObjectID = new ObjectID(id);
		const deletedData = {
			deleted: true,
			date_deleted: new Date()
		};
		return db
			.collection('paymentMethods')
			.updateOne({ _id: methodObjectID }, { $set: deletedData })
			.then(res => {
				return res.modifiedCount > 0;
			});
	}

	async pullShippingMethod(id) {
		if (!ObjectID.isValid(id)) {
			return Promise.reject('Invalid identifier');
		}
		const methodObjectID = new ObjectID(id);
		return await db
			.collection('paymentMethods')
			.update(
				{},
				{ $pull: { 'conditions.shipping_method_ids': methodObjectID } },
				{ multi: true }
			);
	}

	getPaymentMethodConditions(conditions) {
		let methodIds = conditions
			? parse.getArrayIfValid(conditions.shipping_method_ids) || []
			: [];
		let methodObjects = [];
		if (methodIds.length > 0) {
			methodObjects = methodIds.map(id => new ObjectID(id));
		}

		return conditions
			? {
					countries: parse.getArrayIfValid(conditions.countries) || [],
					shipping_method_ids: methodObjects,
					subtotal_min: parse.getNumberIfPositive(conditions.subtotal_min) || 0,
					subtotal_max: parse.getNumberIfPositive(conditions.subtotal_max) || 0
			  }
			: {
					countries: [],
					shipping_method_ids: [],
					subtotal_min: 0,
					subtotal_max: 0
			  };
	}

	getValidDocumentForInsert(tenantId, data) {
		let method = {};

		method.name = parse.getString(data.name);
		method.description = parse.getString(data.description);
		method.position = parse.getNumberIfPositive(data.position) || 0;
		method.enabled = parse.getBooleanIfValid(data.enabled, true);
		method.conditions = this.getPaymentMethodConditions(data.conditions);
		method.gateway = parse.getString(data.gateway);
		method.tenant_id = parse.getObjectIDIfValid(tenantId);
		method.deleted = parse.getBooleanIfValid(data.deleted, false);

		return method;
	}

	getValidDocumentForUpdate(id, data) {
		if (Object.keys(data).length === 0) {
			return new Error('Required fields are missing');
		}

		let method = {};

		if (data.name !== undefined) {
			method.name = parse.getString(data.name);
		}

		if (data.description !== undefined) {
			method.description = parse.getString(data.description);
		}

		if (data.position !== undefined) {
			method.position = parse.getNumberIfPositive(data.position) || 0;
		}

		if (data.enabled !== undefined) {
			method.enabled = parse.getBooleanIfValid(data.enabled, true);
		}

		if (data.conditions !== undefined) {
			method.conditions = this.getPaymentMethodConditions(data.conditions);
		}

		if (data.gateway !== undefined) {
			method.gateway = parse.getString(data.gateway);
		}

		return method;
	}
}

export default new PaymentMethodsService();
