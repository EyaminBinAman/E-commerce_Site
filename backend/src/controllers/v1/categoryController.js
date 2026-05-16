const mongoose = require("mongoose");
const Category = require("../../models/Category");

// GET /get-categories
const getCategories = async (req, res, next) => {
  try {
    // Public + user => only active
    // Admin => all categories

    const filter =
      req.user?.role === "admin"
        ? {}
        : { isActive: true };

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

// POST /post-category
const postCategory = async (req, res, next) => {
  try {
    const { name, animalName } = req.body;

    if (!name || !animalName) {
      return res.status(400).json({
        success: false,
        message: "Name and animalName are required",
      });
    }

    // Prevent duplicate category names
    const existingCategory = await Category.findOne({
      name: {
        $regex: `^${name.trim()}$`,
        $options: "i",
      },
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
      image: req.file
        ? `/uploads/categories/${req.file.filename}`
        : null,
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

// PATCH /update-category/:id
const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, animalName } = req.body;

    // Validate MongoDB ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid category id",
      });
    }

    const category = await Category.findById(id);

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
          $regex: `^${name.trim()}$`,
          $options: "i",
        },
        _id: { $ne: id },
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

    if (req.file) {
      category.image = `/uploads/categories/${req.file.filename}`;
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

// DELETE /delete-category/:id
const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid category id",
      });
    }

    const category = await Category.findByIdAndDelete(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// PATCH /toggle-category-status/:id
const toggleCategoryActive = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    // Validate MongoDB ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid category id",
      });
    }

    if (typeof isActive !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "isActive boolean is required",
      });
    }

    const category = await Category.findById(id);

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
  postCategory,
  updateCategory,
  deleteCategory,
  toggleCategoryActive,
};