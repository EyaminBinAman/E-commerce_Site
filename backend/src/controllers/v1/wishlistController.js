const mongoose = require("mongoose");

const Product = require("../../models/Product");
const User = require("../../models/User");

const sendSuccess = (res, statusCode, message, data) => {
  return res.status(statusCode).json({
    success: true,
    message,
    ...data,
  });
};

const sendError = (res, statusCode, message) => {
  return res.status(statusCode).json({
    success: false,
    message,
  });
};

const formatWishlist = async (userId) => {
  const user = await User.findById(userId).populate({
    path: "wishList",
    match: {
      isActive: true,
      isDeleted: { $ne: true },
    },
    select: "name slug images price discountPrice brand",
    populate: {
      path: "brand",
      select: "name slug",
    },
  });

  const items = (user?.wishList || []).filter(Boolean).map((product) => ({
    _id: product._id,
    name: product.name,
    slug: product.slug,
    image: product.images?.[0] || null,
    price: product.price,
    discountPrice: product.discountPrice,
    brand: product.brand?.name || null,
  }));

  return {
    wishlist: {
      items,
      itemCount: items.length,
    },
  };
};

const getWishlist = async (req, res, next) => {
  try {
    const wishlist = await formatWishlist(req.user._id);

    return sendSuccess(res, 200, "Wishlist fetched successfully", wishlist);
  } catch (error) {
    next(error);
  }
};

const addToWishlist = async (req, res, next) => {
  try {
    const { productId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return sendError(res, 400, "Valid product id is required");
    }

    const product = await Product.findOne({
      _id: productId,
      isActive: true,
      isDeleted: { $ne: true },
    });

    if (!product) {
      return sendError(res, 404, "Product not found");
    }

    await User.findByIdAndUpdate(req.user._id, {
      $addToSet: { wishList: product._id },
    });

    const wishlist = await formatWishlist(req.user._id);

    return sendSuccess(res, 200, "Product added to wishlist", wishlist);
  } catch (error) {
    next(error);
  }
};

const removeFromWishlist = async (req, res, next) => {
  try {
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return sendError(res, 400, "Valid product id is required");
    }

    await User.findByIdAndUpdate(req.user._id, {
      $pull: { wishList: productId },
    });

    const wishlist = await formatWishlist(req.user._id);

    return sendSuccess(res, 200, "Product removed from wishlist", wishlist);
  } catch (error) {
    next(error);
  }
};

const clearWishlist = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.user._id, {
      $set: { wishList: [] },
    });

    const wishlist = await formatWishlist(req.user._id);

    return sendSuccess(res, 200, "Wishlist cleared successfully", wishlist);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
};
