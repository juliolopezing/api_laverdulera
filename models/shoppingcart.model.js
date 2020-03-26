var mongoose         = require('mongoose');
var mongoosePaginate = require('mongoose-paginate-v2')

var shoppingcartSchema = mongoose.Schema({
    idUser: Number,
    dateCreate: Date,
    products:[{
        product: String,
        quantity: Number,
        dateAdd: Date,
        isRecipe: Boolean
    }]
})

shoppingcartSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Shoppingcart', shoppingcartSchema, 'shoppingcart');

