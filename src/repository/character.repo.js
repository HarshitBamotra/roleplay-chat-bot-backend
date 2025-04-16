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
            const { name, personality, backstory, imageUrl } = characterData;
            const systemPrompt = `You are ${name}, a roleplay character with the following personality: ${personality}. Your backstory is: ${backstory}. Respond to all messages in character, never breaking the fourth wall.`;

            const character = new Character({
                name,
                personality,
                backstory,
                systemPrompt,
                imageUrl,
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
            const character = await Character.findById(characterId);

            if(!character){
                throw new NotFoundError("Character", characterId);
            }
            
            // character.conversationHistory.push({ role: 'user', content: message });

            const chat = ai.chats.create({
                model: AI_MODEL,
                history:[
                    {
                        role: "user",
                        parts:[{text: character.systemPrompt}]
                    },
                    {
                        role: "model",
                        parts: [{text: "I understand and will stay in character as described."}]
                    },
                    ...character.conversationHistory.map(msg => ({
                        role: msg.role,
                        parts: [{text: msg.content}]
                    })),
                ]
            });
            
            const result = await chat.sendMessage({
                message: message
            });

            const response = result.candidates[0].content.parts[0].text;

            character.conversationHistory.push({ role: 'user', content: message, timestamp: Date.now()});
            character.conversationHistory.push({ role: 'model', content: response, timestamp: Date.now() });

            await character.save();

            return {response, timestamp: Date.now()};
        }
        catch(err){
            console.log(err);
            throw err;
        }
    }
}

module.exports = CharacterRepo;