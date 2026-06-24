const mongoose = require("mongoose");
const Animal = require("../../models/Animal");
const Category = require("../../models/Category");
const { deleteImageFile } = require("../../utils/imageFiles");

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
      isDeleted: { $ne: true },
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
    const includeInactive = ["1", "true", "yes"].includes(
      String(req.query.includeInactive || "").toLowerCase()
    );
    const filter = includeInactive ? {} : { isActive: true };
    const animals = await Animal.find(filter).sort({ createdAt: -1 });

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
    const { name, icon, image } = req.body;
    const uploadedImage = req.file ? `/uploads/animals/${req.file.filename}` : null;
    const trimmedName = name?.trim();
    const trimmedIcon = String(icon || "🐾").trim();
    const trimmedImage = typeof image === "string" ? image.trim() : "";

    if (!trimmedName) {
      return res.status(400).json({
        success: false,
        message: "Animal name is required",
      });
    }

    const existingAnimal = await findAnimalByName(trimmedName);

    if (existingAnimal) {
      if (existingAnimal.isActive && !existingAnimal.isDeleted) {
        if (req.file) {
          deleteImageFile(`/uploads/animals/${req.file.filename}`, "animals");
        }

        return res.status(400).json({
          success: false,
          message: "This animal already exists",
        });
      }

      existingAnimal.name = trimmedName;
      existingAnimal.slug = await createUniqueSlug(trimmedName, existingAnimal._id);
      existingAnimal.icon = trimmedIcon || "🐾";
      existingAnimal.image = uploadedImage || trimmedImage || existingAnimal.image || null;
      existingAnimal.isDeleted = false;
      existingAnimal.isActive = true;
      await existingAnimal.save();

      return res.status(200).json({
        success: true,
        message: "Animal restored successfully",
        animal: existingAnimal,
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
      icon: trimmedIcon || "🐾",
      image: uploadedImage || trimmedImage || null,
    });

    return res.status(201).json({
      success: true,
      message: "Animal created successfully",
      animal,
    });
  } catch (error) {
    if (req.file) {
      deleteImageFile(`/uploads/animals/${req.file.filename}`, "animals");
    }
    next(error);
  }
};

const updateAnimal = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, icon, image } = req.body;
    const uploadedImage = req.file ? `/uploads/animals/${req.file.filename}` : null;
    const trimmedName = name?.trim();
    const trimmedIcon = String(icon || "").trim();
    const trimmedImage = typeof image === "string" ? image.trim() : "";

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
      if (req.file) {
        deleteImageFile(`/uploads/animals/${req.file.filename}`, "animals");
      }

      return res.status(404).json({
        success: false,
        message: "Animal not found",
      });
    }

    const existingAnimal = await findAnimalByName(trimmedName, animal._id);

    if (existingAnimal) {
      if (req.file) {
        deleteImageFile(`/uploads/animals/${req.file.filename}`, "animals");
      }

      return res.status(400).json({
        success: false,
        message: "This animal already exists",
      });
    }

    const slug = await createUniqueSlug(trimmedName, animal._id);

    if (!slug) {
      if (req.file) {
        deleteImageFile(`/uploads/animals/${req.file.filename}`, "animals");
      }

      return res.status(400).json({
        success: false,
        message: "Animal name must contain letters or numbers",
      });
    }

    animal.name = trimmedName;
    animal.slug = slug;
    if (trimmedIcon) {
      animal.icon = trimmedIcon;
    }
    if (uploadedImage) {
      const previousImage = animal.image;
      animal.image = uploadedImage;
      if (previousImage && previousImage !== uploadedImage) {
        deleteImageFile(previousImage, "animals");
      }
    } else if (typeof image === "string") {
      animal.image = trimmedImage || null;
    }
    await animal.save();

    return res.status(200).json({
      success: true,
      message: "Animal updated successfully",
      animal,
    });
  } catch (error) {
    if (req.file) {
      deleteImageFile(`/uploads/animals/${req.file.filename}`, "animals");
    }
    next(error);
  }
};

const deleteAnimal = async (req, res, next) => {
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

    const linkedCategoryCount = await Category.countDocuments({
      animalName: {
        $regex: `^${escapeRegex(animal.name.trim())}$`,
        $options: "i",
      },
    });

    if (linkedCategoryCount > 0) {
      return res.status(409).json({
        success: false,
        message: "Cannot delete animal while categories are assigned to it",
      });
    }

    deleteImageFile(animal.image, "animals");

    animal.isDeleted = true;
    animal.isActive = false;
    await animal.save();

    return res.status(200).json({
      success: true,
      message: "Animal deleted successfully",
      animal,
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
