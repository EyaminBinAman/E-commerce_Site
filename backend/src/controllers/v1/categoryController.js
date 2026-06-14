const Category = require("../../models/Category");
const Product = require("../../models/Product");
const escapeRegex = (value = "") => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// GET /get-categories
const getCategories = async (req, res, next) => {
  try {
    const includeInactive = ["1", "true", "yes"].includes(
      String(req.query.includeInactive || "").toLowerCase()
    );
    const filter = includeInactive ? {} : { isActive: true };

    const categories = await Category.find(filter).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      message: "Categories fetched successfully",
      categories,
    });
  } catch (error) {
    next(error);
  }
};

// POST /create-category
const createCategory = async (req, res, next) => {
  try {
    const { name, animalName, image } = req.body;

    if (!name || !animalName) {
      return res.status(400).json({
        success: false,
        message: "Name and animalName are required",
      });
    }

    // Prevent duplicate category names
    const existingCategory = await Category.findOne({
      name: {
        $regex: `^${escapeRegex(name.trim())}$`,
        $options: "i",
      },
      isDeleted: { $ne: true },
    });

    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: "Category already exists",
      });
    }

    const category = await Category.create({
      name,
      animalName,
      image: image || null,
    });

    return res.status(201).json({
      success: true,
      message: "Category created successfully",
      category,
    });
  } catch (error) {
    next(error);
  }
};

// PATCH /update-category/:slug
const updateCategoryBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const { name, animalName, image } = req.body;
    const category = await Category.findOne({ slug });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // Duplicate name check
    if (name) {
      const existingCategory = await Category.findOne({
        name: {
          $regex: `^${escapeRegex(name.trim())}$`,
          $options: "i",
        },
        _id: { $ne: category._id },
        isDeleted: { $ne: true },
      });

      if (existingCategory) {
        return res.status(400).json({
          success: false,
          message: "Category name already exists",
        });
      }

      category.name = name;
    }

    if (animalName) {
      category.animalName = animalName;
    }

    if (typeof image === "string") {
      category.image = image.trim() || null;
    }

    // save() triggers slug middleware
    await category.save();

    return res.status(200).json({
      success: true,
      message: "Category updated successfully",
      category,
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /delete-category/:slug
const deleteCategoryBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const category = await Category.findOne({ slug });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    const linkedProductCount = await Product.countDocuments({
      category: category._id,
      isDeleted: false,
    });

    if (linkedProductCount > 0) {
      return res.status(409).json({
        success: false,
        message: "Cannot delete category while products are assigned to it",
      });
    }

    category.isDeleted = true;
    category.isActive = false;
    await category.save();

    return res.status(200).json({
      success: true,
      message: "Category deleted successfully",
      category,
    });
  } catch (error) {
    next(error);
  }
};

// PATCH /active-on-off-animals/:slug
const toggleCategoryActiveBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const { isActive } = req.body;

    if (typeof isActive !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "isActive boolean is required",
      });
    }

    const category = await Category.findOne({ slug });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    category.isActive = isActive;

    await category.save();

    return res.status(200).json({
      success: true,
      message: `Category ${
        isActive ? "activated" : "deactivated"
      } successfully`,
      category,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCategories,
  createCategory,
  updateCategoryBySlug,
  deleteCategoryBySlug,
  toggleCategoryActiveBySlug,
};
