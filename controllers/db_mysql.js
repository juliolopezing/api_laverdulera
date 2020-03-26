var mysql = require('mysql')
var util  = require('util')
var cf    = require("../config.js")

var poolPromise = mysql.createPool(cf.paramDB_CONFIG_MYSQL
/*
{
    connectionLimit: 10,
    host: 'localhost',
    user: 'matt',
    password: 'password',
    database: 'my_database'
}
*/)

poolPromise.getConnection((err, connection) => {
    if (err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.error('Database connection was closed.')
        }
        if (err.code === 'ER_CON_COUNT_ERROR') {
            console.error('Database has too many connections.')
        }
        if (err.code === 'ECONNREFUSED') {
            console.error('Database connection was refused.')
        }
    }
    if (connection) connection.release()
    return
})

poolPromise.query = util.promisify(poolPromise.query) // Magic happens here.
module.exports = { poolPromise }