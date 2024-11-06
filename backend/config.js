require("dotenv").config();
const mysql = require("mysql2");

const urlDB = `mysql://${process.env.MYSQLUSER}:${process.env.MYSQL_ROOT_PASSWORD}@${process.env.RAILWAY_TCP_PROXY_DOMAIN}:${Rprocess.env.AILWAY_TCP_PROXY_PORT}/${process.env.MYSQL_DATABASE}`

const connection = mysql.createConnection(urlDB);

module.exports = connection;