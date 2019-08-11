import { ObjectID } from 'mongodb';
import { db } from '../lib/mongo';
import parse from '../lib/parse';

class VerificationTokensService {
	constructor() {}

	getSingleTokenById(id) {
		if (!ObjectID.isValid(id)) {
			return Promise.reject('Invalid identifier');
		}
		return db
			.collection('verificationTokens')
			.findOne({ _id: parse.getObjectIDIfValid(id) })
			.then(token => this.changeProperties(token));
	}

	addToken(tenantId, data) {
		const token = this.getValidDocumentForInsert(tenantId, data);
		return db
			.collection('verificationTokens')
			.insertMany([token])
			.then(res => this.getSingleTokenById(res.ops[0]._id.toString()));
	}

	getValidDocumentForInsert(tenantId, data) {
		let token = {
			date_created: new Date(),
			date_updated: null,
			enabled: true
		};

		if (data.userId) {
			token.user_id = parse.getObjectIDIfValid(data.userId);
		}
		if (tenantId) {
			token.tenant_id = parse.getObjectIDIfValid(tenantId);
		}
		return token;
	}

	changeProperties(item) {
		if (item) {
			item.id = item._id.toString();
			delete item._id;
		}

		return item;
	}

	updateToken(id, data) {
		if (!ObjectID.isValid(id)) {
			return Promise.reject('Invalid identifier');
		}
		const tokenObjectID = new ObjectID(id);
		const tokenData = this.getValidDocumentForUpdate(data);
		return db
			.collection('verificationTokens')
			.updateOne({ _id: tokenObjectID }, { $set: tokenData })
			.then(res =>
				res.modifiedCount > 0 ? this.getSingleTokenById(id) : null
			);
	}

	getValidDocumentForUpdate(data) {
		if (Object.keys(data).length === 0) {
			throw new Error('Required fields are missing');
		}

		let token = {
			date_updated: new Date()
		};

		if (data.enabled !== undefined) {
			token.enabled = parse.getBooleanIfValid(data.enabled);
		}

		return token;
	}
}

export default new VerificationTokensService();
