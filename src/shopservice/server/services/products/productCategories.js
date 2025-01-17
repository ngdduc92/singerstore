import { ObjectID } from 'mongodb';
import path from 'path';
import url from 'url';
import formidable from 'formidable';
import fse from 'fs-extra';
import settings from '../../lib/settings';
import SettingsService from '../settings/settings';
import { db } from '../../lib/mongo';
import utils from '../../lib/utils';
import parse from '../../lib/parse';

class ProductCategoriesService {
	constructor() {}

	getFilter(tenantId, params = {}) {
		let filter = {};
		const enabled = parse.getBooleanIfValid(params.enabled);
		if (enabled !== null) {
			filter.enabled = enabled;
		}
		const id = parse.getObjectIDIfValid(params.id);
		if (id) {
			filter._id = id;
		}
		filter.deleted = parse.getBooleanIfValid(params.deleted, false);
		filter.tenant_id = parse.getObjectIDIfValid(tenantId);
		return filter;
	}

	async getCategories(tenantId, params = {}) {
		const filter = this.getFilter(tenantId, params);
		const projection = utils.getProjectionFromFields(params.fields);
		const generalSettings = await SettingsService.getSettings(tenantId);
		const domain = generalSettings.domain;
		const items = await db
			.collection('productCategories')
			.find(filter, { projection: projection })
			.sort({ position: 1 })
			.toArray();
		const result = items.map(category =>
			this.changeProperties(tenantId, category, domain)
		);
		return result;
	}

	getSingleCategory(tenantId, id) {
		if (!ObjectID.isValid(id)) {
			return Promise.reject('Invalid identifier');
		}
		return this.getCategories(tenantId, { id: id }).then(categories => {
			return categories.length > 0 ? categories[0] : null;
		});
	}

	async addCategory(tenantId, data) {
		const lastCategory = await db
			.collection('productCategories')
			.findOne(
				{ tenant_id: parse.getObjectIDIfValid(tenantId), deleted: false },
				{ sort: { position: -1 } }
			);
		const newPosition =
			lastCategory && lastCategory.position > 0 ? lastCategory.position + 1 : 1;
		const dataToInsert = await this.getValidDocumentForInsert(
			tenantId,
			data,
			newPosition
		);
		const insertResult = await db
			.collection('productCategories')
			.insertMany([dataToInsert]);
		return this.getSingleCategory(tenantId, insertResult.ops[0]._id.toString());
	}

	addCategories(tenantId, data) {
		return db
			.collection('productCategories')
			.insertMany(data)
			.then(res => this.getCategories(tenantId));
	}

	deleteCategories(tenantId) {
		const deletedData = {
			deleted: true,
			date_deleted: new Date()
		};
		return db
			.collection('productCategories')
			.updateMany(
				{ tenant_id: parse.getObjectIDIfValid(tenantId) },
				{ $set: deletedData }
			)
			.then(res => {
				return res.modifiedCount > 0 ? this.getCategories(tenantId) : null;
			});
	}

	updateCategory(tenantId, id, data) {
		if (!ObjectID.isValid(id)) {
			return Promise.reject('Invalid identifier');
		}
		let categoryObjectID = new ObjectID(id);

		return this.getValidDocumentForUpdate(id, data)
			.then(dataToSet =>
				db
					.collection('productCategories')
					.updateOne({ _id: categoryObjectID }, { $set: dataToSet })
			)
			.then(res =>
				res.modifiedCount > 0 ? this.getSingleCategory(tenantId, id) : null
			);
	}

	findAllChildren(items, id, result) {
		if (id && ObjectID.isValid(id)) {
			result.push(new ObjectID(id));
			let finded = items.filter(
				item => (item.parent_id || '').toString() === id.toString()
			);
			if (finded.length > 0) {
				for (let item of finded) {
					this.findAllChildren(items, item.id, result);
				}
			}
		}

		return result;
	}

	deleteCategory(tenantId, id) {
		if (!ObjectID.isValid(id)) {
			return Promise.reject('Invalid identifier');
		}

		// 1. get all categories
		return this.getCategories(tenantId)
			.then(items => {
				// 2. find category and children
				let idsToDelete = [];
				this.findAllChildren(items, id, idsToDelete);
				return idsToDelete;
			})
			.then(idsToDelete => {
				// 3. delete categories
				let objectsToDelete = idsToDelete.map(id => new ObjectID(id));
				return db
					.collection('productCategories')
					.updateMany(
						{ _id: { $in: objectsToDelete } },
						{ $set: { deleted: true } }
					)
					.then(res => (res.modifiedCount > 0 ? idsToDelete : null));
			})
			.then(idsToDelete => {
				// 4. update category_id for products
				return idsToDelete
					? db
							.collection('products')
							.updateMany(
								{ category_id: { $in: idsToDelete } },
								{ $set: { category_id: null } }
							)
							.then(() => Promise.resolve(true))
					: Promise.resolve(false);
			});
	}

