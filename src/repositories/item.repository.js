const db = require("../database/pg.database");

exports.createItem = async (item) => {
  try {
    const res = await db.query(
      "INSERT INTO items (name, price, store_id, image_url, stock) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [item.name, item.price, item.store_id, item.image_url, item.stock]
    );
    return res.rows[0];
  } catch (error) {
    console.error("Error creating item", error);
    throw error;
  }
};

exports.getAllItems = async () => {
  try {
    const res = await db.query(`
      SELECT items.*, stores.name AS store_name 
      FROM items 
      JOIN stores ON items.store_id = stores.id 
      ORDER BY items.created_at DESC
    `);
    return res.rows;
  } catch (error) {
    console.error("Error getting items", error);
    throw error;
  }
};

exports.getItemById = async (id) => {
  try {
    const res = await db.query("SELECT * FROM items WHERE id = $1", [id]);
    return res.rows[0];
  } catch (error) {
    console.error("Error getting item", error);
    throw error;
  }
};

exports.getItemsByStoreId = async (id) => {
  try {
    const res = await db.query("SELECT * FROM items WHERE store_id = $1", [id]);
    return res.rows;
  } catch (error) {
    console.error("Error getting item", error);
    throw error;
  }
};

exports.updateItem = async (item) => {
  try {
    await db.query("BEGIN");
    const res = await db.query(
      "UPDATE items SET name = $1, price = $2, store_id = $3, image_url = $4, stock = $5 WHERE id = $6 RETURNING *",
      [
        item.name,
        item.price,
        item.store_id,
        item.image_url,
        item.stock,
        item.id,
      ]
    );
    await db.query("COMMIT");
    return res.rows[0];
  } catch (error) {
    await db.query("ROLLBACK");
    console.error("Error updating item", error);
    throw error;
  }
};

exports.deleteItem = async (id) => {
  try {
    const res = await db.query("DELETE FROM items WHERE id = $1 RETURNING *", [
      id,
    ]);
    return res.rows[0];
  } catch (error) {
    console.error("Error deleting item", error);
    throw error;
  }
};

exports.updateItemStock = async (itemId, stock) => {
  try {
    const res = await db.query(
      "UPDATE items SET stock = $1 WHERE id = $2 RETURNING *",
      [stock, itemId]
    );
    return res.rows[0];
  } catch (error) {
    console.error("Error updating item stock", error);
    throw error;
  }
};
