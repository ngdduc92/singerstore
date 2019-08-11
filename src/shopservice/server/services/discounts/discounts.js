import { ObjectID } from 'mongodb';
import { db } from '../../lib/mongo';
import parse from '../../lib/parse';
import OrdersService from '../orders/orders';

class DiscountsService {
	constructor() {}

	getFilter(tenantId, params = {}) {
		let filter = {};
		const id = parse.getObjectIDIfValid(params.id);
		const type = parse.getString(params.type);
		const code = parse.getString(params.code);
		if (id) {
			filter._id = new ObjectID(id);
		}

		if (type && type.length > 0) {
			filter.type = type;
		}

		if (code && code.length > 0) {
			filter.code = code;
		}

		if (params.search) {
			filter['$or'] = [{ code: new RegExp(params.search, 'i') }];
		}

		filter.deleted = parse.getBooleanIfValid(params.deleted, false);
		filter.tenant_id = parse.getObjectIDIfValid(tenantId);
		return filter;
	}

	async getDiscounts(tenantId, params = {}) {
		const filter = this.getFilter(tenantId, params);
		const limit = parse.getNumberIfPositive(params.limit) || 1000;
		const offset = parse.getNumberIfPositive(params.offset) || 0;
		const itemsResult = await db
			.collection('discounts')
			.find(filter)
			.limit(limit)
			.skip(offset)
			.toArray();

		const items = itemsResult.map(discounts =>
			this.changeProperties(discounts)
		);
		return {
			data: items
		};
	}

	async getSingleDiscount(tenantId, id) {
		if (!ObjectID.isValid(id)) {
			return Promise.reject('Invalid identifier');
		}

		return this.getDiscounts(tenantId, { id: id }).then(discounts =>
			discounts.data.length > 0 ? discounts.data[0] : {}
		);
	}

	async getSingleDiscountByCode(tenantId, code) {
		const discounts = await this.getDiscounts(tenantId, {
			code: code,
			limit: 1
		});
		return discounts.data.length > 0 ? discounts.data[0] : {};
	}

	changeProperties(item) {
		if (item) {
			item.id = item._id.toString();
			delete item._id;
		}

		return item;
	}

	async addDiscount(tenantId, data) {
		const discount = await this.getValidDocumentForInsert(tenantId, data);
		// is code unique
		if (discount.code && discount.code.length > 0) {
			const discountCount = await db.collection('discounts').countDocuments({
				code: discount.code,
				tenant_id: discount.tenant_id,
				deleted: discount.deleted
			});
			if (discountCount > 0) {
				throw new Error('This code has already been used.');
			}
		}
		const insertResponse = await db
			.collection('discounts')
			.insertMany([discount]);
		const newDiscountId = insertResponse.ops[0]._id.toString();
		const newDiscount = await this.getSingleDiscount(tenantId, newDiscountId);
		return newDiscount;
	}

	async updateDiscount(tenantId, id, data) {
		if (!ObjectID.isValid(id)) {
			return Promise.reject('Invalid identifier');
		}
		const updateData = this.getValidDocumentForUpdate(data);

		return db
			.collection('discounts')
			.updateOne({ _id: parse.getObjectIDIfValid(id) }, { $set: updateData })
			.then(res =>
				res.modifiedCount > 0 ? this.getSingleDiscount(tenantId, id) : null
			);
	}

	getValidDocumentForInsert(tenantId, data) {
		//  Allow empty discount to create draft
		let discount = {
			date_created: new Date(),
			date_updated: null
		};
		if (data.code !== undefined) {
			discount.code = parse.getString(data.code);
		}
		if (data.description !== undefined) {
			discount.description = parse.getString(data.description);
		}
		if (data.type !== undefined) {
			discount.type = parse.getString(data.type);
		}
		if (data.amount !== undefined) {
			discount.amount = parse.getNumberIfPositive(data.amount);
		}
		if (data.category_ids !== undefined) {
			discount.category_ids = parse.getArrayOfObjectID(data.category_ids);
		}
		if (data.product_ids !== undefined) {
			discount.product_ids = parse.getArrayOfObjectID(data.product_ids);
		}
		if (data.branding_ids !== undefined) {
			discount.branding_ids = parse.getArrayOfObjectID(data.branding_ids);
		}
		if (data.enabled !== undefined) {
			discount.enabled = parse.getBooleanIfValid(data.enabled, false);
		}
		if (data.date_from !== undefined) {
			discount.date_from = parse.getDateIfValid(data.date_from);
		}
		if (data.date_to !== undefined) {
			discount.date_to = parse.getDateIfValid(data.date_to);
		}
		if (data.quantity_min !== undefined) {
			discount.quantity_min = parse.getNumberIfPositive(data.quantity_min) || 1;
		}
		if (data.quantity_max !== undefined) {
			discount.quantity_max = parse.getNumberIfPositive(data.quantity_max) || 1;
		}
		if (data.quantity !== undefined) {
			discount.quantity = parse.getNumberIfPositive(data.quantity);
		}
		if (tenantId !== undefined) {
			discount.tenant_id = parse.getObjectIDIfValid(tenantId);
			this;
		}
		discount.deleted = parse.getBooleanIfValid(data.deleted, false);
		return discount;
	}

