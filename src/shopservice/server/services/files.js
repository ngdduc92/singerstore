import fs from 'fs';
import fse from 'fs-extra';
import formidable from 'formidable';
import utils from '../lib/utils';
import settings from '../lib/settings';

class FilesService {
	getFileData(filesDir, fileName) {
		const filePath = filesDir + '/' + fileName;
		const stats = fs.statSync(filePath);
		if (stats.isFile()) {
			return {
				file: fileName,
				size: stats.size,
				modified: stats.mtime
			};
		} else {
			return null;
		}
	}

	getFilesData(filesDir, files) {
		return files
			.map(fileName => this.getFileData(filesDir, fileName))
			.filter(fileData => fileData !== null)
			.sort((a, b) => a.modified - b.modified);
	}

	getFiles(tenantId) {
		const filesDir = `${settings.uploadPath}/${tenantId}/${
			settings.filesUploadPath
		}`;
		fse.ensureDirSync(filesDir);
		return new Promise((resolve, reject) => {
			fs.readdir(filesDir, (err, files) => {
				if (err) {
					reject(err);
				} else {
					const filesData = this.getFilesData(filesDir, files);
					resolve(filesData);
				}
			});
		});
	}

	deleteFile(tenantId, fileName) {
		return new Promise((resolve, reject) => {
			const filePath = `${settings.uploadPath}/${tenantId}/${
				settings.filesUploadPath
			}/${fileName}`;
			if (fs.existsSync(filePath)) {
				fs.unlink(filePath, err => {
					resolve();
				});
			} else {
				reject('File not found');
			}
		});
	}

	uploadFile(req, res, next) {
		const tenantId = req.get('x-tenant-id');
		const uploadDir = `${settings.uploadPath}/${tenantId}/${
			settings.filesUploadPath
		}`;

		let form = new formidable.IncomingForm(),
			file_name = null,
			file_size = 0;

		fse.ensureDirSync(uploadDir);
		form.uploadDir = uploadDir;

		form
			.on('fileBegin', (name, file) => {
				// Emitted whenever a field / value pair has been received.
				file.name = utils.getCorrectFileName(file.name);
				file.path = uploadDir + '/' + file.name;
			})
			.on('file', function(name, file) {
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
					res.send({ file: file_name, size: file_size });
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

export default new FilesService();
