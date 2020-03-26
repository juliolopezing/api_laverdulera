var mongoose = require('mongoose');

var categorySchema = mongoose.Schema({
	name: 				String,
    dateCreate:         Date,
    dateDelete:         Date,
    eliminated:         Boolean
})

module.exports = mongoose.model('Category', categorySchema, 'category'); 