const path = require("path");
const dotenv = require("dotenv");
dotenv.config({ path: path.join(__dirname, "..", ".env") });

const mongoose = require("mongoose");
const Animal = require("../src/models/Animal");
const Category = require("../src/models/Category");

const run = async () => {
  await mongoose.connect(process.env.MONGODB_URI);

  for (const [name, model] of [
    ["Animal", Animal],
    ["Category", Category],
  ]) {
    const before = await model.collection.indexes();
    console.log(`${name} indexes before:`, JSON.stringify(before, null, 2));
    const dropped = await model.syncIndexes();
    console.log(`${name} dropped indexes:`, dropped);
    const after = await model.collection.indexes();
    console.log(`${name} indexes after:`, JSON.stringify(after, null, 2));
  }

  await mongoose.disconnect();
  console.log("Index sync complete");
};

run().catch((error) => {
  console.error("Index sync failed:", error.message);
  process.exit(1);
});
