var mongoXlsx 			= require('mongo-xlsx')
//let CRRP 				= require("../models/correspondencia.js")
//let FLOW 				= require("../models/flujo.model.js")
let permission 			= require('./check.permissions.controller.js')
const mssql             = require('mssql')
//var querys 				= require("../querys/querys")
//const { poolPromise }   = require('./db_mssql.js')
let moment 				= require('moment')
let fs 					= require('fs')

var querys              = require("../querys/querysMysql")
const { poolPromise }   = require('./db_mysql.js')

//RANGO DE FECHA EN CORRESPONDENCIA
/*
GET
dateBegin:
dateEnd:
download
*/
exports.dateCorrespondencia = async function(req, res, next){
    /*let prmsn = await permission.checkPermissions(req.user.actions, 'REPORT01')
    if(prmsn){*/
        let params = req.params
        let body = req.body
        let dtbg = moment(params.dateBegin, "DD-MM-YYYY")
        let dted = moment(params.dateEnd, "DD-MM-YYYY")

        let query = {
        	$and:[{
        		dateCreate:{$gte: dtbg.toDate()}
        	},{
        		dateCreate:{$lte: dted.toDate()}
        	}]
        }
        console.log(query)

        let only = {
        	dateCreate:1,canceled:1,dateCanceled:1,send:1,dateSend:1,
        	accepted:1,dateAccepted:1,comment:1,destinationUser:1,historial:1
        }

		let crrps = await CRRP.find(query, only)
        if(crrps.length > 0){
        	let size = crrps.length
        	let list = []
        	for(let i=0; i<size; i++){
        		let pool = await poolPromise
                let resultGroup = await pool.query(querys.dataUser, [crrps[i].destinationUser])
                var users = resultGroup
                
                let sizeh = crrps[i].historial.length
                let auxh = crrps[i].historial[sizeh-1]

                var aux = {
                	Nombre_receptor: (users[0] == undefined) ? "":users[0].name + ' ' + (users[0] == undefined) ? "":users[0].lastname,
                	Correo_receptor: (users[0] == undefined) ? "":users[0].email,
                	Creado: moment(crrps[i].dateCreate).format("DD-MM-YYYY HH:mm:ss"),
                	Cancelado: crrps[i].canceled ? "CANCELADO" : "NO",
                	Fecha_cancelado: (crrps[i].dateCanceled == null) ? "--" : moment(crrps[i].dateCanceled).format("DD-MM-YYYY HH:mm:ss"),
                	Enviado: crrps[i].send ? "ENVIADO" : "NO",
                	Fecha_enviado: (auxh.dateSend == null) ? "--" : moment(auxh.dateSend).format("DD-MM-YYYY HH:mm:ss"),
                	Aceptado: crrps[i].accepted ? "ACEPTADO" : "NO",
                	Fecha_aceptado: (crrps[i].dateAccepted == null) ? "--" : moment(crrps[i].dateAccepted).format("DD-MM-YYYY HH:mm:ss"),
                }
                list.push(aux)
        	}
        	if(params.download == "1"){
        		var model = mongoXlsx.buildDynamicModel(list);
        		mongoXlsx.mongoData2Xlsx(list, model, function(err, data) {
					console.log('File saved at:', data.fullPath);
					const stats = fs.statSync(data.fullPath);
		            const fileSizeInBytes = stats.size;
		            res.setHeader('Content-Disposition','attachment; filename=report.xlsx')
		            res.setHeader('Content-Type', 'application/vnd.ms-excel');
		            res.setHeader('Content-Length', fileSizeInBytes);
		            res.setHeader('x-filename', "report.xlsx");
		            var restream = fs.createReadStream(data.fullPath)
		            
		            restream
		                .on('open', function(){
		                    console.log('Archivo abierto')
		                    restream.pipe(res)
		                })
		            restream
		                .on('end', function(){
		                    console.log('Archivo enviado')
		                    fs.unlinkSync(data.fullPath)
		                })
		            restream
		                .on('error', function(err){
		                    console.log('ERROR')
		                    console.log(err)
		                }) 
				});
        	}else{
        		res.status(200).send({valid:true, msg:'Reporte generado.', list:list})
        	}
        }else{
            res.status(200).send({valid:true, msg:'No se ha podido generar el reporte', list:[]})
        }
    /*}else{
        res.status(200).send({msg:"No tienes permiso para realizar el proceso.", valid:false})
    }*/
}

