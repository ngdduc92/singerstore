import fs from 'fs';
import path from 'path';
import winston from 'winston';

const THEME_LOCALES_PATH = 'theme/locales';
const LOCALES_FILENAMES = [
	{
		locale: 'us',
		fileName: 'en'
	},
	{
		locale: 'vn',
		fileName: 'vi'
	}
];
let current_locale = null;
let text = null;

const getLanguageFilePath = locale => {
	let fileName = 'en';
	LOCALES_FILENAMES.map(item => {
		if (item.locale === locale) {
			fileName = item.fileName;
		}
	});
	return `${THEME_LOCALES_PATH}/${fileName}.json`;
};

export const getText = locale => {
	if (locale === current_locale) {
		return Promise.resolve(text);
	} else {
		const filePath = path.resolve(getLanguageFilePath(locale));
		return new Promise((resolve, reject) => {
			fs.readFile(filePath, 'utf8', (err, data) => {
				if (err) {
					winston.error('Fail to read theme locale', filePath, err);
					reject(err);
				} else {
					text = JSON.parse(data);
					current_locale = locale;
					resolve(text);
				}
			});
		});
	}
};
