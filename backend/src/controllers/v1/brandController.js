const mongoose = require("mongoose");
const slugify = require("slugify");

const Brand = require("../../models/Brand");

const normalizeText = (value) => {
  return typeof value === "string" ? value.trim() : value;
};

const isValidBrandId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

const createSlug = (name) => {
  return slugify(name, {
    lower: true,
    strict: true,
    trim: true,
  });
};

const getBrands = async (req, res, next) => {
  try {
    const brands = await Brand.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      brands,
    });
  } catch (error) {
    error.statusCode = error.statusCode || 500;
    next(error);
  }
};

const createBrand = async (req, res, next) => {
  try {
    const { name, animalName, image } = req.body;
    const cleanName = normalizeText(name);
    const cleanAnimalName = normalizeText(animalName);
    const cleanImage = normalizeText(image);

    if (!cleanName || !cleanAnimalName || !cleanImage) {
      return res.status(400).json({
        success: false,
        message: "Name, animal name, and image are required",
      });
    }

    const slug = createSlug(cleanName);

    if (!slug) {
      return res.status(400).json({
        success: false,
        message: "Name must contain letters or numbers",
      });
    }

    const existingBrand = await Brand.findOne({ slug });

    if (existingBrand) {
      return res.status(400).json({
        success: false,
        message: "Brand already exists",
      });
    }

    const brand = await Brand.create({
      name: cleanName,
      slug,
      animalName: cleanAnimalName,
      image: cleanImage,
    });

    return res.status(201).json({
      success: true,
      message: "Brand created successfully",
      brand,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Brand already exists",
      });
    }

    error.statusCode = error.statusCode || 500;
    next(error);
  }
};

const updateBrand = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, animalName, image } = req.body;
    const cleanName = normalizeText(name);
    const cleanAnimalName = normalizeText(animalName);
    const cleanImage = normalizeText(image);

    if (!isValidBrandId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid brand id",
      });
    }

    const brand = await Brand.findById(id);

    if (!brand) {
      return res.status(404).json({
        success: false,
        message: "Brand not found",
      });
    }

    if (cleanName !== undefined) {
      if (!cleanName) {
        return res.status(400).json({
          success: false,
          message: "Name cannot be empty",
        });
      }
    }

    if (cleanAnimalName !== undefined && !cleanAnimalName) {
      return res.status(400).json({
        success: false,
        message: "Animal name cannot be empty",
      });
    }

    if (cleanImage !== undefined && !cleanImage) {
      return res.status(400).json({
        success: false,
        message: "Image cannot be empty",
      });
    }

    if (cleanName && cleanName !== brand.name) {
      const slug = createSlug(cleanName);

      if (!slug) {
        return res.status(400).json({
          success: false,
          message: "Name must contain letters or numbers",
        });
      }

      const existingBrand = await Brand.findOne({
        slug,
        _id: { $ne: id },
      });

      if (existingBrand) {
        return res.status(400).json({
          success: false,
          message: "Brand already exists",
        });
      }

      brand.name = cleanName;
      brand.slug = slug;
    }

    if (cleanAnimalName !== undefined) {
      brand.animalName = cleanAnimalName;
    }

    if (cleanImage !== undefined) {
      brand.image = cleanImage;
    }

    await brand.save();

    return res.status(200).json({
      success: true,
      message: "Brand updated successfully",
      brand,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Brand already exists",
      });
    }

    error.statusCode = error.statusCode || 500;
    next(error);
  }
};

const deleteBrand = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidBrandId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid brand id",
      });
    }

    const brand = await Brand.findByIdAndDelete(id);

    if (!brand) {
      return res.status(404).json({
        success: false,
        message: "Brand not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Brand deleted successfully",
    });
  } catch (error) {
    error.statusCode = error.statusCode || 500;
    next(error);
  }
};

const toggleBrandStatus = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidBrandId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid brand id",
      });
    }

    const brand = await Brand.findById(id);

    if (!brand) {
      return res.status(404).json({
        success: false,
        message: "Brand not found",
      });
    }

    brand.isActive = !brand.isActive;
    await brand.save();

    return res.status(200).json({
      success: true,
      message: "Brand status updated successfully",
      brand,
    });
  } catch (error) {
    error.statusCode = error.statusCode || 500;
    next(error);
  }
};

module.exports = {
  getBrands,
  createBrand,
  updateBrand,
  deleteBrand,
  toggleBrandStatus,
};
