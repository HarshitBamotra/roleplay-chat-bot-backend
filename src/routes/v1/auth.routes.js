const express = require("express");
const { authController } = require("../../controllers");
const authenticate = require("../../utils/authenticate");


const authRouter = express.Router();

authRouter.use("/register", authController.register);
authRouter.use("/login", authController.login);
authRouter.use("/me", authenticate, authController.getCurrentUser);


module.exports = authRouter;