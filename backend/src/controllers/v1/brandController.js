const Brand = require("../../models/Brand");
const { deleteImageFile } = require("../../utils/imageFiles");

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
    const includeInactive = ["1", "true", "yes"].includes(
      String(req.query.includeInactive || "").toLowerCase()
    );
    const filter = includeInactive ? {} : { isActive: true };

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
    const uploadedImage = req.file ? `/uploads/brands/${req.file.filename}` : null;
    const trimmedName = name?.trim();
    const trimmedImage = typeof image === "string" ? image.trim() : "";

    if (!trimmedName) {
      if (req.file) {
        deleteImageFile(`/uploads/brands/${req.file.filename}`, "brands");
      }

      return res.status(400).json({
        success: false,
        message: "Brand name is required",
      });
    }

    const existingBrand = await Brand.findOne({
      name: {
        $regex: `^${trimmedName}$`,
        $options: "i",
      },
      isDeleted: { $ne: true },
    });

    if (existingBrand) {
      if (req.file) {
        deleteImageFile(`/uploads/brands/${req.file.filename}`, "brands");
      }

      return res.status(400).json({
        success: false,
        message: "Brand already exists",
      });
    }

    const brand = await Brand.create({
      name: trimmedName,
      animalNames: normalizeAnimalNames(animalNames),
      image: uploadedImage || trimmedImage || null,
    });

    return res.status(201).json({
      success: true,
      message: "Brand created successfully",
      brand,
    });
  } catch (error) {
    if (req.file) {
      deleteImageFile(`/uploads/brands/${req.file.filename}`, "brands");
    }
    next(error);
  }
};

const updateBrandBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const { name, animalNames, image } = req.body;
    const uploadedImage = req.file ? `/uploads/brands/${req.file.filename}` : null;
    const trimmedImage = typeof image === "string" ? image.trim() : "";

    const brand = await Brand.findOne({ slug });

    if (!brand) {
      if (req.file) {
        deleteImageFile(`/uploads/brands/${req.file.filename}`, "brands");
      }

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
        if (req.file) {
          deleteImageFile(`/uploads/brands/${req.file.filename}`, "brands");
        }

        return res.status(400).json({
          success: false,
          message: "Brand already exists",
        });
      }

      brand.name = name.trim();
    }

    if (animalNames !== undefined) {
      brand.animalNames = normalizeAnimalNames(animalNames);
    }

    if (uploadedImage) {
      deleteImageFile(brand.image, "brands");
      brand.image = uploadedImage;
    } else if (trimmedImage) {
      if (trimmedImage !== brand.image) {
        deleteImageFile(brand.image, "brands");
      }
      brand.image = trimmedImage;
    }

    await brand.save();

    return res.status(200).json({
      success: true,
      message: "Brand updated successfully",
      brand,
    });
  } catch (error) {
    if (req.file) {
      deleteImageFile(`/uploads/brands/${req.file.filename}`, "brands");
    }
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
