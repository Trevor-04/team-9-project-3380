const mysql = require('mysql2/promise');
require('dotenv').config();

// Create a connection pool with provided environment variables
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
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

// Disconnect function for gracefully closing the pool
module.exports.disconnect = async function () {
    try {
        await pool.end();
        console.log("Closed all database connections");
    } catch (error) {
        console.error('Error in disconnect function:', error);
        throw error;
    }
}

// Connection check function
module.exports.checkConnection = async function() {
    try {
        const connection = await pool.getConnection();
        console.log("Successfully connected to the database");
        connection.release();
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
