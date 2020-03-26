var mongoose         = require('mongoose');
var mongoosePaginate = require('mongoose-paginate-v2')

var addressSchema = mongoose.Schema({
    idUser: Number,
    address: String,
    googleMaps: mongoose.Schema.Types.Mixed,
    dateAdd: Date,
    delete: Boolean
})

addressSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Address', addressSchema, 'address');

