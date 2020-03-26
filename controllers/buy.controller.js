let moment = require("moment")

let SHOPPINGCART = require("../models/shoppingcart.model.js")
let PRODUCT = require("../models/product.model.js")
let RECIPE = require("../models/recipe.model.js")
let DESIRED = require("../models/desired.model.js")
let BUY = require("../models/buy.model.js")

let permission = require('./check.permissions.controller.js')

var querys              = require("../querys/querysMysql")
const { poolPromise }   = require('./db_mysql.js')


/** OBTIENE COMPRAS POR ID DE USUARIO */
//-- BUY01
exports.buyList = async function(req, res, next){
    let prmsn = await permission.checkPermissions(req.user.actions, 'BUY01')
    if(prmsn){
        let params = req.params
        let body = req.body
        
        let buys = await BUY.find({'idUser': params.idUser}).populate('deliveryAddress')
        let items = JSON.parse(JSON.stringify(buys))
        if(items.length > 0){
            // Dando formato a fecha de compra
            for (let i = 0; i < items.length; i++) {
                items[i].dateBuy = moment(items[i].dateBuy).format('DD-MM-YYYY hh:mm:ss')
            }

            res.status(200).send({valid:true, msg:'Compras encontradas.', items:items})
        }else{
            res.status(200).send({valid:false, msg:'No existen compras.', items:null})
        }
    }else{
        res.status(200).send({msg:"No tienes permiso para realizar el proceso.", valid:false})
    }
}

/** COMPRAR CARRITO */
//-- BUY02
exports.buyShoppingcart = async function(req, res, next){
    let prmsn = await permission.checkPermissions(req.user.actions, 'BUY02')
    if(prmsn){
        let params = req.params
        let body = req.body

        try{
            // Datos del usuario
            let pool = await poolPromise
            let result = await pool.query(querys.getInfoUser, [parseInt(params.idUser)])
            var user = result[0]

            // Nuevo objeto de compra
            let aux = {
                idUser: params.idUser,
                dateBuy: moment().toDate(),
                nit: user.nit,
                name: user.name + ' ' + user.lastname,
                subtotal: 0.00,
                discount: 0.00,
                total: 0.00,
                totalProducts: 0,
                description: "",
                deliveryAddress: params.address,
                products: []
            }

            // Carrito
            let item = await SHOPPINGCART.find({"idUser": params.idUser})
            let itemById = await SHOPPINGCART.findById(item[0]._id)
            let products = itemById.products

            // Obtener cada Producto y descontarlo del inventario
            let subtotal = 0
            let totalProducts = 0
            if(products.length > 0){
                for (let i = 0; i < products.length; i++) {
                    const product = products[i];

                    // Si es Receta
                    if(product.isRecipe){
                        let item = await RECIPE.findById(product.product)

                        // Objeto de Receta
                        let auxProduct = {
                            idProduct: item._id,
                            product: item.name,
                            price: item.realPriceSale,
                            quantity: product.quantity,
                            isRecipe: product.isRecipe
                        }

                        subtotal += item.realPriceSale * product.quantity
                        totalProducts += product.quantity

                        // Restando del inventario
                        for (let j = 0; j < item.products.length; j++) {
                            const productRecipe = item.products[j];
                            
                            let itemRecipe = await PRODUCT.findById(productRecipe.product)
                            itemRecipe.stock = itemRecipe.stock - productRecipe.quantity
                            await itemRecipe.save()
                        }

                        // Agregando producto a nuevo objeto
                        aux.products.push(auxProduct)
                    }
                    // Si es Producto
                    else{
                        let item = await PRODUCT.findById(product.product)

                        // Objeto de producto
                        let auxProduct = {
                            idProduct: item._id,
                            product: item.name,
                            price: item.realPriceSale,
                            quantity: product.quantity,
                            isRecipe: product.isRecipe
                        }

                        subtotal += item.realPriceSale * product.quantity
                        totalProducts += product.quantity

                        // Restando del inventario
                        item.stock = item.stock - product.quantity
                        await item.save()

                        // Agregando producto a nuevo objeto
                        aux.products.push(auxProduct)
                    }
                }
            }

            // Seteando valores de venta a la compra
            aux.subtotal = subtotal
            aux.discount = 0.00 // Definir politica de descuento
            aux.total = aux.subtotal - aux.discount
            aux.totalProducts = totalProducts

            // Guardando producto
            let buy = new BUY(aux);
            let saved = await buy.save()

            // Limpiar carrito
            let auxShoppingcart = {
                idUser: params.idUser,
                dateCreate: moment().toDate(),
                products: []
            }
            await SHOPPINGCART.findOneAndUpdate({idUser: params.idUser}, auxShoppingcart, {upsert: true})

            // Responder
            if(saved){
                res.status(200).send({valid:true, msg:'Carrito comprado.', item:saved})
            }else{
                res.status(200).send({valid:true, msg:'Carrito no comprado.', item:null})
            }
        }
        catch(e){
            console.log(e)
            res.status(200).send({valid:true, msg:'Carrito no comprado.', item:null})
        }
    }else{
        res.status(200).send({msg:"No tienes permiso para realizar el proceso.", valid:false})
    }
}

/** COMPRAR DESEADOS */
//-- BUY03
exports.buyDesired = async function(req, res, next){
    let prmsn = await permission.checkPermissions(req.user.actions, 'BUY03')
    if(prmsn){
        let a = 0
    }
}

/** OBTIENE COMPRA POR ID (ORDEN) */
//-- BUY04
exports.buyById = async function(req, res, next){
    let prmsn = await permission.checkPermissions(req.user.actions, 'BUY04')
    if(prmsn){
        let params = req.params
        let body = req.body
        
        let buy = await BUY.find({"_id":params.idBuy}).populate('deliveryAddress')
        let item = JSON.parse(JSON.stringify(buy))

        if(item.length > 0){
            // Dando formato a fecha de compra
            for (let i = 0; i < item.length; i++) {
                item[i].dateBuy = moment(item[i].dateBuy).format('DD-MM-YYYY hh:mm:ss')
            }

            res.status(200).send({valid:true, msg:'Compra encontrada.', item:item})
        }else{
            res.status(200).send({valid:false, msg:'No existe compra.', item:null})
        }
    }else{
        res.status(200).send({msg:"No tienes permiso para realizar el proceso.", valid:false})
    }
}