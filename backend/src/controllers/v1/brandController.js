const Brand = require("../../models/Brand");

const normalizeAnimalNames = (value) => {
  if (Array.isArray(value)) {
    return value
      .map((item) => (typeof item === "string" ? item.trim() : ""))
      .filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
};

const getBrands = async (req, res, next) => {
  try {
    const filter = req.user?.role === "admin" ? {} : { isActive: true };

    const brands = await Brand.find(filter).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Brands fetched successfully",
      brands,
    });
  } catch (error) {
    next(error);
  }
};

const createBrand = async (req, res, next) => {
  try {
    const { name, animalNames, image } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Brand name is required",
      });
    }

    const existingBrand = await Brand.findOne({
      name: {
        $regex: `^${name.trim()}$`,
        $options: "i",
      },
      isDeleted: { $ne: true },
    });

    if (existingBrand) {
      return res.status(400).json({
        success: false,
        message: "Brand already exists",
      });
    }

    const brand = await Brand.create({
      name,
      animalNames: normalizeAnimalNames(animalNames),
      image: typeof image === "string" ? image.trim() || null : null,
    });

    return res.status(201).json({
      success: true,
      message: "Brand created successfully",
      brand,
    });
  } catch (error) {
    next(error);
  }
};

const updateBrandBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const { name, animalNames, image } = req.body;

    const brand = await Brand.findOne({ slug });

    if (!brand) {
      return res.status(404).json({
        success: false,
        message: "Brand not found",
      });
    }

    if (name && name.trim().toLowerCase() !== brand.name.toLowerCase()) {
      const existingBrand = await Brand.findOne({
        name: {
          $regex: `^${name.trim()}$`,
          $options: "i",
        },
        _id: { $ne: brand._id },
        isDeleted: { $ne: true },
      });

      if (existingBrand) {
        return res.status(400).json({
          success: false,
          message: "Brand already exists",
        });
      }

      brand.name = name;
    }

    if (animalNames !== undefined) {
      brand.animalNames = normalizeAnimalNames(animalNames);
    }

    if (typeof image === "string") {
      brand.image = image.trim() || null;
    }

    await brand.save();

    return res.status(200).json({
      success: true,
      message: "Brand updated successfully",
      brand,
    });
  } catch (error) {
    next(error);
  }
};

const deleteBrandBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const brand = await Brand.findOne({ slug });

    if (!brand) {
      return res.status(404).json({
        success: false,
        message: "Brand not found",
      });
    }

    brand.isDeleted = true;
    brand.isActive = false;
    brand.deletedAt = new Date();
    await brand.save();

    return res.status(200).json({
      success: true,
      message: "Brand deleted successfully",
      brand,
    });
  } catch (error) {
    next(error);
  }
};

const toggleBrandActiveBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const { isActive } = req.body;

    if (typeof isActive !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "isActive boolean is required",
      });
    }

    const brand = await Brand.findOne({ slug });

    if (!brand) {
      return res.status(404).json({
        success: false,
        message: "Brand not found",
      });
    }

    brand.isActive = isActive;
    await brand.save();

    return res.status(200).json({
      success: true,
      message: `Brand ${isActive ? "activated" : "deactivated"} successfully`,
      brand,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getBrands,
  createBrand,
  updateBrandBySlug,
  deleteBrandBySlug,
  toggleBrandActiveBySlug,
};
