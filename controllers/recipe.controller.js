let moment = require("moment")

let RECIPE = require("../models/recipe.model.js")
let PRODUCT = require("../models/product.model.js")
let SHOPPINGCART = require("../models/shoppingcart.model.js")

let permission = require('./check.permissions.controller.js')

var querys              = require("../querys/querysMysql")
const { poolPromise }   = require('./db_mysql.js')

/** CREAR RECETA */
//-- RECIPE01
exports.addRecipe = async function(req, res, next){
    let prmsn = await permission.checkPermissions(req.user.actions, 'RECIPE01')
    if(prmsn){
        let params = req.params
        let body = req.body

        // Nueva receta para agregar
        let aux = {
                    idUser: params.idUser,
                    dateCreate: moment().toDate(),
                    name: body.name,
                    description: body.description,
                    preparation: body.preparation,
                    price: body.price,
                    images: null,
                    products: body.products
        }

        let recipe = new RECIPE(aux);
        let saved = await recipe.save()
        if(saved){
            res.status(200).send({valid:true, msg:'Receta creada exitosamente.'})
        }else{
            res.status(200).send({valid:false, msg:'No se ha podido crear la receta.'})
        }
    }else{
        res.status(200).send({msg:"No tienes permiso para realizar el proceso.", valid:false})
    }
}

/** LISTA DE RECETAS */
//-- RECIPE02
exports.listRecipes = async function(req, res, next){
    let prmsn = await permission.checkPermissions(req.user.actions, 'RECIPE02')
    if(prmsn){
        let params = req.params
        let body = req.body
        let query = {
            // all
        }
        let options = {
            select:{
                images: false
            },
            sort:{_id:-1},
            page:params.page,
            limit:params.limit
        }
        let recipes = await RECIPE.paginate(query, options)

        if(recipes.docs.length != 0){
            let recipesFinal = {
                "totalDocs": recipes.totalDocs,
                "limit": recipes.limit,
                "totalPages": recipes.totalPages,
                "page": recipes.page,
                "pagingCounter": recipes.pagingCounter,
                "hasPrevPage": recipes.hasPrevPage,
                "hasNextPage": recipes.hasNextPage,
                "prevPage": recipes.prevPage,
                "nextPage": recipes.nextPage,
                "docs": []
            }


            for (let i = 0; i < recipes.docs.length; i++) {
                const recipe = recipes.docs[i];
                
                let auxRecipe = {
                    "_id": recipe._id,
                    "idUser": recipe.idUser,
                    "dateCreate": recipe.dateCreate,
                    "name": recipe.name,
                    "description": recipe.description,
                    "preparation": recipe.preparation,
                    "realPriceSale": recipe.realPriceSale,
                    "images": recipe.images,
                    "products": recipe.products
                }

                recipesFinal.docs.push(auxRecipe)
            }
            
            res.status(200).send({valid:true, msg:'Listado de productos.', recipes:recipesFinal})
        }else{
            res.status(200).send({valid:false, msg:'No hay productos creados.'})
        }
    }else{
        res.status(200).send({msg:"No tienes permiso para realizar el proceso.", valid:false})
    }
}

/** RECETA POR ID */
//-- RECIPE03
exports.getRecipe = async function(req, res, next){
    let prmsn = await permission.checkPermissions(req.user.actions, 'RECIPE03')
    if(prmsn){
        let params = req.params
        let body = req.body
        
        let recipes = await RECIPE.find({'_id':params.idRecipe}, {images:false})
        let recipe = recipes[0]
        
        let auxRecipe = {
            "_id": recipe._id,
            "idUser": recipe.idUser,
            "dateCreate": recipe.dateCreate,
            "name": recipe.name,
            "description": recipe.description,
            "preparation": recipe.preparation,
            "realPriceSale": recipe.realPriceSale,
            "images": recipe.images,
            "products": []
        }
        
        for (let j = 0; j < recipe.products.length; j++) {
            const product = recipe.products[j];
            let item = await PRODUCT.find({'_id':product.product}, {images:false, historialPrice:false, historialStock:false})

            // Objeto de producto
            let auxProduct = {
                product: item,
                quantity: product.quantity
            }

            // Agregando producto a nuevo objeto
            auxRecipe.products.push(auxProduct)
        }

        if(auxRecipe){    
            res.status(200).send({valid:true, msg:'Listado de productos.', recipes:auxRecipe})
        }else{
            res.status(200).send({valid:false, msg:'No hay productos creados.'})
        }
    }else{
        res.status(200).send({msg:"No tienes permiso para realizar el proceso.", valid:false})
    }
}

/** DEFINIR DESCUENTO A RECETA */
//-- RECIPE04
exports.setDiscount = async function(req, res, next){
    let prmsn = await permission.checkPermissions(req.user.actions, 'RECIPE04')
    if(prmsn){
        let params = req.params
        let body = req.body

        let item = await RECIPE.findById(params.idRecipe)

        item.isDiscount = true
        item.discount = params.idDiscount
        item.historialDiscount.push(params.idDiscount)

        let save = item.save()
        if(save != null){
            res.status(200).send({valid:true, msg:'Descuento asociado a receta con exito.'})
        }else{
            res.status(200).send({valid:false, msg:'Descuento no se pudo asociar.'})
        }
    }else{
        res.status(200).send({msg:"No tienes permiso para realizar el proceso.", valid:false})
    }
}

/** REMOVER DESCUENTO A RECETA */
//-- RECIPE05
exports.removeDiscount = async function(req, res, next){
    let prmsn = await permission.checkPermissions(req.user.actions, 'RECIPE05')
    if(prmsn){
        let params = req.params
        let body = req.body

        let item = await RECIPE.findById(params.idRecipe)

        item.isDiscount = false
        item.discount = ''

        let save = item.save()
        if(save != null){
            res.status(200).send({valid:true, msg:'Descuento desasociado a receta con exito.'})
        }else{
            res.status(200).send({valid:false, msg:'Descuento no se pudo desasociar.'})
        }
    }else{
        res.status(200).send({msg:"No tienes permiso para realizar el proceso.", valid:false})
    }
}

/** IMAGEN DE RECETA*/
//-- SIN AUTENTICACION, SIN CODIGO
exports.imageByRecipe = async function(req, res, next){
    let params = req.params
    let body = req.body
    let recipe = await RECIPE.findById(params.idRecipe)
    var data = recipe.images[0];
    var img = Buffer.from(data, 'base64')
    res.writeHead(200, {
        'Content-Type': 'image/png',
        'Content-Length': img.length
    });

    res.end(img); 
}