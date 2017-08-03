/**
 * Created by ronnnwu on 7/8/17.
 */

let mysql = require('mysql'), mysqlServer


if (1){
    mysqlServer = mysql.createConnection({
        host: process.env.RDS_HOSTNAME,
        user: process.env.RDS_USERNAME,
        password:  process.env.RDS_PASSWORD,
        port: process.env.RDS_PORT,
        database: 'rvexdb'
    });
}
else{
    mysqlServer = mysql.createConnection({
        host: '127.0.0.1',
        user: 'root',
        password:   '',
        port: '3306',
        database: 'rvexdb'
    });
};

module.exports = mysqlServer;
