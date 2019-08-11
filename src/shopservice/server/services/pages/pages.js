import { ObjectID } from 'mongodb';
import url from 'url';
import { db } from '../../lib/mongo';
import utils from '../../lib/utils';
import parse from '../../lib/parse';
import SettingsService from '../settings/settings';
import TenantsService from '../tenants/tenants';

const DEFAULT_SORT = { date_created: 1 };

class PagesService {
	constructor() {}

	getFilter(tenantId, params = {}) {
		let filter = {};
		const id = parse.getObjectIDIfValid(params.id);
		const tags = parse.getString(params.tags);
		if (id) {
			filter._id = new ObjectID(id);
		}
		if (tags && tags.length > 0) {
			filter.tags = tags;
		}
		filter.deleted = parse.getBooleanIfValid(params.deleted, false);
		filter.tenant_id = parse.getObjectIDIfValid(tenantId);
		return filter;
	}

	getSortQuery({ sort }) {
		if (sort && sort.length > 0) {
			const fields = sort.split(',');
			return Object.assign(
				...fields.map(field => ({
					[field.startsWith('-') ? field.slice(1) : field]: field.startsWith(
						'-'
					)
						? -1
						: 1
				}))
			);
		} else {
			return DEFAULT_SORT;
		}
	}

	async getPages(tenantId, params = {}) {
		const filter = this.getFilter(tenantId, params);
		const sortQuery = this.getSortQuery(params);
		const projection = utils.getProjectionFromFields(params.fields);
		const items = await db
			.collection('pages')
			.find(filter, { projection: projection })
			.sort(sortQuery)
			.toArray();
		const result = items.map(page => this.changeProperties(page));
		return result;
	}

	getSinglePage(tenantId, id) {
		if (!ObjectID.isValid(id)) {
			return Promise.reject('Invalid identifier');
		}
		return this.getPages(tenantId, { id: id }).then(pages => {
			return pages.length > 0 ? pages[0] : null;
		});
	}

	addPage(tenantId, data) {
		return this.getValidDocumentForInsert(tenantId, data).then(page =>
			db
				.collection('pages')
				.insertMany([page])
				.then(res => this.getSinglePage(tenantId, res.ops[0]._id.toString()))
		);
	}

	updatePage(tenantId, id, data) {
		if (!ObjectID.isValid(id)) {
			return Promise.reject('Invalid identifier');
		}
		const pageObjectID = new ObjectID(id);

		return this.getValidDocumentForUpdate(tenantId, id, data).then(page =>
			db
				.collection('pages')
				.updateOne({ _id: pageObjectID }, { $set: page })
				.then(res => this.getSinglePage(tenantId, id))
		);
	}

	deletePage(id) {
		if (!ObjectID.isValid(id)) {
			return Promise.reject('Invalid identifier');
		}
		const pageObjectID = new ObjectID(id);
		const deletedData = {
			deleted: true,
			date_deleted: new Date()
		};
		return db
			.collection('pages')
			.updateMany({ _id: pageObjectID }, { $set: deletedData })
			.then(res => res.modifiedCount > 0);
	}

	getValidDocumentForInsert(tenantId, data) {
		let page = {
			date_created: new Date()
		};

		page.content = parse.getString(data.content);
		page.meta_description = parse.getString(data.meta_description);
		page.meta_title = parse.getString(data.meta_title);
		page.enabled = parse.getBooleanIfValid(data.enabled, true);
		page.tags = parse.getArrayIfValid(data.tags) || [];
		page.tenant_id = parse.getObjectIDIfValid(tenantId);
		page.deleted = parse.getBooleanIfValid(data.deleted, false);

		let slug =
			!data.slug || data.slug.length === 0 ? data.meta_title : data.slug;
		if (!slug || slug.length === 0) {
			return Promise.resolve(page);
		} else {
			return utils.getAvailableSlug(slug, null, false).then(newSlug => {
				page.slug = newSlug;
				return page;
			});
		}
	}

	getValidDocumentForUpdate(tenantId, id, data) {
		if (Object.keys(data).length === 0) {
			return Promise.reject('Required fields are missing');
		} else {
			return this.getSinglePage(tenantId, id).then(prevPageData => {
				let page = {
					date_updated: new Date()
				};

				if (data.content !== undefined) {
					page.content = parse.getString(data.content);
				}

				if (data.meta_description !== undefined) {
					page.meta_description = parse.getString(data.meta_description);
				}

				if (data.meta_title !== undefined) {
					page.meta_title = parse.getString(data.meta_title);
				}

				if (data.enabled !== undefined) {
					page.enabled = parse.getBooleanIfValid(data.enabled, true);
				}

				if (data.tags !== undefined) {
					page.tags = parse.getArrayIfValid(data.tags) || [];
				}

				if (data.slug !== undefined) {
					let slug = data.slug;
					if (!slug || slug.length === 0) {
						slug = data.meta_title;
					}

					return utils.getAvailableSlug(slug, id, false).then(newSlug => {
						page.slug = newSlug;
						return page;
					});
				} else {
					return page;
				}
			});
		}
	}

	changeProperties(item) {
		if (item) {
			item.id = item._id.toString();
			delete item._id;

			if (!item.slug) {
				item.slug = '';
			}

			item.path = url.resolve('/', `${item.slug}`);
		}

		return item;
	}
}

export default new PagesService();
