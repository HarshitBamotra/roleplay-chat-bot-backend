class CharacterService {
    constructor(characterRepo){
        this.characterRepo = characterRepo;
    }

    async getCharacters(userId){
        try{
            const characters  = await this.characterRepo.getAllCharacters(userId);
            return characters;
        }
        catch(err){
            console.log(err);
            throw err;
        }
    }

    async getCharacter(characterId){
        try{
            const character = await this.characterRepo.getCharacter(characterId);
            return character;
        }
        catch(err){
            console.log(err);
            throw err;
        }
    }

    async createCharacter(characterData, userId){
        try{
            const character = await this.characterRepo.createCharacter(characterData, userId);
            return character;
        }
        catch(err){
            console.log(err);
            throw err;
        }
    }

    async deleteCharacter(characterId){
        try{
            const response = await this.characterRepo.deleteCharacter(characterId);
            return response;
        }
        catch(err){
            console.log(err);
            throw err;
        }
    }

    async getChatHistory(characterId){
        try{
            const chats = await this.characterRepo.getChatHistory(characterId);
            return chats;
        }
        catch(err){
            console.log(err);
            throw err;
        }
    }

    async sendMessage(message, characterId, userId){
        try{
            const response = await this.characterRepo.sendMessage(message, characterId, userId);
            return response;
        }
        catch(err){
            console.log(err);
            throw err;
        }

    }
}

module.exports = CharacterService;