let moment = require("moment")
var mongoXlsx = require('mongo-xlsx');

let PRODUCT = require("../models/product.model.js")
let CATEGORY = require("../models/product.category.model.js")
let COLOR = require("../models/product.color.model.js")
let TYPEMEDIDA = require("../models/product.typemedida.model.js")

let permission = require('./check.permissions.controller.js')

var querys              = require("../querys/querysMysql")
const { poolPromise }   = require('./db_mysql.js')

/** CREACION DE PRODUCTO */
//-- PRODUCT01
exports.createProduct = async function(req, res, next){
    let prmsn = await permission.checkPermissions(req.user.actions, 'PRODUCT01')
    if(prmsn){
        let params = req.params
        let body = req.body

        let aux = {
            name: body.name,
            description: body.description,
            code: body.code,
            realPrice: body.realPrice,
            realPriceSale: body.realPriceSale,
            historialPrice:[{
                price: body.realPrice,
                priceSale: body.realPriceSale,
                date: moment().toDate(),
            }],
            stock: body.stock,
            historialStock:[{
                quantity: body.stock,
                date: moment().toDate()
            }],
            typeMedida: {
                name: body.typeMedida.name,
                smallname: body.typeMedida.smallname
            },
            color: body.color,
            category: body.category,
            weight: body.weight,
            icon: (body.icon === undefined ? null : body.icon),
            images: null,
            limitStock: body.limitStock,
        }
        let product = new PRODUCT(aux);
        let saved = await product.save()
        if(saved){
            res.status(200).send({valid:true, msg:'Producto creado exitosamente.'})
        }else{
            res.status(200).send({valid:false, msg:'No se ha podido crear el producto.'})
        }
    }else{
        res.status(200).send({msg:"No tienes permiso para realizar el proceso.", valid:false})
    }
}

/** LISTA DE PRODUCTOS CREADOS */
//-- PRODUCT02
exports.listProducts = async function(req, res, next){
    let prmsn = await permission.checkPermissions(req.user.actions, 'PRODUCT02')
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
        let products = await PRODUCT.paginate(query, options)
        
        if(products.docs.length != 0){
            res.status(200).send({valid:true, msg:'Listado de productos.', products:products})
        }else{
            res.status(200).send({valid:false, msg:'No hay productos creados.'})
        }
    }else{
        res.status(200).send({msg:"No tienes permiso para realizar el proceso.", valid:false})
    }
}

/** CREACION DE CATEGORIA DE PRODUCTO */
//-- PRODUCT03
exports.createCategoryProduct = async function(req, res, next){
    let prmsn = await permission.checkPermissions(req.user.actions, 'PRODUCT03')
    if(prmsn){
        let params = req.params
        let body = req.body
        let aux = {
            name: body.name.toUpperCase(),
            dateCreate: moment().toDate(),
            dateDelete: null,
            eliminated: false
        }
        let obj = new CATEGORY(aux);
        let saved = await obj.save()
        if(saved){
            res.status(200).send({valid:true, msg:'Categoria creada exitosamente.'})
        }else{
            res.status(200).send({valid:false, msg:'No se ha podido crear la categoria de producto.'})
        }
    }else{
        res.status(200).send({msg:"No tienes permiso para realizar el proceso.", valid:false})
    }
}

/** LISTA DE CATEGORIAS DE PRODUCTOS CREADAS */
//-- PRODUCT04
exports.listCategoriesProduct = async function(req, res, next){
    let prmsn = await permission.checkPermissions(req.user.actions, 'PRODUCT04')
    if(prmsn){
        let params = req.params
        let body = req.body
        let items = await CATEGORY.find({})
        
        if(items.length != 0){
            res.status(200).send({valid:true, msg:'Listado de categorias de productos.', items:items})
        }else{
            res.status(200).send({valid:false, msg:'No hay categorias de productos creados.'})
        }
    }else{
        res.status(200).send({msg:"No tienes permiso para realizar el proceso.", valid:false})
    }
}

/** CREACION DE COLOR DE PRODUCTO */
//-- PRODUCT05
exports.createColorProduct = async function(req, res, next){
    let prmsn = await permission.checkPermissions(req.user.actions, 'PRODUCT05')
    if(prmsn){
        let params = req.params
        let body = req.body
        let aux = {
            name: body.name.toUpperCase(),
            dateCreate: moment().toDate(),
            dateDelete: null,
            eliminated: false
        }
        let obj = new COLOR(aux);
        let saved = await obj.save()
        if(saved){
            res.status(200).send({valid:true, msg:'Color creada exitosamente.'})
        }else{
            res.status(200).send({valid:false, msg:'No se ha podido crear color de producto.'})
        }
    }else{
        res.status(200).send({msg:"No tienes permiso para realizar el proceso.", valid:false})
    }
}

/** LISTA DE CATEGORIAS DE PRODUCTOS CREADAS */
//-- PRODUCT06
exports.listColorsProduct = async function(req, res, next){
    let prmsn = await permission.checkPermissions(req.user.actions, 'PRODUCT06')
    if(prmsn){
        let params = req.params
        let body = req.body
        let items = await COLOR.find({})
        
        if(items.length != 0){
            res.status(200).send({valid:true, msg:'Listado de colores de productos.', items:items})
        }else{
            res.status(200).send({valid:false, msg:'No hay colores de productos creados.'})
        }
    }else{
        res.status(200).send({msg:"No tienes permiso para realizar el proceso.", valid:false})
    }
}

