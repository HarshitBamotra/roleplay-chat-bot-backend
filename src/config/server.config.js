require("dotenv").config();

module.exports = {
    DB_URL: process.env.DB_URL,
    PORT: process.env.PORT,
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
    AI_MODEL: process.env.AI_MODEL
}