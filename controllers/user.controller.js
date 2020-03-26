const mssql     = require('mssql')
var querys = require("../querys/querysMysql")
//const { poolPromise } = require('./db_mssql.js')
const { poolPromise } = require('./db_mysql.js')
const jwt = require('jsonwebtoken');
let config = require('../config.js')
let permission = require('./check.permissions.controller.js')

exports.login = async function(req, res, next){
    let params = req.params
    let body = req.body
    console.log(config)
    console.log('Conectando a BD')
    try{
        let pool = await poolPromise//mssql.connect(cf.paramDB_CONFIG)
        let resultGroup = await pool.query(querys.login, [body.email, body.pass])
            //.input('params_email', mssql.VarChar, body.email)
            //.input('params_pass',  mssql.VarChar, body.pass)
            //.query(querys.login)
            //console.log(resultGroup)
        var users = resultGroup
        
        if(users.length == 0){
            res.status(200).send({msg:"Usuario inválido.", valid:false})
        }else{
            if(users[0].activate){
                let pool = await poolPromise
                let resultGroupActions = await pool.query(querys.se_role, [users[0].idRol])
                    //.input('params_idRol', mssql.Int, users[0].idRol)
                    //.query(querys.se_role)
                let arrayAux = []
                for(let j=0; j<resultGroupActions.length; j++){
                    let aux = {
                        code: resultGroupActions[j].code
                    }
                    arrayAux.push(aux)
                }
                var actions = arrayAux
                let dataUser = { idUser: users[0].idUser, actions:actions }
                const token = jwt.sign(dataUser, config.tokenjwt, {expiresIn: parseInt( config.expiredTime ) });
                res.status(200).send({msg:"success", valid:true, user: users[0], token:token, actions:actions})
            }else{
                res.status(200).send({msg:"Por el momento estás como desactivado, no puedes entrar, contacta al administrador.", valid:false})
            }
        }

    }catch(err){
            console.log(err)
            res.status(200).send({msg:"Error en consulta a base de datos, espere un momento.", valid:false})
    }
}

/*
GET
idUserToRol
idRol
*/
exports.setRole = async function(req, res, next){//CODE:USER01
    let prmsn = await permission.checkPermissions(req.user.actions, 'USER01')
    if(prmsn){
        let params = req.params
        let body = req.body
        console.log('Conectando a BD')
        try{
            let pool = await poolPromise
            console.log('Conexión establecida - ok')
            let resultGroup = await pool.query(querys.up_roleUser,[params.idRol,params.idUserToRol])
                //.input('params_idUser', mssql.Int, params.idUserToRol)
                //.input('params_idRol',  mssql.Int, params.idRol)
                //.query(querys.up_roleUser)
            var roles = resultGroup
            if(roles.affectedRows === 1){
                res.status(200).send({msg:"Rol agregado con éxito", valid:true})
            }else{
                res.status(200).send({msg:"success", valid:false})
            }
        }catch(err){
            console.log(err)
            res.status(200).send({msg:"Error en consulta a base de datos, espere un momento.", valid:false})
        }
    }else{
        res.status(200).send({msg:"No tienes permiso para realizar el proceso.", valid:false})
    }
}

exports.getRole = async function(req, res, next){//CODE:USER02
    let prmsn = await permission.checkPermissions(req.user.actions, 'USER02')
    if(prmsn){
        let params = req.params
        let body = req.body
        console.log('Conectando a BD')
        try{
            let pool = await poolPromise//mssql.connect(cf.paramDB_CONFIG)
            console.log('Conexión establecida - ok')
            let resultGroup = await pool.query(querys.getRole, [params.idUser])
                //.input('params_idUser', mssql.Int, params.idUser)
                //.query(querys.getRole)

            var roles = resultGroup

            if(roles.length == 0){
                res.status(200).send({msg:"Usuario no tiene roles definidos.", valid:false})
            }else{
                res.status(200).send({msg:"success", valid:true, roles: roles})
            }
        }catch(err){
            console.log(err)
            res.status(200).send({msg:"Error en consulta a base de datos, espere un momento.", valid:false})
        }
    }else{
        res.status(200).send({msg:"No tienes permiso para realizar el proceso.", valid:false})
    }
}

