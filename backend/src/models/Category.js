const mongoose = require("mongoose");

const slugify = (value = "") =>
  value
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    animalName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50,
    },

    image: {
      type: String,
      default: null,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Auto generate unique slug
categorySchema.pre("validate", async function (next) {
  try {
    if (!this.name) return next();

    // Prevent unnecessary slug regeneration
    if (!this.isNew && !this.isModified("name") && this.slug) {
      return next();
    }

    const Category = this.constructor;

    const baseSlug = slugify(this.name) || "category";

    let candidate = baseSlug;
    let counter = 1;

    while (
      await Category.exists({
        slug: candidate,
        _id: { $ne: this._id },
      })
    ) {
      candidate = `${baseSlug}-${counter++}`;
    }

    this.slug = candidate;

    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model("Category", categorySchema);