var mongoose         = require('mongoose');
var mongoosePaginate = require('mongoose-paginate-v2')

var recipeSchema = mongoose.Schema({
    idUser: Number,
    dateCreate: Date,
    name: String,
    description: String,
    preparation: String,
    images: [String],
    realPriceSale: Number,
    products:[{
        product: String,
        quantity: Number
    }],
    isDiscount: Boolean,
    discount: String,
    historialDiscount: [String]
})

recipeSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Recipe', recipeSchema, 'recipe');
