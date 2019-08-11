import path from 'path';
import fs from 'fs';
import formidable from 'formidable';
import settings from '../../lib/settings';
import fse from 'fs-extra';

class ThemeAssetsService {
	deleteFile(tenantId, fileName) {
		return new Promise((resolve, reject) => {
			const filePath = path.resolve(
				`${settings.uploadPath}/${tenantId}/${
					settings.logosUploadPath
				}/${fileName}`
			);
			if (!fs.existsSync(filePath)) {
				reject('File not found');
			}
		});
	}

	uploadFile(req, res, next) {
		const tenantId = req.get('x-tenant-id');
		const uploadDir = path.resolve(
			`${settings.uploadPath}/${tenantId}/${settings.logosUploadPath}`
		);
		fse.ensureDirSync(uploadDir);

		let form = new formidable.IncomingForm(),
			file_path = null,
			file_size = 0;

		form.uploadDir = uploadDir;

		form
			.on('fileBegin', (name, file) => {
				// Emitted whenever a field / value pair has been received.
				file.path = uploadDir + '/' + file.name;
			})
			.on('file', function(field, file) {
				// every time a file has been uploaded successfully,
				file_path = `/${tenantId}/${settings.logosUploadUrl}/${file.name}`;
				file_size = file.size;
			})
			.on('error', err => {
				res.status(500).send(this.getErrorMessage(err));
			})
			.on('end', () => {
				//Emitted when the entire request has been received, and all contained files have finished flushing to disk.
				if (file_path) {
					res.send({ file: file_path, size: file_size });
				} else {
					res
						.status(400)
						.send(this.getErrorMessage('Required fields are missing'));
				}
			});

		form.parse(req);
	}

	getErrorMessage(err) {
		return { error: true, message: err.toString() };
	}
}

export default new ThemeAssetsService();