/** CREACION DE COLOR DE PRODUCTO */
//-- PRODUCT07
exports.createTypemedidaProduct = async function(req, res, next){
    let prmsn = await permission.checkPermissions(req.user.actions, 'PRODUCT07')
    if(prmsn){
        let params = req.params
        let body = req.body
        let aux = {
            name: body.name.toUpperCase(),
            smallname: body.smallname.toUpperCase(),
            dateCreate: moment().toDate(),
            dateDelete: null,
            eliminated: false
        }
        let obj = new TYPEMEDIDA(aux);
        let saved = await obj.save()
        if(saved){
            res.status(200).send({valid:true, msg:'Tipo de producto creado exitosamente.'})
        }else{
            res.status(200).send({valid:false, msg:'No se ha podido crear el tipo de producto.'})
        }
    }else{
        res.status(200).send({msg:"No tienes permiso para realizar el proceso.", valid:false})
    }
}

/** LISTA DE TIPO DE MEDIDA DE PRODUCTOS CREADAS */
//-- PRODUCT08
exports.listTypemedidasProduct = async function(req, res, next){
    let prmsn = await permission.checkPermissions(req.user.actions, 'PRODUCT08')
    if(prmsn){
        let params = req.params
        let body = req.body
        let items = await TYPEMEDIDA.find({})
        
        if(items.length != 0){
            res.status(200).send({valid:true, msg:'Listado de tipos de medida de productos.', items:items})
        }else{
            res.status(200).send({valid:false, msg:'No hay tipos de medida de productos creados.'})
        }
    }else{
        res.status(200).send({msg:"No tienes permiso para realizar el proceso.", valid:false})
    }
}

/** OBTIENE PRODUCTO POR ID */
//-- PRODUCT09
exports.getProduct = async function(req, res, next){
    let prmsn = await permission.checkPermissions(req.user.actions, 'PRODUCT09')
    if(prmsn){
        let params = req.params
        let body = req.body
        
        let item = await PRODUCT.find({'_id':params.idProduct}, {images:false, historialPrice:false, historialStock:false})
        if(item != null){
            res.status(200).send({valid:true, msg:'Producto encontrado.', item:item})
        }else{
            res.status(200).send({valid:false, msg:'No existe este producto.', item:item})
        }
    }else{
        res.status(200).send({msg:"No tienes permiso para realizar el proceso.", valid:false})
    }
}

/** OBTIENE LISTA DE PRODUCTO POR CATEGORIA */
//-- PRODUCT10
exports.getProductByCategory = async function(req, res, next){
    let prmsn = await permission.checkPermissions(req.user.actions, 'PRODUCT10')
    if(prmsn){
        let params = req.params
        let body = req.body

        let item = await PRODUCT.find({"category": body.category.toUpperCase()},{images:false, historialPrice:false, historialStock:false})
        if(item != null){
            res.status(200).send({valid:true, msg:'Lista de productos encontrados.', item:item})
        }else{
            res.status(200).send({valid:false, msg:'No existen productos de esta categoria.', item:item})
        }
    }else{
        res.status(200).send({msg:"No tienes permiso para realizar el proceso.", valid:false})
    }
}

/** CARGA MASIVA DE PRODUCTOS*/
//-- PRODUCT11
exports.bulkload = async function(req, res, next){
    let prmsn = await permission.checkPermissions(req.user.actions, 'PRODUCT11')
    if(prmsn){
        let params = req.params
        let body = req.body
        
        /* Read xlsx file without a model */
        /* The library will use the first row the key */
        var model = null;
        var xlsx  = __dirname+'/load1.xlsx';

        //console.log(__dirname)
        
        mongoXlsx.xlsx2MongoData(xlsx, model, function(err, data) {
            if(data != null){
                res.status(200).send({valid:true, msg:'Lista de productos encontrados.', item:data})
            }else{
                res.status(200).send({valid:false, msg:'No existen productos de esta categoria.', item:null})
            }
        });
    }else{
        res.status(200).send({msg:"No tienes permiso para realizar el proceso.", valid:false})
    }
}

/** DEFINIR DESCUENTO A PRODUCTO */
//-- PRODUCT12
exports.setDiscount = async function(req, res, next){
    let prmsn = await permission.checkPermissions(req.user.actions, 'PRODUCT12')
    if(prmsn){
        let params = req.params
        let body = req.body

        let item = await PRODUCT.findById(params.idProduct)

        item.isDiscount = true
        item.discount = params.idDiscount
        item.historialDiscount.push(params.idDiscount)

        let save = item.save()
        if(save != null){
            res.status(200).send({valid:true, msg:'Descuento asociado a producto con exito.'})
        }else{
            res.status(200).send({valid:false, msg:'Descuento no se pudo asociar.'})
        }
    }else{
        res.status(200).send({msg:"No tienes permiso para realizar el proceso.", valid:false})
    }
}

/** REMOVER DESCUENTO A PRODUCTO */
//-- PRODUCT13
exports.removeDiscount = async function(req, res, next){
    let prmsn = await permission.checkPermissions(req.user.actions, 'PRODUCT13')
    if(prmsn){
        let params = req.params
        let body = req.body

        let item = await PRODUCT.findById(params.idProduct)

        item.isDiscount = false
        item.discount = ''

        let save = item.save()
        if(save != null){
            res.status(200).send({valid:true, msg:'Descuento desasociado a producto con exito.'})
        }else{
            res.status(200).send({valid:false, msg:'Descuento no se pudo desasociar.'})
        }
    }else{
        res.status(200).send({msg:"No tienes permiso para realizar el proceso.", valid:false})
    }
}

/** IMAGEN DE PRODUCTO*/
//-- SIN AUTENTICACION, SIN CODIGO
exports.imageByProduct = async function(req, res, next){
        let params = req.params
        let body = req.body
        let product = await PRODUCT.findById(params.idProduct)
        var data = product.images[0];
        var img = Buffer.from(data, 'base64')
        res.writeHead(200, {
            'Content-Type': 'image/png',
            'Content-Length': img.length
        });

        res.end(img); 
}