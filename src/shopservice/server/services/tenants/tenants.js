import { ObjectID } from 'mongodb';
import { db } from '../../lib/mongo';
import parse from '../../lib/parse';
import UsersService from '../users/users';
import EmailTemplatesService from '../settings/emailTemplates';
import ThemeSettingsService from '../theme/settings';
import ProductCategoriesService from '../products/productCategories';
import roles from '../../lib/roles';

class TenantsService {
	constructor() {}

	async getTenants(params = {}) {
		const limit = parse.getNumberIfPositive(params.limit) || 1000;
		const offset = parse.getNumberIfPositive(params.offset) || 0;
		const matchQuery = this.getMatchQuery(params);
		const matchTextQuery = this.getMatchTextQuery(params);
		const itemsAggregation = [];

		if (matchTextQuery) {
			itemsAggregation.push({ $match: matchTextQuery });
		}
		itemsAggregation.push({ $match: matchQuery });
		itemsAggregation.push({ $skip: offset });
		itemsAggregation.push({ $limit: limit });

		const [itemsResult] = await Promise.all([
			db
				.collection('tenants')
				.aggregate(itemsAggregation)
				.toArray()
		]);

		let items = itemsResult.map(item => this.changeProperties(item));
		items = items.filter(item => !!item);

		return {
			data: items
		};
	}

	getMatchTextQuery({ search }) {
		if (
			search &&
			search.length > 0 &&
			search !== 'null' &&
			search !== 'undefined'
		) {
			return {
				$or: [
					{ url_name: new RegExp(search, 'i') },
					{ email: new RegExp(search, 'i') },
					{ $text: { $search: search } }
				]
			};
		} else {
			return null;
		}
	}

	getMatchQuery(params) {
		let { ids, url_name, deleted, enabled } = params;
		ids = parse.getString(ids);
		url_name = parse.getString(url_name);

		let queries = [
			{
				deleted: parse.getBooleanIfValid(deleted, false)
			}
		];
		if (ids && ids.length > 0) {
			const idsArray = ids.split(',');
			let objectIDs = [];
			for (const id of idsArray) {
				if (ObjectID.isValid(id)) {
					objectIDs.push(new ObjectID(id));
				}
			}
			queries.push({
				_id: { $in: objectIDs }
			});
		}

		if (url_name && url_name.length > 0) {
			queries.push({
				url_name: url_name
			});
		}

		if (enabled !== undefined) {
			queries.push({
				enabled: parse.getBooleanIfValid(enabled)
			});
		}

		let matchQuery = {};
		if (queries.length === 1) {
			matchQuery = queries[0];
		} else if (queries.length > 1) {
			matchQuery = {
				$and: queries
			};
		}

		return matchQuery;
	}

	getSingleTenant(id) {
		if (!ObjectID.isValid(id)) {
			return Promise.reject('Invalid identifier');
		}

		return this.getTenants({ ids: id, limit: 1 }).then(tenants =>
			tenants.data.length > 0 ? tenants.data[0] : {}
		);
	}

	addTenant(tenantId, data) {
		const createData = this.getValidDocumentForInsert(data);
		const email = createData.email;
		// Check if tenant url name is existed or not in order to create new tenant
		return db
			.collection('tenants')
			.countDocuments({ url_name: createData.url_name, deleted: false })
			.then(count => {
				if (count > 0) {
					throw new Error('Tenant Url Name has used already');
				} else {
					return db
						.collection('tenants')
						.insertOne(createData)
						.then(res => {
							const tenantAdminId = res.insertedId;
							this.addDefaultItems(tenantId, tenantAdminId).then(res => {
								// Create user account for new tenant
								const userData = {
									email: email,
									password: Math.random()
										.toString(36)
										.slice(-8),
									role: roles.ADMINISTRATOR,
									enabled: true
								};
								UsersService.addUser(tenantAdminId, userData);
							});
							return this.getSingleTenant(tenantAdminId);
						});
				}
			});
	}

