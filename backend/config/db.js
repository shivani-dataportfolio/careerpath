const mongoose = require('mongoose');

const connectDB = async () => {
    const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
    
    try {
        if (uri) {
            console.log(`[SYSTEM] Attempting to connect to MongoDB Atlas...`);
            // Set a strict timeout for the INITIAL connection
            const conn = await mongoose.connect(uri, {
                serverSelectionTimeoutMS: 5000, 
                socketTimeoutMS: 45000,
                connectTimeoutMS: 5000
            });
            console.log(`[SUCCESS] MongoDB Connected (Production/Atlas): ${conn.connection.host}`);
            return; // Success
        }
    } catch (error) {
        console.warn(`[WARNING] MongoDB Atlas connection failed: ${error.message}. Trying local fallback...`);
    }

    // Fallback logic
    try {
        console.log(`[SYSTEM] Checking Local MongoDB...`);
        const conn = await mongoose.connect('mongodb://127.0.0.1:27017/bertcareer', {
            serverSelectionTimeoutMS: 2000 
        });
        console.log(`[SUCCESS] MongoDB Connected (Local Service): ${conn.connection.host}`);
    } catch (localErr) {
        console.warn("[SYSTEM] Local MongoDB not detected. Spinning up Virtual In-Memory Database...");
        
        // FALLBACK: Use In-Memory MongoDB Server
        const { MongoMemoryServer } = require('mongodb-memory-server');
        const mongod = await MongoMemoryServer.create();
        const inMemoryUri = mongod.getUri();
        
        await mongoose.connect(inMemoryUri);
        console.log(`[SUCCESS] MongoDB Connected (Virtual In-Memory): Success!`);
    }

};

module.exports = connectDB;
