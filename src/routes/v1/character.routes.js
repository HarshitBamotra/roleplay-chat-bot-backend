const express = require("express");

const {characterController} = require("../../controllers");
const authenticate = require("../../utils/authenticate");
const upload = require("../../utils/cloudinary");

const characterRouter = express.Router();

characterRouter.get("/ping", characterController.pingCharacterController);
characterRouter.get("/characters", authenticate, characterController.getCharacters);
characterRouter.post("/character", authenticate, upload.single('image'), characterController.createCharacter);
characterRouter.get("/character/:id", authenticate, characterController.getCharacter);
characterRouter.delete("/character/:id", authenticate, characterController.deleteCharacter);
characterRouter.get("/chat/:characterId/history", authenticate, characterController.getChatHistory);
characterRouter.post("/chat/:characterId", authenticate, characterController.sendMessage);

module.exports = characterRouter;