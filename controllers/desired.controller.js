let moment = require("moment")

let DESIRED = require("../models/desired.model.js")
let PRODUCT = require("../models/product.model.js")
let RECIPE = require("../models/recipe.model.js")

let permission = require('./check.permissions.controller.js')

var querys              = require("../querys/querysMysql")
const { poolPromise }   = require('./db_mysql.js')

/** LIMPIAR DESEADOS */
//-- DESIRED01
exports.cleanDesired = async function(req, res, next){
    let prmsn = await permission.checkPermissions(req.user.actions, 'DESIRED01')
    if(prmsn){
        let params = req.params
        let body = req.body
        let aux = {
            idUser: params.idUser,
            dateCreate: moment().toDate(),
            products: []
        }
        
        var saved = await DESIRED.findOneAndUpdate({idUser: params.idUser}, aux, {upsert: true})
        if(saved){
            res.status(200).send({valid:true, msg:'Deseados vaciado exitosamente.'})
        }else{
            res.status(200).send({valid:false, msg:'No se ha podido vaciar los deseados.'})
        }
    }else{
        res.status(200).send({msg:"No tienes permiso para realizar el proceso.", valid:false})
    }
}

/** AGREGAR PRODUCTO A DESEADOS */
//-- DESIRED02
exports.addProduct = async function(req, res, next){
    let prmsn = await permission.checkPermissions(req.user.actions, 'DESIRED02')
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

        // Busca deseados de usuario
        let item = await DESIRED.find({"idUser": params.idUser})

        // Crear deseados en BD si no exite
        let newDesired = null
        if(item.length === 0){
            let de = {
                idUser: params.idUser,
                dateCreate: moment().toDate(),
                products: []
            }
            
            let desired = new DESIRED(de)
            newDesired = await desired.save()
        }

        // Obtiene deseados de BD
        let itemById = null
        if(item.length === 0){
            itemById = await DESIRED.findById(newDesired._id)
        }
        else{
            itemById = await DESIRED.findById(item[0]._id)
        }

        // Agregando prodcuto
        itemById.products.push(aux)

        // Guardando cambios
        let saved = await itemById.save()
        if(saved){
            res.status(200).send({valid:true, msg:'Item agregado a deseados con exito.'})
        }else{
            res.status(200).send({valid:false, msg:'No se ha podido agregar el item al deseados.'})
        }
    }else{
        res.status(200).send({msg:"No tienes permiso para realizar el proceso.", valid:false})
    }
}

/** QUITAR PRODUCTO DE DESEADOS */
//-- DESIRED03
exports.removeProduct = async function(req, res, next){
    let prmsn = await permission.checkPermissions(req.user.actions, 'DESIRED03')
    if(prmsn){
        let params = req.params
        let body = req.body

        let item = await DESIRED.find({"idUser": params.idUser})
        let itemById = await DESIRED.findById(item[0]._id)
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
            res.status(200).send({valid:true, msg:'Producto removido de deseados con exito.'})
        }else{
            res.status(200).send({valid:false, msg:'No se ha podido remover el producto de deseados.'})
        }
    }else{
        res.status(200).send({msg:"No tienes permiso para realizar el proceso.", valid:false})
    }
}

/** DESEADOS DE USUARIO LOGUEADO */
//-- DESIRED04
exports.myDesired = async function(req, res, next){
    let prmsn = await permission.checkPermissions(req.user.actions, 'DESIRED04')
    if(prmsn){
        let params = req.params
        let body = req.body

        try{
            let item = await DESIRED.find({"idUser": params.idUser})
            let itemById = await DESIRED.findById(item[0]._id)
            let products = itemById.products

            // Nuevo objeto
            let desired = {
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
                    desired.products.push(aux)
                }
            }

            if(desired){
                res.status(200).send({valid:true, msg:'Deseados encontrado.', item:desired})
            }else{
                res.status(200).send({valid:true, msg:'Deseados no encontrado.', item:desired})
            }
        }
        catch(e){
            res.status(200).send({valid:true, msg:'Deseados no encontrado.', item:null})
        }
    }else{
        res.status(200).send({msg:"No tienes permiso para realizar el proceso.", valid:false})
    }
}
