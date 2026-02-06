
const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

async function testConnection() {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
        console.error("❌ MONGODB_URI is missing in .env.local");
        return;
    }

    console.log("🔄 Testing MongoDB Connection...");
    console.log(`📡 URI: ${uri.replace(/:([^:@]+)@/, ':****@')}`); // Log masked URI

    const client = new MongoClient(uri);

    try {
        await client.connect();
        console.log("✅ Successfully connected to MongoDB!");

        const db = client.db("kayaPlanet");
        const collections = await db.listCollections().toArray();
        console.log("📂 Collections found:", collections.map(c => c.name));

        await client.close();
        console.log("👋 Connection closed.");
    } catch (error) {
        console.error("❌ Connection failed:", error.message);
    }
}

testConnection();
