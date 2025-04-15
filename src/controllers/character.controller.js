const { StatusCodes } = require("http-status-codes");
const {CharacterRepo} = require("../repository");
const {CharacterService} = require("../services");

const characterService = new CharacterService(new CharacterRepo());

function pingCharacterController(req, res, next){
    return res.json("Character Controller is Up");
}

async function getCharacters(req, res, next){
    try{
        const characters = await characterService.getCharacters(req.user._id);
        return res.status(StatusCodes.OK).json({
            success: true,
            message: "Characters Fetched Successfully",
            err:{},
            data: characters
        });
        
    }
    catch(err){
        next(err);
    }
}

async function createCharacter(req, res, next){
    try{
        const character = await characterService.createCharacter(req.body, req.user._id);
        return res.status(StatusCodes.CREATED).json({
            success: true,
            message: "Character Created Successfully",
            err:{},
            data: character
        });
    }
    catch(err){
        next(err);
    }
}

async function getCharacter(req, res, next){
    try{
        const character = await characterService.getCharacter(req.params._id);
        return res.status(StatusCodes.OK).json({
            success: true,
            message: "Character Fetched Successfully",
            err:{},
            data: character
        });
    }
    catch(err){
        next(err);
    }
}

async function deleteCharacter(req, res, next){
    try{
        const character = await characterService.deleteCharacter(req.params._id);
        return res.status(StatusCodes.OK).json({
            success: true,
            message: "Character Deleted Successfully",
            err:{},
            data: character
        });
    }
    catch(err){
        next(err);
    }
}

module.exports = {
    pingCharacterController,
    getCharacter,
    getCharacters,
    deleteCharacter,
    createCharacter
}