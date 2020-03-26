var mongoose         = require('mongoose');
var mongoosePaginate = require('mongoose-paginate-v2')

var productSchema = mongoose.Schema({
    name: String,
    description: String,
    code: String,
    realPrice: Number,
    realPriceSale: Number,
    historialPrice:[{
        price: Number,
        priceSale: Number,
        date: Date,
    }],
    stock: Number,
    historialStock:[{
        quantity: Number,
        date: Date
    }],
    color: String,
    category: String,
    weight: Number,
    icon: String,
    images: [String],
    limitStock: Number,
    typeMedida: {
        name: String,
        smallname: String
    },
    isDiscount: Boolean,
    discount: String,
    historialDiscount: [String]
})

productSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Product', productSchema, 'product');

