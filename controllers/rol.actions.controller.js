const mssql     = require('mssql')
//var querys = require("../querys/querys")
//const { poolPromise } = require('./db_mssql.js')
const jwt = require('jsonwebtoken');
let config = require('../config.js')
let permission = require('./check.permissions.controller.js')
var querys              = require("../querys/querysMysql")
const { poolPromise }   = require('./db_mysql.js')
/*
POST
{
    rolName
}
*/
exports.addRol = async function(req, res, next){
    let prmsn = await permission.checkPermissions(req.user.actions, 'RLACT01')
    if(prmsn){
        let params = req.params
        let body = req.body
        try{//se_roleByName
            let pool = await poolPromise
            let resultGroup = await pool.query(querys.se_roleByName, [body.rolName])
                //.input('params_nameRole', mssql.VarChar, body.rolName)
                //.query(querys.se_roleByName)

            if(resultGroup.length == 0){
                let pool = await poolPromise
                let resultGroup = await pool.query(querys.in_role, [body.rolName])
                    //.input('params_nameRole', mssql.VarChar, body.rolName)
                    //.query(querys.in_role)
                var roles = resultGroup
                if(roles.affectedRows === 1){
                    res.status(200).send({msg:"Rol agregado con éxito", valid:true})
                }else{
                    res.status(200).send({msg:"success", valid:false})
                }
            }else
                res.status(200).send({msg:"El nombre del rol ya existe.", valid:false})
        }catch(err){
            console.log(err)
            res.status(200).send({msg:"Error en consulta a base de datos, espere un momento.", valid:false})
        }
    }else{
        res.status(200).send({msg:"No tienes permiso para realizar el proceso.", valid:false})
    }
}

/*
PUT
idRol
{
    rolName
}
*/
exports.updateRol = async function(req, res, next){
    let prmsn = await permission.checkPermissions(req.user.actions, 'RLACT02')
    if(prmsn){
        let params = req.params
        let body = req.body
        try{
            let pool = await poolPromise
             let resultGroup = await pool.query(querys.up_role, [body.rolName, params.idRol])
                //.input('params_nameRole', mssql.VarChar, body.rolName)
                //.input('params_idRol',    mssql.Int,     params.idRol)
                //.query(querys.up_role)

            var roles = resultGroup
            if(roles.affectedRows === 1){
                res.status(200).send({msg:"Rol modificado con éxito", valid:true})
            }else{
                res.status(200).send({msg:"No se pudo modificar el rol.", valid:false})
            }
        }catch(err){
            console.log(err)
            res.status(200).send({msg:"Error en consulta a base de datos, espere un momento.", valid:false})
        }
    }else{
        res.status(200).send({msg:"No tienes permiso para realizar el proceso.", valid:false})
    }
}

/*
GET
idRol
*/
exports.deleteRol = async function(req, res, next){
    let prmsn = await permission.checkPermissions(req.user.actions, 'RLACT03')
    if(prmsn){
        let params = req.params
        let body = req.body

        try{
            let pool = await poolPromise

            let resultGroup = await pool.query(querys.dl_role, [params.idRol])
                //.input('params_idRol',    mssql.Int,     params.idRol)
                //.query(querys.dl_role)

            var roles = resultGroup
            
            if(roles.affectedRows === 1){
                res.status(200).send({msg:"Rol eliminado con éxito", valid:true})
            }else{
                res.status(200).send({msg:"No se pudo modificar el rol, revisar si no hay algún usuario que dependa de éste rol.", valid:false})
            }
        }catch(err){
            console.log(err)
            res.status(200).send({msg:"Error en consulta a base de datos, espere un momento.", valid:false})
        }
    }else{
        res.status(200).send({msg:"No tienes permiso para realizar el proceso.", valid:false})
    }
}

/*
GET
*/
exports.listActions = async function(req, res, next){
    let prmsn = await permission.checkPermissions(req.user.actions, 'RLACT04')
    if(prmsn){
        let params = req.params
        let body = req.body
        console.log(req.user)
        try{
            let pool = await poolPromise
            let resultGroup = await pool.query(querys.se_actions)
                //.query(querys.se_actions)
            var actions = resultGroup

            if(actions.length == 0){
                res.status(200).send({msg:"No hay acciones registradas.", valid:false})
            }else{
                res.status(200).send({msg:"success", valid:true, actions: actions})
            }
        }catch(err){
            console.log(err)
            res.status(200).send({msg:"Error en consulta a base de datos, espere un momento.", valid:false})
        }
    }else{
        res.status(200).send({msg:"No tienes permiso para realizar el proceso.", valid:false})
    }
}

