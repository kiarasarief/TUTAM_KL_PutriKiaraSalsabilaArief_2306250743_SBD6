const storeRepository = require("../repositories/store.repository");
const baseResponse = require("../utils/baseResponse.util");

exports.getAllStores = async (req, res) => {
    try {
        const stores = await storeRepository.getAllStores();
        baseResponse(res, true, 200, "Stores retrived succesfully", stores);
    } catch (error) {
        baseResponse(res, false, 500, "Error retrieving stores", error);
    }
};

exports.createStore = async (req, res) => { 
    if(!req.body.name || !req.body.address){
        return baseResponse(res, false, 400, "Name and address are required");
    }
    try {
        const store = await storeRepository.createStore(req.body);
        baseResponse(res, true, 201, "Store created succesfully", store);
    } catch (error) {
        baseResponse(res, false, 500, error.message || "Server Error", error);
    }
};

exports.getStoreById = async (req, res) => {
    const storeId = req.params.id;  
    try {
        const store = await storeRepository.getStoreById(storeId);
        if (!store) {
            return baseResponse(res, false, 404, "Store not found", null);
        }
        baseResponse(res, true, 200, "Store retrieved successfully", store);
    } catch (error) {
        baseResponse(res, false, 500, "Error retrieving store", error);
    }
};

exports.updateStore = async (req, res) => {
    const { id, name, address } = req.body;  

    if (!id || !name || !address) {
        return baseResponse(res, false, 400, "ID, Name, and Address are required");
    }

    try {
        const updatedStore = await storeRepository.updateStore(id, { name, address });
        if (!updatedStore) {
            return baseResponse(res, false, 404, "Store not found", null);
        }
        baseResponse(res, true, 200, "Store updated successfully", updatedStore);
    } catch (error) {
        baseResponse(res, false, 500, "Error updating store", error);
    }
};

exports.deleteStore = async (req, res) => {
    const storeId = req.params.id;  
    try {
        const deletedStore = await storeRepository.deleteStore(storeId);
        if (!deletedStore) {
            return baseResponse(res, false, 404, "Store not found", null);
        }
        baseResponse(res, true, 200, "Store deleted successfully", deletedStore);
    } catch (error) {
        baseResponse(res, false, 500, "Error deleting store", error);
    }
};