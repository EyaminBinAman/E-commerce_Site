const mongoose = require("mongoose");
const Animal = require("../../models/Animal");

const createSlug = (name) => {
  return name
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

const escapeRegex = (value) => {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

const findAnimalByName = async (name, animalId = null) => {
  return Animal.findOne({
    name: { $regex: `^${escapeRegex(name.trim())}$`, $options: "i" },
    ...(animalId ? { _id: { $ne: animalId } } : {}),
  });
};

const createUniqueSlug = async (name, animalId = null) => {
  const baseSlug = createSlug(name);

  if (!baseSlug) {
    return null;
  }

  let slug = baseSlug;
  let counter = 1;

  while (
    await Animal.exists({
      slug,
      ...(animalId ? { _id: { $ne: animalId } } : {}),
    })
  ) {
    slug = `${baseSlug}-${counter}`;
    counter += 1;
  }

  return slug;
};

const isInvalidAnimalId = (id, res) => {
  if (mongoose.Types.ObjectId.isValid(id)) {
    return false;
  }

  res.status(400).json({
    success: false,
    message: "Valid animal id is required",
  });
  return true;
};

const getAnimals = async (req, res, next) => {
  try {
    const animals = await Animal.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Animals fetched successfully",
      animals,
    });
  } catch (error) {
    next(error);
  }
};

const postAnimal = async (req, res, next) => {
  try {
    const { name } = req.body;
    const trimmedName = name?.trim();

    if (!trimmedName) {
      return res.status(400).json({
        success: false,
        message: "Animal name is required",
      });
    }

    const existingAnimal = await findAnimalByName(trimmedName);

    if (existingAnimal) {
      return res.status(400).json({
        success: false,
        message: "This animal already exists",
      });
    }

    const slug = await createUniqueSlug(trimmedName);

    if (!slug) {
      return res.status(400).json({
        success: false,
        message: "Animal name must contain letters or numbers",
      });
    }

    const animal = await Animal.create({
      name: trimmedName,
      slug,
    });

    return res.status(201).json({
      success: true,
      message: "Animal created successfully",
      animal,
    });
  } catch (error) {
    next(error);
  }
};

const updateAnimal = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const trimmedName = name?.trim();

    if (isInvalidAnimalId(id, res)) {
      return;
    }

    if (!trimmedName) {
      return res.status(400).json({
        success: false,
        message: "Animal name is required",
      });
    }

    const animal = await Animal.findById(id);

    if (!animal) {
      return res.status(404).json({
        success: false,
        message: "Animal not found",
      });
    }

    const existingAnimal = await findAnimalByName(trimmedName, animal._id);

    if (existingAnimal) {
      return res.status(400).json({
        success: false,
        message: "This animal already exists",
      });
    }

    const slug = await createUniqueSlug(trimmedName, animal._id);

    if (!slug) {
      return res.status(400).json({
        success: false,
        message: "Animal name must contain letters or numbers",
      });
    }

    animal.name = trimmedName;
    animal.slug = slug;
    await animal.save();

    return res.status(200).json({
      success: true,
      message: "Animal updated successfully",
      animal,
    });
  } catch (error) {
    next(error);
  }
};

const deleteAnimal = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (isInvalidAnimalId(id, res)) {
      return;
    }

    const animal = await Animal.findByIdAndDelete(id);

    if (!animal) {
      return res.status(404).json({
        success: false,
        message: "Animal not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Animal deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

const toggleAnimalActive = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (isInvalidAnimalId(id, res)) {
      return;
    }

    const animal = await Animal.findById(id);

    if (!animal) {
      return res.status(404).json({
        success: false,
        message: "Animal not found",
      });
    }

    animal.isActive =
      typeof req.body.isActive === "boolean" ? req.body.isActive : !animal.isActive;
    await animal.save();

    return res.status(200).json({
      success: true,
      message: "Animal active status updated successfully",
      animal,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAnimals,
  postAnimal,
  updateAnimal,
  deleteAnimal,
  toggleAnimalActive,
};
