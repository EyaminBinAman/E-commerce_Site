const mongoose = require("mongoose");

const Product = require("../../models/Product");
const Category = require("../../models/Category");
const Brand = require("../../models/Brand");

const parseBoolean = (value) => {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    if (value.toLowerCase() === "true") return true;
    if (value.toLowerCase() === "false") return false;
  }
  return undefined;
};

const normalizeStringArray = (value) => {
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

const normalizeVariants = (value) => {
  let variants = value;

  if (typeof variants === "string") {
    try {
      variants = JSON.parse(variants);
    } catch (_error) {
      return null;
    }
  }

  if (!Array.isArray(variants)) return [];

  return variants.map((variant) => ({
    name: variant?.name || null,
    value: variant?.value || null,
    sku: variant?.sku || null,
    priceAdjustment:
      typeof variant?.priceAdjustment === "number"
        ? variant.priceAdjustment
        : Number(variant?.priceAdjustment || 0),
    stockQuantity:
      typeof variant?.stockQuantity === "number"
        ? variant.stockQuantity
        : Number(variant?.stockQuantity || 0),
    isActive:
      typeof variant?.isActive === "boolean"
        ? variant.isActive
        : parseBoolean(variant?.isActive) ?? true,
  }));
};

const validateObjectId = (value) => mongoose.Types.ObjectId.isValid(value);

const escapeRegex = (value = "") =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const resolveCategoryRef = async (value) => {
  if (value === undefined || value === null) return null;

  if (typeof value === "string" && !value.trim()) return null;

  if (validateObjectId(value)) {
    return Category.findById(value);
  }

  if (typeof value === "string") {
    const trimmedValue = value.trim();
    const bySlug = await Category.findOne({ slug: trimmedValue.toLowerCase() });
    if (bySlug) return bySlug;

    return Category.findOne({
      name: { $regex: `^${escapeRegex(trimmedValue)}$`, $options: "i" },
    });
  }

  return null;
};

const resolveBrandRef = async (value) => {
  if (value === undefined || value === null) return null;

  if (typeof value === "string" && !value.trim()) return null;

  if (validateObjectId(value)) {
    return Brand.findById(value);
  }

  if (typeof value === "string") {
    const trimmedValue = value.trim();
    const bySlug = await Brand.findOne({ slug: trimmedValue.toLowerCase() });
    if (bySlug) return bySlug;

    return Brand.findOne({
      name: { $regex: `^${escapeRegex(trimmedValue)}$`, $options: "i" },
    });
  }

  return null;
};

const getProducts = async (req, res, next) => {
  try {
    const {
      search,
      category,
      brand,
      minPrice,
      maxPrice,
      isActive,
      stockStatus,
      isOfferEnabled,
      isFeatured,
      sort = "newest",
      page = 1,
      limit = 10,
    } = req.query;

    const query = {
      isDeleted: false,
    };

    if (search) {
      query.name = { $regex: search.trim(), $options: "i" };
    }

    if (category) {
      const matchedCategory = await resolveCategoryRef(category);
      query.category = matchedCategory?._id || null;
    }

    if (brand) {
      const matchedBrand = await resolveBrandRef(brand);
      query.brand = matchedBrand?._id || null;
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    const activeFilter = parseBoolean(isActive);
    if (typeof activeFilter === "boolean") {
      query.isActive = activeFilter;
    }

    const offerFilter = parseBoolean(isOfferEnabled);
    if (typeof offerFilter === "boolean") {
      query.isOfferEnabled = offerFilter;
    }

    const featuredFilter = parseBoolean(isFeatured);
    if (typeof featuredFilter === "boolean") {
      query.isFeatured = featuredFilter;
    }

    if (typeof stockStatus === "string") {
      if (stockStatus === "in-stock") {
        query.isOutOfStock = false;
      } else if (stockStatus === "out-of-stock") {
        query.isOutOfStock = true;
      }
    }

    let sortOption = { createdAt: -1 };
    if (sort === "price-asc") {
      sortOption = { price: 1, createdAt: -1 };
    } else if (sort === "price-desc") {
      sortOption = { price: -1, createdAt: -1 };
    }

    const sanitizedPage = Math.max(1, Number(page) || 1);
    const sanitizedLimit = Math.min(100, Math.max(1, Number(limit) || 10));
    const skip = (sanitizedPage - 1) * sanitizedLimit;

    const [products, totalProducts] = await Promise.all([
      Product.find(query)
        .populate("category", "name slug")
        .populate("brand", "name slug")
        .sort(sortOption)
        .skip(skip)
        .limit(sanitizedLimit),
      Product.countDocuments(query),
    ]);

    return res.status(200).json({
      success: true,
      message: "Products fetched successfully",
      products,
      pagination: {
        page: sanitizedPage,
        limit: sanitizedLimit,
        totalProducts,
        totalPages: Math.ceil(totalProducts / sanitizedLimit),
      },
    });
  } catch (error) {
    next(error);
  }
};

const getDeletedProducts = async (req, res, next) => {
  try {
    const {
      search,
      sort = "newest",
      page = 1,
      limit = 10,
    } = req.query;

    const query = {
      isDeleted: true,
    };

    if (search) {
      query.name = { $regex: search.trim(), $options: "i" };
    }

    let sortOption = { deletedAt: -1, createdAt: -1 };
    if (sort === "price-asc") {
      sortOption = { price: 1, deletedAt: -1 };
    } else if (sort === "price-desc") {
      sortOption = { price: -1, deletedAt: -1 };
    }

    const sanitizedPage = Math.max(1, Number(page) || 1);
    const sanitizedLimit = Math.min(100, Math.max(1, Number(limit) || 10));
    const skip = (sanitizedPage - 1) * sanitizedLimit;

    const [products, totalProducts] = await Promise.all([
      Product.find(query)
        .populate("category", "name slug")
        .populate("brand", "name slug")
        .populate("deletedBy", "name email role")
        .sort(sortOption)
        .skip(skip)
        .limit(sanitizedLimit),
      Product.countDocuments(query),
    ]);

    return res.status(200).json({
      success: true,
      message: "Deleted products fetched successfully",
      products,
      pagination: {
        page: sanitizedPage,
        limit: sanitizedLimit,
        totalProducts,
        totalPages: Math.ceil(totalProducts / sanitizedLimit),
      },
    });
  } catch (error) {
    next(error);
  }
};

const getSingleProduct = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const product = await Product.findOne({
      slug,
      isDeleted: false,
      isActive: true,
    })
      .populate("category", "name slug")
      .populate("brand", "name slug");

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const relatedProducts = await Product.find({
      _id: { $ne: product._id },
      category: product.category?._id || product.category,
      isDeleted: false,
      isActive: true,
    })
      .select("name slug images price discountPrice isOutOfStock")
      .sort({ createdAt: -1 })
      .limit(4);

    return res.status(200).json({
      success: true,
      message: "Product fetched successfully",
      product,
      relatedProducts,
    });
  } catch (error) {
    next(error);
  }
};