//TIEMPOS PROMEDIOS DE LOS REPORTES ACTUALES
/*
GET
dateBegin:
dateEnd:
download
*/
exports.AVGtime = async function(req, res, next){
    /*let prmsn = await permission.checkPermissions(req.user.actions, 'REPORT01')
    if(prmsn){*/
        let params = req.params
        let body = req.body
        let dtbg = moment(params.dateBegin, "DD-MM-YYYY")
        let dted = moment(params.dateEnd, "DD-MM-YYYY")

        let query = {
        	$and:[{
        		dateCreate:{$gte: dtbg.toDate()}
        	},{
        		dateCreate:{$lte: dted.toDate()}
        	}]
        }
        console.log(query)

        let only = {
        	dateCreate:1,canceled:1,dateCanceled:1,send:1,dateSend:1,
        	accepted:1,dateAccepted:1,comment:1,destinationUser:1,historial:1
        }

        let crrps = await CRRP.find(query, only)
        if(crrps.length > 0){
        	let size = crrps.length
        	let list = []
        	for(let i=0; i<size; i++){
        		let pool = await poolPromise
                let resultGroup = await pool.query(querys.dataUser, [crrps[i].destinationUser])
                    //.input('params_idUser', mssql.Int, crrps[i].destinationUser)
                    //.query(querys.dataUser)
                var users = resultGroup
                console.log(resultGroup)
                let sizeh = crrps[i].historial.length
                let auxh = crrps[i].historial[sizeh-1]

                var aux = {
                	Nombre_receptor: users[0].name + ' ' + users[0].lastname,
                	Correo_receptor: users[0].email,
                	Creado: moment(crrps[i].dateCreate).format("DD-MM-YYYY HH:mm:ss"),
                	Cancelado: crrps[i].canceled ? "CANCELADO" : "NO",
                	Fecha_cancelado: (crrps[i].dateCanceled == null) ? "--" : moment(crrps[i].dateCanceled).format("DD-MM-YYYY HH:mm:ss"),
                	Enviado: crrps[i].send ? "ENVIADO" : "NO",
                	Fecha_enviado: (auxh.dateSend == null) ? "--" : moment(auxh.dateSend).format("DD-MM-YYYY HH:mm:ss"),
                	Aceptado: crrps[i].accepted ? "ACEPTADO" : "NO",
                	Fecha_aceptado: (crrps[i].dateAccepted == null) ? "--" : moment(crrps[i].dateAccepted).format("DD-MM-YYYY HH:mm:ss"),
                }
                list.push(aux)
        	}
        	if(params.download == "1"){
        		var model = mongoXlsx.buildDynamicModel(list);
        		mongoXlsx.mongoData2Xlsx(list, model, function(err, data) {
					console.log('File saved at:', data.fullPath);
					const stats = fs.statSync(data.fullPath);
		            const fileSizeInBytes = stats.size;
		            res.setHeader('Content-Disposition','attachment; filename=report.xlsx')
		            res.setHeader('Content-Type', 'application/vnd.ms-excel');
		            res.setHeader('Content-Length', fileSizeInBytes);
		            res.setHeader('x-filename', "report.xlsx");
		            var restream = fs.createReadStream(data.fullPath)
		            
		            restream
		                .on('open', function(){
		                    console.log('Archivo abierto')
		                    restream.pipe(res)
		                })
		            restream
		                .on('end', function(){
		                    console.log('Archivo enviado')
		                    fs.unlinkSync(data.fullPath)
		                })
		            restream
		                .on('error', function(err){
		                    console.log('ERROR')
		                    console.log(err)
		                }) 
				});
        	}else{
        		res.status(200).send({valid:true, msg:'Reporte generado.', list:list})
        	}
        }else{
            res.status(200).send({valid:true, msg:'No se ha podido generar el reporte', list:[]})
        }
    /*}else{
        res.status(200).send({msg:"No tienes permiso para realizar el proceso.", valid:false})
    }*/
}

