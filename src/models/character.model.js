const mongoose = require('mongoose');

const CharacterSchema = new mongoose.Schema({
    name: String,
    personality: String,
    backstory: String,
    systemPrompt: String,
    imageUrl: String,
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    conversationHistory: [{ 
      role: String, 
      content: String,
      timestamp: { type: Date, default: Date.now }
    }]
  });

module.exports = mongoose.model('Character', CharacterSchema);