/*
GET
idRol
*/
exports.listActionsByRol = async function(req, res, next){
    let prmsn = await permission.checkPermissions(req.user.actions, 'RLACT05')
    if(prmsn){
        let params = req.params
        let body = req.body

        try{
            let pool = await poolPromise

            let resultGroup = await pool.query(querys.se_actionsByRol, [params.idRol])
                //.input('params_idRol',    mssql.Int,     params.idRol)
                //.query(querys.se_actionsByRol)
            var actions = resultGroup

            if(actions.length == 0){
                res.status(200).send({msg:"Rol sin acciones.", valid:false})
            }else{
                res.status(200).send({msg:"success", valid:true, actions: actions})
            }
        }catch(err){
            console.log(err)
            res.status(200).send({msg:"Error en consulta a base de datos, espere un momento.", valid:false})
        }
    }else{
        res.status(200).send({msg:"No tienes permiso para realizar el proceso.", valid:false})
    }
}

/*
GET
idRol
idAction
*/
exports.addActionRefInRol = async function(req, res, next){
    let prmsn = await permission.checkPermissions(req.user.actions, 'RLACT06')
    if(prmsn){
        let params = req.params
        let body = req.body
        try{//se_roleByName
            let pool = await poolPromise

            let resultGroup = await pool.query(querys.se_rolRefAction, [params.idRol, params.idAction])
                //.input('params_idRol',    mssql.Int,     params.idRol)
                //.input('params_idAction', mssql.Int,     params.idAction)
                //.query(querys.se_rolRefAction)

            if(resultGroup.length == 0){
                let pool = await poolPromise

                let resultGroup = await pool.query(querys.in_rolRefAction, [params.idRol, params.idAction])
                    //.input('params_idRol',    mssql.Int,     params.idRol)
                    //.input('params_idAction', mssql.Int,     params.idAction)
                    //.query(querys.in_rolRefAction)

                var roles = resultGroup
            
                if(roles.affectedRows === 1){
                    res.status(200).send({msg:"La acción ha sido agregada al rol.", valid:true})
                }else{
                    res.status(200).send({msg:"No se ha podido agregar la acción al rol.", valid:false})
                }
            }else
                res.status(200).send({msg:"Ese permiso ya se encuentra asignado al rol seleccionado.", valid:false})
        }catch(err){
            console.log(err)
            res.status(200).send({msg:"Error en consulta a base de datos, espere un momento.", valid:false})
        }
    }else{
        res.status(200).send({msg:"No tienes permiso para realizar el proceso.", valid:false})
    }
}

/*
GET
idRol
idAction
*/
exports.deleteActionRefRol = async function(req, res, next){
    let prmsn = await permission.checkPermissions(req.user.actions, 'RLACT07')
    if(prmsn){
        let params = req.params
        let body = req.body
        console.log('Conectando a BD')
        try{
            let pool = await poolPromise
            console.log('Conexión establecida - ok')
            let resultGroup = await pool.query(querys.dl_rolRefAction, [params.idRol, params.idAction])
                //nput('params_idRol',    mssql.Int,     params.idRol)
                //input('params_idAction', mssql.Int,     params.idAction)
                //.query(querys.dl_rolRefAction)

            var roles = resultGroup
            
            if(roles.affectedRows === 1){
                res.status(200).send({msg:"Ha sido eliminada la relación con éxito.", valid:true})
            }else{
                res.status(200).send({msg:"No se pudo modificar el rol, revisar si no hay algún usuario que dependa de éste rol.", valid:false})
            }
        }catch(err){
            console.log(err)
            res.status(200).send({msg:"Error en consulta a base de datos, espere un momento.", valid:false})
        }
    }else{
        res.status(200).send({msg:"No tienes permiso para realizar el proceso.", valid:false})
    }
}