	getValidDocumentForUpdate(data) {
		if (Object.keys(data).length === 0) {
			throw new Error('Required fields are missing');
		}

		let discount = {
			date_updated: new Date()
		};

		if (data.code !== undefined) {
			discount.code = parse.getString(data.code);
		}
		if (data.description !== undefined) {
			discount.description = parse.getString(data.description);
		}
		if (data.type !== undefined) {
			discount.type = parse.getString(data.type);
		}
		if (data.amount !== undefined) {
			discount.amount = parse.getNumberIfPositive(data.amount);
		}
		if (data.category_ids !== undefined) {
			discount.category_ids = parse.getArrayOfObjectID(data.category_ids);
		}
		if (data.product_ids !== undefined) {
			discount.product_ids = parse.getArrayOfObjectID(data.product_ids);
		}
		if (data.branding_ids !== undefined) {
			discount.branding_ids = parse.getArrayOfObjectID(data.branding_ids);
		}
		if (data.enabled !== undefined) {
			discount.enabled = parse.getBooleanIfValid(data.enabled, false);
		}
		if (data.date_from !== undefined) {
			discount.date_from = parse.getDateIfValid(data.date_from);
		}
		if (data.date_to !== undefined) {
			discount.date_to = parse.getDateIfValid(data.date_to);
		}
		if (data.quantity_min !== undefined) {
			discount.quantity_min = parse.getNumberIfPositive(data.quantity_min) || 1;
		}
		if (data.quantity_max !== undefined) {
			discount.quantity_max = parse.getNumberIfPositive(data.quantity_max) || 1;
		}
		if (data.quantity !== undefined) {
			discount.quantity = parse.getNumberIfPositive(data.quantity);
		}
		return discount;
	}

	deleteDiscount(id) {
		if (!ObjectID.isValid(id)) {
			return Promise.reject('Invalid identifier');
		}
		const discountObjectID = new ObjectID(id);
		const deletedData = {
			deleted: true,
			date_deleted: new Date()
		};
		return db
			.collection('discounts')
			.updateOne({ _id: discountObjectID }, { $set: deletedData });
	}

	async applyDiscount(tenantId, data) {
		let code;
		let orderId;
		if (data.code !== undefined) {
			code = parse.getString(data.code);
		}
		if (data.order_id !== undefined) {
			orderId = parse.getString(data.order_id);
		}

		const discount = await this.getSingleDiscountByCode(tenantId, code);
		const order = await OrdersService.getSingleOrder(tenantId, orderId);
		if (this.isValidDiscount(discount, order)) {
			return OrdersService.updateOrder(tenantId, orderId, { coupon: discount });
		}
		return Promise.reject('Invalid identifier');
	}

	getValidAttributesArray(attributes) {
		if (attributes && Array.isArray(attributes)) {
			return attributes
				.filter(
					item =>
						item.name && item.name !== '' && item.value && item.value !== ''
				)
				.map(item => ({
					name: parse.getString(item.name),
					value: parse.getString(item.value)
				}));
		} else {
			return [];
		}
	}

	isValidDiscount(discount, order) {
		if (Object.keys(discount).length === 0 || discount.deleted) {
			throw new Error('Discount code is invalid');
		}
		if (!discount.enabled) {
			throw new Error('Discount code is not actived');
		}
		if (new Date() < discount.date_from || discount.date_to < new Date()) {
			throw new Error('Discount code is not actived');
		}
		if (discount.quantity && discount.quantity <= 0) {
			throw new Error('Discount code usage limited');
		}
		if (discount.product_ids && discount.product_ids.length > 0) {
			let hasProd = false;
			order.items.forEach(item => {
				discount.product_ids.some(id => {
					if (id.toString() == item.product_id.toString()) {
						hasProd = true;
					}
				});
			});
			if (!hasProd) {
				throw new Error('Discount code is invalid product');
			}
		}

		if (discount.category_ids && discount.category_ids.length > 0) {
			let hasCat = false;
			order.items.forEach(item => {
				item.category_ids.some(id1 => {
					discount.category_ids.some(id2 => {
						if (id1.toString() == id2.toString()) {
							hasCat = true;
						}
					});
				});
			});
			if (!hasCat) {
				throw new Error('Discount code is invalid category');
			}
		}

		return true;
	}
}

export default new DiscountsService();
