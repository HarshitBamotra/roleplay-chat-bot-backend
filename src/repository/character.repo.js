const Character = require("../models/character.model");
const {NotFoundError} = require("../errors");
const ai = require("../config/ai.config");
const { AI_MODEL } = require("../config/server.config");

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
            
            character.conversationHistory.push({ role: 'user', content: message });

            const chat = ai.chats.create({
                model: AI_MODEL,
                history:[
                    {
                        role: "user",
                        parts:[character.systemPrompt]
                    },
                    {
                        role: "model",
                        parts: ["I understand and will stay in character as described."]
                    },
                    ...character.conversationHistory.map(msg => ({
                        role: msg.role,
                        parts: [msg.content]
                    })),
                ]
            });

            const result = await chat.sendMessage(message);
            const response = result.response.text();

            character.conversationHistory.push({ role: 'user', content: message });
            character.conversationHistory.push({ role: 'model', content: response });

            await character.save();

            return response;
        }
        catch(err){
            console.log(err);
            throw err;
        }
    }
}

module.exports = CharacterRepo;