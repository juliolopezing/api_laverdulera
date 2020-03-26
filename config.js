/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

module.exports = {
    puerto:             process.env.PORT,
    urlMongo:           process.env.URLMONGO,
    userMongo:          process.env.USER_MONGO,
    passMongo:          process.env.PASS_MONGO,
    bd_Mongo :          process.env.BD_MONGO,
    messageTerminal:    process.env.messageTerminal,
    tokenjwt:           process.env.tokenjwt,
    expiredTime:        process.env.expiredTime,
    paramDB_CONFIG_MYSQL:{
        connectionLimit: process.env.connectionLimit,
        host:            process.env.host,
        user:            process.env.user,
        password:        process.env.password,
        database:        process.env.database
    }
};
