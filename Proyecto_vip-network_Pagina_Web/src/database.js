const sql = require('mssql');

const database = {
    user: 'sa',
    password: 'A44afb0b6808d662',
    // server: '192.168.1.146',
    // server: '186.67.71.37',
    server: '192.168.11.6',
    port: 1433, 
    database: 'Pagina_Web' 
};


//en caso de error
var connection = new sql.ConnectionPool(database, function(err, connection){
    if(err){
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.log('DATABASE CONNECTION WAS CLOSED')
        }
        if (err.code === 'ER_CON_COUNT_ERROR') {
            console.log('DATABASE HAS TO MANY CONNECTION')
        }
        if (err.code === 'ENCONNREFUSED') {
            console.log('DATABASE CONNECTION WAS REFUSED')
        }
    }
    if(connection)connection.relese();    
    console.log("CONECTADO CORRECTAMENTE A LA BASE DE DATOS DE SQL SERVER")
    return;
});

module.exports = connection;