//ESTATUS ACTUAL DE LOS FLUJOS
/*
GET
download
*/
exports.statusFlows = async function(req, res, next){
    /*let prmsn = await permission.checkPermissions(req.user.actions, 'REPORT01')
    if(prmsn){*/
        let params = req.params
        let body = req.body

        let query = {
        	$and:[{
				idUserCreate: req.user.idUser,
        		eliminate: false
        	}]
        }
        console.log(query)

        let flows = await FLOW.find(query)
        if(flows.length > 0){
        	let size = flows.length
        	let list = []
        	for(let i=0; i<size; i++){

				var aux = {
					NombreDelFlujo: flows[i].title,
					Descripcion: flows[i].comment,
					esPublico: (flows[i].public) ? "Si" : "No",
					esPrivado: (flows[i].private) ? "Si" : "No",
					Iniciado:  (flows[i].begin) ? "Si" : "No",
					fechaIniciado: (flows[i].dateBegin == null) ? "--" : moment(auxh.dateBegin).format("DD-MM-YYYY HH:mm:ss"),
					Cancelado:  (flows[i].canceled) ? "Si" : "No",
					fechaIniciado: (flows[i].dateCanceled == null) ? "--" : moment(auxh.dateCanceled).format("DD-MM-YYYY HH:mm:ss"),
					Finalizado:  (flows[i].end) ? "Si" : "No",
					Error:  (flows[i].error) ? "Si" : "No",
				}
                list.push(aux)
        	}
        	if(params.download == "1"){
        		var model = mongoXlsx.buildDynamicModel(list);
        		mongoXlsx.mongoData2Xlsx(list, model, function(err, data) {
					console.log('File saved at:', data.fullPath);
					const stats = fs.statSync(data.fullPath);
		            const fileSizeInBytes = stats.size;
		            res.setHeader('Content-Disposition','attachment; filename=report.xlsx')
		            res.setHeader('Content-Type', 'application/vnd.ms-excel');
		            res.setHeader('Content-Length', fileSizeInBytes);
		            res.setHeader('x-filename', "report.xlsx");
		            var restream = fs.createReadStream(data.fullPath)
		            
		            restream
		                .on('open', function(){
		                    console.log('Archivo abierto')
		                    restream.pipe(res)
		                })
		            restream
		                .on('end', function(){
		                    console.log('Archivo enviado')
		                    fs.unlinkSync(data.fullPath)
		                })
		            restream
		                .on('error', function(err){
		                    console.log('ERROR')
		                    console.log(err)
		                }) 
				});
        	}else{
        		res.status(200).send({valid:true, msg:'Reporte generado.', list:list})
        	}
        }else{
            res.status(200).send({valid:true, msg:'No se ha podido generar el reporte', list:[]})
        }
    /*}else{
        res.status(200).send({msg:"No tienes permiso para realizar el proceso.", valid:false})
    }*/
}

//RANGO DE FECHA, EL PASO EN EL QUE SE ENCUENTRA POR FLUJO PARA TODOS - ADMIN
/*
GET
dateBegin:
dateEnd:
download
*/
exports.stepFlowsByUsers = async function(req, res, next){
    /*let prmsn = await permission.checkPermissions(req.user.actions, 'REPORT01')
    if(prmsn){*/
        let params = req.params
        let body = req.body

        let query = {
        	$and:[{
        		eliminate: false
        	}]
        }
        console.log(query)

        let flows = await FLOW.find(query)
        if(flows.length > 0){
        	let size = flows.length
        	let list = []
        	for(let i=0; i<size; i++){

				let pool = await poolPromise
                let resultGroup = await pool.query(querys.dataUser, [flows[i].idUserCreate])
                var users = resultGroup
                var auxNames = {
					Nombre_receptor:"",
					//Cantidad:0
				}
                if(users[0] != undefined){
					auxNames.Nombre_receptor = users[0].name + ' ' + users[0].lastname
					//auxNames.Cantidad = crrps[i].count
				}

				var aux = {
					Usuario: auxNames.Nombre_receptor,
					NombreDelFlujo: flows[i].title,
					Descripcion: flows[i].comment,
					esPublico: (flows[i].public) ? "Si" : "No",
					esPrivado: (flows[i].private) ? "Si" : "No",
					Iniciado:  (flows[i].begin) ? "Si" : "No",
					fechaIniciado: (flows[i].dateBegin == null) ? "--" : moment(flows[i].dateBegin).format("DD-MM-YYYY HH:mm:ss"),
					Cancelado:  (flows[i].canceled) ? "Si" : "No",
					fechaCancelado: (flows[i].dateCanceled == null) ? "--" : moment(flows[i].dateCanceled).format("DD-MM-YYYY HH:mm:ss"),
					Finalizado:  (flows[i].end) ? "Si" : "No",
					Error:  (flows[i].error) ? "Si" : "No",
				}
                list.push(aux)
        	}
        	if(params.download == "1"){
        		var model = mongoXlsx.buildDynamicModel(list);
        		mongoXlsx.mongoData2Xlsx(list, model, function(err, data) {
					console.log('File saved at:', data.fullPath);
					const stats = fs.statSync(data.fullPath);
		            const fileSizeInBytes = stats.size;
		            res.setHeader('Content-Disposition','attachment; filename=report.xlsx')
		            res.setHeader('Content-Type', 'application/vnd.ms-excel');
		            res.setHeader('Content-Length', fileSizeInBytes);
		            res.setHeader('x-filename', "report.xlsx");
		            var restream = fs.createReadStream(data.fullPath)
		            
		            restream
		                .on('open', function(){
		                    console.log('Archivo abierto')
		                    restream.pipe(res)
		                })
		            restream
		                .on('end', function(){
		                    console.log('Archivo enviado')
		                    fs.unlinkSync(data.fullPath)
		                })
		            restream
		                .on('error', function(err){
		                    console.log('ERROR')
		                    console.log(err)
		                }) 
				});
        	}else{
        		res.status(200).send({valid:true, msg:'Reporte generado.', list:list})
        	}
        }else{
            res.status(200).send({valid:true, msg:'No se ha podido generar el reporte', list:[]})
        }
    /*}else{
        res.status(200).send({msg:"No tienes permiso para realizar el proceso.", valid:false})
    }*/
}

