const db = require('../database/pg.database');

exports.getAllItems = async () => {
    try {
        const res = await db.query("SELECT * FROM items");
        return res.rows;
    } catch (error) {
        console.error("Error executing query", error);
    }
};

exports.createItem = async (item) => {
    try {
        const res = await db.query(
            "INSERT INTO items (name, price, store_id, stock, image_url) VALUES ($1, $2, $3, $4, $5) RETURNING *", 
            [item.name, item.price, item.store_id, item.stock, item.image_url]
        );
        return res.rows[0];
    } catch (error) {
        console.error("Error executing query", error);
    }
};

exports.getItemById = async (id) => {
    try {
        const res = await db.query("SELECT * FROM items WHERE id = $1", [id]);
        return res.rows[0];
    } catch (error) {
        console.error("Error executing query", error);
    }
};

exports.getItemsByStoreId = async (store_id) => {
    try {
        const res = await db.query("SELECT * FROM items WHERE store_id = $1", [store_id]);
        return res.rows;
    } catch (error) {
        console.error("Error executing query", error);
    }
};

exports.updateItem = async (id, itemData) => {
    try {
        const res = await db.query(
            "UPDATE items SET name = $1, price = $2, store_id = $3, stock = $4, image_url = $5 WHERE id = $6 RETURNING *",
            [itemData.name, itemData.price, itemData.store_id, itemData.stock, itemData.image_url, id]
        );
        return res.rows[0];
    } catch (error) {
        console.error("Error executing query", error);
    }
};

exports.deleteItem = async (id) => {
    try {
        const res = await db.query("DELETE FROM items WHERE id = $1 RETURNING *", [id]);
        return res.rows[0];
    } catch (error) {
        console.error("Error executing query", error);
    }
};
