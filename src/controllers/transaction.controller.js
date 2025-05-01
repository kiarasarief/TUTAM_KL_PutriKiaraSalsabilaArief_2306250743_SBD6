const transactionRepository = require("../repositories/transaction.repository");
const itemRepository = require("../repositories/item.repository");
const userRepository = require("../repositories/user.repository");
const baseResponse = require("../utils/baseResponse.util");

exports.createTransaction = async (req, res) => {
    const { item_id, quantity, user_id } = req.body; 

    if (!item_id || !quantity || !user_id) {
        return baseResponse(res, false, 400, "Item ID, quantity, and user ID are required", null);
    }

    if (quantity <= 0) {
        return baseResponse(res, false, 400, "Quantity must be greater than 0", null);
    }

    try {
        const user = await userRepository.getUserById(user_id);
        if (!user) {
            return baseResponse(res, false, 404, "User not found", null);
        }

        const item = await itemRepository.getItemById(item_id);
        if (!item) {
            return baseResponse(res, false, 404, "Item not found", null);
        }

        const total = item.price * quantity;

        const transaction = await transactionRepository.createTransaction({
            user_id,
            item_id,
            quantity,
            total
        });

        baseResponse(res, true, 201, "Transaction created", transaction);
    } catch (error) {
        baseResponse(res, false, 500, "Error creating transaction", error);
    }
};

exports.payTransaction = async (req, res) => {
    const transactionId = req.params.id;  

    try {
        const transaction = await transactionRepository.getTransactionById(transactionId);
        if (!transaction) {
            return baseResponse(res, false, 404, "Transaction not found", null);
        }

        if (transaction.status !== 'pending') {
            return baseResponse(res, false, 400, "Transaction is already paid or canceled", null);
        }

        const user = await userRepository.getUserById(transaction.user_id);
        if (!user) {
            return baseResponse(res, false, 404, "User not found", null);
        }

        if (user.balance < transaction.total) {
            return baseResponse(res, false, 400, "Insufficient balance", null);
        }

        const item = await itemRepository.getItemById(transaction.item_id);
        if (!item) {
            return baseResponse(res, false, 404, "Item not found", null);
        }

        if (item.stock < transaction.quantity) {
            return baseResponse(res, false, 400, "Not enough stock available", null);
        }

        const updatedTransaction = await transactionRepository.updateTransaction(transactionId, { status: 'paid' });
        const updatedItem = await itemRepository.updateItem(transaction.item_id, { stock: item.stock - transaction.quantity });
        const updatedUser = await userRepository.updateUser(user.id, { balance: user.balance - transaction.total });

        baseResponse(res, true, 200, "Payment successful", {
            transaction: updatedTransaction,
            item: updatedItem,
            user: updatedUser
        });
    } catch (error) {
        baseResponse(res, false, 500, "Error processing payment", error);
    }
};

exports.deleteTransaction = async (req, res) => {
    const transactionId = req.params.id;
    
    try {
        const transaction = await transactionRepository.getTransactionById(transactionId);
        if (!transaction) {
            return baseResponse(res, false, 404, "Transaction not found", null);
        }

        const deletedTransaction = await transactionRepository.deleteTransaction(transactionId);
        baseResponse(res, true, 200, "Transaction deleted", deletedTransaction);
    } catch (error) {
        baseResponse(res, false, 500, "Error deleting transaction", error);
    }
};

exports.getAllTransactions = async (req, res) => {
    try {
        const transactions = await transactionRepository.getAllTransactions();
        baseResponse(res, true, 200, "Transactions found", transactions);
    } catch (error) {
        baseResponse(res, false, 500, "Error retrieving transactions", error);
    }
};
