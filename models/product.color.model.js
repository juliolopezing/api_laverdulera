var mongoose = require('mongoose');

var colorSchema = mongoose.Schema({
	name: 				String,
    dateCreate:         Date,
    dateDelete:         Date,
    eliminated:         Boolean
})

module.exports = mongoose.model('Color', colorSchema, 'color'); 