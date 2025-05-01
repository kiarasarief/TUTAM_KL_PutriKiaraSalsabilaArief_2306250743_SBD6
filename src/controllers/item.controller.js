const itemRepository = require("../repositories/item.repository");
const storeRepository = require("../repositories/store.repository");
const baseResponse = require("../utils/baseResponse.util");
const FormData = require("form-data");
const stream = require("stream");
const axios = require("axios");
const cloudinary = require("../utils/cloudinary.util");

exports.getAllItems = async (req, res) => {
  try {
    const items = await itemRepository.getAllItems();
    baseResponse(res, true, 200, "Items retrieved successfully", items);
  } catch (error) {
    baseResponse(res, false, 500, "Error retrieving items", error);
  }
};

exports.createItem = async (req, res) => {
  const { name, price, store_id, stock } = req.body;
  if (!name || !price || !store_id) {
    return baseResponse(
      res,
      false,
      400,
      "Name, price, and store_id are required"
    );
  }

  const store = await storeRepository.getStoreById(store_id);
  if (!store) {
    return baseResponse(res, false, 400, "Store doesn't exist", null);
  }

  let image_url = null;
  if (req.file) {
    try {
      const uploadResponse = await cloudinary.uploader.upload(req.file.path);
      image_url = uploadResponse.secure_url;
    } catch (error) {
      return baseResponse(res, false, 500, "Error uploading image", error);
    }
  }

  try {
    const item = await itemRepository.createItem({
      name,
      price,
      store_id,
      stock,
      image_url,
    });
    baseResponse(res, true, 201, "Item created successfully", item);
  } catch (error) {
    baseResponse(res, false, 500, "Error creating item", error);
  }
};

exports.getItemById = async (req, res) => {
  try {
    const item = await itemRepository.getItemById(req.params.id);
    if (!item) {
      return baseResponse(res, false, 404, "Item not found", null);
    }
    baseResponse(res, true, 200, "Item retrieved successfully", item);
  } catch (error) {
    baseResponse(res, false, 500, "Error retrieving item", error);
  }
};

exports.getItemsByStoreId = async (req, res) => {
  try {
    const items = await itemRepository.getItemsByStoreId(req.params.store_id);
    if (!items) {
      return baseResponse(res, false, 404, "Store doesn't exist", null);
    }
    baseResponse(res, true, 200, "Items retrieved successfully", items);
  } catch (error) {
    baseResponse(res, false, 500, "Error retrieving items", error);
  }
};

exports.updateItem = async (req, res) => {
  const { id, name, price, store_id, stock } = req.body;
  if (!id || !name || !price || !store_id) {
    return baseResponse(
      res,
      false,
      400,
      "ID, name, price, and store_id are required"
    );
  }

  let image_url = req.body.image_url;
  if (req.file) {
    try {
      const uploadResponse = await cloudinary.uploader.upload(req.file.path);
      image_url = uploadResponse.secure_url;
    } catch (error) {
      return baseResponse(res, false, 500, "Error uploading image", error);
    }
  }

  try {
    const updatedItem = await itemRepository.updateItem(id, {
      name,
      price,
      store_id,
      stock,
      image_url,
    });
    if (!updatedItem) {
      return baseResponse(res, false, 404, "Store doesn't exist", null);
    }
    baseResponse(res, true, 200, "Item updated successfully", updatedItem);
  } catch (error) {
    baseResponse(res, false, 500, "Error updating item", error);
  }
};

exports.deleteItem = async (req, res) => {
  try {
    const deletedItem = await itemRepository.deleteItem(req.params.id);
    if (!deletedItem) {
      return baseResponse(res, false, 404, "Item not found", null);
    }
    baseResponse(res, true, 200, "Item deleted successfully", deletedItem);
  } catch (error) {
    baseResponse(res, false, 500, "Error deleting item", error);
  }
};
