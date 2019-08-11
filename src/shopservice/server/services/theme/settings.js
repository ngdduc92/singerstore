import fs from 'fs';
import path from 'path';
import serverSettings from '../../lib/settings';
import { db } from '../../lib/mongo';
import parse from '../../lib/parse';

const SETTINGS_SCHEMA_FILE_EN = path.resolve('theme/settings/en.json');

class ThemeSettingsService {
	constructor() {}

	readFile(file) {
		return new Promise((resolve, reject) => {
			fs.readFile(file, 'utf8', (err, data) => {
				if (err) {
					reject(err);
				} else {
					let jsonData = {};
					try {
						jsonData = data.length > 0 ? JSON.parse(data) : {};
						resolve(jsonData);
					} catch (e) {
						reject('Failed to parse JSON');
					}
				}
			});
		});
	}

	writeFile(file, jsonData) {
		return new Promise((resolve, reject) => {
			const stringData = JSON.stringify(jsonData);
			fs.writeFile(file, stringData, err => {
				if (err) {
					reject(err);
				} else {
					resolve();
				}
			});
		});
	}

	getSettingsSchema(language) {
		const SETTINGS_SCHEMA_FILE = path.resolve(
			`theme/settings/${language}.json`
		);
		if (fs.existsSync(SETTINGS_SCHEMA_FILE)) {
			return this.readFile(SETTINGS_SCHEMA_FILE);
		}

		// If current locale not exist, use scheme in English
		return this.readFile(SETTINGS_SCHEMA_FILE_EN);
	}

	getSettings(tenantId) {
		return db
			.collection('themeSettings')
			.findOne({
				tenant_id: parse.getObjectIDIfValid(tenantId),
				deleted: false
			})
			.then(settings => {
				if (settings) {
					if (settings.footer_logo_url) {
						settings.footer_logo_url = `/${tenantId}/${
							serverSettings.logosUploadUrl
						}/${settings.footer_logo_url}`;
					}
					delete settings._id;
				}

				return settings;
			});
	}

	updateSettings(tenantId, settings) {
		const tenantObjectId = parse.getObjectIDIfValid(tenantId);
		if (settings.footer_logo_url) {
			const fileNameArr = settings.footer_logo_url.split('/');
			const fileName = fileNameArr[fileNameArr.length - 1];
			settings.footer_logo_url = fileName;
		}
		settings.tenant_id = tenantObjectId;
		return db.collection('themeSettings').updateOne(
			{ tenant_id: tenantObjectId },
			{
				$set: settings
			},
			{ upsert: true }
		);
	}
}

export default new ThemeSettingsService();