//RANGO DE FECHA, CUANTOS TIENEN CARGADOS CADA USUARIO - ADMIN
/*
GET
dateBegin:
dateEnd:
download
*/
exports.usersFlowsPending = async function(req, res, next){
    /*let prmsn = await permission.checkPermissions(req.user.actions, 'REPORT01')
    if(prmsn){
		*/
        let params = req.params
        let body = req.body
        let dtbg = moment(params.dateBegin, "DD-MM-YYYY")
        let dted = moment(params.dateEnd, "DD-MM-YYYY")
		console.log(dtbg.toDate())
		console.log(dted.toDate())
		let query = [
			{$match:{
				$and:[{
					dateCreate:{$gte: dtbg.toDate()}
				},{
					dateCreate:{$lte: dted.toDate()}
				},{
					canceled: false
				},{
					eliminate: false
				},{
					end:false
				},{
					order: {$elemMatch:{status:false}}
				}]
			}},
			{$project:{order:1}},
			{$unwind: '$order'},
			{$group:{
				_id: '$order.idUser',
				count: { $sum:1 }
			}},
			{$sort:{
				count:-1
			}}
		]
        console.log(query)

		let crrps = await FLOW.aggregate(query)
		console.log(crrps)
        if(crrps.length > 0){
        	let size = crrps.length
        	let list = []
        	for(let i=0; i<size; i++){
        		let pool = await poolPromise
                let resultGroup = await pool.query(querys.dataUser, [crrps[i]._id])
                var users = resultGroup
                console.log(resultGroup[0])
                if(users[0] != undefined){
					var aux = {
						Nombre_receptor: users[0].name + ' ' + users[0].lastname,
						Cantidad: crrps[i].count
					}
					list.push(aux)
				}
        	}
        	if(params.download == "1"){
        		var model = mongoXlsx.buildDynamicModel(list);
        		mongoXlsx.mongoData2Xlsx(list, model, function(err, data) {
					console.log('File saved at:', data.fullPath);
					const stats = fs.statSync(data.fullPath);
		            const fileSizeInBytes = stats.size;
		            res.setHeader('Content-Disposition','attachment; filename=report.xlsx')
		            res.setHeader('Content-Type', 'application/vnd.ms-excel');
		            res.setHeader('Content-Length', fileSizeInBytes);
		            res.setHeader('x-filename', "report.xlsx");
		            var restream = fs.createReadStream(data.fullPath)
		            
		            restream
		                .on('open', function(){
		                    console.log('Archivo abierto')
		                    restream.pipe(res)
		                })
		            restream
		                .on('end', function(){
		                    console.log('Archivo enviado')
		                    fs.unlinkSync(data.fullPath)
		                })
		            restream
		                .on('error', function(err){
		                    console.log('ERROR')
		                    console.log(err)
		                }) 
				});
        	}else{
        		res.status(200).send({valid:true, msg:'Reporte generado.', list:list})
        	}
        }else{
            res.status(200).send({valid:true, msg:'No se ha podido generar el reporte', list:[]})
        }
    /*}else{
        res.status(200).send({msg:"No tienes permiso para realizar el proceso.", valid:false})
    }*/
}

exports.getXlsx = async function(req, res, next){
    
}