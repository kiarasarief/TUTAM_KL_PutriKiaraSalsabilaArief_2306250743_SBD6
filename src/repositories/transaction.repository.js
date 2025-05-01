const db = require('../database/pg.database');

exports.createTransaction = async (transaction) => {
    try {
        const { user_id, item_id, quantity, total } = transaction;
        const res = await db.query(
            "INSERT INTO transactions (user_id, item_id, quantity, total, status) VALUES ($1, $2, $3, $4, 'pending') RETURNING *",
            [user_id, item_id, quantity, total]
        );
        return res.rows[0]; 
    } catch (error) {
        console.error("Error executing query", error);
    }
};

exports.getTransactionById = async (id) => {
    try {
        const res = await db.query("SELECT * FROM transactions WHERE id = $1", [id]);
        return res.rows[0]; 
    } catch (error) {
        console.error("Error executing query", error);
    }
};

exports.updateTransaction = async (id, transactionData) => {
    try {
        const { status } = transactionData;
        const res = await db.query(
            "UPDATE transactions SET status = $1 WHERE id = $2 RETURNING *",
            [status, id]
        );
        return res.rows[0]; 
    } catch (error) {
        console.error("Error executing query", error);
    }
};

exports.deleteTransaction = async (id) => {
    try {
        const res = await db.query("DELETE FROM transactions WHERE id = $1 RETURNING *", [id]);
        return res.rows[0]; 
    } catch (error) {
        console.error("Error executing query", error);
    }
};

exports.getAllTransactions = async () => {
    try {
        const res = await db.query(`
            SELECT 
                t.*, 
                row_to_json(u) as user,
                row_to_json(i) as item
            FROM transactions t
            JOIN users u ON t.user_id = u.id
            JOIN items i ON t.item_id = i.id
        `);
        return res.rows;
    } catch (error) {
        console.error("Error executing query", error);
    }
};
