import slug from 'slug';
import SitemapService from '../services/sitemap';
import handlebars from 'handlebars';
import crypto from 'crypto';
import settings from './settings';

const slugConfig = {
	symbols: false, // replace unicode symbols or not
	remove: null, // (optional) regex to remove characters
	lower: true // result in lower case
};

const cleanSlug = text => {
	return slug(text || '', slugConfig);
};

const getAvailableSlug = (path, resource, enableCleanPath = true) => {
	return SitemapService.getPaths().then(paths => {
		if (enableCleanPath) {
			path = cleanSlug(path);
		}

		let pathExists = paths.find(
			e => e.path === '/' + path && e.resource != resource
		);
		while (pathExists) {
			path += '-2';
			pathExists = paths.find(
				e => e.path === '/' + path && e.resource != resource
			);
		}
		return path;
	});
};

const getCorrectFileName = filename => {
	if (filename) {
		// replace unsafe characters
		return filename.replace(/[\s*/:;&?@$()<>#%\{\}|\\\^\~\[\]]/g, '-');
	} else {
		return filename;
	}
};

const getProjectionFromFields = fields => {
	const fieldsArray = fields && fields.length > 0 ? fields.split(',') : [];
	return Object.assign({}, ...fieldsArray.map(key => ({ [key]: 1 })));
};

export const getEmailSubject = (emailTemplate, data) => {
    const subjectTemplate = handlebars.compile(emailTemplate.subject);
    return subjectTemplate(data);
}

export const getEmailBody = (emailTemplate, data) => {
    const bodyTemplate = handlebars.compile(emailTemplate.body);
    return bodyTemplate(data);
}

export const encrypt = (text) => {
	let iv = crypto.randomBytes(16);
	let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(settings.cryptoSecretKey), iv);
	let encrypted = cipher.update(text);
	encrypted = Buffer.concat([encrypted, cipher.final()]);
	return iv.toString('hex') + ':' + encrypted.toString('hex');
}

export const decrypt = (text) => {
	let textParts = text.split(':');
	const iv = Buffer.from(textParts.shift(), 'hex');
	const encryptedText = Buffer.from(textParts.join(':'), 'hex');
	const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(settings.cryptoSecretKey), iv);
	let decrypted = decipher.update(encryptedText);
	decrypted = Buffer.concat([decrypted, decipher.final()]);
	return decrypted.toString();
}

export const getCartCookieOptions = isHttps => ({
	maxAge: 24 * 60 * 60 * 1000, // 24 hours
	httpOnly: true,
	signed: true,
	secure: isHttps,
	sameSite: 'strict'
});

export default {
	cleanSlug: cleanSlug,
	getAvailableSlug: getAvailableSlug,
	getCorrectFileName: getCorrectFileName,
	getProjectionFromFields: getProjectionFromFields,
	getEmailSubject: getEmailSubject,
	getEmailBody: getEmailBody,
	encrypt: encrypt,
	decrypt: decrypt,
	getCartCookieOptions: getCartCookieOptions
};
