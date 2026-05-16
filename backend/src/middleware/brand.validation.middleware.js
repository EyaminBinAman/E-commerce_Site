const mongoose = require("mongoose");

const normalizeText = (value) => {
  return typeof value === "string" ? value.trim() : value;
};

const isProvided = (value) => {
  return value !== undefined;
};

const hasAnyProvidedField = (fields) => {
  return fields.some(isProvided);
};

const validateRequiredText = (value, emptyMessage) => {
  const cleanValue = normalizeText(value);

  if (!cleanValue) {
    return {
      error: emptyMessage,
    };
  }

  return {
    value: cleanValue,
  };
};

const validateOptionalText = (value, emptyMessage) => {
  if (!isProvided(value)) {
    return {};
  }

  return validateRequiredText(value, emptyMessage);
};

const isValidBrandSlug = (slug) => {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
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

const validateAnimalNames = (animalNames) => {
  if (!Array.isArray(animalNames)) {
    return {
      error: "Animal names must be an array",
    };
  }

  if (animalNames.some((animalName) => typeof animalName !== "string")) {
    return {
      error: "Animal names must contain only strings",
    };
  }

  const cleanAnimalNames = animalNames.map((animalName) =>
    normalizeText(animalName)
  );

  if (cleanAnimalNames.length === 0) {
    return {
      error: "Animal names cannot be empty",
    };
  }

  if (cleanAnimalNames.some((animalName) => !animalName)) {
    return {
      error: "Animal names cannot contain empty values",
    };
  }

  const uniqueAnimalNames = new Set(
    cleanAnimalNames.map((animalName) => animalName.toLowerCase())
  );

  if (uniqueAnimalNames.size !== cleanAnimalNames.length) {
    return {
      error: "Animal names cannot contain duplicates",
    };
  }

  return {
    value: cleanAnimalNames,
  };
};

const fail = (res, message) => {
  return res.status(400).json({
    success: false,
    message,
  });
};

const validateBrandIdentifier = (req, res, next) => {
  const identifier = normalizeText(req.params.identifier);

  if (!identifier) {
    return fail(res, "Invalid brand id or slug");
  }

  if (mongoose.Types.ObjectId.isValid(identifier)) {
    req.brandQuery = { _id: identifier };
    return next();
  }

  if (isValidBrandSlug(identifier)) {
    req.brandQuery = { slug: identifier };
    return next();
  }

  return fail(res, "Invalid brand id or slug");
};

const validateCreateBrand = (req, res, next) => {
  const { name, animalNames, image } = req.body;
  const cleanName = validateRequiredText(
    name,
    "Name, animal names, and image are required"
  );
  const cleanImage = validateRequiredText(
    image,
    "Name, animal names, and image are required"
  );
  const cleanAnimalNames = validateAnimalNames(animalNames);

  if (cleanName.error) {
    return fail(res, cleanName.error);
  }

  if (cleanImage.error) {
    return fail(res, cleanImage.error);
  }

  if (!isValidImageUrl(cleanImage.value)) {
    return fail(res, "Image must be a valid URL");
  }

  if (cleanAnimalNames.error) {
    return fail(res, cleanAnimalNames.error);
  }

  req.validatedBrand = {
    name: cleanName.value,
    animalNames: cleanAnimalNames.value,
    image: cleanImage.value,
  };

  next();
};

const validateUpdateBrand = (req, res, next) => {
  const { name, animalNames, image } = req.body;
  const validatedBrand = {};

  if (!hasAnyProvidedField([name, animalNames, image])) {
    return fail(res, "At least one field is required for update");
  }

  const cleanName = validateOptionalText(name, "Name cannot be empty");

  if (cleanName.error) {
    return fail(res, cleanName.error);
  }

  if (isProvided(cleanName.value)) {
    validatedBrand.name = cleanName.value;
  }

  const cleanImage = validateOptionalText(image, "Image cannot be empty");

  if (cleanImage.error) {
    return fail(res, cleanImage.error);
  }

  if (isProvided(cleanImage.value)) {
    if (!isValidImageUrl(cleanImage.value)) {
      return fail(res, "Image must be a valid URL");
    }

    validatedBrand.image = cleanImage.value;
  }

  if (isProvided(animalNames)) {
    const cleanAnimalNames = validateAnimalNames(animalNames);

    if (cleanAnimalNames.error) {
      return fail(res, cleanAnimalNames.error);
    }

    validatedBrand.animalNames = cleanAnimalNames.value;
  }

  req.validatedBrand = validatedBrand;
  next();
};

const validateUpdateBrandStatus = (req, res, next) => {
  const { isActive } = req.body;

  if (typeof isActive !== "boolean") {
    return fail(res, "isActive must be a boolean");
  }

  req.validatedBrandStatus = {
    isActive,
  };

  next();
};

module.exports = {
  validateBrandIdentifier,
  validateCreateBrand,
  validateUpdateBrand,
  validateUpdateBrandStatus,
};
