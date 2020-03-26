var mongoose = require('mongoose');

var typeMedidaSchema = mongoose.Schema({
    name: 				String,
    smallname:          String,
    dateCreate:         Date,
    dateDelete:         Date,
    eliminated:         Boolean
})

module.exports = mongoose.model('Typemedida', typeMedidaSchema, 'typemedida'); 