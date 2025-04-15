const Character = require("../models/character.model");
const {NotFoundError} = require("../errors");


class CharacterRepo{
    async getCharacters(userId){
        try{
            const characters = await Character.find({user: userId});
            return characters;
        }
        catch(err){
            console.log(err);
            throw err;
        }
    }

    async getCharacter(id){
        try{
            const character = await Character.findById(id);

            if(!character){
                throw new NotFoundError("Character", id);
            }

            return character;
        }
        catch(err){
            console.log(err);
            throw err;
        }
    }

    async createCharacter(characterData, userId){
        try{
            const { name, personality, backstory } = characterData;
            const systemPrompt = `You are ${name}, a roleplay character with the following personality: ${personality}. Your backstory is: ${backstory}. Respond to all messages in character, never breaking the fourth wall.`;

            const character = new Character({
                name,
                personality,
                backstory,
                systemPrompt,
                user: userId,
                conversationHistory: []
            });

            await character.save();

            return character;
        }
        catch(err){
            console.log(err);
            throw err;
        }
    }

    async deleteCharacter(id){
        try{
            const response = await Character.findByIdAndDelete(id);

            if(!response){
                throw new NotFoundError("Character", id);
            }
            return response;
        }
        catch(err){
            console.log(err);
            throw err;
        }
    }

    async getChatHistory(id){
        try{
            const character = await Character.findById(id);

            if(!character){
                throw new NotFoundError("Character", id);
            }

            return character.conversationHistory;
        }
        catch(err){
            console.log(err);
            throw err;
        }
    }

    async sendMessage(message, characterId, userId){
        try{
            const character = await Character.findById({_id: characterId, user: userId});

            if(!character){
                throw new NotFoundError("Character", characterId);
            }

            
        }
        catch(err){
            console.log(err);
            throw err;
        }
    }
}

module.exports = CharacterRepo;