const db = require('../database/pg.database');

exports.getAllUsers = async () => {
    try {
        const res = await db.query("SELECT * FROM users");
        return res.rows;
    } catch (error) {
        console.error("Error executing query", error);
    }
};

exports.createUser = async (user) => {
    try {
        const { name, email, password, balance } = user;
        const res = await db.query(
            "INSERT INTO users (name, email, password, balance) VALUES ($1, $2, $3, $4) RETURNING *", 
            [name, email, password, balance]
        );
        return res.rows[0];
    } catch (error) {
        console.error("Error executing query", error);
    }
};

exports.getUserById = async (id) => {
    try {
        const res = await db.query("SELECT * FROM users WHERE id = $1", [id]);
        return res.rows[0];
    } catch (error) {
        console.error("Error executing query", error);
    }
};

exports.updateUser = async (id, userData) => {
    try {
        const { balance } = userData;
        const res = await db.query(
            "UPDATE users SET balance = $1 WHERE id = $2 RETURNING *",
            [balance, id]
        );
        return res.rows[0]; 
    } catch (error) {
        console.error("Error executing query", error);
    }
};

exports.deleteUser = async (id) => {
    try {
        const res = await db.query("DELETE FROM users WHERE id = $1 RETURNING *", [id]);
        return res.rows[0];
    } catch (error) {
        console.error("Error executing query", error);
    }
};

exports.getUserByEmail = async (email) => {
    try {
        const res = await db.query("SELECT * FROM users WHERE email = $1", [email]);
        return res.rows[0]; 
    } catch (error) {
        console.error("Error executing query", error);
    }
};

exports.createUser = async (user) => {
    try {
        const { name, email, password } = user;
        const res = await db.query(
            "INSERT INTO users (name, email, password, balance) VALUES ($1, $2, $3, 0) RETURNING *", 
            [name, email, password]
        );
        return res.rows[0];
    } catch (error) {
        console.error("Error executing query", error);
    }
};
