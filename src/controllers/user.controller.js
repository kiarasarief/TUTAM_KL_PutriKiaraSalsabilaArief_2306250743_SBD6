const bcrypt = require("bcrypt");
const saltRounds = 10;
const userRepository = require("../repositories/user.repository");
const baseResponse = require("../utils/baseResponse.util");

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;  // email regex

exports.registerUser = async (req, res) => {
    const { name, email, password } = req.body; 
    if (!name || !email || !password) {
        return baseResponse(res, false, 400, "Name, email, and password are required", null);
    }

    if (!emailRegex.test(email)) {
        return baseResponse(res, false, 400, "Invalid email format", null);
    }

    try {
        const existingUser = await userRepository.getUserByEmail(email);
        if (existingUser) {
            return baseResponse(res, false, 400, "Email already used", null);
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await userRepository.createUser({ name, email, password: hashedPassword });
        baseResponse(res, true, 201, "User created", user);
    } catch (error) {
        baseResponse(res, false, 500, error.message || "Server Error", error);
    }
};

exports.loginUser = async (req, res) => {
    const { email, password } = req.body;  // ambil email dan password dari body request
    if (!email || !password) {
        return baseResponse(res, false, 400, "Email dan password diperlukan", null);
    }

    try {
        // cari user di database berdasarkan email
        const user = await userRepository.getUserByEmail(email);
        if (!user) {
            return baseResponse(res, false, 400, "Email atau password salah", null); // kalau user tidak ditemukan
        }

        // bandingkan password yang dimasukkan dengan password yang tersimpan
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return baseResponse(res, false, 400, "Email atau password salah", null);  // kalau password tidak cocok
        }

        // kalau password cocok, kembalikan data user (tanpa password)
        const { password: userPassword, ...userWithoutPassword } = user;
        baseResponse(res, true, 200, "Login berhasil", userWithoutPassword);

    } catch (error) {
        baseResponse(res, false, 500, "Kesalahan server", error);
    }
};

exports.getUserByEmail = async (req, res) => {
    const email = req.params.email;
    try {
        const user = await userRepository.getUserByEmail(email);
        if (!user) {
            return baseResponse(res, false, 404, "User not found", null);
        }
        baseResponse(res, true, 200, "User found", user);
    } catch (error) {
        baseResponse(res, false, 500, "Error retrieving user", error);
    }
};

exports.updateUser = async (req, res) => {
    const { id, name, email, password } = req.body;
    if (!id || !name || !email || !password) {
        return baseResponse(res, false, 400, "ID, Name, Email, and Password are required", null);
    }

    if (!emailRegex.test(email)) {
        return baseResponse(res, false, 400, "Invalid email format", null);
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const updatedUser = await userRepository.updateUser(id, { name, email, password: hashedPassword });
        if (!updatedUser) {
            return baseResponse(res, false, 404, "User not found", null);
        }
        baseResponse(res, true, 200, "User updated", updatedUser);
    } catch (error) {
        baseResponse(res, false, 500, "Error updating user", error);
    }
};

exports.deleteUser = async (req, res) => {
    const userId = req.params.id;
    try {
        const deletedUser = await userRepository.deleteUser(userId);
        if (!deletedUser) {
            return baseResponse(res, false, 404, "User not found", null);
        }
        baseResponse(res, true, 200, "User deleted", deletedUser);
    } catch (error) {
        baseResponse(res, false, 500, "Error deleting user", error);
    }
};

exports.topUpUser = async (req, res) => {
    const { id, amount } = req.query; 

    if (!id || !amount) {
        return baseResponse(res, false, 400, "User ID and amount are required", null);
    }

    if (isNaN(amount) || amount <= 0) {
        return baseResponse(res, false, 400, "Amount must be larger than 0", null); 
    }

    try {
        const user = await userRepository.getUserById(id);
        if (!user) {
            return baseResponse(res, false, 404, "User not found", null); 
        }

        // top up balance
        const updatedBalance = user.balance + parseFloat(amount); 
        const updatedUser = await userRepository.updateUser(id, { balance: updatedBalance });

        baseResponse(res, true, 200, "Top up successful", updatedUser);
    } catch (error) {
        baseResponse(res, false, 500, "Error performing top up", error);
    }
};