	getErrorMessage(err) {
		return { error: true, message: err.toString() };
	}

	getValidDocumentForInsert(tenantId, data, newPosition) {
		//  Allow empty category to create draft

		let category = {
			date_created: new Date(),
			date_updated: null,
			image: ''
		};

		category.name = parse.getString(data.name);
		category.description = parse.getString(data.description);
		category.meta_description = parse.getString(data.meta_description);
		category.meta_title = parse.getString(data.meta_title);
		category.enabled = parse.getBooleanIfValid(data.enabled, true);
		category.sort = parse.getString(data.sort);
		category.parent_id = parse.getObjectIDIfValid(data.parent_id);
		category.position = parse.getNumberIfValid(data.position) || newPosition;
		category.tenant_id = parse.getObjectIDIfValid(tenantId);
		category.deleted = parse.getBooleanIfValid(data.deleted, false);

		let slug = !data.slug || data.slug.length === 0 ? data.name : data.slug;
		if (!slug || slug.length === 0) {
			return Promise.resolve(category);
		} else {
			return utils.getAvailableSlug(slug).then(newSlug => {
				category.slug = newSlug;
				return category;
			});
		}
	}

	getValidDocumentForUpdate(id, data) {
		return new Promise((resolve, reject) => {
			if (!ObjectID.isValid(id)) {
				reject('Invalid identifier');
			}
			if (Object.keys(data).length === 0) {
				reject('Required fields are missing');
			}

			let category = {
				date_updated: new Date()
			};

			if (data.name !== undefined) {
				category.name = parse.getString(data.name);
			}

			if (data.description !== undefined) {
				category.description = parse.getString(data.description);
			}

			if (data.meta_description !== undefined) {
				category.meta_description = parse.getString(data.meta_description);
			}

			if (data.meta_title !== undefined) {
				category.meta_title = parse.getString(data.meta_title);
			}

			if (data.enabled !== undefined) {
				category.enabled = parse.getBooleanIfValid(data.enabled, true);
			}

			if (data.image !== undefined) {
				category.image = data.image;
			}

			if (data.position >= 0) {
				category.position = data.position;
			}

			if (data.sort !== undefined) {
				category.sort = data.sort;
			}

			if (data.parent_id !== undefined) {
				category.parent_id = parse.getObjectIDIfValid(data.parent_id);
			}

			if (data.slug !== undefined) {
				let slug = data.slug;
				if (!slug || slug.length === 0) {
					slug = data.name;
				}

				utils
					.getAvailableSlug(slug, id)
					.then(newSlug => {
						category.slug = newSlug;
						resolve(category);
					})
					.catch(err => {
						reject(err);
					});
			} else {
				resolve(category);
			}
		});
	}

	changeProperties(tenantId, item, domain) {
		if (item) {
			item.id = item._id.toString();
			item._id = undefined;

			if (item.parent_id) {
				item.parent_id = item.parent_id.toString();
			}

			if (item.slug) {
				item.url = url.resolve(domain, `/${item.slug}`);
				item.path = url.resolve('/', item.slug);
			}

			if (item.image) {
				item.image = url.resolve(
					domain,
					`/${tenantId}/${settings.categoriesUploadUrl}/${item.id}/${
						item.image
					}`
				);
			}
		}
		return item;
	}

	deleteCategoryImage(tenantId, id) {
		this.updateCategory(tenantId, id, { image: '' });
	}

	uploadCategoryImage(tenantId, req, res) {
		let categoryId = req.params.id;
		let form = new formidable.IncomingForm(),
			file_name = null,
			file_size = 0;

		form
			.on('fileBegin', (name, file) => {
				// Emitted whenever a field / value pair has been received.
				let dir = path.resolve(
					`${settings.uploadPath}/${tenantId}/${
						settings.categoriesUploadPath
					}/${categoryId}`
				);
				fse.ensureDirSync(dir);
				file.name = utils.getCorrectFileName(file.name);
				file.path = dir + '/' + file.name;
			})
			.on('file', function(field, file) {
				// every time a file has been uploaded successfully,
				file_name = file.name;
				file_size = file.size;
			})
			.on('error', err => {
				res.status(500).send(this.getErrorMessage(err));
			})
			.on('end', () => {
				//Emitted when the entire request has been received, and all contained files have finished flushing to disk.
				if (file_name) {
					this.updateCategory(tenantId, categoryId, { image: file_name });
					res.send({ file: file_name, size: file_size });
				} else {
					res
						.status(400)
						.send(this.getErrorMessage('Required fields are missing'));
				}
			});

		form.parse(req);
	}
}

export default new ProductCategoriesService();
