var mongoose         = require('mongoose');
var mongoosePaginate = require('mongoose-paginate-v2')

var buySchema = mongoose.Schema({
    idUser: Number,
    dateBuy: Date,
    nit: String,
    name: String,
    subtotal: Number,
    discount: Number,
    total: Number,
    totalProducts: Number,
    description: String,
    deliveryAddress: {type: mongoose.Schema.Types.String, ref: "Address"},
    products:[{
        idProduct: String,
        product: String,
        quantity: Number,
        price: Number,
        isRecipe: Boolean,
        idRecipe: String
    }]
})

buySchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Buy', buySchema, 'buy');