const createProduct = async (req, res, next) => {
  try {
    const {
      name,
      description,
      category,
      brand,
      price,
      discountPrice,
      stockQuantity,
      isActive,
      isFeatured,
      isOfferEnabled,
      tags,
      images,
      variants,
    } = req.body;

    if (!name || !description || !category || !brand || price === undefined) {
      return res.status(400).json({
        success: false,
        message: "Name, description, category, brand, and price are required",
      });
    }

    if (stockQuantity === undefined || Number(stockQuantity) < 0) {
      return res.status(400).json({
        success: false,
        message: "A valid stockQuantity is required",
      });
    }

    const resolvedCategory = await resolveCategoryRef(category);
    if (!resolvedCategory) {
      return res.status(400).json({
        success: false,
        message: "Valid category (id, slug, or name) is required",
      });
    }

    const resolvedBrand = await resolveBrandRef(brand);
    if (!resolvedBrand) {
      return res.status(400).json({
        success: false,
        message: "Valid brand (id, slug, or name) is required",
      });
    }

    const existingProductByName = await Product.findOne({
      name: { $regex: `^${name.trim()}$`, $options: "i" },
      isDeleted: false,
    });

    if (existingProductByName) {
      return res.status(400).json({
        success: false,
        message: "Product with this name already exists",
      });
    }

    const normalizedVariants = normalizeVariants(variants);
    if (normalizedVariants === null) {
      return res.status(400).json({
        success: false,
        message: "variants must be a valid JSON array",
      });
    }

    const parsedPrice = Number(price);
    const parsedDiscountPrice =
      discountPrice === undefined || discountPrice === null || discountPrice === ""
        ? null
        : Number(discountPrice);

    if (!Number.isFinite(parsedPrice) || parsedPrice < 0) {
      return res.status(400).json({
        success: false,
        message: "Valid price is required",
      });
    }

    if (
      parsedDiscountPrice !== null &&
      (!Number.isFinite(parsedDiscountPrice) ||
        parsedDiscountPrice < 0 ||
        parsedDiscountPrice >= parsedPrice)
    ) {
      return res.status(400).json({
        success: false,
        message: "discountPrice must be lower than price",
      });
    }

    const product = await Product.create({
      name,
      description,
      category: resolvedCategory._id,
      brand: resolvedBrand._id,
      price: parsedPrice,
      discountPrice: parsedDiscountPrice,
      stockQuantity: Number(stockQuantity),
      isActive: parseBoolean(isActive) ?? true,
      isFeatured: parseBoolean(isFeatured) ?? false,
      isOfferEnabled: parseBoolean(isOfferEnabled) ?? false,
      tags: normalizeStringArray(tags),
      images: normalizeStringArray(images),
      variants: normalizedVariants,
    });

    const populatedProduct = await Product.findById(product._id)
      .populate("category", "name slug")
      .populate("brand", "name slug");

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      product: populatedProduct,
    });
  } catch (error) {
    next(error);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const {
      name,
      description,
      category,
      brand,
      price,
      discountPrice,
      stockQuantity,
      isActive,
      isFeatured,
      isOfferEnabled,
      tags,
      images,
      variants,
    } = req.body;

    const product = await Product.findOne({
      slug,
      isDeleted: false,
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    if (name && name.trim().toLowerCase() !== product.name.toLowerCase()) {
      const existingProductByName = await Product.findOne({
        name: { $regex: `^${name.trim()}$`, $options: "i" },
        _id: { $ne: product._id },
        isDeleted: false,
      });

      if (existingProductByName) {
        return res.status(400).json({
          success: false,
          message: "Product with this name already exists",
        });
      }

      product.name = name;
    }

    if (description) product.description = description;

    if (category !== undefined) {
      const resolvedCategory = await resolveCategoryRef(category);
      if (!resolvedCategory) {
        return res.status(400).json({
          success: false,
          message: "Valid category (id, slug, or name) is required",
        });
      }

      product.category = resolvedCategory._id;
    }

    if (brand !== undefined) {
      const resolvedBrand = await resolveBrandRef(brand);
      if (!resolvedBrand) {
        return res.status(400).json({
          success: false,
          message: "Valid brand (id, slug, or name) is required",
        });
      }

      product.brand = resolvedBrand._id;
    }

    if (price !== undefined) {
      const parsedPrice = Number(price);
      if (!Number.isFinite(parsedPrice) || parsedPrice < 0) {
        return res.status(400).json({
          success: false,
          message: "Valid price is required",
        });
      }
      product.price = parsedPrice;
    }

    if (discountPrice !== undefined) {
      if (discountPrice === null || discountPrice === "") {
        product.discountPrice = null;
      } else {
        const parsedDiscountPrice = Number(discountPrice);
        if (
          !Number.isFinite(parsedDiscountPrice) ||
          parsedDiscountPrice < 0 ||
          parsedDiscountPrice >= product.price
        ) {
          return res.status(400).json({
            success: false,
            message: "discountPrice must be lower than price",
          });
        }

        product.discountPrice = parsedDiscountPrice;
      }
    }

    if (stockQuantity !== undefined) {
      const parsedStock = Number(stockQuantity);
      if (!Number.isFinite(parsedStock) || parsedStock < 0) {
        return res.status(400).json({
          success: false,
          message: "Valid stockQuantity is required",
        });
      }
      product.stockQuantity = parsedStock;
    }

    const parsedIsActive = parseBoolean(isActive);
    if (typeof parsedIsActive === "boolean") {
      product.isActive = parsedIsActive;
    }

    const parsedIsFeatured = parseBoolean(isFeatured);
    if (typeof parsedIsFeatured === "boolean") {
      product.isFeatured = parsedIsFeatured;
    }

    const parsedOfferEnabled = parseBoolean(isOfferEnabled);
    if (typeof parsedOfferEnabled === "boolean") {
      product.isOfferEnabled = parsedOfferEnabled;
      if (!parsedOfferEnabled) {
        product.discountPrice = null;
      }
    }

    if (tags !== undefined) {
      product.tags = normalizeStringArray(tags);
    }

    if (images !== undefined) {
      product.images = normalizeStringArray(images);
    }

    if (variants !== undefined) {
      const normalizedVariants = normalizeVariants(variants);
      if (normalizedVariants === null) {
        return res.status(400).json({
          success: false,
          message: "variants must be a valid JSON array",
        });
      }
      product.variants = normalizedVariants;
    }

    await product.save();

    const updatedProduct = await Product.findById(product._id)
      .populate("category", "name slug")
      .populate("brand", "name slug");

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    next(error);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const product = await Product.findOne({
      slug,
      isDeleted: false,
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    product.isDeleted = true;
    product.deletedAt = new Date();
    product.deletedBy = req.user?._id || null;
    product.isActive = false;
    await product.save();

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getDeletedProducts,
  getSingleProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};
