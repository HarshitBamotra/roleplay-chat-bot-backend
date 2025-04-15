const express = require("express");
const {characterController} = require("../../controllers");
const authenticate = require("../../utils/authenticate");

const characterRouter = express.Router();

characterRouter.get("/ping", characterController.pingCharacterController);
characterRouter.get("/characters", authenticate, characterController.getCharacters);
characterRouter.post("/character", authenticate, characterController.createCharacter);
characterRouter.get("/character/:id", authenticate, characterController.getCharacter);
characterRouter.get("/chat/:characterId/history", authenticate, characterController.getChatHistory);
characterRouter.post("/chat/:characterId", authenticate, characterController.sendMessage);

module.exports = characterRouter;