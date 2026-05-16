const mongoose = require("mongoose");

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

const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
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

module.exports = mongoose.model("Brand", brandSchema);
