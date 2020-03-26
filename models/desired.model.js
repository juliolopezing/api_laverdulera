var mongoose         = require('mongoose');
var mongoosePaginate = require('mongoose-paginate-v2')

var desiredSchema = mongoose.Schema({
    idUser: Number,
    dateCreate: Date,
    products:[{
        product: String,
        quantity: Number,
        dateAdd: Date,
        isRecipe: Boolean,
        idRecipe: String
    }]
})

desiredSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Desired', desiredSchema, 'desired');

