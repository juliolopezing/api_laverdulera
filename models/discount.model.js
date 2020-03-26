var mongoose         = require('mongoose');
var mongoosePaginate = require('mongoose-paginate-v2')

var discountSchema = mongoose.Schema({
    name: String,
    description: String,
    dateBegin: Date,
    dateEnd: Date,
    dateRangeText: String,
    isPercent: Boolean,
    percent: Number,
    isDirect: Boolean,
    direct: Number,
    conditions: mongoose.Schema.Types.Mixed,
    isCode: Boolean,
    code: String, 
    active: Boolean,
    dateCreate: Date
})

discountSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Discount', discountSchema, 'discount');

