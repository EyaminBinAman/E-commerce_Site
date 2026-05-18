const mongoose = require("mongoose");

<<<<<<< HEAD
const normalizeAnimalName = (animalName) => {
  return typeof animalName === "string"
    ? animalName.trim().toLowerCase()
    : animalName;
};

const isValidImageUrl = (image) => {
  if (typeof image !== "string") {
    return false;
  }

  try {
    const url = new URL(image);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch (error) {
    return false;
  }
};
=======
const slugify = (value = "") =>
  value
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
>>>>>>> origin/products_api

const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
<<<<<<< HEAD
=======
      minlength: 2,
      maxlength: 80,
>>>>>>> origin/products_api
    },
    slug: {
      type: String,
      required: true,
<<<<<<< HEAD
      trim: true,
      lowercase: true,
=======
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
>>>>>>> origin/products_api
    },
    isActive: {
      type: Boolean,
      default: true,
    },
<<<<<<< HEAD
    isDeleted: {
      type: Boolean,
      default: false,
    },
    animalNames: {
      type: [
        {
          type: String,
          required: true,
          cast: false,
          set: normalizeAnimalName,
        },
      ],
      required: true,
      validate: [
        {
          validator(animalNames) {
            return Array.isArray(animalNames) && animalNames.length > 0;
          },
          message: "Animal names cannot be empty",
        },
        {
          validator(animalNames) {
            if (!Array.isArray(animalNames)) {
              return false;
            }

            const uniqueAnimalNames = new Set(
              animalNames.map((animalName) => animalName.toLowerCase())
            );

            return uniqueAnimalNames.size === animalNames.length;
          },
          message: "Animal names cannot contain duplicates",
        },
      ],
    },
    image: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: isValidImageUrl,
        message: "Image must be a valid URL",
      },
    },
  },
  {
    timestamps: true,
    collection: "brands",
  }
);

brandSchema.index(
  { slug: 1 },
  {
    unique: true,
    partialFilterExpression: { isDeleted: false },
  }
);

const excludeDeleted = function (next) {
  if (!this.getOptions().withDeleted) {
    this.where({ isDeleted: { $ne: true } });
  }

  next();
};

brandSchema.pre(/^find/, excludeDeleted);
brandSchema.pre(/^update/, excludeDeleted);
brandSchema.pre("countDocuments", excludeDeleted);

brandSchema.pre("aggregate", function (next) {
  if (!this.options.withDeleted) {
    this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
  }

  next();
});

const preventHardDelete = function (next) {
  if (this.getOptions().hardDelete) {
    return next();
  }

  const error = new Error("Hard delete is disabled for Brand. Use soft delete instead.");
  error.statusCode = 400;
  next(error);
};

brandSchema.pre("deleteOne", { query: true, document: false }, preventHardDelete);
brandSchema.pre("deleteMany", preventHardDelete);
brandSchema.pre("findOneAndDelete", preventHardDelete);

=======
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

>>>>>>> origin/products_api
module.exports = mongoose.model("Brand", brandSchema);