	updateTenant(id, data) {
		if (!ObjectID.isValid(id)) {
			return Promise.reject('Invalid identifier');
		}
		const updateData = this.getValidDocumentForUpdate(data);

		return db
			.collection('tenants')
			.updateOne({ _id: parse.getObjectIDIfValid(id) }, { $set: updateData })
			.then(res => (res.modifiedCount > 0 ? this.getSingleTenant(id) : null));
	}

	deleteTenant(id) {
		if (!ObjectID.isValid(id)) {
			return Promise.reject('Invalid identifier');
		}
		const tenantObjectID = new ObjectID(id);
		const deletedData = {
			deleted: true,
			date_deleted: new Date()
		};
		return db
			.collection('tenants')
			.updateOne({ _id: tenantObjectID }, { $set: deletedData });
	}

	getValidDocumentForInsert(data) {
		if (Object.keys(data).length === 0) {
			throw new Error('Required fields are missing');
		}

		let tenant = {
			date_created: new Date(),
			date_updated: null,
			deleted: parse.getBooleanIfValid(data.deleted, false),
			enabled: true
		};

		if (data.name !== undefined) {
			tenant.name = parse.getString(data.name);
		}

		if (data.url_name !== undefined) {
			tenant.url_name = parse.getString(data.url_name);
		}

		if (data.address !== undefined) {
			tenant.address = parse.getString(data.address);
		}

		if (data.tel !== undefined) {
			tenant.tel = parse.getString(data.tel);
		}

		if (data.email !== undefined) {
			tenant.email = parse.getString(data.email);
		}

		return tenant;
	}

	getValidDocumentForUpdate(data) {
		if (Object.keys(data).length === 0) {
			throw new Error('Required fields are missing');
		}

		let tenant = {
			date_updated: new Date()
		};

		if (data.name !== undefined) {
			tenant.name = parse.getString(data.name);
		}

		if (data.url_name !== undefined) {
			tenant.url_name = parse.getString(data.url_name);
		}

		if (data.address !== undefined) {
			tenant.address = parse.getString(data.address);
		}

		if (data.tel !== undefined) {
			tenant.tel = parse.getString(data.tel);
		}

		if (data.email !== undefined) {
			tenant.email = parse.getString(data.email);
		}

		if (data.enabled !== undefined) {
			tenant.enabled = parse.getBooleanIfValid(data.enabled);
		}

		return tenant;
	}

	changeProperties(item) {
		if (item) {
			item.id = item._id.toString();
			delete item._id;
		}

		return item;
	}

	getTenantIdByUrlName(tenantUrlName) {
		return this.getTenants({ url_name: tenantUrlName, enabled: true }).then(
			tenants => (tenants.data.length > 0 ? { id: tenants.data[0].id } : {})
		);
	}

	async addDefaultItems(tenantId, tenantAdminId) {
		return (
			EmailTemplatesService.getEmailTemplates(tenantId)
				// Add default email templates for new tenant
				.then(defaultTemplates => {
					defaultTemplates.map(template => {
						template.tenant_id = parse.getObjectIDIfValid(tenantAdminId);
						template.deleted = false;
					});
					return EmailTemplatesService.addEmailTemplates(
						tenantAdminId,
						defaultTemplates
					);
				})
				// Get default theme settings from owner
				.then(res => ThemeSettingsService.getSettings(tenantId))
				// Add default theme settings for new tenant
				.then(settings => {
					settings.tenant_id = parse.getObjectIDIfValid(tenantAdminId);
					return ThemeSettingsService.updateSettings(tenantAdminId, settings);
				})
				// Get default product categories from owner
				.then(res => ProductCategoriesService.getCategories(tenantId))
				// Add default product categories for new tenant
				.then(categories => {
					const currentDate = new Date();
					categories.map(category => {
						category.tenant_id = parse.getObjectIDIfValid(tenantAdminId);
						category.deleted = false;
						category.date_created = currentDate;
						category.date_updated = currentDate;
						delete category.id;
						delete category.url;
						delete category.path;
					});
					return ProductCategoriesService.addCategories(
						tenantAdminId,
						categories
					);
				})
		);
	}
}

export default new TenantsService();
