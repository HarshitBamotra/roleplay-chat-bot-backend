const AuthRepo = require("../repository/auth.repo");
const AuthService = require("../services/auth.service");
const { StatusCodes } = require("http-status-codes");

const authService = new AuthService(new AuthRepo);

async function register(req, res, next) {
    try {
        const userData = {
            ...req.body,
            profileImage: req.file ? req.file.path : null
        }
        console.log(userData);
        const result = await authService.register(userData);
        if (result.userExists) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: "User already exists. Please log in or use a different email/username.",
                err: {},
                data: null
            });
        }

        const message = result.isNewUser ? "User created successfully" : "User already exists. Successfully logged in.";

        return res.status(StatusCodes.CREATED).json({
            success: true,
            message: message,
            err: {},
            data: result
        });
    }
    catch (err) {
        next(err);
    }
}


async function login(req, res, next) {
    try {
        const result = await authService.login(req.body);

        if (result.userNotFound) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: "User not found. Please register first.",
                err: {},
                data: null
            });
        }

        if (result.invalidPassword) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: "Invalid credentials.",
                err: {},
                data: null
            });
        }

        return res.status(StatusCodes.OK).json({
            success: true,
            message: "Login Successful",
            err: {},
            data: result
        });
    }
    catch (err) {
        next(err);
    }
}

async function getCurrentUser(req, res, next) {
    try {
        return res.status(StatusCodes.OK).json({
            success: true,
            message: "User fetched successfully",
            err: {},
            data: {
                id: req.user._id,
                username: req.user.username,
                email: req.user.email,
                profileImage: req.user.profileImage
            }
        });
    }
    catch (err) {
        next(err);
    }
}

async function updateUser(req, res, next) {
    try {
        const userData = {
            ...req.body,
            profileImage: req.file ? req.file.path : null
        }

        console.log(userData);

        const result = await authService.updateUser(req.user._id, userData);
        console.log(result);
        return res.status(StatusCodes.CREATED).json({
            success: true,
            message: "Character Created Successfully",
            err: {},
            data: result
        });
    }
    catch (err) {
        next(err);
    }
}

module.exports = {
    register,
    login,
    getCurrentUser,
    updateUser
}