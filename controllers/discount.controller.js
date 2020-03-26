let moment = require("moment")

let DISCOUNT = require("../models/discount.model.js")

let permission = require('./check.permissions.controller.js')

var querys              = require("../querys/querysMysql")
const { poolPromise }   = require('./db_mysql.js')

/** CREACION DE UN DESCUENTO */
//-- DISCOUNT01
exports.addDiscount = async function(req, res, next){
    let prmsn = await permission.checkPermissions(req.user.actions, 'DISCOUNT01')
    if(prmsn){
        let params = req.params
        let body = req.body

        let aux = {
            name: body.name,
            description: body.description,
            dateBegin: body.dateBegin,
            dateEnd: body.dateEnd,
            dateRangeText: body.dateRangeText,
            isPercent: body.isPercent,
            percent: body.percent,
            isDirect: body.isDirect,
            direct: body.direct,
            conditions: body.conditions,
            isCode: body.isCode,
            code: body.code, 
            active: true,
            dateCreate: moment().toDate()
        }

        let discount = new DISCOUNT(aux);
        let saved = await discount.save()
        if(saved){
            res.status(200).send({valid:true, msg:'Descuento agregado con exitosamente.'})
        }else{
            res.status(200).send({valid:false, msg:'No se ha podido agregar el descuento.'})
        }
    }else{
        res.status(200).send({msg:"No tienes permiso para realizar el proceso.", valid:false})
    }
}

/** LISTA DE DESCUENTOS */
//-- DISCOUNT02
exports.listDiscounts = async function(req, res, next){
    let prmsn = await permission.checkPermissions(req.user.actions, 'DISCOUNT02')
    if(prmsn){
        let params = req.params
        let body = req.body

        let query = {
            //$and:[
            //    {"dateBegin": true},
            //    {"dateEnd": true}
            //]
        }

        let options = {
            sort:{_id:-1},
            page:params.page,
            limit:params.limit
        }

        let discounts = await DISCOUNT.paginate(query, options)
        
        if(discounts.length != 0){
            res.status(200).send({valid:true, msg:'Listado de descuentos.', discounts:discounts})
        }else{
            res.status(200).send({valid:false, msg:'No hay descuentos.', discounts:null})
        }
    }else{
        res.status(200).send({msg:"No tienes permiso para realizar el proceso.", valid:false})
    }
}

/** DESCUENTO POR ID */
//-- DISCOUNT03
exports.getDiscount = async function(req, res, next){
    let prmsn = await permission.checkPermissions(req.user.actions, 'DISCOUNT03')
    if(prmsn){
        let params = req.params
        let body = req.body

        let item = await DISCOUNT.findById(params.idDiscount)
        
        if(item){
            res.status(200).send({valid:true, msg:'Descuento encontrado.', item:item})
        }else{
            res.status(200).send({valid:false, msg:'Descuento no encontrado.', item:null})
        }
    }else{
        res.status(200).send({msg:"No tienes permiso para realizar el proceso.", valid:false})
    }
}

/** EDITAR DESCUENTO */
//-- DISCOUNT04
exports.editDiscount = async function(req, res, next){
    let prmsn = await permission.checkPermissions(req.user.actions, 'DISCOUNT04')
    if(prmsn){
        let params = req.params
        let body = req.body

        let item = await DISCOUNT.findById(params.idDiscount)

        // Setear nuevos valores
        item.dateBegin = body.dateBegin
        item.dateEnd = body.dateEnd
        item.dateRangeText = body.dateRangeText
        item.isPercent = body.isPercent
        item.percent = body.percent
        item.isDirect = body.isDirect
        item.direct = body.direct
        item.isCode = body.isCode
        item.code = body.code
        item.active = body.active

        let save = item.save()
        
        if(save){
            res.status(200).send({valid:true, msg:'Descuento modificado.'})
        }else{
            res.status(200).send({valid:false, msg:'Descuento no se pudo modificar.'})
        }
    }else{
        res.status(200).send({msg:"No tienes permiso para realizar el proceso.", valid:false})
    }
}