/**
 * Script to fix MongoDB indexes
 * Run this script once to update existing indexes
 *
 * Usage: node scripts/fix-mongodb-indexes.js
 */

require("dotenv").config();
const mongoose = require("mongoose");
const suggestionSchema = require("../schemas/suggestionSchema");

async function fixIndexes() {
    try {
        console.log("Connecting to MongoDB...");
        const mongoURL = process.env.MONGO_URL;

        if (!mongoURL) {
            console.error(
                "Error: MONGO_URL environment variable not set in .env file"
            );
            process.exit(1);
        }

        // Validate connection string format
        if (
            !mongoURL.startsWith("mongodb://") &&
            !mongoURL.startsWith("mongodb+srv://")
        ) {
            console.error("\nError: Invalid MongoDB connection string format");
            console.error(
                'Your MONGO_URL should start with "mongodb://" or "mongodb+srv://"'
            );
            console.error(
                `Current value starts with: "${mongoURL.substring(0, 20)}..."`
            );
            console.error("\nExpected format examples:");
            console.error("  - mongodb://localhost:27017/database");
            console.error(
                "  - mongodb+srv://username:password@cluster.mongodb.net/database"
            );
            process.exit(1);
        }

        await mongoose.connect(mongoURL);
        console.log("Connected to MongoDB");

        console.log("\n=== Fixing suggestionSchema indexes ===");

        // Drop the old threadId index that doesn't allow multiple nulls
        try {
            await suggestionSchema.collection.dropIndex("threadId_1");
            console.log("✓ Dropped old threadId_1 index");
        } catch (err) {
            if (err.code === 27) {
                console.log(
                    "✓ Index threadId_1 does not exist (already dropped or never created)"
                );
            } else {
                console.error("Error dropping index:", err.message);
            }
        }

        // Create new sparse index that allows multiple nulls
        try {
            await suggestionSchema.collection.createIndex(
                { threadId: 1 },
                { unique: true, sparse: true }
            );
            console.log("✓ Created new sparse threadId index");
        } catch (err) {
            console.error("Error creating index:", err.message);
        }

        // List all current indexes
        const indexes = await suggestionSchema.collection.indexes();
        console.log("\nCurrent indexes:");
        indexes.forEach((index) => {
            console.log(
                `  - ${JSON.stringify(index.key)}: ${JSON.stringify(index)}`
            );
        });

        console.log("\n✓ Index fix completed successfully");
    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    } finally {
        await mongoose.connection.close();
        console.log("\nDatabase connection closed");
        process.exit(0);
    }
}

fixIndexes();
