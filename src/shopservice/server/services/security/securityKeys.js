import { ObjectID } from 'mongodb';
import moment from 'moment';
import jwt from 'jsonwebtoken';
import LRUCache from 'lru-cache';
import { db } from '../../lib/mongo';
import parse from '../../lib/parse';
import settings from '../../lib/settings';

const cache = new LRUCache({
	max: 10000,
	maxAge: 1000 * 60 * 60 * 24 // 24h
});

const BLACKLIST_CACHE_KEY = 'blacklist';

class SecurityKeysService {
	constructor() {}

	getKeys(params = {}) {
		let filter = {
			revoked: false,
			deleted: false,
			enabled: true
		};

		const id = parse.getObjectIDIfValid(params.id);
		if (id) {
			filter._id = new ObjectID(id);
		}

		const appId = parse.getString(params.app_id);
		if (appId && appId.length > 0) {
			filter.app_id = appId;
		}

		return db
			.collection('securityKeys')
			.find(filter)
			.toArray()
			.then(items => items.map(item => this.changeProperties(item)));
	}

	getSingleKey(id) {
		if (!ObjectID.isValid(id)) {
			return Promise.reject('Invalid identifier');
		}
		return this.getKeys({ id: id }).then(items => {
			return items.length > 0 ? items[0] : null;
		});
	}

	getSingleKeyByAppId(appId) {
		return this.getKeys({ app_id: appId }).then(items => {
			return items.length > 0 ? items[0] : null;
		});
	}

	getKeysBlacklist() {
		const blacklistFromCache = cache.get(BLACKLIST_CACHE_KEY);

		if (blacklistFromCache) {
			return Promise.resolve(blacklistFromCache);
		} else {
			return db
				.collection('securityKeys')
				.find(
					{
						revoked: true
					},
					{ _id: 1 }
				)
				.toArray()
				.then(items => {
					const blacklistFromDB = items.map(item => item._id.toString());
					cache.set(BLACKLIST_CACHE_KEY, blacklistFromDB);
					return blacklistFromDB;
				});
		}
	}

	addKey(data) {
		const shouldStoreAccessKeys = settings.storeAccessKeysToDatabase;
		return this.getValidDocumentForInsert(data)
			.then(keyData => db.collection('securityKeys').insertMany([keyData]))
			.then(res => this.getSingleKey(res.ops[0]._id.toString()))
			.then(key =>
				this.getSignedKey(key).then(signedKey => {
					key.access_key = signedKey;
					if (shouldStoreAccessKeys) {
						this.updateKey(key.id, { access_key: signedKey });
					}
					return key;
				})
			);
	}

	updateKey(id, data) {
		if (!ObjectID.isValid(id)) {
			return Promise.reject('Invalid identifier');
		}

		const keyObjectID = new ObjectID(id);
		const key = this.getValidDocumentForUpdate(id, data);

		return db
			.collection('securityKeys')
			.updateOne(
				{
					_id: keyObjectID
				},
				{ $set: key }
			)
			.then(res => this.getSingleKey(id));
	}

	deleteKey(id) {
		if (!ObjectID.isValid(id)) {
			return Promise.reject('Invalid identifier');
		}

		const keyObjectID = new ObjectID(id);

		return db
			.collection('securityKeys')
			.updateOne(
				{
					_id: keyObjectID
				},
				{
					$set: {
						revoked: true,
						deleted: true,
						enabled: false,
						date_created: new Date()
					}
				}
			)
			.then(res => {
				cache.del(BLACKLIST_CACHE_KEY);
			});
	}

	checkKeyAppIdUnique(appId) {
		if (appId && appId.length > 0) {
			return db
				.collection('securityKeys')
				.countDocuments({ app_id: appId, revoked: false, deleted: false })
				.then(count =>
					count === 0 ? appId : Promise.reject('Key app id must be unique')
				);
		} else {
			return Promise.resolve(appId);
		}
	}

	getValidDocumentForInsert(data) {
		const appId = parse.getString(data.app_id);

		return this.checkKeyAppIdUnique(appId).then(appId => {
			let key = {
				revoked: false,
				deleted: false,
				enabled: true,
				date_created: new Date()
			};

			if (appId && appId.length > 0) {
				key.app_id = appId;
			}

			key.app_name = parse.getString(data.app_name);
			key.email = parse.getString(data.email);

			return key;
		});
	}

	getValidDocumentForUpdate(id, data) {
		if (Object.keys(data).length === 0) {
			return new Error('Required fields are missing');
		}

		let key = {
			date_updated: new Date()
		};

		if (data.app_name !== undefined) {
			key.app_name = parse.getString(data.app_name);
		}

		if (data.access_key !== undefined) {
			key.access_key = parse.getString(data.access_key);
		}

		return key;
	}

	changeProperties(item) {
		if (item) {
			item.id = item._id.toString();
			delete item._id;
			delete item.revoked;
		}
		return item;
	}

	getSignedKey(key) {
		return new Promise((resolve, reject) => {
			const options = {};

			let payload = {
				jti: key.id
			};

			if (key.app_id && key.app_id.length > 0) {
				payload.app_id = key.app_id;
			}

			if (key.email && key.email.length > 0) {
				payload.email = key.email;
			}

			jwt.sign(payload, settings.jwtSecretKey, options, (err, key) => {
				if (err) {
					reject(err);
				} else {
					resolve(key);
				}
			});
		});
	}
}

export default new SecurityKeysService();
