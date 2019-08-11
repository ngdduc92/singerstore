import { ObjectID } from 'mongodb';
import { db } from '../../lib/mongo';
import parse from '../../lib/parse';

class CustomerGroupsService {
	constructor() {}

	getGroups(tenantId, params = {}) {
		return db
			.collection('customerGroups')
			.find({ tenant_id: parse.getObjectIDIfValid(tenantId), deleted: false })
			.toArray()
			.then(items => items.map(item => this.changeProperties(item)));
	}

	getSingleGroup(id) {
		if (!ObjectID.isValid(id)) {
			return Promise.reject('Invalid identifier');
		}
		let groupObjectID = new ObjectID(id);

		return db
			.collection('customerGroups')
			.findOne({ _id: groupObjectID })
			.then(item => this.changeProperties(item));
	}

	addGroup(tenantId, data) {
		const group = this.getValidDocumentForInsert(tenantId, data);
		return db
			.collection('customerGroups')
			.insertMany([group])
			.then(res => this.getSingleGroup(res.ops[0]._id.toString()));
	}

	updateGroup(id, data) {
		if (!ObjectID.isValid(id)) {
			return Promise.reject('Invalid identifier');
		}
		const groupObjectID = new ObjectID(id);
		const group = this.getValidDocumentForUpdate(id, data);

		return db
			.collection('customerGroups')
			.updateOne(
				{
					_id: groupObjectID
				},
				{ $set: group }
			)
			.then(res => this.getSingleGroup(id));
	}

	deleteGroup(id) {
		if (!ObjectID.isValid(id)) {
			return Promise.reject('Invalid identifier');
		}
		const groupObjectID = new ObjectID(id);
		const deletedData = {
			deleted: true,
			date_deleted: new Date()
		};
		return db
			.collection('customerGroups')
			.updateOne({ _id: groupObjectID }, { $set: deletedData })
			.then(res => res.modifiedCount > 0);
	}

	getValidDocumentForInsert(tenantId, data) {
		let group = {
			date_created: new Date()
		};

		group.name = parse.getString(data.name);
		group.description = parse.getString(data.description);
		group.tenant_id = parse.getObjectIDIfValid(tenantId);
		group.deleted = parse.getBooleanIfValid(data.deleted, false);

		return group;
	}

	getValidDocumentForUpdate(id, data) {
		if (Object.keys(data).length === 0) {
			return new Error('Required fields are missing');
		}

		let group = {
			date_updated: new Date()
		};

		if (data.name !== undefined) {
			group.name = parse.getString(data.name);
		}

		if (data.description !== undefined) {
			group.description = parse.getString(data.description);
		}

		return group;
	}

	changeProperties(item) {
		if (item) {
			item.id = item._id.toString();
			delete item._id;
		}

		return item;
	}
}

export default new CustomerGroupsService();
