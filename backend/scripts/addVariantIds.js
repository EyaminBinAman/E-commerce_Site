const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const Product = require("../src/models/Product");

const run = async () => {
  const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;

  if (!mongoUri) {
    throw new Error("MONGODB_URI or MONGO_URI is required");
  }

  await mongoose.connect(mongoUri);

  const products = await Product.find({
    variants: { $exists: true, $ne: [] },
  });
  let updatedProducts = 0;
  let updatedVariants = 0;

  for (const product of products) {
    let changed = false;

    product.variants.forEach((variant) => {
      if (!variant._id) {
        variant._id = new mongoose.Types.ObjectId();
        changed = true;
        updatedVariants += 1;
      }
    });

    if (changed) {
      await product.save();
      updatedProducts += 1;
    }
  }

  console.log(
    `Variant id migration completed. Products updated: ${updatedProducts}. Variants updated: ${updatedVariants}.`
  );

  await mongoose.disconnect();
};

run().catch(async (error) => {
  console.error(error.message);
  await mongoose.disconnect();
  process.exit(1);
});
