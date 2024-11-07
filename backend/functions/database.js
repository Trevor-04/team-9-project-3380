const mysql = require('mysql2/promise');
require('dotenv').config();

// Railway provides these environment variables automatically
const pool = mysql.createPool({
    host: process.env.MYSQLHOST || process.env.DB_HOST,
    user: process.env.MYSQLUSER || process.env.DB_USER,
    password: process.env.MYSQLPASSWORD || process.env.DB_PASSWORD,
    database: process.env.MYSQLDATABASE || process.env.DB_NAME,
    port: process.env.MYSQLPORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports.query = async function(query, params = []) {
    let connection;
    try {
        connection = await pool.getConnection();
        const [results] = await connection.execute(query, params);
        return results;
    } catch (err) {
        console.error("Error with query:", err);
        throw err;
    } finally {
        if (connection) {
            connection.release();
        }
    }
}

module.exports.disconnect = async function () {
    try {
        await pool.end();
        console.log("Closed all database connections");
    } catch (error) {
        console.error('Error in disconnect function:', error);
        throw error;
    }
}

module.exports.checkConnection = async function() {
    try {
        const connection = await pool.getConnection();
        console.log("Successfully connected to the database:");
        console.log(`Host: ${process.env.MYSQLHOST || process.env.DB_HOST}`);
        console.log(`Database: ${process.env.MYSQLDATABASE || process.env.DB_NAME}`);
        console.log(`User: ${process.env.MYSQLUSER || process.env.DB_USER}`);
        connection.release();
        return true;
    } catch (err) {
        console.error("Database connection failed:", err);
        throw err;
    }
}

module.exports.startTransaction = async function() {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        console.log("Started Transaction");
        return connection;
    } catch (err) {
        console.error("Failed to start transaction:", err);
        connection.release();
        throw err;
    }
}

module.exports.commit = async function(connection) {
    try {
        await connection.commit();
        console.log("Committed Transaction");
    } catch (err) {
        console.error("Failed to commit transaction:", err);
        throw err;
    } finally {
        connection.release();
    }
}

module.exports.rollback = async function(connection) {
    try {
        await connection.rollback();
        console.log("Rolled back transaction");
    } catch (err) {
        console.error("Failed to rollback transaction:", err);
        throw err;
    } finally {
        connection.release();
    }
}