const express = require("express");
const { authController } = require("../../controllers");
const authenticate = require("../../utils/authenticate");


const authRouter = express.Router();

authRouter.post("/register", authController.register);
authRouter.post("/login", authController.login);
authRouter.get("/me", authenticate, authController.getCurrentUser);


module.exports = authRouter;