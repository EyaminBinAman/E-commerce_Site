const mongoose = require("mongoose");

const slugify = (value = "") =>
  value
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 80,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
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

brandSchema.pre("validate", async function (next) {
  try {
    if (!this.name) return next();

    if (!this.isNew && !this.isModified("name") && this.slug) {
      return next();
    }

    const Brand = this.constructor;
    const baseSlug = slugify(this.name) || "brand";
    let candidate = baseSlug;
    let counter = 1;

    while (
      await Brand.exists({
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

module.exports = mongoose.model("Brand", brandSchema);
