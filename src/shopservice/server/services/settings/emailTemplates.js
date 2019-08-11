import { db } from '../../lib/mongo';
import parse from '../../lib/parse';

class EmailTemplatesService {
	constructor() {}

	getEmailTemplates(tenantId) {
		return db
			.collection('emailTemplates')
			.find({ tenant_id: parse.getObjectIDIfValid(tenantId), deleted: false })
			.toArray()
			.then(templates =>
				templates.map(template => this.changeProperties(template))
			);
	}

	getEmailTemplate(tenantId, name) {
		return db
			.collection('emailTemplates')
			.findOne({
				tenant_id: parse.getObjectIDIfValid(tenantId),
				name: name,
				deleted: false
			})
			.then(template => {
				return this.changeProperties(template);
			});
	}

	addEmailTemplates(tenantId, templates) {
		return db
			.collection('emailTemplates')
			.insertMany(templates)
			.then(res => this.getEmailTemplates(tenantId));
	}

	deleteEmailTemplates(tenantId) {
		const deletedData = {
			deleted: true,
			date_deleted: new Date()
		};
		return db
			.collection('emailTemplates')
			.updateMany(
				{ tenant_id: parse.getObjectIDIfValid(tenantId) },
				{ $set: deletedData }
			)
			.then(res => {
				return res.modifiedCount > 0 ? this.getEmailTemplates(tenantId) : null;
			});
	}

	updateEmailTemplate(tenantId, name, data) {
		const template = this.getValidDocumentForUpdate(data);
		return db
			.collection('emailTemplates')
			.updateOne(
				{ tenant_id: parse.getObjectIDIfValid(tenantId), name: name },
				{
					$set: template
				},
				{ upsert: true }
			)
			.then(res => this.getEmailTemplate(tenantId, name));
	}

	getValidDocumentForUpdate(data) {
		if (Object.keys(data).length === 0) {
			return new Error('Required fields are missing');
		}

		let template = {};

		if (data.subject !== undefined) {
			template.subject = parse.getString(data.subject);
		}

		if (data.body !== undefined) {
			template.body = parse.getString(data.body);
		}

		return template;
	}

	changeProperties(template) {
		if (template) {
			delete template._id;
		} else {
			return {
				subject: '',
				body: ''
			};
		}

		return template;
	}
}

export default new EmailTemplatesService();
