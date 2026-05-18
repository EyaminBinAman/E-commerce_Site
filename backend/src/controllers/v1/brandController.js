const slugify = require("slugify");

const Brand = require("../../models/Brand");

const createSlug = (name) => {
  return slugify(name, {
    lower: true,
    strict: true,
    trim: true,
  });
};

const sendSuccess = (res, statusCode, message, data) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

const sendError = (res, statusCode, message) => {
  return res.status(statusCode).json({
    success: false,
    message,
  });
};

const handleBrandError = (error, res, next) => {
  if (error.code === 11000) {
    return sendError(res, 400, "Brand already exists");
  }

  error.statusCode = error.statusCode || 500;
  return next(error);
};

const getBrands = async (req, res, next) => {
  try {
    const filter =
      req.user?.role === "admin"
        ? { isDeleted: { $ne: true } }
        : { isActive: true, isDeleted: { $ne: true } };
    const brands = await Brand.find(filter).sort({ createdAt: -1 });

    return sendSuccess(res, 200, "Brands fetched successfully", { brands });
  } catch (error) {
    return handleBrandError(error, res, next);
  }
};

const createBrand = async (req, res, next) => {
  try {
    const { name, animalNames, image } = req.validatedBrand;

    const slug = createSlug(name);

    if (!slug) {
      return sendError(res, 400, "Name must contain letters or numbers");
    }

    const existingBrand = await Brand.findOne({
      slug,
    });

    if (existingBrand) {
      return sendError(res, 400, "Brand already exists");
    }

    const brand = await Brand.create({
      name,
      slug,
      animalNames,
      image,
    });

    return sendSuccess(res, 201, "Brand created successfully", { brand });
  } catch (error) {
    return handleBrandError(error, res, next);
  }
};

const updateBrand = async (req, res, next) => {
  try {
    const { name, animalNames, image } = req.validatedBrand;

    const brand = await Brand.findOne(req.brandQuery);
    
    if (!brand) {
      return sendError(res, 404, "Brand not found");
    }

    const updateData = {};

    if (name && name !== brand.name) {
      const slug = createSlug(name);

      if (!slug) {
        return sendError(res, 400, "Name must contain letters or numbers");
      }

      const existingBrand = await Brand.findOne({
        slug,
        _id: { $ne: brand._id },
      });

      if (existingBrand) {
        return sendError(res, 400, "Brand already exists");
      }

      updateData.name = name;
      updateData.slug = slug;
    }

    if (animalNames !== undefined) {
      updateData.animalNames = animalNames;
    }

    if (image !== undefined) {
      updateData.image = image;
    }

    brand.set(updateData);
    await brand.save();

    return sendSuccess(res, 200, "Brand updated successfully", { brand });
  } catch (error) {
    return handleBrandError(error, res, next);
  }
};

const softDeleteBrand = async (req, res, next) => {
  try {
    const brand = await Brand.findOne(req.brandQuery);

    if (!brand) {
      return sendError(res, 404, "Brand not found");
    }

    brand.set({
      isDeleted: true,
      isActive: false,
    });
    await brand.save();

    return sendSuccess(res, 200, "Brand deleted successfully", { brand });
  } catch (error) {
    return handleBrandError(error, res, next);
  }
};

const updateBrandStatus = async (req, res, next) => {
  try {
    const { isActive } = req.validatedBrandStatus;

    const brand = await Brand.findOne(req.brandQuery);

    if (!brand) {
      return sendError(res, 404, "Brand not found");
    }

    brand.set({ isActive });
    await brand.save();

    return sendSuccess(
      res,
      200,
      `Brand ${isActive ? "activated" : "deactivated"} successfully`,
      { brand }
    );
  } catch (error) {
    return handleBrandError(error, res, next);
  }
};

module.exports = {
  getBrands,
  createBrand,
  updateBrand,
  softDeleteBrand,
  updateBrandStatus,
};
