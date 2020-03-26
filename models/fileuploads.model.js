var mongoose = require('mongoose');

var fileUploadsSchema = mongoose.Schema({
	code: 				String,
	md5File: 			String,
	uploadProcess: {
		fieldname: 			String,
		originalname: 		String,
		encoding: 			String,
		mimetype: 			String,
		destination: 		String,
		filename: 			String,
		path: 				String,
		size: 				Number
	}
		
})

module.exports = mongoose.model('FileUploads', fileUploadsSchema, 'fileuploads'); 