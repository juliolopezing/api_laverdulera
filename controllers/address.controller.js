let moment = require("moment")

let ADDRESS = require("../models/address.model.js")

let permission = require('./check.permissions.controller.js')

var querys              = require("../querys/querysMysql")
const { poolPromise }   = require('./db_mysql.js')

/** CREACION DE DIRECCION DE USUARIO */
//-- ADDRESS01
exports.addAddress = async function(req, res, next){
    let prmsn = await permission.checkPermissions(req.user.actions, 'ADDRESS01')
    if(prmsn){
        let params = req.params
        let body = req.body

        let aux = {
            idUser: params.idUser,
            address: body.address,
            googleMaps: body.googleMaps,
            dateAdd: moment().toDate(),
            delete: false
        }

        let address = new ADDRESS(aux);
        let saved = await address.save()
        if(saved){
            res.status(200).send({valid:true, msg:'Direccion agregada exitosamente.'})
        }else{
            res.status(200).send({valid:false, msg:'No se ha podido agregar la direccion.'})
        }
    }else{
        res.status(200).send({msg:"No tienes permiso para realizar el proceso.", valid:false})
    }
}

/** LISTA DE DIRECCIONES DE USUARIO */
//-- ADDRESS02
exports.listAddress = async function(req, res, next){
    let prmsn = await permission.checkPermissions(req.user.actions, 'ADDRESS02')
    if(prmsn){
        let params = req.params
        let body = req.body

        let query = {
            //$and:[
            //    {"idUser": params.idUser},
            //    {"delete": false}
            //]
        }

        let address = await ADDRESS.find(query)
        
        if(address.length != 0){
            res.status(200).send({valid:true, msg:'Listado de direcciones.', address:address})
        }else{
            res.status(200).send({valid:false, msg:'No hay direcciones agregadas.', address:null})
        }
    }else{
        res.status(200).send({msg:"No tienes permiso para realizar el proceso.", valid:false})
    }
}

/** ELIMINAR DIRECCION DE USUARIO */
//-- ADDRESS03
exports.removeAddress = async function(req, res, next){
    let prmsn = await permission.checkPermissions(req.user.actions, 'ADDRESS03')
    if(prmsn){
        let params = req.params
        let body = req.body

        let address = await ADDRESS.findById(params.idAddress)
        address.delete = true
        let save = await address.save()
        
        if(save){
            res.status(200).send({valid:true, msg:'Direccion eliminada con exito.'})
        }else{
            res.status(200).send({valid:false, msg:'No se pudo eliminar la direccion.'})
        }
    }else{
        res.status(200).send({msg:"No tienes permiso para realizar el proceso.", valid:false})
    }
}