exports.listUsers = async function(req, res, next){//CODE:USER03
    let prmsn = await permission.checkPermissions(req.user.actions, 'USER03')
    if(prmsn){
        let params = req.params
        let body = req.body
        console.log(req.user)
        try{
            let pool = await poolPromise//mssql.connect(cf.paramDB_CONFIG)
            console.log('Conexión establecida - ok')
            let resultGroup = await pool.query(querys.listUsers)
                //.query(querys.listUsers)
            var users = resultGroup

            if(users.length == 0){
                res.status(200).send({msg:"No hay usuarios registrados.", valid:false})
            }else{
                res.status(200).send({msg:"success", valid:true, users: users})
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
POST
{
    name:
    lastname:
}
*/
exports.updateUser = async function(req, res, next){//CODE:USER04
    let prmsn = await permission.checkPermissions(req.user.actions, 'USER04')
    if(prmsn){
        let params = req.params
        let body = req.body
        console.log('Conectando a BD')
        try{
            let pool = await poolPromise
            let resultGroup = await pool.query(querys.up_dataUser, [body.name, body.lastname, req.user.idUser])
                //.input('params_name',      mssql.VarChar, body.name)
                //.input('params_lastname',  mssql.VarChar, body.lastname)
                //.input('params_idUser',    mssql.VarChar, req.user.idUser)
                //.query(querys.up_dataUser)

            var updateInfo = resultGroup
            
            if(updateInfo.affectedRows === 1){
                res.status(200).send({msg:"Actualización de datos satisfactoria.", valid:true})
            }else{
                res.status(200).send({msg:"No se puede actualizar la información", valid:false})
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
POST
{
    newpassword
}
*/
exports.updatePassword = async function(req, res, next){//CODE:USER05
    let prmsn = await permission.checkPermissions(req.user.actions, 'USER05')
    if(prmsn){
        let params = req.params
        let body = req.body
        console.log('Conectando a BD')
        try{
            let pool = await poolPromise
            let resultGroup = await pool.query(querys.up_passUser, [body.newpassword, req.user.idUser])
                //.input('params_pass',      mssql.VarChar, body.newpassword)
                //.input('params_idUser',    mssql.VarChar, req.user.idUser)
                //.query(querys.up_passUser)

            var updateInfo = resultGroup
            if(updateInfo.affectedRows === 1){
                res.status(200).send({msg:"Actualización de contraseña satisfactoria.", valid:true})
            }else{
                res.status(200).send({msg:"No se puede actualizar la información", valid:false})
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
POST
{
    newemail
}
*/
exports.updateEmail = async function(req, res, next){//CODE:USER06
    let prmsn = await permission.checkPermissions(req.user.actions, 'USER06')
    if(prmsn){
        let params = req.params
        let body = req.body
        console.log('Conectando a BD')
        try{
            let pool = await poolPromise
            let resultGroup = await pool.query(querys.up_emailUser, [body.newemail, req.user.idUser])
                //.input('params_email',      mssql.VarChar, body.newemail)
                //.input('params_idUser',     mssql.VarChar, req.user.idUser)
                //.query(querys.up_emailUser)

            var updateInfo = resultGroup

            if(updateInfo.affectedRows === 1){
                res.status(200).send({msg:"Actualización de email satisfactoria.", valid:true})
            }else{
                res.status(200).send({msg:"No se puede actualizar la información", valid:false})
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
POST
{
    email:
    pass:
    name:
    lastname:
    pathSign:
    rol:
}
*/
exports.newUser = async function(req, res, next){//CODE:USER07
    let prmsn = await permission.checkPermissions(req.user.actions, 'USER07')
    if(prmsn){
        let params = req.params
        let body = req.body
        console.log('Conectando a BD')
        try{
            let pool = await poolPromise
            //@params_email, @params_pass, @params_name, @params_last, @params_sign, 1, @params_rol
            let resultGroup = await pool.query(querys.in_user, [body.email, body.pass, body.name, body.lastname, body.pathSign, body.rol])
                // .input('params_email',      mssql.VarChar, body.email)
                //.input('params_pass',       mssql.VarChar, body.pass)
                //.input('params_name',       mssql.VarChar, body.name)
                //.input('params_last',       mssql.VarChar, body.lastname)
                //.input('params_sign',       mssql.VarChar, body.pathSign)
                //.input('params_rol',        mssql.VarChar, body.rol)
                //.query(querys.in_user)

            var inserInfo = resultGroup

            if(inserInfo.affectedRows === 1){
                res.status(200).send({msg:"Usuario agregado con éxito.", valid:true})
            }else{
                res.status(200).send({msg:"No se puede actualizar la información", valid:false})
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
exports.listRoles = async function(req, res, next){//CODE:USER08
    let prmsn = await permission.checkPermissions(req.user.actions, 'USER08')
    if(prmsn){
        let params = req.params
        let body = req.body
        console.log('Conectando a BD')
        try{
            let pool = await poolPromise
            let resultGroup = await pool.query(querys.se_rolelist)
                //.query(querys.se_rolelist)

            var roles = resultGroup

            if(roles.length != 0){
                res.status(200).send({msg:"Listado de roles.", valid:true, roles:roles})
            }else{
                res.status(200).send({msg:"No se puede obtener el listado de roles.", valid:false})
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
PUT
idUser
{
    activate
}
*/
exports.updateActivateUser = async function(req, res, next){//CODE:USER04
    let prmsn = await permission.checkPermissions(req.user.actions, 'USER09')
    if(prmsn){
        let params = req.params
        let body = req.body
        console.log(body)
        console.log(params)
        try{
            let pool = await poolPromise
            let resultGroup = await pool.query(querys.up_activateUser, [body.activate, params.idUser])
                //.input('params_activate',  mssql.Bit,     body.activate)
                //.input('params_idUser',    mssql.VarChar, params.idUser)
                //.query(querys.up_activateUser)
            console.log(resultGroup)
            var updateInfo = resultGroup
            
            if(updateInfo.affectedRows === 1){
                res.status(200).send({msg:"Actualización de datos satisfactoria.", valid:true})
            }else{
                res.status(200).send({msg:"No se puede actualizar la información", valid:false})
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
PUT
idUser
{
    name:
    lastname:
    pathSign
}
*/
exports.updateUserAdmin = async function(req, res, next){//CODE:USER04
    let prmsn = await permission.checkPermissions(req.user.actions, 'USER10')
    if(prmsn){
        let params = req.params
        let body = req.body
        console.log('Conectando a BD')
        try{
            let pool = await poolPromise
            let resultGroup = await pool.query(querys.up_dataUserAdmin, [body.name, body.lastname, body.pathSign, params.idUser])
                //.input('params_name',      mssql.VarChar, body.name)
                //.input('params_lastname',  mssql.VarChar, body.lastname)
                //.input('params_pathSign',  mssql.VarChar, body.pathSign)
                //.input('params_idUser',    mssql.VarChar, params.idUser)
                //.query(querys.up_dataUser)

            var updateInfo = resultGroup
            
            if(updateInfo.affectedRows === 1){
                res.status(200).send({msg:"Actualización de datos satisfactoria.", valid:true})
            }else{
                res.status(200).send({msg:"No se puede actualizar la información", valid:false})
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
PUT
idUser
{
    newpassword
}
*/
exports.updatePasswordAdmin = async function(req, res, next){//CODE:USER05
    let prmsn = await permission.checkPermissions(req.user.actions, 'USER11')
    if(prmsn){
        let params = req.params
        let body = req.body
        console.log('Conectando a BD')
        try{
            let pool = await poolPromise
            let resultGroup = await pool.query(querys.up_passUser, [body.newpassword, params.idUser])
                //.input('params_pass',      mssql.VarChar, body.newpassword)
                //.input('params_idUser',    mssql.VarChar, params.idUser)
                //.query(querys.up_passUser)

            var updateInfo = resultGroup

            if(updateInfo.affectedRows === 1){
                res.status(200).send({msg:"Actualización de contraseña satisfactoria.", valid:true})
            }else{
                res.status(200).send({msg:"No se puede actualizar la información", valid:false})
            }
        }catch(err){
            console.log(err)
            res.status(200).send({msg:"Error en consulta a base de datos, espere un momento.", valid:false})
        }
    }else{
        res.status(200).send({msg:"No tienes permiso para realizar el proceso.", valid:false})
    }
}