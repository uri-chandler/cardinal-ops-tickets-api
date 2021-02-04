module.exports = {
    PORT: parseInt(process.env.PORT) || 3000,
    MONGODB_URI: process.env.MONGODB_URI,
    DB_NAME: process.env.DB_NAME,
    COLLECTION_NAME: process.env.COLLECTION_NAME
};