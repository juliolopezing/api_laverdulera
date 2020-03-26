let moment = require("moment")

let SHOPPINGCART = require("../models/shoppingcart.model.js")
let PRODUCT = require("../models/product.model.js")
let RECIPE = require("../models/recipe.model.js")

let permission = require('./check.permissions.controller.js')

var querys              = require("../querys/querysMysql")
const { poolPromise }   = require('./db_mysql.js')

/** LIMPIAR CARRITO */
//-- SHOPPINGCART01
exports.cleanShoppingcart = async function(req, res, next){
    let prmsn = await permission.checkPermissions(req.user.actions, 'SHOPPINGCART01')
    if(prmsn){
        let params = req.params
        let body = req.body
        let aux = {
            idUser: params.idUser,
            dateCreate: moment().toDate(),
            products: []
        }
        
        var saved = await SHOPPINGCART.findOneAndUpdate({idUser: params.idUser}, aux, {upsert: true})
        if(saved){
            res.status(200).send({valid:true, msg:'Carrito vaciado exitosamente.'})
        }else{
            res.status(200).send({valid:false, msg:'No se ha podido vaciar el carrito.'})
        }
    }else{
        res.status(200).send({msg:"No tienes permiso para realizar el proceso.", valid:false})
    }
}

/** AGREGAR RECETA/PRODUCTO AL CARRITO */
//-- SHOPPINGCART02
exports.addProduct = async function(req, res, next){
    let prmsn = await permission.checkPermissions(req.user.actions, 'SHOPPINGCART02')
    if(prmsn){
        let params = req.params
        let body = req.body

        // Nuevo producto para agregar
        let aux = {}

        // Si es Receta 
        if (body.isRecipe){
            aux = {
                product: body.product,
                quantity: body.quantity,
                dateAdd: moment().toDate(),
                isRecipe: true
            }
        }
        // Si es Producto
        else{
            aux = {
                product: body.product,
                quantity: body.quantity,
                dateAdd: moment().toDate(),
                isRecipe: false
            }
        }

        // Busca carrito de usuario
        let item = await SHOPPINGCART.find({"idUser": params.idUser})

        // Crear carrito en BD si no exite
        let newShoppingCart = null
        if(item.length === 0){
            let sc = {
                idUser: params.idUser,
                dateCreate: moment().toDate(),
                products: []
            }
            
            let shoppingcart = new SHOPPINGCART(sc)
            newShoppingCart = await shoppingcart.save()
        }

        // Obtiene carrito de BD
        let itemById = null
        if(item.length === 0){
            itemById = await SHOPPINGCART.findById(newShoppingCart._id)
        }
        else{
            itemById = await SHOPPINGCART.findById(item[0]._id)
        }

        // Revisar que producto y/o receta se encuentre en el carrito
        let band = false
        for (let i = 0; i < itemById.products.length; i++) {
            const product = itemById.products[i];
            if(product.product === body.product){
                itemById.products[i].quantity += Number(body.quantity)
                band = true
                break
            }
        }

        // Agregando prodcuto si no existia ya en el carrito
        if(!band) itemById.products.push(aux)

        // Guardando cambios
        let saved = await itemById.save()
        if(saved){
            res.status(200).send({valid:true, msg:'Item agregado a carrito de compras con exito.'})
        }else{
            res.status(200).send({valid:false, msg:'No se ha podido agregar el item al carrito de compras.'})
        }
    }else{
        res.status(200).send({msg:"No tienes permiso para realizar el proceso.", valid:false})
    }
}

/** QUITAR RECETA/PRODUCTO DEL CARRITO */
//-- SHOPPINGCART03
exports.removeProduct = async function(req, res, next){
    let prmsn = await permission.checkPermissions(req.user.actions, 'SHOPPINGCART03')
    if(prmsn){
        let params = req.params
        let body = req.body

        let item = await SHOPPINGCART.find({"idUser": params.idUser})
        let itemById = await SHOPPINGCART.findById(item[0]._id)
        let products = itemById.products
        if(products.length > 0){
            for (let i = 0; i < products.length; i++) {
                const product = products[i];
                if(product.product.toString() === params.idProduct.toString()){
                    itemById.products.splice(i, 1)
                    break;
                }
            }
        }

        let saved = await itemById.save()
        if(saved){
            res.status(200).send({valid:true, msg:'Item removido del carrito de compras con exito.'})
        }else{
            res.status(200).send({valid:false, msg:'No se ha podido remover el item del carrito de compras.'})
        }
    }else{
        res.status(200).send({msg:"No tienes permiso para realizar el proceso.", valid:false})
    }
}

/** CARRITO DE USUARIO LOGUEADO */
//-- SHOPPINGCART04
exports.myShoppingcart = async function(req, res, next){
    let prmsn = await permission.checkPermissions(req.user.actions, 'SHOPPINGCART04')
    if(prmsn){
        let params = req.params
        let body = req.body

        try{
            let item = await SHOPPINGCART.find({"idUser": params.idUser})
            let itemById = await SHOPPINGCART.findById(item[0]._id)
            let products = itemById.products

            // Nuevo objeto
            let shopping = {
                "_id": itemById._id,
                "idUser": itemById.idUser,
                "dateCreate": itemById.dateCreate,
                "products": []
            }

            // Recorriendo lista para obtener objeto
            if(products.length > 0){
                for (let i = 0; i < products.length; i++) {
                    const product = products[i];

                    let item = {}
                    // Si es Receta 
                    if(product.isRecipe){
                        item = await RECIPE.find({'_id':product.product}, {images:false})
                    }
                    // Si es Producto
                    else{
                        item = await PRODUCT.find({'_id':product.product}, {images:false, historialPrice:false, historialStock:false})
                    }

                    // Objeto de producto
                    let aux = {
                        isRecipe: product.isRecipe,
                        product: item,
                        quantity: product.quantity
                    }

                    // Agregando producto a nuevo objeto
                    shopping.products.push(aux)
                }
            }

            if(shopping){
                res.status(200).send({valid:true, msg:'Carrito encontrado.', item:shopping})
            }else{
                res.status(200).send({valid:true, msg:'Carrito no encontrado.', item:shopping})
            }
        }
        catch(e){
            res.status(200).send({valid:true, msg:'Carrito no encontrado.', item:null})
        }
    }else{
        res.status(200).send({msg:"No tienes permiso para realizar el proceso.", valid:false})
    }
}
