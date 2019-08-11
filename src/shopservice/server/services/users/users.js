import { ObjectID } from 'mongodb';
import { db } from '../../lib/mongo';
import parse from '../../lib/parse';
import mailer from '../../lib/mailer';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import settings from '../../lib/settings';
import roles from '../../lib/roles';
import utils from '../../lib/utils';
import url from 'url';
import VerificationTokensService from '../verificationTokens';
import SettingsService from '../settings/settings';
import EmailTemplatesService from '../settings/emailTemplates';
import TenantsService from '../tenants/tenants';

class UsersService {
	constructor() {}

	async getUsers(tenantId, params = {}) {
		const limit = parse.getNumberIfPositive(params.limit) || 1000;
		const offset = parse.getNumberIfPositive(params.offset) || 0;
		const matchQuery = this.getMatchQuery(tenantId, params);
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
				.collection('users')
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
					{ email: new RegExp(search, 'i') },
					{ $text: { $search: search } }
				]
			};
		} else {
			return null;
		}
	}

	getMatchQuery(tenantId, params) {
		const queries = [
			{
				deleted: parse.getBooleanIfValid(params.deleted, false),
				tenant_id: parse.getObjectIDIfValid(tenantId)
			}
		];

		const id = parse.getObjectIDIfValid(params.id);
		if (id) {
			queries.push({
				_id: id
			});
		}

		const email = parse.getString(params.email);
		if (email && email.length > 0) {
			queries.push({
				email: email
			});
		}

		if (params.enabled !== undefined) {
			queries.push({
				enabled: parse.getBooleanIfValid(params.enabled)
			});
		}

		const role = parse.getString(params.role);
		if (role && role.length > 0) {
			queries.push({
				role: role
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

	getSingleUserById(tenantId, id) {
		if (!ObjectID.isValid(id)) {
			return Promise.reject('Invalid identifier');
		}
		return this.getUsers(tenantId, { id: id }).then(items => {
			return items.data.length > 0 ? items.data[0] : null;
		});
	}

	addUser(tenantId, data) {
		const user = this.getValidDocumentForInsert(tenantId, data);
		return db
			.collection('users')
			.insertMany([user])
			.then(res => {
				this.sendAccountInfoEmail(tenantId, data.email, data.password);
				return this.getSingleUserById(tenantId, res.ops[0]._id.toString());
			});
	}

	getValidDocumentForInsert(tenantId, data) {
		let user = {
			date_created: new Date(),
			date_updated: null,
			enabled: parse.getBooleanIfValid(data.enabled, false),
			deleted: parse.getBooleanIfValid(data.deleted, false)
		};
		if (data.full_name && data.full_name.length > 0) {
			user.full_name = parse.getString(data.full_name);
		}
		if (data.email && data.email.length > 0) {
			user.email = parse.getString(data.email);
		}
		if (data.password && data.password.length > 0) {
			user.password = bcrypt.hashSync(parse.getString(data.password), 12);
		}
		if (data.country && data.country.length > 0) {
			user.country = parse.getString(data.country);
		}
		if (data.state && data.state.length > 0) {
			user.state = parse.getString(data.state);
		}
		if (data.city && data.city.length > 0) {
			user.city = parse.getString(data.city);
		}
		if (data.phone && data.phone.length > 0) {
			user.phone = parse.getString(data.phone);
		}
		if (data.address1 && data.address1.length > 0) {
			user.address1 = parse.getString(data.address1);
		}
		if (data.address2 && data.address2.length > 0) {
			user.address2 = parse.getString(data.address2);
		}
		if (tenantId) {
			user.tenant_id = parse.getObjectIDIfValid(tenantId);
		}
		if (data.role !== undefined) {
			user.role = parse.getString(data.role);
		}
		return user;
	}

	changeProperties(item) {
		if (item) {
			item.id = item._id.toString();
			delete item._id;
		}

		return item;
	}

	updateUser(tenantId, id, data) {
		if (!ObjectID.isValid(id)) {
			return Promise.reject('Invalid identifier');
		}
		const userObjectID = new ObjectID(id);
		const userData = this.getValidDocumentForUpdate(data);
		return db
			.collection('users')
			.updateOne({ _id: userObjectID }, { $set: userData })
			.then(res =>
				res.modifiedCount > 0 ? this.getSingleUserById(tenantId, id) : null
			);
	}

	deleteUser(id) {
		if (!ObjectID.isValid(id)) {
			return Promise.reject('Invalid identifier');
		}
		const userObjectID = new ObjectID(id);
		const deletedData = {
			deleted: true,
			date_deleted: new Date()
		};
		return db
			.collection('users')
			.updateOne({ _id: userObjectID }, { $set: deletedData });
	}

	getValidDocumentForUpdate(data) {
		if (Object.keys(data).length === 0) {
			throw new Error('Required fields are missing');
		}

		let user = {
			date_updated: new Date()
		};

		if (data.full_name !== undefined) {
			user.full_name = parse.getString(data.full_name);
		}

		if (data.email !== undefined) {
			user.email = parse.getString(data.email);
		}

		if (data.password !== undefined) {
			user.password = bcrypt.hashSync(parse.getString(data.password), 12);
		}

		if (data.phone !== undefined) {
			user.phone = parse.getString(data.phone);
		}

		if (data.country !== undefined) {
			user.country = parse.getString(data.country);
		}

		if (data.state !== undefined) {
			user.state = parse.getString(data.state);
		}

		if (data.city !== undefined) {
			user.city = parse.getString(data.city);
		}

		if (data.role !== undefined) {
			user.role = parse.getString(data.role);
		}

		if (data.address1 !== undefined) {
			user.address1 = parse.getString(data.address1);
		}

		if (data.address2 !== undefined) {
			user.address2 = parse.getString(data.address2);
		}

		if (data.enabled !== undefined) {
			user.enabled = parse.getBooleanIfValid(data.enabled);
		}

		return user;
	}

	getSingleUserByEmail(tenantId, email) {
		return this.getUsers(tenantId, {
			email: email,
			enabled: true,
			limit: 1
		}).then(users => (users.data.length > 0 ? users.data[0] : null));
	}

	async register(tenantId, data) {
		const user = await this.getUsers(tenantId, { email: data.email }).then(
			items => (items.data.length > 0 ? items.data[0] : null)
		);
		if (!user) {
			const userData = {
				email: data.email,
				password: data.password,
				role: roles.CUSTOMER,
				enabled: false
			};
			const insertData = this.getValidDocumentForInsert(tenantId, userData);
			const user = await db
				.collection('users')
				.insertMany([insertData])
				.then(res =>
					this.getSingleUserById(tenantId, res.ops[0]._id.toString())
				);
			if (user) {
				this.sendActivationEmail(tenantId, data.email, user.id);
				return { sent: true, error: null };
			} else {
				return { sent: false, error: 'Access Denied' };
			}
		} else {
			return { sent: false, error: 'This email has already been used.' };
		}
	}

	resetPassword(req) {
		const tenantId = req.get('x-tenant-id');
		const email = req.body.email;
		const locale = req.body.locale;
		const isAdmin = req.body.isAdmin;
		return this.getSingleUserByEmail(tenantId, email).then(user => {
			if (user) {
				this.sendResetPasswordEmail(tenantId, email, user.id, locale, isAdmin);
				return { sent: true, error: null };
			} else {
				return { sent: false, error: 'This email is incorrect.' };
			}
		});
	}

	async sendAccountInfoEmail(tenantId, email, password) {
		//Create reset password link
		const generalSettings = await SettingsService.getSettings(tenantId);
		const tenants = await TenantsService.getSingleTenant(tenantId);
		const link = url.resolve(generalSettings.domain, `/${tenants.url_name}/`);
		//Create reset password email content
		const emailTemplate = await EmailTemplatesService.getEmailTemplate(
			tenantId,
			'account_info'
		);
		const subject = utils.getEmailSubject(emailTemplate, {});
		const body = utils.getEmailBody(emailTemplate, {
			link,
			email,
			password
		});
		const message = {
			to: email,
			subject: subject,
			html: body
		};
		mailer.send(message);
	}

	async sendResetPasswordEmail(tenantId, email, userId, locale, isAdmin) {
		//Add verification token
		const token = await VerificationTokensService.addToken(tenantId, {
			userId: userId
		});
		//Create reset password link
		const generalSettings = await SettingsService.getSettings(tenantId);
		const tenants = await TenantsService.getSingleTenant(tenantId);
		let link;
		if (isAdmin) {
			link = url.resolve(
				generalSettings.domain,
				`/${
					tenants.url_name
				}/${locale}/admin/reset-password?token=${utils.encrypt(token.id)}`
			);
		} else {
			link = url.resolve(
				generalSettings.domain,
				`/${tenants.url_name}/${locale}/reset-password?token=${utils.encrypt(
					token.id
				)}`
			);
		}
		//Create reset password email content
		const emailTemplate = await EmailTemplatesService.getEmailTemplate(
			tenantId,
			'reset_password'
		);
		const subject = utils.getEmailSubject(emailTemplate, {});
		const body = utils.getEmailBody(emailTemplate, { link });
		const message = {
			to: email,
			subject: subject,
			html: body
		};
		mailer.send(message);
	}

	async sendActivationEmail(tenantId, email, userId) {
		//Add verification token
		const token = await VerificationTokensService.addToken(tenantId, {
			userId: userId
		});
		//Create activation link
		const generalSettings = await SettingsService.getSettings(tenantId);
		const tenants = await TenantsService.getSingleTenant(tenantId);
		const link = url.resolve(
			generalSettings.domain,
			`/${tenants.url_name}/active-account?token=${utils.encrypt(token.id)}`
		);
		//Create activation email content
		const emailTemplate = await EmailTemplatesService.getEmailTemplate(
			tenantId,
			'account_activation'
		);
		const subject = utils.getEmailSubject(emailTemplate, {});
		const body = utils.getEmailBody(emailTemplate, { link });
		const message = {
			to: email,
			subject: subject,
			html: body
		};
		mailer.send(message);
	}

	getToken(data) {
		return new Promise((resolve, reject) => {
			const jwtOptions = {};

			let payload = {
				role: data.role,
				email: data.email.toLowerCase(),
				userId: data.userId
			};

			if (data.expiration) {
				// convert hour to sec
				jwtOptions.expiresIn = data.expiration * 60 * 60;
			}

			jwt.sign(payload, settings.jwtSecretKey, jwtOptions, (err, token) => {
				if (err) {
					reject(err);
				} else {
					resolve(token);
				}
			});
		});
	}

	async authorize(tenantId, data) {
		let userData = {
			email: data.email,
			enabled: true,
			limit: 1
		};

		const user = await this.getUsers(tenantId, userData).then(items => {
			return items.data.length > 0 ? items.data[0] : null;
		});
		if (user) {
			if (user.password && bcrypt.compareSync(data.password, user.password)) {
				const tokenData = {
					role: user.role,
					email: user.email,
					expiration: 24,
					userId: user.id
				};
				const token = await this.getToken(tokenData);
				if (token) {
					return { token: token, error: null };
				} else {
					return { token: null, error: 'Access Denied' };
				}
			} else {
				return { token: null, error: 'Email or password is incorrect' };
			}
		} else {
			return { token: null, error: 'Email or password is incorrect' };
		}
	}
}

export default new UsersService();
